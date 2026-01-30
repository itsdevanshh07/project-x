const LiveChatMessage = require('../models/LiveChatMessage');
const LiveClass = require('../models/LiveClass');

module.exports = (io) => {
    const rooms = {}; // To track streamers in each room

    io.on('connection', (socket) => {
        console.log('New socket connection:', socket.id);

        // Join a live class room
        socket.on('join-room', async ({ roomId, userId, role, name }) => {
            socket.join(roomId);
            console.log(`${role} ${name} joined room ${roomId}`);

            if (role === 'teacher') {
                rooms[roomId] = socket.id; // Store streamer's socket ID
                socket.to(roomId).emit('streamer-connected', { socketId: socket.id });

                // Update DB status to live
                await LiveClass.findByIdAndUpdate(roomId, { status: 'live', startTime: new Date() });
            } else {
                // If student joins, tell them who the streamer is
                if (rooms[roomId]) {
                    socket.emit('streamer-available', { streamerId: rooms[roomId] });
                }
            }

            // Chat: Send previous messages (optional, for brevity sending dummy "welcome")
            // socket.emit('chat-message', { senderName: 'System', message: `Welcome to the class, ${name}!` });
        });

        // WebRTC Signaling
        socket.on('offer', ({ sdperson, to, from }) => {
            io.to(to).emit('offer', { sdperson, from });
        });

        socket.on('answer', ({ sdperson, to, from }) => {
            io.to(to).emit('answer', { sdperson, from });
        });

        socket.on('ice-candidate', ({ candidate, to, from }) => {
            io.to(to).emit('ice-candidate', { candidate, from });
        });

        // Chat Logic
        socket.on('send-message', async ({ roomId, userId, name, message }) => {
            try {
                const newMessage = await LiveChatMessage.create({
                    liveClass: roomId,
                    sender: userId,
                    senderName: name,
                    message
                });

                io.to(roomId).emit('chat-message', {
                    senderName: name,
                    message,
                    timestamp: newMessage.timestamp
                });
            } catch (error) {
                console.error('Chat error:', error);
            }
        });

        // Streaming control
        socket.on('end-stream', async ({ roomId }) => {
            await LiveClass.findByIdAndUpdate(roomId, { status: 'ended', endTime: new Date() });
            io.to(roomId).emit('stream-ended');
            delete rooms[roomId];
        });

        socket.on('disconnecting', () => {
            // Cleanup room if streamer disconnects abruptly
            for (const room of socket.rooms) {
                if (rooms[room] === socket.id) {
                    delete rooms[room];
                    io.to(room).emit('streamer-disconnected');
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
