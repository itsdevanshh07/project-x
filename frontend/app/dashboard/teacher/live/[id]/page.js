'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    PhoneOff,
    MessageSquare,
    Users,
    Send,
    Eye,
    Circle
} from 'lucide-react';
import { io } from 'socket.io-client';
import Navbar from '@/components/Navbar';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function TeacherLiveRoom() {
    const { id: roomId } = useParams();
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Stream States
    const [isStreaming, setIsStreaming] = useState(false);
    const [stream, setStream] = useState(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const [viewers, setViewers] = useState(0);

    // Chat States
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // WebRTC & Socket Refs
    const socketRef = useRef();
    const videoRef = useRef();
    const peersRef = useRef({}); // Store RTCPeerConnection for each student
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    useEffect(() => {
        setMounted(true);
        if (user?.role !== 'teacher') {
            router.push('/dashboard');
            return;
        }

        socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');

        socketRef.current.emit('join-room', {
            roomId,
            userId: user._id,
            role: 'teacher',
            name: user.fullName
        });

        socketRef.current.on('chat-message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        // WebRTC Signaling: Student wants to connect
        socketRef.current.on('offer', async ({ sdperson, from }) => {
            console.log('Received offer from student:', from);
            const pc = createPeerConnection(from);
            peersRef.current[from] = pc;

            await pc.setRemoteDescription(new RTCSessionDescription(sdperson));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socketRef.current.emit('answer', {
                sdperson: pc.localDescription,
                to: from,
                from: socketRef.current.id
            });
        });

        socketRef.current.on('ice-candidate', ({ candidate, from }) => {
            if (peersRef.current[from]) {
                peersRef.current[from].addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            stopStream();
            socketRef.current.disconnect();
        };
    }, []);

    const createPeerConnection = (studentId) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // Add local stream tracks to this peer
        if (stream) {
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', {
                    candidate: event.candidate,
                    to: studentId,
                    from: socketRef.current.id
                });
            }
        };

        return pc;
    };

    const startStream = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
            setIsStreaming(true);

            // Start Recording
            startRecording(mediaStream);

            toast.success('You are now LIVE!');
        } catch (err) {
            console.error('Error starting stream:', err);
            toast.error('Could not access camera/mic');
        }
    };

    const startRecording = (mediaStream) => {
        const options = { mimeType: 'video/webm;codecs=vp9,opus' };
        const recorder = new MediaRecorder(mediaStream, options);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        recorder.onstop = () => {
            saveRecording();
        };

        recorder.start(1000); // Check every second
    };

    const saveRecording = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        // In a real app, upload this to Cloudinary/AWS S3
        console.log('Recording finished, blob size:', blob.size);
        toast.info('Session recording saved successfully (Simulation)');
    };

    const stopStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsStreaming(false);
        socketRef.current.emit('end-stream', { roomId });
        toast.info('Session Ended');
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
                {/* Video Area */}
                <div className="flex-grow relative bg-black flex items-center justify-center group">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                    />

                    {!isStreaming && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Video className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-display font-black mb-2">Ready to Go Live?</h2>
                            <p className="text-slate-400 mb-8 font-medium">Your students are waiting in the lobby.</p>
                            <button
                                onClick={startStream}
                                className="px-10 py-4 bg-blue-600 rounded-full font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
                            >
                                Start Broadcast
                            </button>
                        </div>
                    )}

                    {/* Stats & Timer Overlay */}
                    {isStreaming && (
                        <div className="absolute top-6 left-6 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-red-600 px-4 py-1.5 rounded-full flex items-center space-x-2 shadow-lg ring-4 ring-red-600/20">
                                <Circle className="w-2 h-2 fill-current animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live</span>
                            </div>
                            <div className="glass px-4 py-1.5 rounded-full flex items-center space-x-2 text-xs font-bold text-white/80">
                                <Eye className="w-3.5 h-3.5 text-blue-400" />
                                <span>{viewers} Viewers</span>
                            </div>
                        </div>
                    )}

                    {/* Controls Overlay */}
                    {isStreaming && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={() => setIsMicOn(!isMicOn)}
                                className={`p-5 rounded-full backdrop-blur-md transition-all ${isMicOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/80 hover:bg-red-500'}`}
                            >
                                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                            </button>
                            <button
                                onClick={stopStream}
                                className="p-6 bg-red-600 rounded-[2rem] hover:bg-red-700 transition-all shadow-xl shadow-red-900/40 hover:-translate-y-1 active:scale-95"
                            >
                                <PhoneOff className="w-8 h-8" />
                            </button>
                            <button
                                onClick={() => setIsCamOn(!isCamOn)}
                                className={`p-5 rounded-full backdrop-blur-md transition-all ${isCamOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/80 hover:bg-red-500'}`}
                            >
                                {isCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                            </button>
                        </div>
                    )}
                </div>

                {/* Chat Panel */}
                <div className="w-full lg:w-[400px] bg-slate-800 border-l border-white/5 flex flex-col">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                            <h3 className="font-display font-black uppercase tracking-widest text-sm">Live Chat</h3>
                        </div>
                        <Users className="w-4 h-4 text-slate-500" />
                    </div>

                    <div className="flex-grow overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                                <MessageSquare className="w-10 h-10 mb-4" />
                                <p className="text-sm font-medium">Chat is quiet... Ask your students to say hello!</p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div key={idx} className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${msg.senderName === user.fullName ? 'text-blue-400' : 'text-slate-400'}`}>
                                        {msg.senderName}
                                    </span>
                                    <span className="text-[9px] text-white/20">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none text-sm font-medium border border-white/5 italic">
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
                                placeholder="Type a message..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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
