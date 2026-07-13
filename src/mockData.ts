import { Contractor, DamagePin, ChatMessage, EscrowMilestone } from './types';

export const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: 'apex-elite',
    name: 'Apex Elite Roofing',
    websiteDomain: 'apexdetroitroofing.com',
    websiteAge: '8 years active',
    physicalLocation: '150 N Almont Ave, Imlay City, MI 48444',
    hasPhysicalAddress: true,
    trustScore: 9.9,
    rating: 4.9,
    reviewCount: 142,
    scamReportCheck: 'Checked: 0 matching reports found in Michigan LARA and BBB databases.',
    courtDocketsCheck: 'Checked: 0 active or historical civil fraud filings in Lapeer County courts.',
    stateLicense: 'Michigan Residential Builder License #2101998762 (Verified Active, Expiry 2028)',
    phone: '(810) 724-1100',
    city: 'Imlay City',
    manufacturerCredentials: ['GAF Master Elite® Certified ID #ME12345', 'CertainTeed ShingleMaster™'],
    specialties: ['Laminate Shingles', 'High-Wind Systems', 'Regional Ice Shielding', 'Storm Mitigation'],
    bio: 'Apex Elite Roofing is a locally owned company serving Imlay City and the wider Lapeer/Macomb counties. They specialize in high-durability residential roofing built to survive heavy Michigan snow loads and high-wind cycles.',
    logoColor: 'from-indigo-600 to-slate-800',
    reviews: [
      {
        id: 'rev-1',
        author: 'Marcus Vance (Imlay Township)',
        rating: 5,
        date: 'May 12, 2026',
        comment: 'Worked with Apex through RoofLocker secure portal. Completely stress-free! They did not pressure me on the first day, and their measurements matched the RoofLocker 3D layout exactly.',
        verified: true
      },
      {
        id: 'rev-2',
        author: 'Sarah Jenkins (Lapeer)',
        rating: 5,
        date: 'April 20, 2026',
        comment: 'Very professional. When my insurance company originally lowballed the ice barrier, Apex helped get the required local building code documents showing two layers are legally required. No extra fees, clean work.',
        verified: true
      }
    ]
  },
  {
    id: 'great-lakes',
    name: 'Great Lakes Shingle Co.',
    websiteDomain: 'greatlakesshingles.com',
    websiteAge: '12 years active',
    physicalLocation: '450 Clay St, Lapeer, MI 48446',
    hasPhysicalAddress: true,
    trustScore: 9.7,
    rating: 4.8,
    reviewCount: 96,
    scamReportCheck: 'Checked: Clean history. Safe listing across Michigan consumer complaint registries.',
    courtDocketsCheck: 'Checked: No pending lien-abuse filings or legal disputes found.',
    stateLicense: 'Michigan Residential Builder License #2102115543 (Verified Active, Expiry 2027)',
    phone: '(810) 664-5900',
    city: 'Lapeer',
    manufacturerCredentials: ['Owens Corning Platinum Preferred ID #OC9876'],
    specialties: ['Metal Roof Transitions', 'Architectural Shingles', 'Attic Ventilation Systems'],
    bio: 'Great Lakes Shingle Co. offers premier roofing solutions with an emphasis on high-quality structural engineering and energy-efficient ventilation setups designed specifically for Great Lakes weather.',
    logoColor: 'from-indigo-500 to-indigo-700',
    reviews: [
      {
        id: 'rev-3',
        author: 'David L. (Attica)',
        rating: 5,
        date: 'March 15, 2026',
        comment: 'Excellent craftsmanship and honest communication. They showed me their license certificate and insurance before we signed anything inside RoofLocker.',
        verified: true
      }
    ]
  },
  {
    id: 'rooflocker-roofers',
    name: 'RoofLocker Roofers',
    websiteDomain: 'rooflockerroofers.com',
    websiteAge: '5 years active',
    physicalLocation: '700 S Blacks Corners Rd, Imlay City, MI 48444',
    hasPhysicalAddress: true,
    trustScore: 9.5,
    rating: 4.7,
    reviewCount: 68,
    scamReportCheck: 'Checked: 0 complaints registered under current or historic corporate names.',
    courtDocketsCheck: 'Checked: No adverse consumer protection judgments.',
    stateLicense: 'Michigan Residential Builder License #2101224599 (Verified Active, Expiry 2027)',
    phone: '(800) 555-5625',
    city: 'Imlay City',
    manufacturerCredentials: ['CertainTeed Select ShingleMaster™ ID #SSM543'],
    specialties: ['Hail Damage Assessment', 'Seamless Aluminium Gutters', 'Emergency Board-up'],
    bio: 'RoofLocker Roofers specializes in emergency storm repairs and comprehensive wind-restoration services. They prioritize durable shingles and robust underlayment systems.',
    logoColor: 'from-slate-700 to-indigo-600',
    reviews: [
      {
        id: 'rev-4',
        author: 'Jessica Miller (Almont)',
        rating: 4,
        date: 'June 2, 2026',
        comment: 'Quick to respond after the windstorm. Their estimate was clear and matched the RoofLocker calculation. Recommended!',
        verified: true
      }
    ]
  }
];

