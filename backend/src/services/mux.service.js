const Mux = require('@mux/mux-node');

console.log('MUX_TOKEN_ID from process.env:', process.env.MUX_TOKEN_ID ? process.env.MUX_TOKEN_ID.slice(0, 5) + '...' : 'MISSING');

const muxClient = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
});

const { video } = muxClient;

/**
 * Create a direct upload URL for Mux
 * @param {string} passthrough Metadata to pass through to assets
 * @returns {Promise<Object>} Upload object with ID and URL
 */
exports.createUploadUrl = async (passthrough) => {
    try {
        const upload = await video.uploads.create({
            cors_origin: '*',
            new_asset_settings: {
                playback_policy: ['public'],
                passthrough: passthrough
            },
        });
        return upload;
    } catch (error) {
        console.error('Mux Upload Error:', error);
        throw new Error(`Mux API Error: ${error.message}`);
    }
};

/**
 * Create a Mux Live Stream
 * @param {string} passthrough Metadata to pass through to assets
 * @returns {Promise<Object>} Stream object with stream_key and playback_id
 */
exports.createLiveStream = async (passthrough) => {
    try {
        const stream = await video.liveStreams.create({
            playback_policy: ['public'],
            new_asset_settings: {
                playback_policy: ['public'],
                passthrough: passthrough
            },
        });
        return stream;
    } catch (error) {
        console.error('Mux Live Stream Error:', error);
        throw new Error('Failed to create live stream');
    }
};

/**
 * Get Asset details
 * @param {string} assetId 
 */
exports.getAsset = async (assetId) => {
    try {
        return await video.assets.retrieve(assetId);
    } catch (error) {
        console.error('Mux Get Asset Error:', error);
        throw new Error('Failed to fetch asset');
    }
};
