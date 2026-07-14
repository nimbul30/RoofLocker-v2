import React, { useState, useRef, useEffect } from 'react';
import { Contractor, ChatMessage } from '../types';
import { MOCK_CHAT_HISTORY } from '../mockData';
import { googleSignIn, initAuth, logout, clearAccessToken } from '../lib/googleAuth';
import { User as FirebaseUser } from 'firebase/auth';
import { createCalendarEvent, listCalendarEvents, CalendarApiError } from '../lib/googleCalendar';
import { 
  ShieldCheck, 
  Send, 
  Video, 
  AlertTriangle, 
  Play, 
  Phone, 
  HelpCircle, 
  UserX, 
  AlertOctagon, 
  Sparkles, 
  User, 
  ShieldAlert,
  Mic,
  MicOff,
  Camera,
  Square,
  Trash2,
  Pause,
  RefreshCw,
  X,
  Volume2,
  VolumeX,
  PhoneCall,
  PhoneOff,
  CheckCircle,
  VideoOff,
  Lock,
  Calendar,
  Clock,
  Loader2,
  LogOut,
  Plus,
  Paperclip,
  Maximize2,
  Minimize2,
  FileText,
  Eye
} from 'lucide-react';

interface CommunicationHubProps {
  contractor: Contractor;
}

// Regex rules to detect phone numbers and emails
const PHONE_REGEX = /(\b\d{3}[-.]?\d{3}[-.]?\d{4}\b)|(\b\d{10}\b)/g;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

