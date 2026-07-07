import React, { useState } from 'react';
import { ShieldCheck, Video, Play, CheckCircle, GraduationCap, ArrowRight, UserCheck, Eye, Lock, X } from 'lucide-react';

interface ExplainerVideoProps {
  onComplete: () => void;
}

export default function ExplainerVideo({ onComplete }: ExplainerVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsUnlocked, setTermsUnlocked] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      setHasWatched(true);
    }, 3000); // Simulate a short 3-second animated video watch
  };

  return (
    <div 
      className="max-w-4xl mx-auto my-6 p-6 md:p-8 bg-gradient-to-b from-white to-slate-50/50 rounded-2xl border-2 border-teal/15 shadow-xl transition-all duration-300 hover:border-teal/25" 
      id="explainer-video-container"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-mist px-4 py-1.5 rounded-full text-navy font-semibold text-sm mb-4 border border-teal/10">
          <Lock className="w-4 h-4 text-teal animate-pulse" />
          Your Secure Lockerroom Gateway
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-navy font-bold tracking-tight">
          Welcome to RoofLocker
        </h1>
        <p className="text-stone-gray mt-2 text-base md:text-lg max-w-2xl mx-auto">
          Before you step into your secure locker, here's a quick look at how RoofLocker keeps you protected and in control.
        </p>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Left Column: Simulated Video Player */}
        <div className="flex flex-col justify-between">
          <div className="bg-slate-900 rounded-xl overflow-hidden aspect-video relative group border border-slate-800 shadow-lg min-h-[220px]">
            {!isPlaying ? (
              <div className="absolute inset-0 flex flex-col justify-between p-5 bg-gradient-to-t from-navy/95 via-navy/50 to-transparent">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-mist bg-navy/60 px-2 py-0.5 rounded font-bold tracking-wider">MICHIGAN COMPLIANCE V1.0</span>
                  <span className="text-xs text-slate-400 font-mono">1:02</span>
                </div>
                <div className="my-auto flex flex-col items-center justify-center">
                  <button
                    onClick={handlePlayVideo}
                    id="play-explainer-btn"
                    className="w-14 h-14 rounded-full bg-amber hover:bg-amber/95 text-white flex items-center justify-center shadow-lg transform transition hover:scale-105 active:scale-95 focus:outline-none"
                    aria-label="Play explainer video"
                  >
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </button>
                  <p className="text-white font-medium text-xs mt-3 tracking-wide">
                    Watch Walkthrough Video
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Topics: Commission Bans • Deductible Scams • Escrow
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F2B40] text-center p-6 animate-pulse">
                <Video className="w-10 h-10 text-teal animate-bounce mb-3" />
                <p className="text-white font-mono text-xs tracking-widest font-bold">STREAMING PRESENTATION...</p>
                <p className="text-mist text-[10px] mt-1">Simulating educational walkthrough</p>
                <div className="w-40 h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-teal animate-[loading_3s_ease-in-out]" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsTermsOpen(true)}
            id="terms-conditions-trigger-btn"
            className="w-full mt-4 p-4 rounded-xl bg-white border-2 border-slate-200 hover:border-teal/40 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-2.5 text-navy font-bold text-sm shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-teal" />
            Terms and Conditions
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-stone-gray">
          <button 
            type="button"
            disabled={!termsUnlocked}
            onClick={() => setHasWatched(prev => !prev)}
            className={`flex items-center gap-3 focus:outline-none transition-all ${
              termsUnlocked ? 'cursor-pointer hover:opacity-90' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <CheckCircle className={`w-[30px] h-[30px] transition-all ${hasWatched ? 'text-teal fill-teal/10' : 'text-slate-300'}`} />
            <div className="flex flex-col text-left">
              <span className="font-bold select-none text-navy text-sm md:text-base leading-snug">I have read and understood the compliance rules.</span>
              {!termsUnlocked && (
                <span className="text-[11px] text-teal font-bold animate-pulse mt-0.5">
                  (Unlock by clicking &quot;Terms and Conditions&quot; and scrolling to the bottom)
                </span>
              )}
            </div>
          </button>
        </div>

        <button
          onClick={onComplete}
          disabled={!hasWatched}
          id="enter-workspace-btn"
          className={`w-full sm:w-auto px-9 py-4 text-lg rounded-2xl font-bold transition flex items-center justify-center gap-3 select-none ${
            hasWatched
              ? 'bg-navy hover:bg-navy/90 text-white shadow-lg active:translate-y-px cursor-pointer scale-105'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Enter Your Lockerroom
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Terms and Conditions Popup Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn" id="terms-modal-overlay">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 animate-scaleUp">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal" />
                <span className="font-bold text-navy text-base">RoofLocker Document Viewer</span>
              </div>
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-navy transition"
                aria-label="Close Terms and Conditions"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div 
              className="p-6 overflow-y-auto flex-1 text-slate-700 space-y-5 select-text" 
              id="terms-content-container"
              onScroll={(e) => {
                const target = e.currentTarget;
                const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 15;
                if (isAtBottom) {
                  setTermsUnlocked(true);
                }
              }}
            >
              <div>
                <h2 className="text-xl font-bold text-navy mb-1">RoofLocker Homeowner Terms of Use</h2>
                <p className="text-xs text-stone-gray font-semibold">Last updated: July 5, 2026</p>
              </div>

              <p className="text-sm leading-relaxed text-slate-600">
                Welcome to RoofLocker. These Terms of Use (&quot;Terms&quot;) are an agreement between you (&quot;you,&quot; &quot;Homeowner&quot;) and RoofLocker (&quot;RoofLocker,&quot; &quot;we,&quot; &quot;us&quot;). Please read them carefully. By checking the box and creating an account, you agree to these Terms.
              </p>

              <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">1. What RoofLocker Is</h3>
                  <p>RoofLocker is a free online platform that helps homeowners research, connect with, and communicate with independent roofing contractors (&quot;Contractors&quot;) in a secure, private environment. We provide a directory of Contractors, tools to communicate with them, and information to help you make your own decisions.</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">2. What RoofLocker Is Not</h3>
                  <p>This is important, so we want to be clear:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li><strong>We are not a roofing contractor.</strong> We do not perform, supervise, or guarantee any roofing work.</li>
                    <li><strong>We are not a party to any contract</strong> between you and a Contractor. Any agreement you sign with a Contractor is strictly between you and that Contractor.</li>
                    <li><strong>We are not your insurance adjuster, insurance advisor, attorney, or financial advisor.</strong> We do not provide insurance, legal, or financial advice, and nothing on our platform should be treated as such.</li>
                    <li><strong>We do not guarantee the work, pricing, conduct, or results of any Contractor.</strong> We provide information and tools; the decisions are yours.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">3. Our Verification — What It Means and Doesn't</h3>
                  <p>We make good-faith efforts to review certain public and submitted information about Contractors, such as licensing, insurance, and business details, and we display this information with dates when available. However:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Verification reflects information available to us at a point in time and may change.</li>
                    <li>We do not guarantee the accuracy, completeness, or current status of any Contractor's credentials, and you are encouraged to independently verify anything important to you.</li>
                    <li>A Contractor appearing on RoofLocker is not an endorsement, recommendation, or guarantee by us.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">4. It's Free for Homeowners</h3>
                  <p>RoofLocker is free for homeowners. Contractors pay us a fee to access the platform and communicate with homeowners who select them. We disclose this because we believe you should understand how we operate. This fee arrangement does not make us a representative of any Contractor.</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">5. Your Account and Identity Verification</h3>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>You must be at least 18 years old and the owner of the property (or authorized to act for the owner) to use RoofLocker.</li>
                    <li>You agree to provide accurate information and to complete identity and property verification through our third-party verification providers.</li>
                    <li>You are responsible for keeping your login credentials secure.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">6. Communicating Through the Platform</h3>
                  <p>To protect you, all communication with Contractors must happen inside the RoofLocker portal. You agree that:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>You will keep communication focused on your roofing project.</li>
                    <li>You will not share personal contact information (phone, email, address) with a Contractor through the portal before you choose to enter a contract, and you understand our system may filter such information for your protection.</li>
                    <li>Communications in the portal may be recorded, logged, and stored for security, quality, and dispute-resolution purposes. By using the portal, you consent to this recording and logging.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">7. The "Off-Platform" Warning</h3>
                  <p>For your safety, we strongly discourage communicating or transacting with any Contractor outside the RoofLocker portal. If you choose to do so, the protections RoofLocker provides — including our communication safeguards, records, and dispute-resolution tools — may not apply, and you do so at your own risk.</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">8. Your Control and the Kill-Switch</h3>
                  <p>You may end communication with any Contractor at any time using the reporting/kill-switch feature. When you do, we will restrict that Contractor's access to your portal and review the report. We may take further action against a Contractor at our discretion, but we cannot control a Contractor's conduct outside our platform.</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">9. Your Decisions Are Your Own</h3>
                  <p>You are solely responsible for:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Choosing whether to hire any Contractor.</li>
                    <li>Reviewing and signing any contract (we recommend you review any agreement carefully and consult a professional if you have questions).</li>
                    <li>The terms, price, scope, and outcome of any work you agree to.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">10. Dispute Resolution Between You and a Contractor</h3>
                  <p>If a dispute arises between you and a Contractor, RoofLocker may offer optional tools to help you communicate and document the issue, and may, at its discretion, help facilitate a resolution. However:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>RoofLocker acts only as a neutral facilitator, not as a judge, arbitrator, or legal representative.</li>
                    <li>Our involvement is voluntary and does not pause, toll, or change any legal deadlines you or the Contractor may have under law, including any statutory deadlines under Michigan law.</li>
                    <li>We are not responsible for the outcome of any dispute.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">11. Your Data and Privacy</h3>
                  <p>Your use of RoofLocker is also governed by our Privacy Policy [LINK], which explains what information we collect, how we use it, and how we protect it. We designed RoofLocker to keep your identity private from Contractors until you choose to move forward. We will not release your private information to a Contractor or third party except as described in our Privacy Policy or as required by law, or where you direct us to.</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">12. Acceptable Use</h3>
                  <p>You agree not to:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Provide false information or impersonate anyone.</li>
                    <li>Use the platform for any unlawful purpose.</li>
                    <li>Harass, abuse, or defame any Contractor or RoofLocker staff.</li>
                    <li>Attempt to interfere with, disrupt, or gain unauthorized access to the platform.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">13. Reviews and Content You Submit</h3>
                  <p>If you leave a review or submit content, it must be truthful and based on your genuine experience. You are responsible for what you post, and you agree not to post false, misleading, or defamatory statements. We may remove content at our discretion.</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">14. Disclaimers</h3>
                  <p>RoofLocker is provided &quot;as is&quot; and &quot;as available.&quot; To the fullest extent permitted by law, we disclaim all warranties, express or implied, including any warranty that the platform will be uninterrupted, error-free, or that any Contractor's work or conduct will meet your expectations.</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">15. Limitation of Liability</h3>
                  <p>To the fullest extent permitted by law, RoofLocker and its owners, employees, and affiliates will not be liable for any indirect, incidental, or consequential damages, or for any dispute, loss, injury, or damage arising from your dealings with any Contractor or from any roofing work. Because we provide a free service to homeowners and are not a party to your contract with a Contractor, our total liability to you for any claim relating to the platform is limited to the maximum extent permitted by law.</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">16. Indemnification</h3>
                  <p>You agree to hold RoofLocker harmless from claims arising out of your use of the platform, your interactions with Contractors, or your violation of these Terms, to the extent permitted by law.</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">17. Changes to These Terms</h3>
                  <p>We may update these Terms from time to time. If we make material changes, we will notify you and ask you to review and accept the updated Terms. The version you accept, and the date you accept it, will be recorded.</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">18. Governing Law and Dispute Resolution</h3>
                  <p>These Terms are governed by the laws of the State of Michigan. [ANY ARBITRATION CLAUSE, CLASS-ACTION WAIVER, OR VENUE PROVISION TO BE DRAFTED AND REVIEWED BY YOUR ATTORNEY — these clauses carry significant legal weight and consumer-protection considerations and should not be finalized without counsel.]</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy mb-1">19. Contact</h3>
                  <p>Questions about these Terms? Contact us at support@rooflocker.com.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-2xl">
              <div className="text-xs font-semibold flex items-center gap-1.5 pl-2">
                {termsUnlocked ? (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <CheckCircle className="w-4 h-4 fill-emerald-500/10 text-emerald-600" /> Terms Unlocked
                  </span>
                ) : (
                  <span className="text-stone-gray animate-pulse font-medium">
                    Scroll to bottom to unlock
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className="px-6 py-2 bg-navy hover:bg-navy/95 text-white text-xs font-bold rounded-xl shadow transition duration-200 cursor-pointer"
              >
                Close Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
