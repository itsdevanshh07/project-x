const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const LiveClass = require('../models/LiveClass');
const Doubt = require('../models/Doubt');
const muxService = require('../services/mux.service');

// @desc    Pre-create a lesson and return a Mux upload URL
// @route   POST /api/mux/upload
// @access  Private/Teacher
exports.createUpload = async (req, res, next) => {
    try {
        const { courseId, moduleId, title, description } = req.body;
        console.log('DEBUG: createUpload Body:', { courseId, moduleId, title, description });

        // Create a "pending" lesson first
        const lesson = await Lesson.create({
            title,
            description,
            course: courseId,
            module: moduleId,
            videoUrl: 'uploading...',
            isFree: false
        });

        // Use lesson ID as passthrough for Mux webhook
        const upload = await muxService.createUploadUrl(lesson._id.toString());

        // Update lesson with muxAssetId (initially uploadId)
        lesson.muxAssetId = upload.id;
        await lesson.save();

        res.status(200).json({
            uploadUrl: upload.url,
            uploadId: upload.id,
            lessonId: lesson._id
        });
    } catch (error) {
        console.error('Create Upload Error:', error);
        res.status(500).json({
            message: 'Failed to initialize Mux upload. Please check your Mux API credentials in the .env file.',
            error: error.message
        });
    }
};

// @desc    Create a Mux Live Stream for a class
// @route   POST /api/mux/live
// @access  Private/Teacher
exports.createLiveClass = async (req, res, next) => {
    try {
        const { courseId, title, description, scheduledTime } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Create Mux Live Stream with course info in passthrough
        const stream = await muxService.createLiveStream(courseId);

        // Create LiveClass record
        const liveClass = await LiveClass.create({
            course: courseId,
            instructor: req.user._id,
            title,
            description,
            scheduledTime,
            status: 'live', // Start as live if created via this flow
            muxStreamId: stream.id,
            streamKey: stream.stream_key,
            playbackId: stream.playback_ids[0].id,
            platform: 'mux'
        });

        res.status(201).json({
            liveClass,
            streamKey: stream.stream_key,
            rtmpUrl: 'rtmp://global-live.mux.com:5222/app'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mux Webhook Handler
// @route   POST /api/mux/webhook
// @access  Public
exports.handleWebhook = async (req, res, next) => {
    try {
        const { type, data } = req.body;

        console.log(`Mux Webhook Event: ${type}`);

        if (type === 'video.asset.ready') {
            const assetId = data.id;
            const playbackId = data.playback_ids[0].id;
            const duration = data.duration;
            const lessonId = data.passthrough; // We stored lessonId here

            if (lessonId) {
                await Lesson.findByIdAndUpdate(lessonId, {
                    muxAssetId: assetId,
                    muxPlaybackId: playbackId,
                    duration: Math.floor(duration).toString() + 's',
                    videoUrl: `https://stream.mux.com/${playbackId}.m3u8`
                });
                console.log(`Asset ${assetId} linked to lesson ${lessonId}`);
            }
        }

        if (type === 'video.asset.created') {
            const lessonId = data.passthrough;
            if (lessonId) {
                await Lesson.findByIdAndUpdate(lessonId, { videoUrl: 'processing...' });
                console.log(`Asset for lesson ${lessonId} is now processing`);
            }
        }

        if (type === 'video.live_stream.recorded') {
            const assetId = data.recorded_asset_id;
            const liveStreamId = data.id;

            // Find the live class
            const liveClass = await LiveClass.findOne({ muxStreamId: liveStreamId });
            if (liveClass) {
                const asset = await muxService.getAsset(assetId);
                const playbackId = asset.playback_ids[0].id;

                // Create a Lesson from the recording
                await Lesson.create({
                    title: `Recording: ${liveClass.title}`,
                    description: liveClass.description,
                    course: liveClass.course,
                    module: await findOrCreateRecordingModule(liveClass.course),
                    muxAssetId: assetId,
                    muxPlaybackId: playbackId,
                    videoUrl: `https://stream.mux.com/${playbackId}.m3u8`,
                    duration: Math.floor(asset.duration).toString() + 's',
                    isFree: false
                });

                liveClass.status = 'ended';
                liveClass.recordingUrl = playbackId;
                await liveClass.save();
                console.log(`Live stream ${liveStreamId} saved as recording`);
            }
        }

        if (type === 'video.live_stream.active') {
            const liveStreamId = data.id;
            await LiveClass.findOneAndUpdate({ muxStreamId: liveStreamId }, { status: 'live' });
            console.log(`Live stream ${liveStreamId} is now active`);
        }

        if (type === 'video.live_stream.idle') {
            const liveStreamId = data.id;
            // Note: Don't set to 'ended' here yet, wait for recorded event if you want to keep recordingUrl
            // But we can set a transitional status if needed.
            console.log(`Live stream ${liveStreamId} is now idle`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Mux Webhook Error:', error);
        res.status(500).send('Webhook Error');
    }
};

// Helper: Find or create a "Live Recordings" module
async function findOrCreateRecordingModule(courseId) {
    const Module = require('../models/Module');
    let module = await Module.findOne({ course: courseId, title: 'Live Recordings' });
    if (!module) {
        module = await Module.create({
            title: 'Live Recordings',
            course: courseId,
            order: 99
        });
    }
    return module._id;
}

// @desc    Add meeting link to a doubt (Zoom/Meet)
// @route   POST /api/mux/doubt-meeting
// @access  Private/Teacher
exports.addDoubtMeeting = async (req, res, next) => {
    try {
        const { doubtId, meetingLink } = req.body;

        const doubt = await Doubt.findById(doubtId);
        if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

        // Add an answer with the meeting link
        doubt.answers.push({
            user: req.user._id,
            text: `I've scheduled a live session to discuss this. Join here: ${meetingLink}`,
        });
        doubt.status = 'answered';
        await doubt.save();

        res.status(200).json({ success: true, data: doubt });
    } catch (error) {
        next(error);
    }
};
