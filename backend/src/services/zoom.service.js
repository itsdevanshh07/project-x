const axios = require('axios');

/**
 * Get Zoom Access Token (Server-to-Server OAuth)
 */
const getAccessToken = async () => {
    try {
        const auth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
        const response = await axios.post(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
            {},
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Zoom Auth Error:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Zoom');
    }
};

/**
 * Create a Zoom Meeting
 * @param {string} topic 
 * @param {string} startTime ISO String
 */
exports.createMeeting = async (topic, startTime, duration = 60) => {
    try {
        const token = await getAccessToken();
        const response = await axios.post(
            'https://api.zoom.us/v2/users/me/meetings',
            {
                topic,
                type: 2, // Scheduled meeting
                start_time: startTime,
                duration,
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                    auto_recording: 'cloud',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            id: response.data.id,
            joinUrl: response.data.join_url,
            startUrl: response.data.start_url,
            password: response.data.password,
        };
    } catch (error) {
        console.error('Zoom Meeting Creation Error:', error.response?.data || error.message);
        throw new Error('Failed to create Zoom meeting');
    }
};
