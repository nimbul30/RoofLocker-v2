import React, { useState } from 'react';
import { BookOpen, Search, ShieldAlert, FileText, Landmark, Scale, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function Guides() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openGuideId, setOpenGuideId] = useState<string | null>('deductible');

  const guides = [
    {
      id: 'deductible',
      category: 'Legal & Policy',
      title: 'The Truth About Deductible Bribes',
      subtitle: 'Why "free roof" offers are active felonies under State laws',
      icon: <Landmark className="w-5 h-5 text-teal" />,
      content: `
### What is a "Deductible Waive" or "Deductible Rebate"?
Many door-to-door sales representatives will offer to "waive" or "absorb" your homeowner’s insurance deductible. They might say, "We will give you an advertising allowance" or "We'll write a credit to make your deductible free."

### Why this is highly dangerous (and illegal)
Under state consumer protection laws (e.g. MCL § 500.2082 and similar statutes):
1. **Insurance Fraud:** Your insurance carrier calculates their payout assuming you pay your deductible. If a roofer charges $15,000 but writes a bill to the insurance company for $15,000 while quietly refunding or waiving your $1,000 deductible, they are **falsifying the actual cost of repair**.
2. **Policy Cancellation:** Getting caught participating in a deductible waiver scheme is grounds for immediate insurance policy voidance and can lead to civil litigation.
3. **Low-Quality Substitutions:** Roofers who pay your deductible must cut corners elsewhere to keep their profit margins. This often results in cheap, non-certified shingles, unskilled labor, and zero-warranty installations that fail in the next high-wind storm.

### How RoofLocker Protects You
RoofLocker enforces statutory compliance by utilizing an unalterable contract verification system. All contracts verified on RoofLocker must explicitly outline your exact homeowner deductible, preventing illicit backend credits.
      `,
    },
    {
      id: 'red-flags',
      category: 'Contract Protection',
      title: 'Spotting Predatory Repair Contracts',
      subtitle: 'Beware of the "Immediate Authorization" clause',
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
      content: `
### Red Flag #1: "Direction of Payment" (DOP) Forms
Some storm-chasing roofers will ask you to sign a "Direction of Payment" before they even inspect your roof. This document forces your insurance company to mail all claim checks directly to the roofer—bypassing your approval entirely. Once they have the money, you lose all leverage.

### Red Flag #2: Pre-estimate Cancellation Fees
Never sign a document with a clause stating: *"If we inspect and represent you to your insurance, you must use us or pay a 20% fee."* Under state law, a cancellation fee must only represent actual administrative costs incurred, not an abusive penalty designed to trap you.

### Red Flag #3: Instant Contingency Agreements
If a salesperson knocks on your door and asks you to sign an agreement "just so we can look at your roof with the adjuster," **do not sign it**. This is frequently a binding contract that locks you into their services before you've seen a scope of work, warranty details, or sub-contractor roster.
      `,
    },
    {
      id: 'adjuster',
      category: 'Claims Handling',
      title: 'Interacting with Insurance Adjusters',
      subtitle: 'How to manage claim inspections without stress',
      icon: <FileText className="w-5 h-5 text-teal" />,
      content: `
### Step 1: Document Your Own Roof First
Before your insurance adjuster schedules their field visit, use RoofLocker's **Damage Canvas** to map and annotate every facet of your roof. Having an independent, timestamped digital damage record gives you a solid point of comparison.

### Step 2: Ensure an Unbiased Inspection
Your insurance adjuster is looking for structural evidence of wind or hail impact. They will climb the roof, mark a "Test Square" (typically a 10' x 10' section on each facet), and count the number of qualifying damages.
- **Do not let high-pressure sales reps bully the adjuster.** Some roofers try to accompany the adjuster and aggressively argue over every mark. This creates friction and often leads to delayed claims.
- **Provide clear documentation:** Print or share your RoofLocker damage report to show the adjuster the specific spots where shingle fracture occurred.

### Step 3: Review the "Scope of Loss"
Once approved, the insurance carrier will issue a document called the "Scope of Loss," explaining what they are paying to replace (e.g. ice-and-water shields, metal flashing, valley liners). Keep this document handy when selecting a contractor from the RoofLocker directory to ensure they quote matching specifications.
      `,
    },
  ];

  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0 animate-fadeIn" id="guides-view">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal/10 text-teal mb-4">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="font-display font-black text-3xl text-navy tracking-tight">
          Homeowner Defense Guides
        </h1>
        <p className="text-stone-gray text-base mt-2 max-w-xl mx-auto leading-relaxed">
          Knowledge is your strongest shield. Learn how to spot roofing scams, understand insurance regulations, and defend your bank account.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto mb-10">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search guides (e.g., deductible, contract, insurance)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition"
        />
      </div>

      {/* Guides List */}
      <div className="space-y-4" id="guides-accordion-list">
        {filteredGuides.map((guide) => {
          const isOpen = openGuideId === guide.id;
          return (
            <div
              key={guide.id}
              className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${
                isOpen ? 'border-teal shadow-md' : 'border-slate-100 shadow-sm hover:border-slate-200'
              }`}
            >
              {/* Accordion Trigger */}
              <button
                onClick={() => setOpenGuideId(isOpen ? null : guide.id)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isOpen ? 'bg-teal/10 text-teal' : 'bg-slate-50 text-stone-gray'
                  }`}>
                    {guide.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-teal uppercase block">
                      {guide.category}
                    </span>
                    <strong className="text-sm md:text-base text-navy font-display font-bold block mt-0.5">
                      {guide.title}
                    </strong>
                    <span className="text-xs text-stone-gray block">
                      {guide.subtitle}
                    </span>
                  </div>
                </div>
                <div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-stone-gray" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-gray" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-50 bg-slate-50/40 animate-fadeIn">
                  <div className="prose prose-sm prose-slate max-w-none text-xs md:text-sm text-stone-gray leading-relaxed space-y-4">
                    {guide.content.split('\n\n').map((paragraph, index) => {
                      if (paragraph.trim().startsWith('###')) {
                        return (
                          <h4 key={index} className="font-display font-bold text-navy text-sm md:text-base mt-4 block">
                            {paragraph.replace('###', '').trim()}
                          </h4>
                        );
                      }
                      if (paragraph.trim().startsWith('1.') || paragraph.trim().startsWith('-')) {
                        return (
                          <ul key={index} className="list-disc pl-5 space-y-2 mt-2">
                            {paragraph.split('\n').map((line, lIdx) => (
                              <li key={lIdx} className="leading-relaxed">
                                {line.replace(/^(\d+\.|-)\s*/, '').trim()}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={index} className="mt-1">{paragraph.trim()}</p>;
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredGuides.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-stone-gray text-sm font-medium">No guides matched your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-teal font-bold underline mt-1"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>

      {/* Safety Shield Banner */}
      <div className="mt-10 bg-navy/5 border border-navy/10 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy shrink-0 mt-0.5">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <strong className="text-sm font-bold text-navy block font-display">Need Legal Mediation?</strong>
          <p className="text-xs text-stone-gray leading-relaxed mt-1">
            If you’ve already signed an predatory agreement with a door-to-door solicitor and are facing intimidation tactics or cancellation fees exceeding 15%, head to our **Project Dispute Center** inside the secured portal or file an administrative complain directly.
          </p>
        </div>
      </div>
    </div>
  );
}
