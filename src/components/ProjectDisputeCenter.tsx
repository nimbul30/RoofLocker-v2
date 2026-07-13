import React, { useState } from 'react';
import { ProjectDispute } from '../types';
import { Scale, MessageSquare, Download, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ProjectDisputeCenter() {
  const [dispute, setDispute] = useState<ProjectDispute | null>(null);

  // Form states
  const [category, setCategory] = useState<ProjectDispute['category']>('workmanship');
  const [description, setDescription] = useState('');
  const [requestedOutcome, setRequestedOutcome] = useState('');
  const [isEmergencyLeak, setIsEmergencyLeak] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  // Document Vault Simulation
  const [showVaultExport, setShowVaultExport] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleStartDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !requestedOutcome) return;

    if (isEmergencyLeak) {
      setShowEmergencyAlert(true);
      return;
    }

    const newDispute: ProjectDispute = {
      id: `disp-${Date.now()}`,
      category,
      status: 'structured_self_resolution',
      description,
      requestedOutcome,
      createdAt: new Date().toLocaleDateString(),
      homeownerPosition: description
    };

    setDispute(newDispute);
  };

  // Simulate contractor accepting terms in Tier 1
  const handleContractorAccept = () => {
    if (!dispute) return;
    setDispute({
      ...dispute,
      status: 'resolved',
      contractorPosition: 'We agree to revisit the property on Tuesday and re-lay the architectural hip shingles underlayment in compliance with the Lapeer Code guidelines.'
    });
  };

  // Simulate escalation to Tier 2
  const handleEscalateToMediation = () => {
    if (!dispute) return;
    setDispute({
      ...dispute,
      status: 'mediation',
      contractorPosition: 'Contractor disputes that wind damaged these shingle panels after tear-off.',
      mediationNotes: [
        'Advocate Sarah joined. System log review indicates materials were delivered June 12th.',
        'Scheduled 3-way conference call for tomorrow morning.',
        'Michigan Lien Act Clock reminder issued: 90-day filing limits remain active. This process is voluntary.'
      ]
    });
  };

  const handleResetDispute = () => {
    setDispute(null);
    setDescription('');
    setRequestedOutcome('');
    setIsEmergencyLeak(false);
    setShowEmergencyAlert(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dispute-center-view">
      {/* LEFT: Intake Form & Active Status (7 columns) */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
        {!dispute ? (
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 font-semibold text-xs px-3 py-1 rounded-full mb-3 border border-red-100">
              <Scale className="w-3.5 h-3.5" />
              Administrative Dispute Terminal
            </div>
            <h2 className="font-display font-bold text-navy text-xl leading-tight">
              File Project Discrepancy
            </h2>
            <p className="text-stone-gray text-sm mt-1 mb-5">
              Filing a dispute initiates an official audit. Under Michigan law, participation is voluntary and does not alter the contractor's 90-day construction lien rights.
            </p>

            <form onSubmit={handleStartDispute} className="space-y-4" id="dispute-intake-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectDispute['category'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2.5 focus:outline-none focus:ring-1 focus:ring-teal"
                  >
                    <option value="workmanship">Workmanship Quality Concern</option>
                    <option value="pricing">Pricing / Invoicing supplements</option>
                    <option value="communication">Contractor Unresponsive / Absent</option>
                    <option value="contract_terms">Contract terms mismatch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase mb-1">Requested Outcome</label>
                  <select
                    value={requestedOutcome}
                    onChange={(e) => setRequestedOutcome(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2.5 focus:outline-none focus:ring-1 focus:ring-teal"
                  >
                    <option value="">-- Choose desired solution --</option>
                    <option value="revisit-repair">Revisit property and correct installation</option>
                    <option value="partial-refund">Partial refund of material draw</option>
                    <option value="cancel-contract">Cancel contract with zero penalty fee</option>
                  </select>
                </div>
              </div>

              {/* Safety Screening Question (Real-world bypass fix) */}
              <div className="p-3.5 bg-amber/5 border border-amber/20 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEmergencyLeak}
                    onChange={(e) => setIsEmergencyLeak(e.target.checked)}
                    className="mt-1 accent-teal"
                  />
                  <div>
                    <strong className="text-sm text-navy font-bold block">🚨 Active Exposure Risk / Attic Leak?</strong>
                    <span className="block text-xs text-stone-gray leading-tight">
                      Check this box if rain or snow is actively entering the structure. This bypasses response queues and alerts the contractor instantly.
                    </span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Provide Specific Details</label>
                <textarea
                  required
                  placeholder="Detail what happened. Cite measurements, missing material shields, or unapproved supplements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2.5 h-24 focus:outline-none focus:ring-1 focus:ring-teal resize-none"
                />
              </div>

              {showEmergencyAlert ? (
                <div className="bg-red-50 border border-red-200 text-red-900 p-4 rounded-xl text-sm space-y-2 animate-fadeIn">
                  <div className="font-bold flex items-center gap-1 text-red-700">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                    EMERGENCY BYPASS INITIATED
                  </div>
                  <p>
                    Because you flagged an active leak exposure, standard mediation queues are bypassed. High-priority SMS alerts have been sent to the contractor and their local foreman to mitigate property water damage immediately.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmergencyLeak(false);
                      setShowEmergencyAlert(false);
                    }}
                    className="text-sm underline font-bold"
                  >
                    Change to standard dispute
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  id="submit-dispute-btn"
                  className="w-full py-3 bg-navy hover:bg-navy/95 text-white font-bold text-sm rounded-xl shadow-sm transition"
                >
                  Open Administrative Dispute File
                </button>
              )}
            </form>
          </div>
        ) : (
          <div className="space-y-5 animate-fadeIn">
            {/* Active Dispute Header */}
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs uppercase font-mono text-stone-gray block">Active Dispute ID: {dispute.id}</span>
                <span className="text-sm bg-amber/10 border border-amber/20 text-amber font-mono font-bold px-2 py-0.5 rounded uppercase mt-1 inline-block">
                  {dispute.status.replace(/_/g, ' ')}
                </span>
              </div>
              <button
                onClick={handleResetDispute}
                className="text-sm text-stone-gray hover:text-navy font-semibold underline"
              >
                Clear dispute
              </button>
            </div>

            {/* Structured Positions details */}
            <div className="space-y-4">
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-navy uppercase block mb-1">Your Filed Concern</span>
                <p className="text-stone-gray text-sm italic">"{dispute.homeownerPosition}"</p>
                <div className="mt-2.5 text-xs font-semibold text-teal">
                  Requested Solution: {dispute.requestedOutcome}
                </div>
              </div>

              {dispute.contractorPosition && (
                <div className="bg-amber/5 p-3.5 rounded-xl border border-amber/15 animate-fadeIn">
                  <span className="text-xs font-bold text-navy uppercase block mb-1">Contractor Reply Position</span>
                  <p className="text-stone-gray text-sm italic">"{dispute.contractorPosition}"</p>
                </div>
              )}

              {/* Tier 2 Mediation Log timeline */}
              {dispute.status === 'mediation' && dispute.mediationNotes && (
                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-2 animate-fadeIn">
                  <h4 className="font-display font-bold text-navy text-sm uppercase tracking-wider mb-2 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-teal" />
                    Advocate Mediation Log
                  </h4>
                  {dispute.mediationNotes.map((note, index) => (
                    <div key={index} className="text-xs md:text-sm text-stone-gray leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0 mt-1.5"></span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive escalation actions */}
            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row gap-2 justify-end">
              {dispute.status === 'structured_self_resolution' && (
                <>
                  <button
                    onClick={handleContractorAccept}
                    id="simulate-contractor-agree-btn"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-sm rounded-xl transition"
                  >
                    Simulate Roofer Resolves Issue
                  </button>

                  <button
                    onClick={handleEscalateToMediation}
                    id="escalate-mediation-btn"
                    className="px-4 py-2 bg-teal hover:bg-teal/95 text-white font-bold text-sm rounded-xl transition shadow-sm"
                  >
                    Escalate to Tier 2 Mediation
                  </button>
                </>
              )}

              {dispute.status === 'resolved' && (
                <div className="w-full bg-teal/10 border border-teal/20 text-navy p-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal" />
                  Dispute successfully resolved. Portal milestone holds have been removed.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Document Vault & Escalation info (5 columns) */}
      <div className="lg:col-span-5 bg-navy border border-deep-slate rounded-2xl p-5 md:p-6 text-white shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-amber" />
            <h3 className="font-display font-bold text-white text-lg">
              3-Tier Dispute Policy
            </h3>
          </div>

          <div className="space-y-4 text-sm text-mist leading-relaxed mb-6">
            <div className="bg-deep-slate p-3.5 rounded-xl border border-slate-800/60 font-mono text-xs text-teal space-y-1.5">
              <strong className="text-white block uppercase text-sm">Tier 1: Self Resolution</strong>
              <p className="text-xs text-slate-400">
                Automated 72-hour filing blocks. Most disputes close within this window once structured terms are viewed by the roofer.
              </p>
            </div>

            <div className="bg-deep-slate p-3.5 rounded-xl border border-slate-800/60 font-mono text-xs text-teal space-y-1.5">
              <strong className="text-white block uppercase text-sm">Tier 2: RoofLocker Mediation</strong>
              <p className="text-xs text-slate-400">
                A neutral human advocate joins a secure thread, evaluates satellite files, and coordinates voluntary resolutions.
              </p>
            </div>

            <div className="bg-deep-slate p-3.5 rounded-xl border border-slate-800/60 font-mono text-xs text-teal space-y-1.5">
              <strong className="text-white block uppercase text-sm">Tier 3: External AAA</strong>
              <p className="text-xs text-slate-400">
                Official referral to the AAA construction track using our locked portal database logs as certified truth.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowVaultExport(true)}
          id="export-doc-vault-btn"
          className="w-full py-3 bg-amber hover:bg-amber/90 text-navy font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          Pre-Arbitration Document Vault
        </button>
      </div>

      {/* DOCUMENT VAULT EXPORT POPUP OVERLAY */}
      {showVaultExport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white text-navy rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono uppercase bg-teal/10 text-teal px-2 py-0.5 rounded font-bold">CERTIFIED SYSTEM LOG PACKAGE</span>
                <h3 className="font-display font-extrabold text-navy text-2xl mt-1">Pre-Arbitration Document Vault Export</h3>
              </div>
              <button
                onClick={() => setShowVaultExport(false)}
                className="text-stone-gray hover:text-red-500 font-mono text-lg"
              >
                ×
              </button>
            </div>

            {/* Simulated Document Layout */}
            <div className="border border-slate-300 p-5 rounded-xl bg-slate-50 font-mono text-xs text-slate-700 space-y-4 max-h-[50vh] overflow-y-auto select-all shadow-inner">
              <div className="text-center border-b border-slate-300 pb-3">
                <strong className="text-navy text-base font-display block font-extrabold">ROOFLOCKER SECURE TRACE RECORDS</strong>
                <span>Date of Export: 2026-06-26 13:10 EST • System Certification: AAA/Carrier Accepted</span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded border">
                <div>
                  <strong>Homeowner:</strong> John Doe<br />
                  <strong>Property:</strong> 215 Cedar St, Imlay City, MI 48444
                </div>
                <div>
                  <strong>Selected Roofer:</strong> Apex Elite Roofing<br />
                  <strong>LARA Builder License:</strong> #2101998762 (Verified)
                </div>
              </div>

              <div className="space-y-1">
                <strong className="text-navy uppercase border-b pb-0.5 block">I. GEO-SPATIAL MODEL DATA (Google Solar API)</strong>
                <p>Surface Area: 3,200 sq. feet (32.0 Squares base)<br />ridges: 140 ft • Valleys: 110 ft • Hips: 80 ft • Pitch: 6:12 standard<br />Structural Waste Factor: 10% Gable allocation • Max Load Cap: 7,680 lbs shingles</p>
              </div>

              <div className="space-y-1">
                <strong className="text-navy uppercase border-b pb-0.5 block">II. VERIFIED PHOTOGRAMMETRY TIMELINE</strong>
                <p>
                  [June 12, 10:14 AM] Drone flyover LIDAR mesh completed. Confidence index 99.1%.<br />
                  [June 15, 02:15 PM] Pin #1 dropped on South-West Hip Slope. Category: Wind-Fractured Shingles.<br />
                  [June 15, 02:23 PM] Milestone #1 (Deductible Payment Receipt) logged for record compliance.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-navy uppercase border-b pb-0.5 block">III. INTERACTION TRANSCRIPT (Tamper-proof hashes)</strong>
                <p className="text-xs leading-relaxed">
                  2:15 PM - System: Secure Room Activated. Contact information redacted.<br />
                  2:18 PM - Contractor: Hello! I reviewed your RoofLocker 3D Scope package...<br />
                  2:20 PM - Homeowner: Hi! Specifically interested in Lapeer County double ice rules...<br />
                  2:22 PM - Contractor: Absolutely. Under MI Residential Code R905, two layers required...
                </p>
              </div>

              <div className="border-t border-slate-300 pt-3 text-center text-stone-gray text-xs">
                🛡️ This electronic document is cryptographically signed by RoofLocker Security agents. It stands as an objective record of workmanship specifications and compliance.
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-stone-gray italic flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal" /> Saved $1,450 in legal transcription fees.
              </span>
              <button
                onClick={() => {
                  setDownloadSuccess(true);
                  setTimeout(() => {
                    setDownloadSuccess(false);
                    setShowVaultExport(false);
                  }, 2000);
                }}
                disabled={downloadSuccess}
                className={`w-full sm:w-auto px-5 py-2.5 font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-1.5 ${
                  downloadSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-navy hover:bg-navy/90 text-white'
                }`}
              >
                {downloadSuccess ? '✓ Certified PDF Downloaded!' : 'Download Certified Document Vault PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
