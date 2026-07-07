import React, { useState, useRef, useEffect } from 'react';
import { Contractor, ChatMessage } from '../types';
import { MOCK_CHAT_HISTORY } from '../mockData';
import { ShieldCheck, MessageCircle, Send, Video, AlertTriangle, XCircle, Play, Phone, HelpCircle, UserX, AlertOctagon, Sparkles, User, ShieldAlert } from 'lucide-react';

interface CommunicationHubProps {
  contractor: Contractor;
}

export default function CommunicationHub({ contractor }: CommunicationHubProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
  const [inputText, setInputText] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);

  // Filter Alerts
  const [showFilterAlert, setShowFilterAlert] = useState(false);
  const [filteredSnippet, setFilteredSnippet] = useState('');

  // Kill Switch States
  const [showKillSwitchModal, setShowKillSwitchModal] = useState(false);
  const [killReason, setKillReason] = useState('high-pressure');
  const [customKillReason, setCustomKillReason] = useState('');
  const [isKilled, setIsKilled] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Regex rules to detect phone numbers and emails
  const PHONE_REGEX = /(\b\d{3}[-.]?\d{3}[-.]?\d{4}\b)|(\b\d{10}\b)/g;
  const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isKilled) return;

    let text = inputText;
    let didFilter = false;
    let snip = '';

    // Check for phone or email
    if (PHONE_REGEX.test(text)) {
      snip = text.match(PHONE_REGEX)?.[0] || 'Phone Number';
      text = text.replace(PHONE_REGEX, '***-***-****');
      didFilter = true;
    }

    if (EMAIL_REGEX.test(text)) {
      snip = text.match(EMAIL_REGEX)?.[0] || 'Email Address';
      text = text.replace(EMAIL_REGEX, '*******@****.***');
      didFilter = true;
    }

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
    setShowDemo(false);
    setIsDemoPlaying(false);
    // Auto-open Kill switch with preset
    setKillReason('high-pressure');
    setShowKillSwitchModal(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="communication-hub-view">
      {/* LEFT: Secured Chat Terminal (7 columns) */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-[520px] justify-between overflow-hidden relative">
        {/* Chat Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-r ${contractor.logoColor} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
              {contractor.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-navy text-sm leading-tight">{contractor.name}</h3>
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" title="Secure Link Active" />
              </div>
              <span className="text-xs text-stone-gray font-mono block">Vetted Builder Representative • Active Portal</span>
            </div>
          </div>

          <div className="flex gap-2">
            {!isKilled && (
              <>
                <button
                  onClick={() => setShowDemo(true)}
                  id="open-video-demo-btn"
                  className="p-2 bg-mist text-teal hover:bg-mist/80 rounded-lg transition"
                  title="Join Live Demo Room"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowKillSwitchModal(true)}
                  id="trigger-kill-switch-btn"
                  className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                  title="Activate No-Pressure Kill-Switch"
                >
                  <UserX className="w-4 h-4" />
                  Kill Switch
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

            if (isSystem) {
              return (
                <div key={msg.id || i} className="mx-auto max-w-md bg-navy/5 text-navy border border-slate-100 p-3 rounded-xl text-center text-sm space-y-1">
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
                className={`flex flex-col max-w-[80%] ${isContractor ? 'self-start' : 'self-end ml-auto'}`}
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
                  {msg.text}
                </div>
                <span className="text-xs text-stone-gray font-mono mt-1 px-1 self-end">
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
          <input
            type="text"
            disabled={isKilled}
            placeholder={isKilled ? "Conversation permanently blocked." : "Ask about quotes, GAF shingles, code, or schedule a video demonstration..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-teal focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
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

      {/* RIGHT: Live Video Demo & Product Viewer (5 columns) */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        {showDemo ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white h-full flex flex-col justify-between overflow-hidden shadow-xl animate-fadeIn relative">
            {/* Live Streaming view */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono tracking-wider font-semibold text-red-500">LIVE PRESENTATION</span>
              </div>
              <button
                onClick={() => setShowDemo(false)}
                className="text-sm text-slate-400 hover:text-white font-medium"
              >
                Exit Room
              </button>
            </div>

            {/* Video content */}
            {!isDemoPlaying ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950 rounded-xl border border-slate-800/80 mb-4">
                <Video className="w-12 h-12 text-teal animate-pulse mb-3" />
                <h4 className="font-display font-bold text-white text-base">Join Video Product Demonstration</h4>
                <p className="text-slate-300 text-sm max-w-xs mt-1 mb-4 leading-normal">
                  Apex Elite Roofing is ready to show you GAF Timberline HDZ samples, local shingles, and building code layouts.
                </p>
                <button
                  onClick={() => setIsDemoPlaying(true)}
                  id="connect-video-btn"
                  className="px-4 py-2 rounded-xl bg-teal hover:bg-teal/95 font-bold text-sm flex items-center gap-1.5 shadow animate-pulse"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Connect Secure Feed
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between mb-4 relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80">
                {/* Overlay details */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono text-white">
                  Representative: Brad S. (Apex Elite)
                </div>

                <div className="flex-1 flex items-center justify-center p-6 text-center animate-pulse">
                  <div className="space-y-2">
                    <Sparkles className="w-10 h-10 text-amber mx-auto animate-bounce" />
                    <p className="font-semibold text-sm text-white">STREAMING GAF ROOF SAMPLES</p>
                    <p className="text-slate-300 text-xs">Demonstrating Ridge Ventilation & Double-Layer Ice Shielding</p>
                  </div>
                </div>

                {/* Reporting Action directly built on feed */}
                <div className="p-3 bg-black/70 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-mono">Stream: 1080p Secure Tunnel</span>
                  <button
                    onClick={handleReportHighPressureInDemo}
                    id="report-pressure-demo-btn"
                    className="bg-red-600/20 hover:bg-red-600 text-red-100 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/30 transition uppercase tracking-wider flex items-center gap-1"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    Flag Pressure Tactics
                  </button>
                </div>
              </div>
            )}

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <strong className="font-semibold text-sm text-slate-300 block mb-1">Your Defense Rules:</strong>
              <p className="text-slate-400 text-xs leading-relaxed">
                If the sales representative attempts to lock you into a quote, bypass RoofLocker guidelines, or claims they will wave fees, hit the **Flag Pressure Tactics** button immediately to terminate contact and flag them.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-navy border border-deep-slate rounded-2xl p-6 text-white h-full flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-teal" />
                <h3 className="font-display font-bold text-white text-lg">Secure Buffer Policy</h3>
              </div>

              <div className="space-y-4 text-sm text-mist leading-relaxed">
                <p>
                  Homeowners are routinely subjected to high-pressure techniques, such as **contingencies** that force agreement on the spot.
                </p>
                <p>
                  Our built-in communication workspace acts as an absolute legal buffer. By remaining inside the hub, you prevent:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 font-mono text-xs text-teal">
                  <li>Unlicensed Adjusting Abuse</li>
                  <li>Deductible Fraud schemes</li>
                  <li>Incurring hidden cancellation penalties</li>
                  <li>Aggressive door-knocking solicitation</li>
                </ul>
              </div>
            </div>

            <div className="bg-deep-slate p-4 rounded-xl border border-slate-800/60 mt-6 text-sm flex gap-3">
              <HelpCircle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-semibold">Ready to see materials?</strong>
                <p className="text-slate-300 text-xs mt-1">
                  Click the camera icon <Video className="w-3 h-3 text-teal inline animate-bounce" /> in chat to trigger a secure live demo where Apex Elite can show you shingles without ever getting your personal cell number.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

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
                <p className="text-stone-gray text-sm mt-1">
                  Activating the No-Pressure Kill-Switch is irreversible. Apex Elite Roofing will be blocked from sending messages or viewing your project workspace.
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4 mb-5">
              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1.5">Reason for Termination</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 text-sm text-stone-gray p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="kill-reason"
                      checked={killReason === 'high-pressure'}
                      onChange={() => setKillReason('high-pressure')}
                      className="mt-0.5 accent-teal"
                    />
                    <div>
                      <strong className="text-navy font-semibold">High-Pressure Environment</strong>
                      <span className="block text-xs text-slate-400">Representative was pushy, aggressive, or used contingency traps.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 text-sm text-stone-gray p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="kill-reason"
                      checked={killReason === 'bypass'}
                      onChange={() => setKillReason('bypass')}
                      className="mt-0.5 accent-teal"
                    />
                    <div>
                      <strong className="text-navy font-semibold">Bypass Escrow / Fraud Offer</strong>
                      <span className="block text-xs text-slate-400">Offered to 'eat' or waive deductible, or requested cash outside Stripe Connect.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 text-sm text-stone-gray p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="kill-reason"
                      checked={killReason === 'poor-comms'}
                      onChange={() => setKillReason('poor-comms')}
                      className="mt-0.5 accent-teal"
                    />
                    <div>
                      <strong className="text-navy font-semibold">Poor Communication</strong>
                      <span className="block text-xs text-slate-400">Unresponsive, poor service, or repeatedly ignoring building code specifications.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 text-sm text-stone-gray p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="kill-reason"
                      checked={killReason === 'other'}
                      onChange={() => setKillReason('other')}
                      className="mt-0.5 accent-teal"
                    />
                    <div>
                      <strong className="text-navy font-semibold">Other Reason</strong>
                      <span className="block text-xs text-slate-400">Provide custom feedback for the RoofLocker Admin queue below.</span>
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 h-14 focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowKillSwitchModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-stone-gray hover:bg-slate-50"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleTriggerKillSwitch}
                id="confirm-kill-switch-btn"
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow"
              >
                Terminate Contractor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