export default function CommunicationHub({ contractor }: CommunicationHubProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
  const [inputText, setInputText] = useState('');
  
  // Right Column tabs: 'calling' | 'demo' | 'policy' | 'schedule'
  const [rightTab, setRightTab] = useState<'calling' | 'demo' | 'policy' | 'schedule'>('calling');
  
  // Live Demo state (preserved)
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);

  // Filter Alerts
  const [showFilterAlert, setShowFilterAlert] = useState(false);
  const [filteredSnippet, setFilteredSnippet] = useState('');

  // Kill Switch States
  const [showKillSwitchModal, setShowKillSwitchModal] = useState(false);
  const [killReason, setKillReason] = useState('high-pressure');
  const [customKillReason, setCustomKillReason] = useState('');
  const [isKilled, setIsKilled] = useState(false);

  // --- GOOGLE CALENDAR & AUTH INTEGRATION STATES ---
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isFetchingEvents, setIsFetchingEvents] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [scheduleType, setScheduleType] = useState<'video' | 'voice'>('video');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // --- SECURE CALLING STATES ---
  const [callState, setCallState] = useState<'idle' | 'dialing' | 'connected' | 'ended'>('idle');
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // --- VOICE MEMO & VIDEO NOTES RECORDING STATES ---
  const [activeMediaRecording, setActiveMediaRecording] = useState<'none' | 'voice' | 'video'>('none');
  const [voiceRecordingState, setVoiceRecordingState] = useState<'idle' | 'recording' | 'preview'>('idle');
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [videoRecordingState, setVideoRecordingState] = useState<'idle' | 'recording' | 'preview'>('idle');
  const [videoDuration, setVideoDuration] = useState(0);

  // --- PLAYBACK STATES FOR ATTACHMENTS ---
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [playProgress, setPlayProgress] = useState(0);
  const [selectedVideoNote, setSelectedVideoNote] = useState<ChatMessage | null>(null);
  const [videoPlaybackPlaying, setVideoPlaybackPlaying] = useState(true);
  const [videoPlaybackProgress, setVideoPlaybackProgress] = useState(0);

  // --- FULL SCREEN VIDEO STATES ---
  const [fullscreenVideo, setFullscreenVideo] = useState<'none' | 'demo' | 'active-call' | 'video-note'>('none');

  // --- DOCUMENT REDACTION STATES ---
  const [uploadedDoc, setUploadedDoc] = useState<{
    name: string;
    size: string;
    type: string;
    redactedFields: {
      fullName: boolean;
      phone: boolean;
      email: boolean;
      address: boolean;
    };
    customRedactedPhrases: string[];
  } | null>(null);
  const [showRedactionModal, setShowRedactionModal] = useState(false);
  const [isViewingRedactedDoc, setIsViewingRedactedDoc] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<any>(null);
  const [customRedactText, setCustomRedactText] = useState('');
  const [highlightedText, setHighlightedText] = useState('');

  // --- WEBCAM & TIMERS REFS ---
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const callTimerRef = useRef<any>(null);
  const voiceTimerRef = useRef<any>(null);
  const videoTimerRef = useRef<any>(null);
  const audioPlaybackIntervalRef = useRef<any>(null);
  const videoPlaybackIntervalRef = useRef<any>(null);
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const recordingWebcamRef = useRef<HTMLVideoElement | null>(null);

  // --- CAMERA AND STREAM STATES ---
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [cameraAvailable, setCameraAvailable] = useState<boolean>(true);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Google OAuth State Initialization
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setNeedsAuth(false);
        setIsAuthChecking(false);
        loadEvents(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
        setIsAuthChecking(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Google access tokens expire after ~1 hour; a 401 means the user must
  // reconnect their calendar rather than the request being retryable.
  const handleExpiredSession = () => {
    clearAccessToken();
    setAccessToken(null);
    setNeedsAuth(true);
    setCalendarEvents([]);
    setScheduleError('Your Google session expired. Please reconnect your calendar.');
  };

  const loadEvents = async (token: string) => {
    setIsFetchingEvents(true);
    try {
      const events = await listCalendarEvents(token);
      setCalendarEvents(events);
    } catch (err: any) {
      console.error("Error fetching calendar events:", err);
      if (err instanceof CalendarApiError && err.status === 401) {
        handleExpiredSession();
      }
    } finally {
      setIsFetchingEvents(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthChecking(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
        loadEvents(result.accessToken);
      }
    } catch (err: any) {
      console.error("Google sign in failed:", err);
      setScheduleError(err.message || "Failed to sign in with Google");
    } finally {
      setIsAuthChecking(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
      setCalendarEvents([]);
    } catch (err: any) {
      console.error("Logout failed:", err);
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setScheduleError("Please connect your Google Calendar first");
      return;
    }
    if (!scheduleDate || !scheduleTime) {
      setScheduleError("Please specify a valid date and time");
      return;
    }

    setIsScheduling(true);
    setScheduleError(null);
    setScheduleSuccess(false);

    try {
      // Build start and end dates (default duration 30 minutes). Date math
      // handles day rollover for times near midnight, e.g. 23:45 starts.
      const startDateTime = `${scheduleDate}T${scheduleTime}:00`;
      const end = new Date(`${scheduleDate}T${scheduleTime}:00`);
      end.setMinutes(end.getMinutes() + 30);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const endDateTime = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}:00`;

      const typeLabel = scheduleType === 'video' ? 'Video Demonstration' : 'Voice Consultation';
      const summary = `RoofLocker: ${typeLabel} with ${contractor.name}`;
      const description = `Secured session with vetted contractor ${contractor.name}.\n\nType: ${typeLabel}\n\nNotes from homeowner:\n${scheduleNotes || 'No notes provided.'}\n\nProtected under RoofLocker Consumer Protection Agreement (MCL § 500.1227). All discussions are recorded and legally binding in this secure buffer room.`;

      await createCalendarEvent(accessToken, {
        summary,
        description,
        startDateTime,
        endDateTime,
        type: scheduleType
      });

      // Append confirmation to chat
      setMessages(prev => [
        ...prev,
        {
          id: `msg-schedule-${Date.now()}`,
          sender: 'system',
          text: `📅 Google Calendar Appointment Scheduled: ${summary} on ${scheduleDate} at ${scheduleTime}. A video/voice link has been added directly to your calendar, with permission from the app's users. Secure buffer room terms (MCL § 500.1227) are strictly enforced.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      setScheduleSuccess(true);
      setScheduleNotes('');
      loadEvents(accessToken);
    } catch (err: any) {
      console.error("Scheduling failed:", err);
      if (err instanceof CalendarApiError && err.status === 401) {
        handleExpiredSession();
      } else {
        setScheduleError(err.message || "Failed to schedule event on Google Calendar");
      }
    } finally {
      setIsScheduling(false);
    }
  };

  // Handle active call timers
  useEffect(() => {
    if (callState === 'connected') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [callState]);

  // Handle dialing simulation (automatic answer after 3 seconds)
  useEffect(() => {
    if (callState === 'dialing') {
      const timer = setTimeout(() => {
        setCallState('connected');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [callState]);

  // Manage media streams for video calls / direct recordings
  const startWebcamStream = async (targetRef: React.RefObject<HTMLVideoElement | null>) => {
    try {
      if (webcamStream) {
        // Stop current tracks first
        webcamStream.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setWebcamStream(stream);
      setCameraAvailable(true);
      if (targetRef.current) {
        targetRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Webcam access failed or blocked in preview frame:", err);
      setCameraAvailable(false);
    }
  };

  const stopWebcamStream = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
  };

  useEffect(() => {
    if (callState === 'connected' && callType === 'video' && !isCameraOff) {
      startWebcamStream(webcamRef);
    } else if (activeMediaRecording === 'video' && videoRecordingState === 'recording') {
      startWebcamStream(recordingWebcamRef);
    } else {
      stopWebcamStream();
    }
    return () => {
      stopWebcamStream();
    };
  }, [callState, callType, isCameraOff, activeMediaRecording, videoRecordingState]);

  // Ensure video elements bound to streams correctly
  useEffect(() => {
    if (callState === 'connected' && callType === 'video' && webcamRef.current && webcamStream) {
      webcamRef.current.srcObject = webcamStream;
    }
  }, [webcamStream, callState, callType]);

  useEffect(() => {
    if (activeMediaRecording === 'video' && videoRecordingState === 'recording' && recordingWebcamRef.current && webcamStream) {
      recordingWebcamRef.current.srcObject = webcamStream;
    }
  }, [webcamStream, activeMediaRecording, videoRecordingState]);

  // Cleanup all intervals on unmount only. This effect must have an empty
  // dependency list: re-running it on state changes (e.g. webcamStream) would
  // clear active call/recording timers mid-session. The webcam stream itself
  // is stopped by the stream-management effect above; the ref here only
  // covers a stream still live at unmount.
  const webcamStreamRef = useRef<MediaStream | null>(null);
  webcamStreamRef.current = webcamStream;
  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
      if (videoTimerRef.current) clearInterval(videoTimerRef.current);
      if (audioPlaybackIntervalRef.current) clearInterval(audioPlaybackIntervalRef.current);
      if (videoPlaybackIntervalRef.current) clearInterval(videoPlaybackIntervalRef.current);
      webcamStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isKilled) return;

    let text = inputText;
    let didFilter = false;
    const snippets: string[] = [];

    // Check for phone or email. Using .match() (never .test() on a /g regex,
    // whose stateful lastIndex can silently skip matches).
    const phoneMatches = text.match(PHONE_REGEX);
    if (phoneMatches) {
      snippets.push(phoneMatches[0]);
      text = text.replace(PHONE_REGEX, '***-***-****');
      didFilter = true;
    }

    const emailMatches = text.match(EMAIL_REGEX);
    if (emailMatches) {
      snippets.push(emailMatches[0]);
      text = text.replace(EMAIL_REGEX, '*******@****.***');
      didFilter = true;
    }
    const snip = snippets.join(', ');

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'homeowner',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      flagged: didFilter
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    if (didFilter) {
      setFilteredSnippet(snip);
      setShowFilterAlert(true);
      // Auto reply with system notification
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `msg-sys-${Date.now()}`,
          sender: 'system',
          text: '⚠️ Security Interception: External contact information was automatically redacted. Keeping communications inside the RoofLocker secure room prevents common out-of-portal payment scams and protects your legal trail.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 800);
    } else {
      // Simple contractor auto-reply after 2 seconds
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `msg-contractor-${Date.now()}`,
          sender: 'contractor',
          text: `Got your message! Let me know if you would like to initiate the GAF WeatherWatch ice-barrier code certification. Our bids are locked in standard 32 squares.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isKilled) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const mockDoc = {
      name: file.name,
      size: file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'application/pdf',
      redactedFields: {
        fullName: false,
        phone: false,
        email: false,
        address: false,
      },
      customRedactedPhrases: []
    };

    setUploadedDoc(mockDoc);
    setShowRedactionModal(true);
    setIsViewingRedactedDoc(false);
    
    e.target.value = '';
  };

  const handleToggleRedactionField = (field: 'fullName' | 'phone' | 'email' | 'address') => {
    if (!uploadedDoc) return;
    setUploadedDoc({
      ...uploadedDoc,
      redactedFields: {
        ...uploadedDoc.redactedFields,
        [field]: !uploadedDoc.redactedFields[field]
      }
    });
  };

  const handleAddCustomRedaction = (phrase: string) => {
    if (!uploadedDoc || !phrase.trim()) return;
    const clean = phrase.trim();
    if (uploadedDoc.customRedactedPhrases.includes(clean)) return;
    setUploadedDoc({
      ...uploadedDoc,
      customRedactedPhrases: [...uploadedDoc.customRedactedPhrases, clean]
    });
    setCustomRedactText('');
    setHighlightedText('');
  };

  const handleRemoveCustomRedaction = (phrase: string) => {
    if (!uploadedDoc) return;
    setUploadedDoc({
      ...uploadedDoc,
      customRedactedPhrases: uploadedDoc.customRedactedPhrases.filter(p => p !== phrase)
    });
  };

  const handleTextSelection = () => {
    if (isViewingRedactedDoc) return;
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString().trim();
      if (text && text.length < 150) {
        setHighlightedText(text);
      } else {
        setHighlightedText('');
      }
    }
  };

  const handleAutoScrubAll = () => {
    if (!uploadedDoc) return;
    setUploadedDoc({
      ...uploadedDoc,
      redactedFields: {
        fullName: true,
        phone: true,
        email: true,
        address: true,
      },
      customRedactedPhrases: [
        ...uploadedDoc.customRedactedPhrases,
        ...['$14,850.00', 'Jane Doe', '(555) 019-2831', 'janedoe@example.com', '123 Maple St, Detroit'].filter(
          p => !uploadedDoc.customRedactedPhrases.includes(p)
        )
      ]
    });
  };

  const handleSendRedactedDoc = () => {
    if (!uploadedDoc) return;

    const redactedTags: string[] = [];
    if (uploadedDoc.redactedFields.fullName) redactedTags.push("Full Name");
    if (uploadedDoc.redactedFields.phone) redactedTags.push("Phone");
    if (uploadedDoc.redactedFields.email) redactedTags.push("Email");
    if (uploadedDoc.redactedFields.address) redactedTags.push("Property Address");
    if (uploadedDoc.customRedactedPhrases.length > 0) {
      redactedTags.push(`${uploadedDoc.customRedactedPhrases.length} custom phrases`);
    }

    const redactionText = redactedTags.length > 0 
      ? `[Locker Shield Redacted: ${redactedTags.join(', ')}]` 
      : `[No Redactions Applied - Security Risk Warning Ignored]`;

    const newMessage: ChatMessage = {
      id: `doc-${Date.now()}`,
      sender: 'homeowner',
      text: `📄 Uploaded Estimate Document: ${uploadedDoc.name} ${redactionText}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentType: 'document',
      attachmentName: uploadedDoc.name,
      attachmentSize: uploadedDoc.size,
      redactedFields: { ...uploadedDoc.redactedFields },
      customRedactedPhrases: [...uploadedDoc.customRedactedPhrases]
    };

    setMessages(prev => [...prev, newMessage]);
    setShowRedactionModal(false);
    setUploadedDoc(null);

    // Contractor auto reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `msg-contractor-doc-${Date.now()}`,
        sender: 'contractor',
        text: redactedTags.length > 0
          ? `Locker Privacy Shield verified! Received redacted file "${newMessage.attachmentName}". Excellent decision blacking out direct contacts (${redactedTags.join(', ')}). Our team is banned from out-of-portal solicitation, so keeping this anonymous is 100% compliant with local laws. I will review your shingles layout and estimate details right now.`
          : `Warning: File received, but RoofLocker detected that you bypassed the redaction filters. Please be careful — sharing direct contact coordinates could result in aggressive direct solicitation calls and text spam outside our legally-escrowed workspace. For safety, please use the black-out tool next time. I will keep this data secured.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1800);
  };

  const handleOpenDocViewer = (msg: ChatMessage) => {
    if (!msg.redactedFields) return;
    setViewingDoc({
      name: msg.attachmentName || 'Document',
      size: msg.attachmentSize || 'Unknown size',
      redactedFields: msg.redactedFields,
      customRedactedPhrases: msg.customRedactedPhrases || []
    });
    setIsViewingRedactedDoc(true);
  };

  const renderTextWithRedactions = (originalText: string) => {
    const activePhrases = isViewingRedactedDoc 
      ? (viewingDoc?.customRedactedPhrases || []) 
      : (uploadedDoc?.customRedactedPhrases || []);

    if (activePhrases.length === 0) {
      return <span>{originalText}</span>;
    }

    // Sort phrases by length descending to prevent partial replacements of nested phrases
    const sortedPhrases = [...activePhrases].sort((a, b) => b.length - a.length);

    // Escape regex characters
    const escapeRegExp = (str: string) => {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const regexPattern = sortedPhrases.map(p => escapeRegExp(p)).filter(Boolean).join('|');
    if (!regexPattern) return <span>{originalText}</span>;

    const regex = new RegExp(`(${regexPattern})`, 'gi');
    const parts = originalText.split(regex);

    return (
      <>
        {parts.map((part, index) => {
          const isMatch = sortedPhrases.some(p => p.toLowerCase() === part.toLowerCase());
          if (isMatch) {
            return (
              <span 
                key={index} 
                className="bg-black text-red-500 font-bold px-1 py-0.5 rounded mx-0.5 select-none font-mono text-[9px] cursor-pointer inline-block"
                title={isViewingRedactedDoc ? "Redacted Info" : "Click to remove this custom redaction"}
                onClick={(e) => {
                  if (isViewingRedactedDoc) return;
                  e.stopPropagation();
                  handleRemoveCustomRedaction(part);
                }}
              >
                REDACTED
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  const renderClickablePhrase = (phrase: string, displayName?: string) => {
    const textToShow = displayName || phrase;
    const activePhrases = isViewingRedactedDoc 
      ? (viewingDoc?.customRedactedPhrases || []) 
      : (uploadedDoc?.customRedactedPhrases || []);

    const isRedacted = activePhrases.some((p: string) => p.toLowerCase() === phrase.toLowerCase());

    if (isRedacted) {
      return (
        <span
          onClick={(e) => {
            if (isViewingRedactedDoc) return;
            e.stopPropagation();
            handleRemoveCustomRedaction(phrase);
          }}
          className="bg-black text-red-500 font-bold px-1.5 py-0.5 rounded font-mono text-[9px] cursor-pointer inline-block mx-0.5 select-none"
          title={isViewingRedactedDoc ? "Redacted Info" : "Click to undo manual redaction"}
        >
          REDACTED
        </span>
      );
    }

    return (
      <span
        onClick={(e) => {
          if (isViewingRedactedDoc) return;
          e.stopPropagation();
          handleAddCustomRedaction(phrase);
        }}
        className="font-semibold text-slate-800 hover:bg-amber/15 hover:outline-dashed hover:outline-1 hover:outline-amber px-1 rounded transition duration-150 cursor-pointer inline-block"
        title="Click to manually redact this specific phrase"
      >
        {textToShow} <span className="text-[7px] text-amber inline-block ml-0.5">⚠️ Redact</span>
      </span>
    );
  };

  const handleTriggerKillSwitch = () => {
    setIsKilled(true);
    setShowKillSwitchModal(false);

    // Append system terminated messages
    setMessages(prev => [
      ...prev,
      {
        id: `msg-terminated-${Date.now()}`,
        sender: 'system',
        text: `❌ CHAT TERMINATED. Homeowner has activated the No-Pressure Kill-Switch citing: "${
          killReason === 'high-pressure'
            ? 'High-Pressure Sales Environment'
            : killReason === 'bypass'
            ? 'Attempting to Bypass Platform Safeguards'
            : killReason === 'poor-comms'
            ? 'Unresponsive or Poor Communication'
            : customKillReason || 'Other Policy Violation'
        }".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: `msg-terminated-cease-${Date.now()}`,
        sender: 'system',
        text: `🛡️ Legal Cease Order Sent: ${contractor.name} has been formally notified to cease all messaging, calls, or physical visitation. Your property and contact details have been scrubbed from their portal. This incident has been flagged for RoofLocker administrative review.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleReportHighPressureInDemo = () => {
    setRightTab('calling');
    setIsDemoPlaying(false);
    // Auto-open Kill switch with preset
    setKillReason('high-pressure');
    setShowKillSwitchModal(true);
  };

  // --- CALL ACTIONS ---
  const handleInitiateCall = (type: 'voice' | 'video') => {
    if (isKilled) return;
    setCallType(type);
    setCallState('dialing');
    setActiveMediaRecording('none');
    setVoiceRecordingState('idle');
    setVideoRecordingState('idle');
  };

  const handleEndCall = () => {
    const durationStr = formatDuration(callDuration);
    const newMessage: ChatMessage = {
      id: `msg-call-${Date.now()}`,
      sender: 'system',
      text: `📞 Secured Peer-to-Peer ${callType === 'voice' ? 'Voice' : 'Video'} Call Completed. (Duration: ${durationStr}). Data log secured under MCL § 500.1227.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setCallState('ended');
    stopWebcamStream();
  };

  // --- DIRECT VOICE NOTE RECORDING ---
  const handleStartRecordingVoice = () => {
    setActiveMediaRecording('voice');
    setVoiceRecordingState('recording');
    setVoiceDuration(0);
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    voiceTimerRef.current = setInterval(() => {
      setVoiceDuration(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecordingVoice = () => {
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    setVoiceRecordingState('preview');
  };

  const handleSendVoiceNote = () => {
    const durationStr = formatDuration(voiceDuration === 0 ? 8 : voiceDuration);
    const newMessage: ChatMessage = {
      id: `msg-voice-${Date.now()}`,
      sender: 'homeowner',
      text: `🎤 Play Secure Voice Message (${durationStr})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentType: 'audio',
      attachmentDuration: durationStr
    };
    setMessages(prev => [...prev, newMessage]);
    setActiveMediaRecording('none');
    setVoiceRecordingState('idle');

    // Auto reply from roofer
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `msg-rep-voice-reply-${Date.now()}`,
        sender: 'contractor',
        text: `I received your voice message! Thanks for details on the roof deck. I will add the extra underlayment layer to our 3D estimate files so it complies with MCL guidelines.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // --- DIRECT VIDEO NOTE RECORDING ---
  const handleStartRecordingVideo = () => {
    setActiveMediaRecording('video');
    setVideoRecordingState('recording');
    setVideoDuration(0);
    if (videoTimerRef.current) clearInterval(videoTimerRef.current);
    videoTimerRef.current = setInterval(() => {
      setVideoDuration(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecordingVideo = () => {
    if (videoTimerRef.current) clearInterval(videoTimerRef.current);
    setVideoRecordingState('preview');
    stopWebcamStream();
  };

  const handleSendVideoNote = () => {
    const durationStr = formatDuration(videoDuration === 0 ? 12 : videoDuration);
    const newMessage: ChatMessage = {
      id: `msg-video-${Date.now()}`,
      sender: 'homeowner',
      text: `📹 Secure Video Note sent showing roof shingle cracks. (${durationStr})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentType: 'video',
      attachmentDuration: durationStr
    };
    setMessages(prev => [...prev, newMessage]);
    setActiveMediaRecording('none');
    setVideoRecordingState('idle');

    // Auto reply from roofer
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `msg-rep-video-reply-${Date.now()}`,
        sender: 'contractor',
        text: `Got your video note! Seeing those wind cracks near the hip ridge is super helpful. I've pinned that location as high severity in our RoofLocker Canvas.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  // --- PLAYBACK HELPERS ---
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const parseDurationSeconds = (dur: string) => {
    const parts = dur.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 10;
  };

  const handleToggleAudioPlayback = (msgId: string) => {
    if (playingMessageId === msgId) {
      setPlayingMessageId(null);
      if (audioPlaybackIntervalRef.current) clearInterval(audioPlaybackIntervalRef.current);
    } else {
      setPlayingMessageId(msgId);
      setPlayProgress(0);
      
      const msg = messages.find(m => m.id === msgId);
      const totalSeconds = parseDurationSeconds(msg?.attachmentDuration || '0:10');
      let currentSeconds = 0;
      
      if (audioPlaybackIntervalRef.current) clearInterval(audioPlaybackIntervalRef.current);
      audioPlaybackIntervalRef.current = setInterval(() => {
        currentSeconds += 0.2;
        const progress = (currentSeconds / totalSeconds) * 100;
        if (progress >= 100) {
          setPlayProgress(100);
          setPlayingMessageId(null);
          clearInterval(audioPlaybackIntervalRef.current);
        } else {
          setPlayProgress(progress);
        }
      }, 200);
    }
  };

  const handlePlayVideoMessage = (msg: ChatMessage) => {
    setSelectedVideoNote(msg);
    setVideoPlaybackPlaying(true);
    setVideoPlaybackProgress(0);
    
    const totalSeconds = parseDurationSeconds(msg.attachmentDuration || '0:10');
    let currentSeconds = 0;
    
    if (videoPlaybackIntervalRef.current) clearInterval(videoPlaybackIntervalRef.current);
    videoPlaybackIntervalRef.current = setInterval(() => {
      currentSeconds += 0.2;
      const progress = (currentSeconds / totalSeconds) * 100;
      if (progress >= 100) {
        setVideoPlaybackProgress(100);
        setVideoPlaybackPlaying(false);
        clearInterval(videoPlaybackIntervalRef.current);
      } else {
        setVideoPlaybackProgress(progress);
      }
    }, 200);
  };

  const handleToggleVideoPlayback = () => {
    if (videoPlaybackPlaying) {
      setVideoPlaybackPlaying(false);
      if (videoPlaybackIntervalRef.current) clearInterval(videoPlaybackIntervalRef.current);
    } else {
      setVideoPlaybackPlaying(true);
      const totalSeconds = parseDurationSeconds(selectedVideoNote?.attachmentDuration || '0:10');
      let currentSeconds = (videoPlaybackProgress / 100) * totalSeconds;
      
      if (videoPlaybackIntervalRef.current) clearInterval(videoPlaybackIntervalRef.current);
      videoPlaybackIntervalRef.current = setInterval(() => {
        currentSeconds += 0.2;
        const progress = (currentSeconds / totalSeconds) * 100;
        if (progress >= 100) {
          setVideoPlaybackProgress(100);
          setVideoPlaybackPlaying(false);
          clearInterval(videoPlaybackIntervalRef.current);
        } else {
          setVideoPlaybackProgress(progress);
        }
      }, 200);
    }
  };

  const handleCloseVideoPlayback = () => {
    setSelectedVideoNote(null);
    if (videoPlaybackIntervalRef.current) clearInterval(videoPlaybackIntervalRef.current);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="communication-hub-view">
      {/* LEFT: Secured Chat Terminal (7 columns) */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-[520px] justify-between overflow-hidden relative">
        {/* Chat Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-r ${contractor.logoColor} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}>
              {contractor.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-navy text-sm leading-tight">{contractor.name}</h3>
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" title="Secure Link Active" />
              </div>
              <span className="text-[11px] text-stone-gray font-mono block">Vetted Builder Representative • Active Portal</span>
            </div>
          </div>

          <div className="flex gap-1.5 sm:gap-2 shrink-0">
            {!isKilled && (
              <>
                <button
                  onClick={() => {
                    setRightTab('calling');
                    handleInitiateCall('voice');
                  }}
                  id="header-voice-call-btn"
                  className="p-2 bg-amber/10 text-amber hover:bg-amber/20 rounded-lg transition"
                  title="Initiate Secure Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setRightTab('calling');
                    handleInitiateCall('video');
                  }}
                  id="header-video-call-btn"
                  className="p-2 bg-teal/10 text-teal hover:bg-teal/20 rounded-lg transition"
                  title="Initiate Secure Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setRightTab('demo');
                    setIsDemoPlaying(true);
                  }}
                  id="open-video-demo-btn"
                  className="p-2 bg-indigo-50 text-[#4f46e5] hover:bg-indigo-100 rounded-lg transition"
                  title="Join Live Demo Room"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowKillSwitchModal(true)}
                  id="trigger-kill-switch-btn"
                  className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                  title="Activate No-Pressure Kill-Switch"
                >
                  <UserX className="w-4 h-4" />
                  <span className="hidden md:inline">Kill Switch</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Messaging Logs Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, i) => {
            const isSystem = msg.sender === 'system';
            const isContractor = msg.sender === 'contractor';
            const isAudio = msg.attachmentType === 'audio';
            const isVideo = msg.attachmentType === 'video';

            if (isSystem) {
              return (
                <div key={msg.id || i} className="mx-auto max-w-md bg-navy/5 text-navy border border-slate-100 p-3 rounded-xl text-center text-xs space-y-1">
                  <div className="flex justify-center mb-0.5">
                    <ShieldCheck className="w-4 h-4 text-teal" />
                  </div>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                </div>
              );
            }

            return (
              <div
                key={msg.id || i}
                className={`flex flex-col max-w-[85%] ${isContractor ? 'self-start' : 'self-end ml-auto'}`}
              >
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isContractor
                    ? 'bg-white text-navy border border-slate-100 rounded-tl-none'
                    : 'bg-navy text-white rounded-tr-none'
                }`}>
                  {msg.flagged && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber bg-amber/15 border border-amber/25 px-1.5 py-0.5 rounded mb-1.5 uppercase font-mono tracking-wider">
                      <AlertTriangle className="w-3 h-3" /> Redacted external address
                    </div>
                  )}
                  
                  {isAudio ? (
                    <div className="flex flex-col gap-1 w-56 sm:w-64">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-teal font-extrabold flex items-center gap-1">
                        <Mic className="w-3 h-3" /> SECURE LOCKER VOICEMAIL
                      </span>
                      <div className="flex items-center gap-2.5 mt-2">
                        <button
                          type="button"
                          onClick={() => handleToggleAudioPlayback(msg.id)}
                          className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center hover:scale-105 active:scale-95 transition shrink-0 cursor-pointer"
                        >
                          {playingMessageId === msg.id ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-end gap-0.5 h-5">
                            {[3, 6, 9, 8, 5, 11, 14, 10, 6, 8, 12, 10, 7, 3, 6, 9, 8, 4].map((h, idx) => {
                              const isPlayed = playingMessageId === msg.id && (idx / 18) * 100 < playProgress;
                              return (
                                <div
                                  key={idx}
                                  className={`w-0.5 rounded-full transition-all duration-300 ${
                                    isPlayed ? 'bg-teal' : 'bg-slate-300/60'
                                  }`}
                                  style={{
                                    height: playingMessageId === msg.id 
                                      ? `${h + Math.sin((playProgress / 4) + idx) * 3}px` 
                                      : `${h}px`
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 shrink-0">
                          {playingMessageId === msg.id 
                            ? formatDuration(Math.max(0, Math.round(((100 - playProgress) / 100) * parseDurationSeconds(msg.attachmentDuration || '0:00')))) 
                            : msg.attachmentDuration}
                        </span>
                      </div>
                    </div>
                  ) : isVideo ? (
                    <div className="flex flex-col gap-1.5 w-56 sm:w-64">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-teal font-extrabold flex items-center gap-1">
                        <Video className="w-3 h-3" /> SECURE VIDEO NOTE
                      </span>
                      <div 
                        onClick={() => handlePlayVideoMessage(msg)}
                        className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 border border-slate-800 cursor-pointer group mt-1.5"
                      >
                        <div className="absolute inset-0 bg-navy/25 group-hover:bg-navy/40 transition flex items-center justify-center z-10">
                          <div className="w-10 h-10 rounded-full bg-white/95 text-navy flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>
                        
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 to-slate-800 p-3 text-center">
                          <Camera className="w-6 h-6 text-teal/40 animate-pulse mb-1" />
                          <span className="text-[10px] font-mono text-slate-400">Play Clip Preview</span>
                        </div>
                        
                        <div className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-mono text-white z-10">
                          {msg.attachmentDuration}
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 mt-1">{msg.text}</p>
                    </div>
                  ) : msg.attachmentType === 'document' ? (
                    <div className="flex flex-col gap-1.5 w-56 sm:w-64">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-teal font-extrabold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> SECURED PRIVACY FILE
                      </span>
                      <div className="mt-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-2 shadow-inner">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-8 h-8 text-amber shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block truncate">{msg.attachmentName}</span>
                            <span className="text-[9px] text-slate-400 font-mono block">{msg.attachmentSize}</span>
                          </div>
                        </div>
                      </div>
                      
                      {msg.redactedFields && (
                        <div className="space-y-1 mt-1 bg-slate-950/40 p-2 rounded-lg border border-slate-800/40">
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase tracking-wider">Locker Scrub Shield:</span>
                          <div className="flex flex-wrap gap-1">
                            {msg.redactedFields.fullName && (
                              <span className="text-[8px] font-mono px-1.5 py-0.5 bg-black text-emerald-400 rounded border border-emerald-500/10">✓ NAME</span>
                            )}
                            {msg.redactedFields.phone && (
                              <span className="text-[8px] font-mono px-1.5 py-0.5 bg-black text-emerald-400 rounded border border-emerald-500/10">✓ PHONE</span>
                            )}
                            {msg.redactedFields.email && (
                              <span className="text-[8px] font-mono px-1.5 py-0.5 bg-black text-emerald-400 rounded border border-emerald-500/10">✓ EMAIL</span>
                            )}
                            {msg.redactedFields.address && (
                              <span className="text-[8px] font-mono px-1.5 py-0.5 bg-black text-emerald-400 rounded border border-emerald-500/10">✓ ADDRESS</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {msg.redactedFields && (
                        <button
                          type="button"
                          onClick={() => handleOpenDocViewer(msg)}
                          className="mt-1.5 w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-[11px] font-bold rounded-lg border border-slate-700 text-white transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Redacted Doc</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                <span className="text-[10px] text-stone-gray font-mono mt-1 px-1 self-end">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Filter Alert Banner */}
        {showFilterAlert && (
          <div className="absolute bottom-16 left-4 right-4 bg-amber/95 backdrop-blur border border-amber text-navy p-3 rounded-xl shadow-lg flex items-start gap-3 animate-slideUp z-30">
            <ShieldAlert className="w-5 h-5 text-navy shrink-0 mt-0.5 animate-bounce" />
            <div className="flex-1">
              <strong className="text-sm block font-bold">Privacy Safeguard Intercepted Info</strong>
              <p className="text-xs leading-snug">
                You typed <code className="bg-navy/10 px-1 font-mono font-bold rounded">{filteredSnippet}</code>. For your security under Michigan construction statutes, contact details are automatically hidden. Keep chats inside RoofLocker to avoid scams.
              </p>
            </div>
            <button
              onClick={() => setShowFilterAlert(false)}
              className="text-navy hover:text-red-500 text-sm font-bold font-mono px-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white shrink-0 flex gap-2">
          <label 
            htmlFor="doc-upload-input" 
            className={`p-2.5 bg-slate-100 text-stone-gray hover:bg-slate-200 hover:text-navy rounded-xl transition cursor-pointer shrink-0 flex items-center justify-center ${isKilled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Upload Document & Redact Info"
          >
            <Paperclip className="w-4 h-4" />
            <input
              type="file"
              id="doc-upload-input"
              className="hidden"
              disabled={isKilled}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              onChange={handleDocUpload}
            />
          </label>
          <input
            type="text"
            disabled={isKilled}
            placeholder={isKilled ? "Conversation permanently blocked." : "Ask about quotes, GAF shingles, code, or schedule a video demonstration..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-teal focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isKilled || !inputText.trim()}
            id="send-message-btn"
            className={`p-2.5 rounded-xl text-white transition shrink-0 ${
              isKilled || !inputText.trim()
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-teal hover:bg-teal/95 shadow-sm'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* RIGHT: Secure Comm Center & Live Presentation Room (5 columns) */}
      <div className="lg:col-span-5 flex flex-col h-[520px] justify-between">
        {/* Horizontal Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 mb-3 shrink-0">
          <button
            onClick={() => setRightTab('calling')}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition cursor-pointer ${
              rightTab === 'calling'
                ? 'bg-navy text-white shadow-sm'
                : 'text-stone-gray hover:text-navy hover:bg-white/40'
            }`}
          >
            Secure Call
          </button>
          <button
            onClick={() => setRightTab('demo')}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition cursor-pointer ${
              rightTab === 'demo'
                ? 'bg-navy text-white shadow-sm'
                : 'text-stone-gray hover:text-navy hover:bg-white/40'
            }`}
          >
            Live Demo
          </button>
          <button
            onClick={() => setRightTab('schedule')}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition cursor-pointer ${
              rightTab === 'schedule'
                ? 'bg-navy text-white shadow-sm'
                : 'text-stone-gray hover:text-navy hover:bg-white/40'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setRightTab('policy')}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition cursor-pointer ${
              rightTab === 'policy'
                ? 'bg-navy text-white shadow-sm'
                : 'text-stone-gray hover:text-navy hover:bg-white/40'
            }`}
          >
            Locker Policy
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {rightTab === 'calling' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white h-full flex flex-col justify-between overflow-hidden shadow-xl animate-fadeIn relative">
              
              {/* IF IN ACTIVE CALLING MODE */}
              {callState !== 'idle' ? (
                <div className="flex-1 flex flex-col justify-between h-full">
                  
                  {/* Call Header */}
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${callState === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber animate-ping'}`} />
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-teal">
                        {callState === 'dialing' ? 'Establishing Secure Link...' : 'Secure Line Connected'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-navy/60 px-2 py-0.5 rounded text-white border border-teal/40 font-bold">
                      AES-256
                    </span>
                  </div>

                  {/* Call Body */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-3">
                    {callState === 'dialing' ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="relative mx-auto w-16 h-16 bg-amber/15 border border-amber/30 rounded-full flex items-center justify-center">
                          <PhoneCall className="w-8 h-8 text-amber animate-bounce" />
                          <div className="absolute inset-0 border border-amber/40 rounded-full animate-ping scale-125" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-white">Calling {contractor.name}...</h4>
                          <p className="text-slate-200 text-xs mt-1">Ringing secure browser line...</p>
                        </div>
                        <p className="text-[10px] font-mono text-slate-300 tracking-wider">End-to-End Tunnel Encrypted</p>
                      </div>
                    ) : callState === 'connected' ? (
                      <div className="w-full h-full flex flex-col justify-between">
                        
                        {/* Interactive Video Call Grid */}
                        {callType === 'video' ? (
                          <div className="grid grid-cols-2 gap-3 w-full my-auto shrink-0">
                            {/* Homeowner box */}
                            <div className="bg-slate-950 rounded-xl overflow-hidden aspect-video border border-slate-800 relative group flex items-center justify-center">
                              {cameraAvailable ? (
                                <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center p-2">
                                  <User className="w-6 h-6 text-teal mx-auto opacity-60 mb-1" />
                                  <span className="text-[9px] font-mono text-slate-200 block">Encrypted Voice (Cam Off)</span>
                                </div>
                              )}
                              <span className="absolute bottom-1.5 left-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-white">You</span>
                            </div>

                            {/* Contractor box */}
                            <div className="bg-slate-950 rounded-xl overflow-hidden aspect-video border border-slate-800 relative flex items-center justify-center">
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex flex-col justify-between p-2">
                                <span className="bg-emerald-600/20 text-emerald-400 text-[8px] font-mono px-1.5 py-0.5 rounded font-bold w-fit border border-emerald-500/20">ONSITE • ACTIVE</span>
                                <div className="text-left">
                                  <strong className="text-[10px] font-bold block text-white">Brad S.</strong>
                                  <span className="text-[8px] text-slate-100 block">Apex Representative</span>
                                </div>
                              </div>
                              {/* Roof inspection visual placeholder loop */}
                              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-slate-900">
                                <Sparkles className="w-6 h-6 text-amber/60 animate-spin mb-1" style={{ animationDuration: '4s' }} />
                                <span className="text-[8px] font-mono text-slate-200 block uppercase tracking-wider">Shingle Feed</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Audio Call Display
                          <div className="my-auto space-y-4">
                            <div className="relative mx-auto w-16 h-16 bg-teal/15 border border-teal/30 rounded-full flex items-center justify-center">
                              <User className="w-8 h-8 text-teal" />
                              <div className="absolute inset-0 border border-teal/40 rounded-full animate-ping scale-110" />
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-base text-white">{contractor.name}</h4>
                              <p className="text-slate-200 text-xs mt-1">Brad S. (Vetted Specialist)</p>
                            </div>
                            
                            {/* Pulsing Audio wave bars */}
                            <div className="flex justify-center items-center gap-0.5 h-6 shrink-0">
                              {[3, 6, 8, 4, 9, 12, 10, 5, 8, 11, 4, 7].map((h, i) => (
                                <div 
                                  key={i} 
                                  className="w-1 bg-teal rounded-full animate-[loading_1.5s_ease-in-out_infinite]"
                                  style={{ 
                                    height: `${h}px`,
                                    animationDelay: `${i * 0.1}s`
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-center mt-2">
                          <span className="font-mono text-xs text-teal font-bold">{formatDuration(callDuration)}</span>
                        </div>
                      </div>
                    ) : (
                      // Call Ended Panel
                      <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 bg-red-100/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500">
                          <PhoneOff className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">Locker Connection Terminated</h4>
                          <p className="text-slate-200 text-xs mt-1">Line disconnected safely. Communication metadata kept offline.</p>
                        </div>
                        <button
                          onClick={() => setCallState('idle')}
                          className="px-4 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs font-semibold cursor-pointer text-white"
                        >
                          Return to Comm Center
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Call Controls Footer */}
                  {callState === 'connected' && (
                    <div className="p-3 border-t border-slate-800 flex justify-center gap-3 shrink-0">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2 rounded-full transition cursor-pointer ${isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        title={isMuted ? "Unmute Mic" : "Mute Mic"}
                      >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>

                      {callType === 'video' && (
                        <button
                          onClick={() => setIsCameraOff(!isCameraOff)}
                          className={`p-2 rounded-full transition cursor-pointer ${isCameraOff ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                          title={isCameraOff ? "Turn Cam On" : "Turn Cam Off"}
                        >
                          {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                        </button>
                      )}

                      {callType === 'video' && (
                        <button
                          type="button"
                          onClick={() => setFullscreenVideo('active-call')}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition cursor-pointer"
                          title="Maximize to Fullscreen"
                        >
                          <Maximize2 className="w-4 h-4 text-teal animate-pulse" />
                        </button>
                      )}

                      <button
                        onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                        className={`p-2 rounded-full transition cursor-pointer ${isSpeakerMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        title={isSpeakerMuted ? "Unmute Volume" : "Mute Volume"}
                      >
                        {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={handleEndCall}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow shrink-0 cursor-pointer"
                        title="Disconnect line"
                      >
                        <PhoneOff className="w-3.5 h-3.5" />
                        Hang Up
                      </button>

                      <button
                        onClick={() => {
                          handleEndCall();
                          handleStartRecordingVoice();
                        }}
                        className="px-3.5 py-2 bg-amber hover:bg-amber/90 text-navy rounded-full text-xs font-bold flex items-center gap-1 shadow shrink-0 cursor-pointer"
                        title="Leave Voicemail"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        Voicemail
                      </button>
                    </div>
                  )}

                  {callState === 'dialing' && (
                    <div className="p-3 border-t border-slate-800 flex justify-center shrink-0">
                      <button
                        onClick={() => setCallState('idle')}
                        className="px-5 py-2 bg-red-600/20 hover:bg-red-600 hover:text-white border border-red-500/30 text-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <PhoneOff className="w-3.5 h-3.5" /> Cancel Call
                      </button>
                    </div>
                  )}

                </div>
              ) : activeMediaRecording !== 'none' ? (
                // IF IN DIRECT RECORDING MODE
                <div className="flex-1 flex flex-col justify-between h-full">
                  
                  {/* Recorder Header */}
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-300">
                        {activeMediaRecording === 'voice' ? 'Secure Voicemail Recorder' : 'Secure Video Note'}
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveMediaRecording('none')}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Recorder Viewport / Control Body */}
                  <div className="flex-1 flex flex-col items-center justify-center p-2">
                    {activeMediaRecording === 'voice' ? (
                      // Voice Memo Recorder Body
                      <div className="space-y-4 w-full text-center">
                        {voiceRecordingState === 'recording' ? (
                          <>
                            <div className="relative mx-auto w-14 h-14 bg-red-600/10 border border-red-600/30 rounded-full flex items-center justify-center">
                              <Mic className="w-6 h-6 text-red-500 animate-pulse" />
                              <div className="absolute inset-0 border border-red-600/30 rounded-full animate-ping scale-110" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono uppercase bg-red-600/20 border border-red-500/30 px-2 py-0.5 rounded text-red-400 font-bold tracking-widest inline-block mb-1">
                                RECORDING MEMO
                              </span>
                              <p className="font-mono text-base font-bold text-white mt-1">{formatDuration(voiceDuration)}</p>
                              <p className="text-[11px] text-slate-400 mt-1">Speak clearly. We protect and log your requests safely.</p>
                            </div>
                            {/* Visual equalizer wave */}
                            <div className="flex justify-center items-end gap-0.5 h-5">
                              {[3, 6, 9, 7, 5, 10, 13, 9, 6, 8, 11, 7, 4].map((h, i) => (
                                <div 
                                  key={i} 
                                  className="w-1 bg-red-500 rounded-full animate-[loading_1.2s_ease-in-out_infinite]"
                                  style={{ 
                                    height: `${h}px`,
                                    animationDelay: `${i * 0.08}s`
                                  }}
                                />
                              ))}
                            </div>
                          </>
                        ) : (
                          // Voice Preview state
                          <>
                            <div className="mx-auto w-14 h-14 bg-teal/10 border border-teal/30 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-7 h-7 text-teal" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono uppercase bg-teal/20 border border-teal/30 px-2.5 py-0.5 rounded text-teal font-bold tracking-widest inline-block">
                                RECORDING COMPLETE
                              </span>
                              <p className="font-mono text-xs font-bold text-slate-300 mt-2">Duration: {formatDuration(voiceDuration === 0 ? 8 : voiceDuration)}</p>
                              <p className="text-[11px] text-slate-400 mt-1">Review and send your voicemail to {contractor.name}.</p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      // Video Note Recorder Body
                      <div className="w-full flex flex-col items-center">
                        <div className="w-full bg-slate-950 rounded-xl overflow-hidden aspect-video border border-slate-800 relative flex items-center justify-center max-h-[160px] sm:max-h-[190px]">
                          {videoRecordingState === 'recording' ? (
                            <>
                              {cameraAvailable ? (
                                <video ref={recordingWebcamRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center p-3">
                                  <Camera className="w-8 h-8 text-teal mx-auto opacity-60 mb-2 animate-pulse" />
                                  <span className="text-[10px] font-mono text-slate-400 block uppercase">SECURE VIEWPORT LOCKED</span>
                                </div>
                              )}
                              
                              {/* Recording overlay indicators */}
                              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                <span className="text-[9px] font-mono text-white font-bold tracking-widest">REC</span>
                              </div>
                              <span className="absolute bottom-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[9px] font-mono text-white font-bold">
                                {formatDuration(videoDuration)}
                              </span>
                            </>
                          ) : (
                            // Video Preview State
                            <div className="text-center p-3">
                              <CheckCircle className="w-8 h-8 text-teal mx-auto mb-2" />
                              <span className="text-xs font-bold text-white block">Video Message Registered</span>
                              <span className="text-[10px] font-mono text-slate-400 block mt-1">Duration: {formatDuration(videoDuration === 0 ? 12 : videoDuration)}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 text-center mt-2">
                          {videoRecordingState === 'recording' ? '🔴 Recording live roof/shingle area...' : 'Review clip and send to secure project trail'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Recorder Controls Footer */}
                  <div className="p-3 border-t border-slate-800 flex justify-center gap-2 shrink-0">
                    {activeMediaRecording === 'voice' ? (
                      voiceRecordingState === 'recording' ? (
                        <>
                          <button
                            onClick={handleStopRecordingVoice}
                            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" /> Stop Recording
                          </button>
                          <button
                            onClick={() => setActiveMediaRecording('none')}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleSendVoiceNote}
                            className="flex-1 py-2 bg-teal hover:bg-teal/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" /> Send Voicemail
                          </button>
                          <button
                            onClick={handleStartRecordingVoice}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
                            title="Re-record"
                          >
                            <RefreshCw className="w-4 h-4 text-slate-400" />
                          </button>
                          <button
                            onClick={() => setActiveMediaRecording('none')}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
                            title="Cancel"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400" />
                          </button>
                        </>
                      )
                    ) : (
                      // Video controls
                      videoRecordingState === 'recording' ? (
                        <>
                          <button
                            onClick={handleStopRecordingVideo}
                            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" /> Stop Recording
                          </button>
                          <button
                            onClick={() => setActiveMediaRecording('none')}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleSendVideoNote}
                            className="flex-1 py-2 bg-teal hover:bg-teal/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" /> Send Video Note
                          </button>
                          <button
                            onClick={handleStartRecordingVideo}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
                            title="Re-record"
                          >
                            <RefreshCw className="w-4 h-4 text-slate-400" />
                          </button>
                          <button
                            onClick={() => setActiveMediaRecording('none')}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
                            title="Cancel"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400" />
                          </button>
                        </>
                      )
                    )}
                  </div>

                </div>
              ) : (
                // DEFAULT IDLE COMM PORTAL HOME SCREEN
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
                      <Lock className="w-4 h-4 text-teal" />
                      <h4 className="font-display font-bold text-sm text-white">Locker Communication Portal</h4>
                    </div>
                    
                    <p className="text-xs text-slate-100 leading-relaxed">
                      Establish direct encrypted voice or video calls without exposing your phone number or email to third-party sales systems.
                    </p>

                    {/* Calling Buttons */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => handleInitiateCall('voice')}
                        className="p-3 bg-teal hover:bg-teal/90 text-white rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center gap-2 shadow hover:scale-[1.02] transition cursor-pointer"
                      >
                        <Phone className="w-5 h-5" />
                        <span>Secure Voice Call</span>
                      </button>
                      <button
                        onClick={() => handleInitiateCall('video')}
                        className="p-3 bg-amber hover:bg-amber/90 text-navy rounded-xl text-center font-bold text-xs flex flex-col items-center justify-center gap-2 shadow hover:scale-[1.02] transition cursor-pointer"
                      >
                        <Video className="w-5 h-5" />
                        <span>Secure Video Call</span>
                      </button>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-800"></div>
                      <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-350 uppercase tracking-widest">OR</span>
                      <div className="flex-grow border-t border-slate-800"></div>
                    </div>

                    {/* Media Messaging Recording triggers */}
                    <div>
                      <strong className="text-xs text-slate-100 block mb-2 font-semibold">Leave Recorded Media Note:</strong>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={handleStartRecordingVoice}
                          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
                        >
                          <Mic className="w-4 h-4 text-teal" />
                          <span>Voice Message</span>
                        </button>
                        <button
                          onClick={handleStartRecordingVideo}
                          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
                        >
                          <Camera className="w-4 h-4 text-amber" />
                          <span>Video Note</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Footnote */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mt-4">
                    <span className="text-[10px] font-mono text-slate-200 leading-snug block">
                      🛡️ <strong>Encrypted Tunnel:</strong> Under Michigan Residential Code laws, keeping contractor comms inside RoofLocker safeguards your escrow files from direct solicitation harassment.
                    </span>
                  </div>
                </div>
              )}

            </div>
          ) : rightTab === 'demo' ? (
            // PRESERVED LIVE DEMO TAB
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white h-full flex flex-col justify-between overflow-hidden shadow-xl animate-fadeIn relative">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-mono tracking-wider font-semibold text-red-400">LIVE PRESENTATION</span>
                </div>
                <button
                  onClick={() => setRightTab('calling')}
                  className="text-xs text-slate-200 hover:text-white font-medium cursor-pointer"
                >
                  Exit Demo
                </button>
              </div>

              {!isDemoPlaying ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-slate-950 rounded-xl border border-slate-800/80 mb-4">
                  <Video className="w-10 h-10 text-teal animate-pulse mb-3" />
                  <h4 className="font-display font-bold text-white text-base">Join Video Product Demonstration</h4>
                  <p className="text-slate-100 text-xs max-w-xs mt-1 mb-4 leading-normal">
                    {contractor.name} is ready to show you GAF Timberline HDZ samples, local shingles, and building code layouts.
                  </p>
                  <button
                    onClick={() => setIsDemoPlaying(true)}
                    id="connect-video-btn"
                    className="px-4 py-2 rounded-xl bg-teal hover:bg-teal/95 font-bold text-xs flex items-center gap-1.5 shadow animate-pulse cursor-pointer text-white"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Connect Secure Feed
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between mb-4 relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 min-h-[160px]">
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white z-10">
                    Representative: Brad S. (Apex Elite)
                  </div>

                  <div className="flex-1 flex items-center justify-center p-4 text-center animate-pulse">
                    <div className="space-y-2">
                      <Sparkles className="w-8 h-8 text-amber mx-auto animate-bounce" />
                      <p className="font-semibold text-xs text-white">STREAMING GAF ROOF SAMPLES</p>
                      <p className="text-slate-100 text-[10px]">Demonstrating Ridge Ventilation & Double-Layer Ice Shielding</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-black/70 border-t border-slate-800 flex justify-between items-center shrink-0 z-10 gap-2">
                    <span className="text-[10px] text-slate-200 font-mono">Stream: 1080p Secure Tunnel</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFullscreenVideo('demo')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                        title="Expand Demo to Fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-teal" />
                        <span>Fullscreen</span>
                      </button>
                      <button
                        onClick={handleReportHighPressureInDemo}
                        id="report-pressure-demo-btn"
                        className="bg-red-600/20 hover:bg-red-600 text-red-100 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-red-500/30 transition uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Flag Pressure Tactics
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 shrink-0">
                <strong className="font-semibold text-xs text-slate-100 block mb-1">Your Defense Rules:</strong>
                <p className="text-slate-200 text-[10px] leading-relaxed">
                  If the sales representative attempts to lock you into a quote, bypass RoofLocker guidelines, or claims they will wave fees, hit the **Flag Pressure Tactics** button immediately to terminate contact.
                </p>
              </div>
            </div>
          ) : rightTab === 'schedule' ? (
            // GOOGLE CALENDAR SCHEDULE TAB
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white h-full flex flex-col justify-between overflow-y-auto shadow-xl animate-fadeIn relative">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal" />
                    <span className="text-xs font-mono tracking-wider font-semibold text-teal uppercase">Schedule secure session</span>
                  </div>
                  {googleUser && (
                    <button
                      onClick={handleGoogleLogout}
                      className="text-[10px] text-slate-200 hover:text-red-400 transition flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded cursor-pointer animate-fadeIn"
                      title="Unlink Google Calendar"
                    >
                      <LogOut className="w-3 h-3" />
                      Unlink
                    </button>
                  )}
                </div>

                {needsAuth ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-6 px-2 animate-fadeIn">
                    <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center text-teal mb-3.5 border border-teal/20 animate-pulse">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Connect Google Calendar</h4>
                    <p className="text-xs text-slate-200 leading-relaxed mb-5 max-w-xs">
                      Synchronize your personal calendar to securely book voice consultations or live video material demonstrations with the roofer.
                    </p>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isAuthChecking}
                      className="w-full max-w-xs flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-navy font-bold text-xs rounded-xl transition duration-200 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isAuthChecking ? (
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-teal" />
                      ) : (
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4.5 h-4.5 shrink-0">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        </svg>
                      )}
                      <span>{isAuthChecking ? "Authenticating securely..." : "Sign in with Google"}</span>
                    </button>
                    {scheduleError && (
                      <div className="mt-3.5 text-[11px] text-red-400 bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-900/30 animate-fadeIn">
                        {scheduleError}
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleScheduleSession} className="space-y-3.5 animate-fadeIn">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-200 mb-1.5">
                        Session Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setScheduleType('video')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                            scheduleType === 'video'
                              ? 'bg-teal/15 text-teal border-teal/40 shadow-sm'
                              : 'bg-slate-800/40 text-slate-200 border-slate-700/60 hover:bg-slate-800/60'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          Video Demo
                        </button>
                        <button
                          type="button"
                          onClick={() => setScheduleType('voice')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                            scheduleType === 'voice'
                              ? 'bg-teal/15 text-teal border-teal/40 shadow-sm'
                              : 'bg-slate-800/40 text-slate-200 border-slate-700/60 hover:bg-slate-800/60'
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Voice Consultation
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-200 mb-1.5">
                          Date
                        </label>
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-200 mb-1.5">
                          Time Slot
                        </label>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-200 mb-1.5">
                        Notes / Discussion Items
                      </label>
                      <textarea
                        value={scheduleNotes}
                        onChange={(e) => setScheduleNotes(e.target.value)}
                        placeholder="e.g. Roof shingles selection, double ice barriers review, etc."
                        rows={2}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal resize-none"
                      />
                    </div>

                    {scheduleSuccess && (
                      <div className="text-[11px] text-teal bg-teal/10 px-3 py-2 rounded-lg border border-teal/20 flex items-center gap-2 animate-fadeIn">
                        <CheckCircle className="w-4 h-4 text-teal shrink-0 animate-pulse" />
                        <span>Successfully added to your Google Calendar!</span>
                      </div>
                    )}

                    {scheduleError && (
                      <div className="text-[11px] text-red-400 bg-red-950/40 px-3 py-2 rounded-lg border border-red-900/30 animate-fadeIn">
                        {scheduleError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isScheduling}
                      className="w-full py-2 bg-teal hover:bg-teal/95 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl font-bold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isScheduling ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Scheduling Session...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Schedule on Google Calendar</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* List of upcoming events */}
                {!needsAuth && (
                  <div className="border-t border-slate-800/80 pt-3.5 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-[10px] font-mono uppercase tracking-wider text-slate-200">Upcoming Secure Sessions</strong>
                      {isFetchingEvents && <Loader2 className="w-3 h-3 animate-spin text-teal" />}
                    </div>

                    {calendarEvents.length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic">No RoofLocker meetings scheduled yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                        {calendarEvents.map((ev) => {
                          const start = ev.start?.dateTime || ev.start?.date;
                          const formattedDate = start ? new Date(start).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown time';
                          return (
                            <div key={ev.id} className="bg-slate-950/50 border border-slate-800/50 rounded-lg p-2 flex items-start gap-2.5 hover:border-slate-800 transition animate-fadeIn">
                              <Calendar className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <h5 className="text-[11px] font-semibold text-white truncate">{ev.summary}</h5>
                                <div className="flex items-center gap-1.5 text-[9px] text-slate-300 mt-0.5 font-mono">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{formattedDate}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 mt-4 shrink-0 text-[10px] text-slate-200 leading-relaxed">
                <span className="font-semibold text-white block mb-0.5">Secure Buffer Room Note:</span>
                Google Calendar scheduling uses the security credentials of the active applet. Do not share raw video/voice links outside of this secured enclave.
              </div>
            </div>
          ) : (
            // PRESERVED SECURE BUFFER POLICY TAB
            <div className="bg-navy border border-deep-slate rounded-2xl p-5 md:p-6 text-white h-full flex flex-col justify-between shadow-xl animate-fadeIn">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-teal" />
                  <h3 className="font-display font-bold text-white text-base">Secure Buffer Policy</h3>
                </div>

                <div className="space-y-3.5 text-xs text-mist leading-relaxed">
                  <p>
                    Homeowners are routinely subjected to high-pressure techniques, such as **contingencies** that force agreement on the spot.
                  </p>
                  <p>
                    Our built-in communication workspace acts as an absolute legal buffer. By remaining inside the hub, you prevent:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 font-mono text-[11px] text-amber font-medium">
                    <li>Unlicensed Adjusting Abuse</li>
                    <li>Deductible Fraud schemes</li>
                    <li>Incurring hidden cancellation penalties</li>
                    <li>Aggressive door-knocking solicitation</li>
                  </ul>
                </div>
              </div>

              <div className="bg-deep-slate p-3.5 rounded-xl border border-slate-800/60 mt-4 text-xs flex gap-2.5 shrink-0">
                <HelpCircle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-semibold">Ready to see materials?</strong>
                  <p className="text-slate-300 text-[10px] mt-0.5">
                    Select the camera or phone icons in the chat header or the Secure Call tab to initiate safe, direct contact!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIDEO MESSAGE PLAYBACK OVERLAY MODAL */}
      {selectedVideoNote && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 text-white rounded-2xl max-w-lg w-full border border-slate-800 shadow-2xl p-5 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-teal animate-pulse" />
                <strong className="text-sm font-display font-bold">Secure Video Note Playback</strong>
              </div>
              <button 
                onClick={handleCloseVideoPlayback}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Screen Viewport */}
            <div className="bg-black rounded-xl overflow-hidden aspect-video border border-slate-850 relative flex items-center justify-center">
              
              {/* Playback simulation screen */}
              {videoPlaybackPlaying ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <Camera className="w-10 h-10 text-teal/40 animate-pulse mb-2" />
                  <span className="text-xs text-slate-300 font-mono tracking-wider font-semibold">STREAMING DEPOSITED CLIP...</span>
                  <p className="text-[10px] text-slate-500 mt-1">End-to-End Cryptography Intact</p>
                  
                  {/* Pulsing sound animation overlay */}
                  <div className="flex gap-1 items-end h-8 mt-4">
                    {[5, 12, 18, 14, 8, 15, 20, 12, 6, 10, 16, 9].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-0.5 bg-teal rounded-full"
                        style={{ 
                          height: `${h}px`,
                          animation: 'loading 1.2s ease-in-out infinite',
                          animationDelay: `${i * 0.08}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-slate-950/90">
                  <Pause className="w-10 h-10 text-teal mb-2 opacity-50" />
                  <span className="text-xs font-mono text-slate-400">PLAYBACK PAUSED</span>
                </div>
              )}

              {/* Watermark security overlay */}
              <div className="absolute top-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono border border-slate-800">
                Locker Clip ID: {selectedVideoNote.id}
              </div>
              
              {/* Video control overlay bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/0 p-3 flex flex-col gap-2">
                <div className="w-full bg-slate-800 rounded-full h-1 relative overflow-hidden">
                  <div className="bg-teal h-full transition-all duration-200" style={{ width: `${videoPlaybackProgress}%` }} />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleToggleVideoPlayback}
                      className="text-white hover:text-teal focus:outline-none cursor-pointer"
                    >
                      {videoPlaybackPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <span>
                      {formatDuration(Math.round((videoPlaybackProgress / 100) * parseDurationSeconds(selectedVideoNote.attachmentDuration || '0:10')))}
                      {' / '}
                      {selectedVideoNote.attachmentDuration}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>1080p Secure Tunnel</span>
                    <button
                      type="button"
                      onClick={() => setFullscreenVideo('video-note')}
                      className="text-white hover:text-teal focus:outline-none cursor-pointer p-0.5 ml-1"
                      title="Expand Fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Note Details */}
            <div className="mt-4 p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 block">Message Context:</span>
              <p className="text-xs text-slate-200 mt-1 italic font-medium">
                "{selectedVideoNote.text}"
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-850">
              <button
                type="button"
                onClick={handleCloseVideoPlayback}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-xs font-bold rounded-xl shadow cursor-pointer text-slate-200"
              >
                Close Playback
              </button>
            </div>

          </div>
        </div>
      )}

      {/* KILL SWITCH WARNING DIALOG MODAL */}
      {showKillSwitchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl p-6 animate-scaleUp">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-6 h-6 text-red-600 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy text-lg leading-tight">
                  WARNING: Terminate Contractor Portal?
                </h3>
                <p className="text-stone-gray text-xs sm:text-sm mt-1">
                  Activating the No-Pressure Kill-Switch is irreversible. {contractor.name} will be blocked from sending messages or viewing your project workspace.
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4 mb-5">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-navy uppercase mb-1.5">Reason for Termination</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-gray p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="kill-reason"
                      checked={killReason === 'high-pressure'}
                      onChange={() => setKillReason('high-pressure')}
                      className="mt-0.5 accent-teal"
                    />
                    <div>
                      <strong className="text-navy font-semibold">High-Pressure Environment</strong>
                      <span className="block text-[11px] text-slate-400">Representative was pushy, aggressive, or used contingency traps.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-gray p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="kill-reason"
                      checked={killReason === 'bypass'}
                      onChange={() => setKillReason('bypass')}
                      className="mt-0.5 accent-teal"
                    />
                    <div>
                      <strong className="text-navy font-semibold">Bypass Escrow / Fraud Offer</strong>
                      <span className="block text-[11px] text-slate-400">Offered to 'eat' or waive deductible, or requested cash outside Stripe Connect.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-gray p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="kill-reason"
                      checked={killReason === 'poor-comms'}
                      onChange={() => setKillReason('poor-comms')}
                      className="mt-0.5 accent-teal"
                    />
                    <div>
                      <strong className="text-navy font-semibold">Poor Communication</strong>
                      <span className="block text-[11px] text-slate-400">Unresponsive, poor service, or repeatedly ignoring building code specifications.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-gray p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="kill-reason"
                      checked={killReason === 'other'}
                      onChange={() => setKillReason('other')}
                      className="mt-0.5 accent-teal"
                    />
                    <div>
                      <strong className="text-navy font-semibold">Other Reason</strong>
                      <span className="block text-[11px] text-slate-400">Provide custom feedback for the RoofLocker Admin queue below.</span>
                    </div>
                  </label>
                </div>
              </div>

              {killReason === 'other' && (
                <div>
                  <textarea
                    placeholder="Provide specific details about their conduct..."
                    value={customKillReason}
                    onChange={(e) => setCustomKillReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm p-2 h-14 focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowKillSwitchModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-stone-gray hover:bg-slate-50 cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleTriggerKillSwitch}
                id="confirm-kill-switch-btn"
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow cursor-pointer"
              >
                Terminate Contractor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT REDACTION & PRIVACY WARNING MODAL */}
      {(showRedactionModal || isViewingRedactedDoc) && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl max-w-2xl w-full border border-slate-800 shadow-2xl p-5 sm:p-6 my-8 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-teal animate-pulse" />
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  {isViewingRedactedDoc ? 'RoofLocker Privacy Scrubbed Document' : 'Locker File Scanner & Privacy Scrub Tool'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowRedactionModal(false);
                  setIsViewingRedactedDoc(false);
                  setUploadedDoc(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Banner - ONLY show when uploading/redacting, not when reviewing */}
            {!isViewingRedactedDoc && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-100 rounded-xl flex items-start gap-3 mb-4 leading-normal text-xs animate-pulse">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-400 font-bold block mb-0.5">⚠️ PRIVACY LEAK INTERCEPTED: EXPOSURE DETECTED</strong>
                  Under Michigan Residential Building Codes, providing your direct email, phone, or home address to roofers enables predatory solicitation outside our secured escrow. Use our blackout tool to safely sanitize the document prior to sending.
                </div>
              </div>
            )}

            {/* Document Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">FILE NAME</span>
                <span className="font-bold text-slate-200 truncate block">
                  {isViewingRedactedDoc ? viewingDoc?.attachmentName : uploadedDoc?.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">ENCRYPTION ENGINE</span>
                <span className="font-bold text-teal flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active AES-256
                </span>
              </div>
            </div>

            {/* Redaction Tool Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Left Column: Interactive Controls (Only if in upload/redact mode) */}
              {!isViewingRedactedDoc ? (
                <div className="md:col-span-5 space-y-3">
                  <div className="p-3.5 bg-slate-950/40 border border-slate-805/80 rounded-xl">
                    <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex justify-between items-center">
                      <span>Scrub Fields</span>
                      <span className="text-[9px] text-teal font-normal capitalize">Interactive</span>
                    </h4>
                    
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleToggleRedactionField('fullName')}
                        className={`w-full p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          uploadedDoc?.redactedFields.fullName 
                            ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" /> Full Name
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-black/40 rounded font-mono">
                          {uploadedDoc?.redactedFields.fullName ? 'REDACTED' : 'EXPOSED'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleRedactionField('phone')}
                        className={`w-full p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          uploadedDoc?.redactedFields.phone 
                            ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> Phone Number
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-black/40 rounded font-mono">
                          {uploadedDoc?.redactedFields.phone ? 'REDACTED' : 'EXPOSED'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleRedactionField('email')}
                        className={`w-full p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          uploadedDoc?.redactedFields.email 
                            ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" /> Email Address
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-black/40 rounded font-mono">
                          {uploadedDoc?.redactedFields.email ? 'REDACTED' : 'EXPOSED'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleRedactionField('address')}
                        className={`w-full p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          uploadedDoc?.redactedFields.address 
                            ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Street Address
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-black/40 rounded font-mono">
                          {uploadedDoc?.redactedFields.address ? 'REDACTED' : 'EXPOSED'}
                        </span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoScrubAll}
                      className="mt-3.5 w-full py-2 bg-gradient-to-r from-teal to-emerald-600 hover:from-teal/95 hover:to-emerald-600/95 text-white font-bold text-xs rounded-lg transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>⚡ Auto-Scrub All Contact Data</span>
                    </button>

                    {/* Manual Block & Custom Redaction Input */}
                    <div className="mt-3.5 pt-3.5 border-t border-slate-800/80">
                      <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                        Manual Redact Text / Phrase
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={customRedactText}
                          onChange={(e) => setCustomRedactText(e.target.value)}
                          placeholder="Type specific word or value..."
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal flex-1 min-w-0"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomRedaction(customRedactText);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCustomRedaction(customRedactText)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-teal font-bold text-xs rounded-lg border border-slate-700 transition cursor-pointer"
                        >
                          Redact
                        </button>
                      </div>

                      {/* Highlight Selection Helper */}
                      {highlightedText && (
                        <div className="mt-2.5 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between gap-2 animation-pulse">
                          <div className="min-w-0 flex-1">
                            <span className="text-[8px] font-mono font-bold text-amber-400 block uppercase">Selected Text</span>
                            <span className="text-xs text-slate-200 truncate block font-serif">"{highlightedText}"</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddCustomRedaction(highlightedText)}
                            className="shrink-0 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-black font-bold text-[10px] rounded flex items-center gap-1 cursor-pointer transition shadow"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" /> Redact Highlight
                          </button>
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 block mt-1.5 leading-normal">
                        Tip: Drag your mouse to highlight ANY text inside the document, or click directly on blue phrases to blackout instantly!
                      </span>
                    </div>

                    {/* Active Manual Blackouts List */}
                    {uploadedDoc && uploadedDoc.customRedactedPhrases.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Active Blackouts ({uploadedDoc.customRedactedPhrases.length})
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                          {uploadedDoc.customRedactedPhrases.map((phrase, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] font-mono bg-black text-red-400 border border-red-500/20 px-2 py-0.5 rounded flex items-center gap-1 shrink-0"
                            >
                              <span>{phrase}</span>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveCustomRedaction(phrase)}
                                className="text-slate-400 hover:text-white font-bold hover:scale-110 ml-0.5 cursor-pointer text-xs"
                                title="Remove Blackout"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Right Column: Visual Document Preview Layout */}
              <div className={`${isViewingRedactedDoc ? 'md:col-span-12' : 'md:col-span-7'} flex flex-col`}>
                <div 
                  onMouseUp={handleTextSelection}
                  className="bg-white text-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 shadow-inner flex-1 min-h-[250px] relative font-sans text-xs flex flex-col justify-between"
                >
                  {/* Decorative Header */}
                  <div className="border-b border-slate-200 pb-2.5 mb-3 flex justify-between items-center shrink-0">
                    <div>
                      <strong className="text-xs uppercase font-bold tracking-tight text-slate-800">MICHIGAN ROOFING ESTIMATE</strong>
                      <span className="text-[8px] font-mono text-slate-400 block mt-0.5">
                        ID: {renderClickablePhrase("EST-89230")} • Model: {renderClickablePhrase("GAF Timberline HDZ")}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      Draft Estimate
                    </span>
                  </div>

                  {/* Document Content with blackouts */}
                  <div className="space-y-2.5 flex-1 select-text">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Name field */}
                      <div className="border-b border-slate-100 pb-1.5">
                        <span className="text-[8px] font-mono text-slate-400 block uppercase">Customer Name</span>
                        <div className="relative mt-0.5">
                          {(isViewingRedactedDoc ? viewingDoc?.redactedFields?.fullName : uploadedDoc?.redactedFields?.fullName) ? (
                            <button type="button" className="h-5 bg-black rounded w-32 flex items-center justify-center text-[9px] font-mono font-bold text-red-500 cursor-pointer" title="Click to undo redaction" onClick={() => !isViewingRedactedDoc && handleToggleRedactionField('fullName')}>
                              REDACTED
                            </button>
                          ) : (
                            <div className="flex items-center">
                              {renderClickablePhrase("Jane Doe")}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phone field */}
                      <div className="border-b border-slate-100 pb-1.5">
                        <span className="text-[8px] font-mono text-slate-400 block uppercase">Phone Number</span>
                        <div className="relative mt-0.5">
                          {(isViewingRedactedDoc ? viewingDoc?.redactedFields?.phone : uploadedDoc?.redactedFields?.phone) ? (
                            <button type="button" className="h-5 bg-black rounded w-32 flex items-center justify-center text-[9px] font-mono font-bold text-red-500 cursor-pointer" title="Click to undo redaction" onClick={() => !isViewingRedactedDoc && handleToggleRedactionField('phone')}>
                              REDACTED
                            </button>
                          ) : (
                            <div className="flex items-center">
                              {renderClickablePhrase("(555) 019-2831")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Email field */}
                      <div className="border-b border-slate-100 pb-1.5">
                        <span className="text-[8px] font-mono text-slate-400 block uppercase">Email Address</span>
                        <div className="relative mt-0.5">
                          {(isViewingRedactedDoc ? viewingDoc?.redactedFields?.email : uploadedDoc?.redactedFields?.email) ? (
                            <button type="button" className="h-5 bg-black rounded w-36 flex items-center justify-center text-[9px] font-mono font-bold text-red-500 cursor-pointer" title="Click to undo redaction" onClick={() => !isViewingRedactedDoc && handleToggleRedactionField('email')}>
                              REDACTED
                            </button>
                          ) : (
                            <div className="flex items-center">
                              {renderClickablePhrase("janedoe@example.com")}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Address field */}
                      <div className="border-b border-slate-100 pb-1.5">
                        <span className="text-[8px] font-mono text-slate-400 block uppercase">Property Address</span>
                        <div className="relative mt-0.5">
                          {(isViewingRedactedDoc ? viewingDoc?.redactedFields?.address : uploadedDoc?.redactedFields?.address) ? (
                            <button type="button" className="h-5 bg-black rounded w-44 flex items-center justify-center text-[9px] font-mono font-bold text-red-500 cursor-pointer" title="Click to undo redaction" onClick={() => !isViewingRedactedDoc && handleToggleRedactionField('address')}>
                              REDACTED
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 flex-wrap">
                              {renderClickablePhrase("123 Maple St")}, {renderClickablePhrase("Detroit")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Non-sensitive details */}
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 mt-2 text-[10px]">
                      <strong className="text-slate-700 font-bold block mb-0.5">Scope of Work (Michigan Approved):</strong>
                      <p className="text-slate-500 leading-normal">
                        Complete shingle replacement on {renderClickablePhrase("2,400 sq.ft.")} surface. Installation of {renderClickablePhrase("GAF WeatherWatch")} Ice & Water shield along eaves and valleys, underlayment, and {renderClickablePhrase("GAF Timberline HDZ")} shingles. Total price includes state inspections and cleanup.
                      </p>
                      <div className="flex justify-between items-center mt-1.5 border-t border-slate-200/60 pt-1 font-mono text-slate-600 font-semibold text-[8px]">
                        <span>PROJECT VALUE: {renderClickablePhrase("$14,850.00")}</span>
                        <span>TAXES INCLUDED</span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy shield protection watermark badge */}
                  <div className="mt-3 border-t border-slate-100 pt-2 flex items-center justify-between shrink-0 text-[8px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> RoofLocker Shield Active
                    </span>
                    <span>Michigan Compliant § 500.1227</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer actions */}
            <div className="flex gap-2 justify-end mt-5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowRedactionModal(false);
                  setIsViewingRedactedDoc(false);
                  setUploadedDoc(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-xs font-bold rounded-xl shadow cursor-pointer text-slate-200"
              >
                Close Window
              </button>
              
              {!isViewingRedactedDoc && (
                <button
                  type="button"
                  onClick={handleSendRedactedDoc}
                  className="px-5 py-2 bg-teal hover:bg-teal/95 font-bold text-xs rounded-xl shadow transition duration-200 cursor-pointer text-white flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Transmit Secure Redacted Document
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* FULLSCREEN VIDEO VIEWPORT OVERLAY */}
      {fullscreenVideo !== 'none' && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col justify-between p-4 animate-fadeIn">
          
          {/* Top Control Bar */}
          <div className="flex justify-between items-center bg-black/60 backdrop-blur-md p-3 rounded-xl border border-slate-800 z-10">
            <div className="flex items-center gap-2 text-white">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <strong className="text-xs font-mono uppercase tracking-widest text-slate-200 font-bold">
                {fullscreenVideo === 'demo' ? 'Live GAF Material presentation' :
                 fullscreenVideo === 'active-call' ? 'Secured Peer-To-Peer Video Call' :
                 'Secure recorded Video Note'}
              </strong>
            </div>
            
            <button
              type="button"
              onClick={() => setFullscreenVideo('none')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Fullscreen</span>
            </button>
          </div>

          {/* Full Screen Main Display */}
          <div className="flex-1 flex items-center justify-center my-4 relative">
            {fullscreenVideo === 'demo' ? (
              <div className="w-full h-full max-w-4xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-between p-6">
                <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-xs font-mono text-white z-10">
                  Presenter: Brad S. (Apex Rep)
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <Sparkles className="w-16 h-16 text-amber animate-spin mb-4" style={{ animationDuration: '6s' }} />
                  <h3 className="font-display font-bold text-white text-2xl tracking-wide">GAF WEATHERWATCH PRESENTATION FEED</h3>
                  <p className="text-slate-300 text-sm max-w-md mt-2">
                    Brad is demonstrating dual-action self-sealing layers & leak barrier standards live.
                  </p>
                </div>

                <div className="flex justify-between items-center p-3 bg-black/80 rounded-xl border border-slate-800/80 shrink-0 mt-4">
                  <span className="text-xs text-slate-300 font-mono">Stream Quality: 1080p AES Tunnel</span>
                  <button
                    onClick={() => {
                      setFullscreenVideo('none');
                      handleReportHighPressureInDemo();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold border border-red-500/30 transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    Flag Pressure Tactics
                  </button>
                </div>
              </div>
            ) : fullscreenVideo === 'active-call' ? (
              <div className="w-full h-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                
                {/* Homeowner Box */}
                <div className="bg-slate-950 rounded-2xl overflow-hidden h-full border border-slate-800 relative flex flex-col items-center justify-center min-h-[220px]">
                  {cameraAvailable ? (
                    <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <User className="w-12 h-12 text-teal mx-auto opacity-60 mb-2" />
                      <span className="text-xs font-mono text-slate-200 block">Your Webcam Stream (Disabled)</span>
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded text-xs font-mono text-white">You</span>
                </div>

                {/* Contractor Box */}
                <div className="bg-slate-950 rounded-2xl overflow-hidden h-full border border-slate-800 relative flex flex-col items-center justify-center min-h-[220px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex flex-col justify-between p-4 z-10">
                    <span className="bg-emerald-600/30 text-emerald-400 text-xs font-mono px-2 py-1 rounded font-bold w-fit border border-emerald-500/20">ONSITE • LIVE ACTIVE FEED</span>
                    <div className="text-left">
                      <strong className="text-sm font-bold block text-white">Brad S.</strong>
                      <span className="text-xs text-slate-100 block">Apex Representative</span>
                    </div>
                  </div>
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900">
                    <Sparkles className="w-12 h-12 text-amber/60 animate-spin mb-2" style={{ animationDuration: '4s' }} />
                    <span className="text-xs font-mono text-slate-200 block uppercase tracking-wider">Shingle Feed</span>
                  </div>
                </div>

              </div>
            ) : fullscreenVideo === 'video-note' && selectedVideoNote ? (
              <div className="w-full h-full max-w-3xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-between p-6">
                <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-xs font-mono text-white z-10">
                  Secure Video Note Archive: {selectedVideoNote.id}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <Camera className="w-16 h-16 text-teal/40 animate-pulse mb-3" />
                  <span className="text-sm text-slate-300 font-mono tracking-wider font-semibold">STREAMING SECURE HIGH DEFINITION PORTABLE CLIP</span>
                  <p className="text-xs text-slate-500 mt-1">End-to-End Cryptography Lock Intact</p>
                  
                  {/* Staggered voice sound lines */}
                  <div className="flex gap-1.5 items-end h-12 mt-6">
                    {[5, 14, 24, 18, 11, 20, 28, 16, 9, 14, 22, 12, 19, 25, 10].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-1 bg-teal rounded-full animate-pulse"
                        style={{ 
                          height: `${h}px`,
                          animationDuration: '0.8s',
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center text-xs mt-4">
                  <p className="text-slate-200 italic">"{selectedVideoNote.text}"</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Bottom Security / Duration Bar */}
          <div className="bg-black/60 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-mono z-10">
            <span className="text-teal font-semibold">🛡️ Peer-To-Peer Tunnel Active</span>
            {fullscreenVideo === 'active-call' ? (
              <span className="text-white font-bold">{formatDuration(callDuration)}</span>
            ) : (
              <span className="text-slate-400">1080p Secure</span>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
