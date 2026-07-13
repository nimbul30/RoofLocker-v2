import React, { useState } from 'react';
import { PREDATORY_CONTRACT_SAMPLE } from '../mockData';
import { ShieldAlert, FileSearch, Sparkles, AlertTriangle, FileText, Scale, Check, Info } from 'lucide-react';

interface RedFlag {
  id: string;
  phrase: string;
  title: string;
  severity: 'high' | 'critical';
  lawCitation: string;
  explanation: string;
}

export default function RedFlagScanner() {
  const [contractText, setContractText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [foundFlags, setFoundFlags] = useState<RedFlag[]>([]);

  // List of rules to simulate AI OCR scanner
  const RED_FLAG_RULES: RedFlag[] = [
    {
      id: 'flag-contingency',
      phrase: 'sole and exclusive contractor for all restoration work',
      title: 'Hidden Contingency Trap',
      severity: 'critical',
      lawCitation: 'Michigan Consumer Protection Act (MCL 445.901)',
      explanation: 'This clause legally binds you to use this contractor if your insurance company approves the storm claim. It strips away your legal right to obtain competitive bids or change builders.'
    },
    {
      id: 'flag-penalty',
      phrase: 'liquidated damages cancellation fee of 20%',
      title: 'Exorbitant Cancellation Fee',
      severity: 'critical',
      lawCitation: 'Michigan Common Law Liquidated Damages Rule',
      explanation: 'Predatory roofers include high cancellation penalties (15% to 20%) to bully you into staying with them. Under state law, a cancellation fee must reflect actual administrative costs incurred, not acts as a penalty when no materials have been purchased or delivered.'
    },
    {
      id: 'flag-deductible',
      phrase: 'bypass, waive, absorb, or rebate the mandatory state insurance deductible',
      title: 'Insurance Deductible Fraud Warning',
      severity: 'critical',
      lawCitation: 'Michigan Insurance Code (MCL 500.2082)',
      explanation: 'It is a state felony in Michigan for a roofing contractor to offer to ' + 'eat' + ', rebate, or waive your insurance deductible. It forces the homeowner to participate in fraudulent billing to the carrier. Avoid contractors who advertise this.'
    },
    {
      id: 'flag-adjuster',
      phrase: 'direct-file all estimates, specifications, and insurance demands',
      title: 'Unlicensed Public Adjusting',
      severity: 'high',
      lawCitation: 'Michigan Public Adjuster Licensing Act (MCL 500.1222)',
      explanation: 'Contractors are legally forbidden from acting as public adjusters. They can provide material dimensions and labor costs (physical scope), but they cannot legally argue policy coverage, negotiate payouts, or act as your legal fiduciary to an insurance company.'
    }
  ];

  const loadSampleContract = () => {
    setContractText(PREDATORY_CONTRACT_SAMPLE);
    setHasScanned(false);
    setFoundFlags([]);
  };

  const clearScanner = () => {
    setContractText('');
    setHasScanned(false);
    setFoundFlags([]);
  };

  const executeScan = () => {
    if (!contractText.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      // Look for matches
      const matches: RedFlag[] = [];
      const lowerText = contractText.toLowerCase();

      RED_FLAG_RULES.forEach(rule => {
        if (lowerText.includes(rule.phrase.toLowerCase())) {
          matches.push(rule);
        }
      });

      // If nothing matches but some text was submitted, give some generic tips
      if (matches.length === 0) {
        // Mock a general check
        matches.push({
          id: 'flag-generic',
          phrase: 'Standard Agreement',
          title: 'Custom Contract Evaluation',
          severity: 'high',
          lawCitation: 'Michigan Residential Code General Practices',
          explanation: 'No high-severity contingency clauses detected. Ensure that contract terms specify progress milestones rather than requiring large front-end deposits without physical progress.'
        });
      }

      setFoundFlags(matches);
      setIsScanning(false);
      setHasScanned(true);
    }, 1500); // Simulate AI scan wait
  };

  // Helper to highlight terms in the text
  const renderHighlightedText = () => {
    if (!hasScanned) return <pre className="whitespace-pre-wrap text-stone-gray font-mono text-[11px] leading-relaxed select-all">{contractText}</pre>;

    let text = contractText;
    foundFlags.forEach(flag => {
      if (flag.id === 'flag-generic') return;
      const regex = new RegExp(`(${flag.phrase})`, 'gi');
      text = text.replace(regex, `<mark class="bg-red-100 text-red-900 border-b-2 border-red-400 font-semibold px-1 py-0.5" title="${flag.title}">$1</mark>`);
    });

    return (
      <div
        className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed select-all text-stone-gray"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="red-flag-scanner-view">
      {/* LEFT: The Editor panel (7 columns) */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-display font-bold text-navy text-xl flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-teal" />
                Contract Red-Flag Scanner
              </h2>
              <p className="text-stone-gray text-xs">
                Scan contingency agreements or estimates for legal traps before signing.
              </p>
            </div>
            <button
              onClick={loadSampleContract}
              id="load-sample-contract-btn"
              className="text-[11px] bg-mist hover:bg-mist/80 text-navy font-bold px-3 py-1.5 rounded-lg transition"
            >
              Load Predatory Sample
            </button>
          </div>

          <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-4 min-h-[300px] flex flex-col justify-between shadow-inner">
            {!hasScanned ? (
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste the contract, estimate sheet, or 'permission slip' here... Or click 'Load Predatory Sample' above to test the scanner."
                className="w-full bg-transparent border-none text-xs font-mono focus:outline-none resize-none flex-1 placeholder:text-stone-gray/60 min-h-[250px]"
              />
            ) : (
              <div className="flex-1 min-h-[250px] overflow-y-auto">
                {renderHighlightedText()}
              </div>
            )}

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center mt-4">
              <span className="text-[10px] font-mono text-stone-gray">
                {contractText ? `${contractText.length} characters` : 'Input empty'}
              </span>
              {hasScanned && (
                <button
                  onClick={clearScanner}
                  className="text-xs text-stone-gray hover:text-navy font-semibold"
                >
                  Clear and paste new
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={executeScan}
            disabled={!contractText.trim() || isScanning}
            id="run-scanner-btn"
            className={`flex-1 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
              !contractText.trim() || isScanning
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-navy hover:bg-navy/95 text-white shadow-sm'
            }`}
          >
            {isScanning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber" />
                Scanning legal clauses with AI rules...
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4" />
                Analyze Contract Text
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT: Results & Layman Explanations (5 columns) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Flag Summary list */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm flex-1">
          <h3 className="font-display font-bold text-navy text-base mb-4 flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5 text-amber animate-pulse" />
            Scanner Risk Assessment
          </h3>

          {!hasScanned ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-stone-gray font-semibold text-xs">Awaiting Analysis</p>
              <p className="text-stone-gray text-[10px] max-w-xs mx-auto mt-1">
                Paste a contract and click analyze. We'll identify clauses that legally lock you down or violate state law.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-100 mb-2">
                <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider">Identified Risk Levels</span>
                <span className="text-xs bg-red-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                  {foundFlags.filter(f => f.severity === 'critical').length} Critical • {foundFlags.filter(f => f.severity === 'high').length} High
                </span>
              </div>

              {foundFlags.map(flag => (
                <div
                  key={flag.id}
                  id={`scanner-card-${flag.id}`}
                  className="p-4 border rounded-xl bg-slate-50 hover:bg-white transition-all duration-300 relative overflow-hidden"
                  style={{ borderLeftWidth: '4px', borderLeftColor: flag.severity === 'critical' ? '#ef4444' : '#f59e0b' }}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-display font-bold text-navy text-xs leading-tight">
                      {flag.title}
                    </h4>
                    <span className={`text-[9px] uppercase font-bold font-mono px-1.5 py-0.5 rounded ${
                      flag.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber/15 text-amber'
                    }`}>
                      {flag.severity}
                    </span>
                  </div>

                  <p className="text-stone-gray text-[11px] leading-relaxed mb-2 italic bg-white p-2 rounded border border-slate-100">
                    "{flag.phrase}"
                  </p>

                  <p className="text-stone-gray text-[11.5px] leading-relaxed mb-3">
                    {flag.explanation}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-teal font-semibold font-mono bg-mist/20 p-1.5 rounded">
                    <Scale className="w-3.5 h-3.5 shrink-0" />
                    <span>Statute: {flag.lawCitation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Educational Consumer Fact Card */}
        <div className="bg-navy border border-deep-slate rounded-2xl p-5 text-white">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-amber shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-1">Michigan Legal Code Shield</h4>
              <p className="text-mist text-xs leading-relaxed">
                Roofing contractors on RoofLocker are legally and contractually banned from altering claims packages. Always remember: **Your property measurements belong to you.** Sharing honest scope sheets with insurance adjusters ensures accurate material calculations with zero hidden traps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
