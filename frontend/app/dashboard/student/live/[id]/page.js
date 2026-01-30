'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import {
    Video,
    MessageSquare,
    Users,
    Send,
    Eye,
    Circle,
    Loader2
} from 'lucide-react';
import { io } from 'socket.io-client';
import Navbar from '@/components/Navbar';
import { toast } from 'react-toastify';

export default function StudentLiveRoom() {
    const { id: roomId } = useParams();
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Stream States
    const [isLive, setIsLive] = useState(false);
    const [streamerSocketId, setStreamerSocketId] = useState(null);

    // Chat States
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // WebRTC & Socket Refs
    const socketRef = useRef();
    const videoRef = useRef();
    const pcRef = useRef(null);

    useEffect(() => {
        setMounted(true);

        socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');

        socketRef.current.emit('join-room', {
            roomId,
            userId: user._id,
            role: 'student',
            name: user.fullName
        });

        // 1. Initial connection: Check if streamer is already live
        socketRef.current.on('streamer-available', ({ streamerId }) => {
            console.log('Streamer is online, initiating contact...');
            setStreamerSocketId(streamerId);
            initiateConnection(streamerId);
        });

        // 2. Streamer just connected after we joined
        socketRef.current.on('streamer-connected', ({ socketId }) => {
            console.log('Streamer just went live!');
            setStreamerSocketId(socketId);
            initiateConnection(socketId);
        });

        // WebRTC Signaling
        socketRef.current.on('answer', async ({ sdperson }) => {
            console.log('Received answer from teacher');
            if (pcRef.current) {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdperson));
            }
        });

        socketRef.current.on('ice-candidate', ({ candidate }) => {
            console.log('Received ICE from teacher');
            if (pcRef.current) {
                pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        socketRef.current.on('chat-message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        socketRef.current.on('stream-ended', () => {
            setIsLive(false);
            toast.info('The teacher has ended the session');
            router.push(`/dashboard`);
        });

        socketRef.current.on('streamer-disconnected', () => {
            setIsLive(false);
            toast.warn('Teacher disconnected unexpectedly');
        });

        return () => {
            if (pcRef.current) pcRef.current.close();
            socketRef.current.disconnect();
        };
    }, []);

    const initiateConnection = async (streamerId) => {
        console.log('Initiating WebRTC offer to:', streamerId);
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        pcRef.current = pc;

        // Manage incoming tracks
        pc.ontrack = (event) => {
            console.log('Received remote track');
            if (videoRef.current) {
                videoRef.current.srcObject = event.streams[0];
                setIsLive(true);
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', {
                    candidate: event.candidate,
                    to: streamerId,
                    from: socketRef.current.id
                });
            }
        };

        // Create Offer
        // Note: For 1-to-many, we usually want the student to trigger receiving.
        // But since we don't have a media server, we ask the teacher to send tracks.
        // We create an offer to signal our desire to receive.
        const offer = await pc.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
        await pc.setLocalDescription(offer);

        socketRef.current.emit('offer', {
            sdperson: pc.localDescription,
            to: streamerId,
            from: socketRef.current.id
        });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        socketRef.current.emit('send-message', {
            roomId,
            userId: user._id,
            name: user.fullName,
            message: newMessage
        });
        setNewMessage('');
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <Navbar />

            <div className="pt-24 flex flex-col lg:flex-row h-screen overflow-hidden">
                {/* Viewer Area */}
                <div className="flex-grow relative bg-black flex items-center justify-center">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                    />

                    {!isLive && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md px-10 text-center">
                            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-8 relative">
                                <Video className="w-10 h-10 text-slate-500" />
                                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <h2 className="text-3xl font-display font-black mb-4 uppercase tracking-tighter">Connecting to <span className="text-blue-600">Teacher...</span></h2>
                            <p className="text-slate-400 max-w-sm font-medium leading-relaxed italic">
                                "The best preparation for tomorrow is doing your best today."
                            </p>
                        </div>
                    )}

                    {/* Stats Overlay */}
                    {isLive && (
                        <div className="absolute top-6 left-6 flex items-center space-x-3">
                            <div className="bg-red-600 px-4 py-1.5 rounded-full flex items-center space-x-2 shadow-xl ring-4 ring-red-600/20">
                                <Circle className="w-2 h-2 fill-current animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Session</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Panel */}
                <div className="w-full lg:w-[400px] bg-slate-800 border-l border-white/5 flex flex-col">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                            <h3 className="font-display font-black uppercase tracking-widest text-sm">Live Class Chat</h3>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white/40">
                            <Users className="w-3 h-3" />
                            <span>124 watching</span>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${msg.senderName === user.fullName ? 'text-blue-400' : 'text-slate-400'}`}>
                                        {msg.senderName}
                                    </span>
                                    <span className="text-[9px] text-white/20">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none text-sm font-medium border border-white/5 shadow-sm">
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={sendMessage} className="p-6 bg-slate-900/50">
                        <div className="relative">
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Participate in class..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/40"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
