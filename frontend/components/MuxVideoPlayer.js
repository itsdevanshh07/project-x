'use client';

import MuxPlayer from '@mux/mux-player-react';

const MuxVideoPlayer = ({ playbackId, title, metadata }) => {
    if (!playbackId) return null;

    return (
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black group">
            <MuxPlayer
                playbackId={playbackId}
                metadata={{
                    video_id: metadata?.videoId || 'video-id-123',
                    video_title: title || 'Academic Lecture',
                    viewer_user_id: metadata?.userId || 'user-id-007',
                }}
                streamType="on-demand"
                primaryColor="#6366F1"
                secondaryColor="#000000"
                className="w-full h-full"
            />
        </div>
    );
};

export default MuxVideoPlayer;