export const MOCK_INITIAL_PINS: DamagePin[] = [
  {
    id: 'pin-1',
    facetName: 'South-West Hip Slope',
    x: 35,
    y: 45,
    damageType: 'Wind-Fractured Shingles',
    notes: 'Wind caught the lower edge. Approximately 8 laminated shingles are completely missing or creased along the sealing line.',
    severity: 'high',
    photoUrl: 'https://images.unsplash.com/photo-1631651352404-c24e77545935?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    videoNarration: 'I am taking a video from the ground of the southwest hip slope. You can see there are about 8 laminated shingles missing near the edge, and the synthetic felt underneath is exposed and fluttering in the high winds.'
  },
  {
    id: 'pin-2',
    facetName: 'North Eave Area',
    x: 65,
    y: 75,
    damageType: 'Hail Bruising',
    notes: 'Impact marks circular in shape on the fiberglass mat. Asphalt granules are knocked off leaving the black backing exposed.',
    severity: 'medium',
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4?v=2',
    videoNarration: 'Video scanning the north eave. Here are multiple round hail impact strikes. Notice how the protective colored slate granules have been chipped away completely in several 1-inch circles.'
  },
  {
    id: 'pin-3',
    facetName: 'East Ridge Line',
    x: 55,
    y: 20,
    damageType: 'Cosmetic Blistering',
    notes: 'Small pockets of air under the shingles. Appears to be older weathering rather than storm impact damage.',
    severity: 'low',
    photoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4?v=3',
    videoNarration: 'Walkthrough of the east ridge. We can observe blistering near the peak. The asphalt coating has swollen and bubbled up, probably due to solar heat combined with poor ventilation underneath.'
  }
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'system',
    text: '🔒 Secure Workspace Created. Your contact information is completely hidden. All chats are recorded to provide a legally sound, tamper-proof record of all contractor commitments.',
    timestamp: '2:15 PM'
  },
  {
    id: 'msg-2',
    sender: 'contractor',
    text: 'Hello! I have reviewed your RoofLocker 3D Scope package. Your roof is exactly 32 squares, and our automated calculations match your measurements. We would like to schedule a quick video demonstration to show you the architectural shingles we recommend.',
    timestamp: '2:18 PM'
  },
  {
    id: 'msg-3',
    sender: 'homeowner',
    text: 'Hi! That sounds great. I am specifically interested in making sure we comply with Lapeer County building codes regarding the ice-and-water barrier. My previous roofer cut corners on that.',
    timestamp: '2:20 PM'
  },
  {
    id: 'msg-4',
    sender: 'contractor',
    text: 'Absolutely! Under Michigan Residential Code (Section R905), we must install two layers of self-adhering ice barrier from the eaves up to 24 inches inside the warm exterior wall line. I will show you our GAF WeatherWatch barrier on the live presentation so you can see exactly how it works.',
    timestamp: '2:22 PM'
  },
  {
    id: 'msg-5',
    sender: 'system',
    text: '💡 Educational Tip: All bids are locked. Remember, contractors on RoofLocker are contractually forbidden from offering to waive your insurance deductible or inflating square footage.',
    timestamp: '2:23 PM'
  }
];

export const MOCK_MILESTONES: EscrowMilestone[] = [
  {
    id: 'ms-1',
    title: 'Deductible Verified',
    description: 'Homeowner verifies statutory deductible contribution compliance.',
    status: 'completed',
    amount: 1000.00,
    isDeductible: true,
    requiredProofDescription: 'Homeowner uploads or inputs deductible receipt record for compliance documentation.'
  },
  {
    id: 'ms-2',
    title: 'Material Delivery Audit',
    description: 'Milestone 1: Shingle pallets delivered on-site. Verifies that physical materials correspond to specifications (40% physical progress).',
    status: 'active',
    amount: 5400.00,
    isDeductible: false,
    requiredProofDescription: 'Upload a clear photo of the shingle pallets sitting on your driveway to verify materials for compliance records.'
  },
  {
    id: 'ms-3',
    title: 'Tear-Off Complete & Deck Inspection',
    description: 'Milestone 2: Bare wood deck is prepared. Verifies structural integrity before new shingles are laid (70% physical progress).',
    status: 'locked',
    amount: 4050.00,
    isDeductible: false,
    requiredProofDescription: 'Contractor must upload a photo of the clean bare deck showing the double-layer ice barrier in place for project files.'
  },
  {
    id: 'ms-4',
    title: 'Final Completion & Clean-Up Sign-Off',
    description: 'Project Close: Complete structural sign-off and yard clean-up audit (100% physical progress).',
    status: 'locked',
    amount: 4050.00,
    isDeductible: false,
    requiredProofDescription: 'Homeowner inspects the yard, verifies magnetic nail sweeps, and taps "Confirm Satisfaction" to complete project documentation.'
  }
];

export const PREDATORY_CONTRACT_SAMPLE = `
STANDARD CONTINGENCY AGREEMENT AND PERMISSION SLIP
Date: June 15, 2026

Property Owner: John Doe
Property Address: 215 Cedar St, Imlay City, MI 48444

By signing this inspection authorization document, the Owner hereby agrees and designates Apex Predator Builders as the sole and exclusive contractor for all restoration work on the property.

Key Conditions:
1. Homeowner agrees to designate Contractor as sole provider upon insurance claim approval.
2. In the event that the Owner cancels this agreement for any reason after approval is secured, a liquidated damages cancellation fee of 20% of the total claim value shall be assessed and immediately payable.
3. Contractor may assist Homeowner in bypassing, waiving, absorbing, or rebating the mandatory state insurance deductible, subject to advertising promotions and rebate agreements.
4. Contractor is granted power of attorney to direct-file all estimates, specifications, and insurance demands to the homeowner's carrier.
`;
