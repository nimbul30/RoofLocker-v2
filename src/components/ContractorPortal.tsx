import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Coins, 
  MapPin, 
  BadgeCheck, 
  Plus, 
  RefreshCw, 
  Download, 
  Sparkles, 
  FilePlus,
  Info,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Contractor } from '../types';
import { MOCK_CONTRACTORS } from '../mockData';

export default function ContractorPortal() {
  const [selectedProject, setSelectedProject] = useState<string>('proj-1');
  
  // Compliance Contract Generator States
  const [clientName, setClientName] = useState('John Doe');
  const [clientAddress, setClientAddress] = useState('215 Cedar St, Imlay City, MI 48444');
  const [squaresCount, setSquaresCount] = useState(32);
  const [shingleBrand, setShingleBrand] = useState('GAF Timberline HDZ®');
  const [deductibleEscrowed, setDeductibleEscrowed] = useState(true);
  const [contractGenerated, setContractGenerated] = useState(false);
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Simulated live permit lookup results
  const [municipalSearch, setMunicipalSearch] = useState('Imlay Township');
  const [bylawsFeedback, setBylawsFeedback] = useState({
    iceShield: 'Required: Two layers self-adhering ice barrier from eaves to 24" inside heated line.',
    underlayment: 'Standard synthetic water-resistant underlayment required. Tar paper is restricted.',
    dripEdge: 'Eave and rake drip edges are mandatory. Minimal 2" overlap at seams.',
    maxLayers: 'Maximum 1 shingle layer permitted. Full tear-off mandatory for re-roof permits.'
  });

  const handleMunicipalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMunicipalSearch(value);
    if (value === 'Imlay Township') {
      setBylawsFeedback({
        iceShield: 'Required: Two layers self-adhering ice barrier from eaves to 24" inside heated line.',
        underlayment: 'Standard synthetic water-resistant underlayment required. Tar paper is restricted.',
        dripEdge: 'Eave and rake drip edges are mandatory. Minimal 2" overlap at seams.',
        maxLayers: 'Maximum 1 shingle layer permitted. Full tear-off mandatory for re-roof permits.'
      });
    } else if (value === 'Lapeer City') {
      setBylawsFeedback({
        iceShield: 'Required: Minimum 36" ice barrier protection at all eaves.',
        underlayment: 'Synthetic or ASTM D226 Type II felt allowed.',
        dripEdge: 'Mandatory on eaves only. Highly recommended on rakes.',
        maxLayers: 'Up to 2 layers permitted if deck structure passes engineering deflection test.'
      });
    } else {
      setBylawsFeedback({
        iceShield: 'Standard Michigan Residential Code R905 applies (36" minimum from eaves).',
        underlayment: 'Standard felt or synthetic permitted.',
        dripEdge: 'Required by general state builder parameters.',
        maxLayers: 'Tear-off mandatory if roof is over 15 years old.'
      });
    }
  };

  const handleGenerateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setContractGenerated(true);
    setShowContractPreview(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="contractor-portal-root">
      
      {/* Upper Status Banner */}
      <div className="bg-gradient-to-r from-navy to-deep-slate text-white p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal/15 border border-teal/20 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6 text-teal" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl">Michigan Contractor Compliance Desk</h2>
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                <CheckCircle className="w-3.5 h-3.5" /> LARA ACTIVE
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Serving verified roofers with automated state license monitoring, localized municipal code tracking, and digital compliance checks.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 font-mono text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 shrink-0">
          <div>License: <span className="text-teal">#2101998762</span></div>
          <div className="text-slate-500">|</div>
          <div>Auto-Scan: <span className="text-teal">Passed (June 2026)</span></div>
        </div>
      </div>

      {/* Main Grid: Projects & Building Codes on Left, Contract Builder on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Columns (7 columns) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Active Estimating Ledger & Project selection */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-navy text-base flex items-center gap-2">
              <Coins className="w-5 h-5 text-teal" />
              Active Estimating Ledger
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Card 1 */}
              <div 
                onClick={() => setSelectedProject('proj-1')}
                className={`p-4 rounded-xl border transition text-left cursor-pointer ${
                  selectedProject === 'proj-1' 
                    ? 'border-teal bg-teal/5 shadow-xs' 
                    : 'border-slate-100 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono font-bold bg-teal/15 text-teal px-1.5 py-0.5 rounded uppercase">Escrow Secured</span>
                  <span className="text-stone-gray font-mono text-xs">32 Squares</span>
                </div>
                <strong className="text-sm text-navy block font-display">215 Cedar St</strong>
                <span className="text-stone-gray text-xs block">Client: John Doe • Imlay City</span>
                <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex justify-between items-center text-xs text-stone-gray font-mono">
                  <span>Deductible: <strong className="text-teal font-bold">$1,000</strong></span>
                  <span>Total Bid: <strong className="font-bold">$13,840</strong></span>
                </div>
              </div>

              {/* Project Card 2 */}
              <div 
                onClick={() => setSelectedProject('proj-2')}
                className={`p-4 rounded-xl border transition text-left cursor-pointer ${
                  selectedProject === 'proj-2' 
                    ? 'border-teal bg-teal/5 shadow-xs' 
                    : 'border-slate-100 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono font-bold bg-amber/10 text-amber px-1.5 py-0.5 rounded uppercase">Deductible Pending</span>
                  <span className="text-stone-gray font-mono text-xs">26 Squares</span>
                </div>
                <strong className="text-sm text-navy block font-display">412 Pine Dr</strong>
                <span className="text-stone-gray text-xs block">Client: Sarah Jenkins • Lapeer</span>
                <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex justify-between items-center text-xs text-stone-gray font-mono">
                  <span>Deductible: <strong className="text-amber font-bold">$1,000</strong></span>
                  <span>Total Bid: <strong className="font-bold">$10,230</strong></span>
                </div>
              </div>
            </div>

            {/* Consumer Guardrails warning box */}
            <div className="bg-amber/5 border border-amber/15 p-4 rounded-xl text-sm space-y-2">
              <strong className="text-navy flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber" />
                Consumer Guardrails & Anti-Bypass Notice:
              </strong>
              <p className="text-stone-gray leading-relaxed">
                By participating in the RoofLocker Network, you contractually agree to perform all storm damage scope audits inside the system. Offering deductible waivers or rebates, inflating measurement claims, or taking project deposits outside of standard legal protocols is a breach of contract and a class-G felony under Michigan MCL § 500.2082.
              </p>
            </div>
          </div>

          {/* Local Municipal Code Finder */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="font-display font-bold text-navy text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal" />
                Michigan Municipal Code Finder
              </h3>
              
              <select 
                value={municipalSearch}
                onChange={handleMunicipalChange}
                className="bg-slate-50 border border-slate-200 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal font-medium"
              >
                <option value="Imlay Township">Imlay Township (Lapeer County)</option>
                <option value="Lapeer City">Lapeer City (Lapeer County)</option>
                <option value="Almont Village">Almont Village (Macomb boundary)</option>
              </select>
            </div>

            <p className="text-stone-gray text-sm leading-relaxed">
              Local building inspectors in Michigan strictly enforce regional variations of the Residential Code. Make sure your bids reflect these requirements to prevent inspection failures.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-stone-gray text-xs uppercase block font-semibold">Ice-and-Water Barrier</span>
                <span className="text-navy text-sm block leading-relaxed font-sans font-medium">{bylawsFeedback.iceShield}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-stone-gray text-xs uppercase block font-semibold">Underlayment standard</span>
                <span className="text-navy text-sm block leading-relaxed font-sans font-medium">{bylawsFeedback.underlayment}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-stone-gray text-xs uppercase block font-semibold">Drip Edge Policy</span>
                <span className="text-navy text-sm block leading-relaxed font-sans font-medium">{bylawsFeedback.dripEdge}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-stone-gray text-xs uppercase block font-semibold">Max Shingle Layers</span>
                <span className="text-navy text-sm block leading-relaxed font-sans font-medium">{bylawsFeedback.maxLayers}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Contract Builder (5 columns) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm sticky top-6 space-y-5">
            <div className="flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-teal" />
              <h3 className="font-display font-bold text-navy text-lg">
                Compliant Contract Builder
              </h3>
            </div>

            <p className="text-stone-gray text-sm leading-relaxed">
              Generate a legally compliant roofing contract proposal in 30 seconds. This auto-appends mandatory consumer protective disclosures under Michigan insurance code guidelines.
            </p>

            <form onSubmit={handleGenerateProposal} className="space-y-4" id="contract-builder-form">
              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Property Owner / Client</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Client Physical Address</label>
                <input
                  type="text"
                  required
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase mb-1">Total Squares</label>
                  <input
                    type="number"
                    required
                    value={squaresCount}
                    onChange={(e) => setSquaresCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase mb-1">Shingle Material</label>
                  <select
                    value={shingleBrand}
                    onChange={(e) => setShingleBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-teal focus:outline-none"
                  >
                    <option value="GAF Timberline HDZ®">GAF Timberline HDZ®</option>
                    <option value="Owens Corning Duration®">Owens Corning Duration®</option>
                    <option value="CertainTeed Landmark®">CertainTeed Landmark®</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="chk-deductible-deposit"
                  checked={deductibleEscrowed}
                  onChange={(e) => setDeductibleEscrowed(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-teal focus:ring-teal accent-teal text-sm"
                />
                <label htmlFor="chk-deductible-deposit" className="text-sm font-semibold text-navy">
                  Requires Deductible Payment Verification
                </label>
              </div>

              <button
                type="submit"
                id="generate-contract-btn"
                className="w-full py-2.5 bg-navy hover:bg-navy/95 text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal" />
                Generate Signed Proposal Preview
              </button>
            </form>

            {/* Generated Contract PDF proposal modal simulation */}
            {contractGenerated && showContractPreview && (
              <div className="border border-teal/20 bg-teal/5 p-4 rounded-xl space-y-3 animate-fadeIn" id="contract-proposal-preview-box">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-teal uppercase flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    MCL-COMPLIANT PROPOSAL GENERATED!
                  </span>
                  <button 
                    onClick={() => setShowContractPreview(false)}
                    className="text-stone-gray hover:text-navy text-sm font-bold"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="bg-white p-3.5 border border-slate-200 rounded-lg font-mono text-xs text-slate-600 max-h-48 overflow-y-auto space-y-2 leading-relaxed">
                  <strong className="block text-navy text-xs font-sans border-b border-slate-100 pb-1 uppercase font-bold">
                    CONTRACTING PROPOSAL & COVENANT
                  </strong>
                  <p><strong>Builder License:</strong> #2101998762</p>
                  <p><strong>Customer Name:</strong> {clientName}</p>
                  <p><strong>Property Address:</strong> {clientAddress}</p>
                  <p><strong>Specifications:</strong> {squaresCount} Squares of {shingleBrand} roofing system.</p>
                  
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded text-xs text-navy font-sans leading-relaxed">
                    <strong>MANDATORY MCL § 500.2082 FRAUD WARNING:</strong><br />
                    It is a class-G felony in the State of Michigan for a roofing contractor to pay, waive, rebate, or absorb any part of the customer insurance deductible. By signing below, both homeowner and contractor certify that the deductible will be paid in full in accordance with state law.
                  </div>
                  
                  <p className="italic text-slate-400">Electronic Signatures: [Apex Elite authorized signer] & [John Doe - Pending homeowner tap]</p>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  {downloadSuccess && (
                    <span className="text-xs font-semibold text-teal animate-pulse">✓ Proposal PDF Saved</span>
                  )}
                  <button
                    onClick={() => {
                      setDownloadSuccess(true);
                      setTimeout(() => {
                        setDownloadSuccess(false);
                        setShowContractPreview(false);
                      }, 2000);
                    }}
                    className="px-3.5 py-1.5 bg-navy hover:bg-navy/90 text-white font-bold text-xs rounded-lg transition flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
