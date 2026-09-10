import React, { useState, useEffect, useRef } from 'react';
import { LiveSession } from '../types';
import { liveSessions as initialSessions } from '../data';
import {
  Radio,
  Users,
  Clock,
  Calendar,
  Play,
  Video,
  MessageSquare,
  Bell,
  Circle,
  Mic,
  MicOff,
  VideoOff,
} from 'lucide-react';

const LiveStream: React.FC = () => {
  const [sessions, setSessions] = useState<LiveSession[]>(() => {
    const stored = localStorage.getItem('admin_live_sessions');
    if (stored) {
      return JSON.parse(stored);
    }
    return initialSessions;
  });

  const [currentLiveSession, setCurrentLiveSession] = useState<LiveSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Sync with admin changes
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem('admin_live_sessions');
      if (stored) {
        const adminSessions = JSON.parse(stored);
        setSessions(adminSessions);
        
        // Check if there's an active live session
        const activeSession = adminSessions.find((s: LiveSession) => s.isLive);
        if (activeSession && !currentLiveSession) {
          setCurrentLiveSession(activeSession);
        } else if (!activeSession && currentLiveSession) {
          setCurrentLiveSession(null);
          disconnectFromStream();
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [currentLiveSession]);

  // Connect to live stream when session is active
  useEffect(() => {
    if (currentLiveSession && !isConnected) {
      connectToStream();
    }
  }, [currentLiveSession]);

  const connectToStream = async () => {
    try {
      // Create BroadcastChannel for signaling
      channelRef.current = new BroadcastChannel('live-stream-channel');
      
      // Create peer connection
      const config = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      };
      
      peerConnectionRef.current = new RTCPeerConnection(config);
      
      // Handle incoming tracks
      peerConnectionRef.current.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };
      
      // Listen for signaling messages
      channelRef.current.onmessage = async (event) => {
        const { type, data } = event.data;
        
        if (type === 'offer' && peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          
          channelRef.current?.postMessage({
            type: 'answer',
            data: peerConnectionRef.current.localDescription
          });
        } else if (type === 'ice-candidate' && peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data));
        }
      };
      
      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          channelRef.current?.postMessage({
            type: 'ice-candidate',
            data: event.candidate
          });
        }
      };
      
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting to stream:', error);
    }
  };

  const disconnectFromStream = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (channelRef.current) {
      channelRef.current.close();
      channelRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsConnected(false);
  };

  const toggleMute = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  useEffect(() => {
    return () => {
      disconnectFromStream();
    };
  }, []);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'أحمد', message: 'مرحباً، هل يمكن إعادة الشرح؟', time: '10:05' },
    { id: 2, user: 'المعلم', message: 'بالتأكيد، سأعيد شرح النقطة الأخيرة', time: '10:06' },
    { id: 3, user: 'فاطمة', message: 'شكراً جزيلاً على الشرح الواضح', time: '10:08' },
    { id: 4, user: 'محمد', message: 'هل يوجد تمرين إضافي على هذا الموضوع؟', time: '10:10' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const liveSessions = sessions.filter((s) => s.isLive);
  const upcomingSessions = sessions.filter((s) => !s.isLive);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: chatMessages.length + 1,
        user: 'أنت',
        message: newMessage,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMessage('');
  };

  // Active Live Session View
  if (currentLiveSession) {
    return (
      <div className="min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Live Video */}
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Loading State */}
                {!isConnected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <Video size={64} className="text-white/30" />
                        <div className="absolute -top-1 -right-1">
                          <span className="flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                          </span>
                        </div>
                      </div>
                      <p className="text-white/60 mt-4 text-sm">جاري الاتصال بالبث...</p>
                      <p className="text-white/40 text-xs mt-1">{currentLiveSession.teacher}</p>
                    </div>
                  </div>
                )}

                {/* Live Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Circle size={8} fill="white" />
                    مباشر
                  </span>
                  <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Users size={12} />
                    {currentLiveSession.viewers} مشاهد
                  </span>
                </div>

                {/* Controls */}
                {isConnected && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className={`p-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-black/50'} text-white hover:opacity-80 transition`}
                    >
                      {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <button
                      onClick={toggleVideo}
                      className={`p-2 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-black/50'} text-white hover:opacity-80 transition`}
                    >
                      {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                    </button>
                  </div>
                )}
              </div>

              {/* Session Info */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{currentLiveSession.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {currentLiveSession.teacher}
                      </span>
                      <span className="flex items-center gap-1">
                        <Radio size={14} />
                        {currentLiveSession.subject}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      disconnectFromStream();
                      setCurrentLiveSession(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                  >
                    العودة للقائمة
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-500" />
                المحادثة المباشرة
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.user === 'أنت' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.user === 'أنت'
                      ? 'bg-indigo-600 text-white'
                      : msg.user === 'المعلم'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {msg.user !== 'أنت' && (
                      <p className={`text-xs font-medium mb-1 ${
                        msg.user === 'المعلم' ? 'text-green-600' : 'text-indigo-600'
                      }`}>
                        {msg.user}
                      </p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-2">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="اكتب رسالتك..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Live Sessions List View
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Radio className="text-indigo-600" size={28} />
          البث المباشر
        </h2>
        <p className="text-gray-500 mt-2">
          انضم إلى الحصص المباشرة مع المعلمين وتفاعل معهم في الوقت الحقيقي
        </p>
      </div>

      {/* Live Now */}
      {liveSessions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            يبث الآن
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative bg-gradient-to-br from-red-500 to-pink-600 h-32 flex items-center justify-center">
                  <Video size={40} className="text-white/50" />
                  <div className="absolute top-3 right-3">
                    <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Circle size={6} fill="white" />
                      مباشر
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/50 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Users size={12} />
                      {session.viewers} مشاهد
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800">{session.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{session.teacher}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Radio size={12} />
                      {session.subject}
                    </span>
                  </div>
                  <button 
                    onClick={() => setCurrentLiveSession(session)}
                    className="mt-3 w-full bg-red-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                    <Play size={14} />
                    انضم الآن
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-indigo-500" size={20} />
          الجلسات القادمة
        </h3>
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar size={24} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{session.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {session.teacher}
                    </span>
                    <span className="flex items-center gap-1">
                      <Radio size={14} />
                      {session.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {session.time}
                    </span>
                  </div>
                </div>
                <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2">
                  <Bell size={16} />
                  تذكير
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
