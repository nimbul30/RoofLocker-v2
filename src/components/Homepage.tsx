import React, { useState } from 'react';
import BrandLogo, { LogoMark } from './BrandLogo';
import { t } from '../translations';
import { 
  ShieldCheck, 
  ArrowRight, 
  Calculator, 
  HelpCircle, 
  CheckCircle, 
  Lock, 
  BadgeAlert, 
  FileCheck, 
  Search, 
  Briefcase, 
  ChevronRight, 
  Layers,
  Sparkles,
  Info,
  X,
  AlertTriangle
} from 'lucide-react';

interface HomepageProps {
  onNavigate: (view: 'directory' | 'portal' | 'protection-suite' | 'login') => void;
  hasUnlockedPortal: boolean;
  language?: 'en' | 'es';
}

const shingleDetails = {
  '3-tab': {
    name: 'Traditional 3-Tab Fiberglass Shingles',
    brandExample: 'GAF Royal Sovereign®, Owens Corning® Supreme',
    lifespan: '15 - 20 Years',
    windRating: 'Up to 60 MPH',
    warranty: '25-Year Limited Warranty',
    description: 'A classic, economical single-layer asphalt shingle featuring three uniform tabs along its lower edge. Highly popular for rental properties, budget-conscious builds, and simple starter homes.',
    pros: ['Most affordable initial cost', 'Lightweight & easy to install', 'Clean, uniform, flat appearance'],
    cons: ['Shorter lifespan', 'Lower wind resistance (vulnerable to high storms)', 'Prone to blow-offs over time'],
    idealFor: 'Budget-focused replacements, rental properties, and regions with very mild weather.'
  },
  'architectural': {
    name: 'Laminated Architectural Shingles',
    brandExample: 'GAF Timberline® HDZ, CertainTeed Landmark®',
    lifespan: '25 - 30 Years',
    windRating: 'Up to 130 MPH (industry standard)',
    warranty: 'Lifetime Limited Warranty (when installed with qualified systems)',
    description: 'Also known as dimensional shingles, these are constructed with two or more layers of asphalt laminated together. This creates a textured, multi-dimensional shadow line mimicking wood shake.',
    pros: ['Excellent wind resistance and durability', 'Deep, dimensional look boosts curb appeal', 'Long-lasting with comprehensive warranty protection'],
    cons: ['Slightly heavier than 3-tab', 'Higher upfront material cost than 3-tab'],
    idealFor: 'Standard residential homeowners looking for the best balance of longevity, storm resistance, and aesthetic value.'
  },
  'duration': {
    name: 'Owens Corning® Duration® Shingles',
    brandExample: 'Owens Corning® TruDefinition® Duration®',
    lifespan: '25 - 30 Years',
    windRating: 'Up to 130 MPH (SureNail® Guaranteed)',
    warranty: 'Lifetime Limited Warranty',
    description: 'Engineered with patented SureNail® Technology—a tough, woven fabric reinforcing strip in the nailing zone. This ensures exceptional grip, consistent nailing depth, and ultimate resistance to wind pull-through.',
    pros: ['Superior nail-pull-through resistance', 'Fast, accurate installation for builders', 'Beautiful, high-contrast shadow lines'],
    cons: ['Slightly more expensive than basic architectural options'],
    idealFor: 'Homes in high-wind regions, coastal areas, or locations prone to severe spring/summer storms.'
  },
  'luxury': {
    name: 'Premium Luxury Designer Shingles',
    brandExample: 'CertainTeed Grand Manor® / Belmont®, GAF Camelot® II',
    lifespan: '35 - 50 Years',
    windRating: 'Up to 110 - 130 MPH',
    warranty: '50-Year to Lifetime Warranty',
    description: 'High-end multi-layer asphalt shingles custom-sculpted to replicate the thick, natural texture of real cedar shakes or hand-cut slate tiles. Much thicker and heavier than standard options.',
    pros: ['Ultra-premium aesthetic and premium home value booster', 'Extremely heavy-duty and puncture-resistant', 'Exceptional lifespan for asphalt materials'],
    cons: ['High material and labor cost', 'Significantly heavier (requires sound roof decking structural review)'],
    idealFor: 'Executive homes, historical properties, or homeowners seeking a premium slate-like look at a fraction of slate\'s cost.'
  },
  'metal': {
    name: 'Standing Seam Metal Roofing',
    brandExample: 'Sheffield Metals®, Union Corrugating, Fabral®',
    lifespan: '50 - 70 Years',
    windRating: 'Up to 140+ MPH (High Velocity Hurricane Zones)',
    warranty: '40-Year to Lifetime Warranty',
    description: 'Composed of continuous interlocking vertical metal panels secured by concealed fasteners. Extremely durable, energy-efficient (reflects solar heat), and virtually maintenance-free.',
    pros: ['Lifetime durability (50+ years)', 'Concealed fasteners prevent leak hazards', 'Maximum energy savings via high heat reflectivity'],
    cons: ['High initial investment (2x to 3x of asphalt)', 'Requires specialized, certified metal installers', 'Can be noisy during severe rain/hail if insulation is light'],
    idealFor: 'Modern architecture, mountain homes with heavy snow loads, and homeowners looking for a "one-and-done" permanent roof solution.'
  },
  'synthetic': {
    name: 'Synthetic Composite Slate & Shake',
    brandExample: 'DaVinci® Roofscapes Slate, EcoStar® Majestic Slate',
    lifespan: '50+ Years',
    windRating: 'Up to 110+ MPH (Class 4 Impact Rated)',
    warranty: '50-Year Limited Lifetime Warranty',
    description: 'Molded from state-of-the-art engineered polymers, resins, and recycled materials. Perfectly duplicates the look of premium natural slate tiles or hand-split wood shakes without the weight or cracking.',
    pros: ['Impeccable high-end natural aesthetic', 'Class 4 Impact Resistance (resists large hail damages)', 'Lightweight (no structural reinforcement needed unlike real slate)'],
    cons: ['Highest upfront material cost', 'Requires specialized, highly skilled installers'],
    idealFor: 'Luxury homes desiring authentic slate/shake beauty with maximum impact-resistance and zero decay over a lifetime.'
  }
};

export default function Homepage({ onNavigate, hasUnlockedPortal, language = 'en' }: HomepageProps) {
  // Calculator States
  const [roofSize, setRoofSize] = useState<number>(32); // Default to 32 squares
  const [shingleType, setShingleType] = useState<'3-tab' | 'architectural' | 'duration' | 'luxury' | 'metal' | 'synthetic'>('architectural');
  const [deductible, setDeductible] = useState<number>(1000);
  const [includeDeductible, setIncludeDeductible] = useState<boolean>(true);
  const [selectedDetailId, setSelectedDetailId] = useState<'3-tab' | 'architectural' | 'duration' | 'luxury' | 'metal' | 'synthetic' | null>(null);
  const [activeTab, setActiveTab] = useState<'size_materials' | 'complexity' | 'insurance'>('size_materials');

  // Roof Complexity States
  const [pitch, setPitch] = useState<'standard' | 'steep' | 'extreme'>('standard');
  const [stories, setStories] = useState<'1' | '2' | '3'>('1');
  const [valleys, setValleys] = useState<'simple' | 'moderate' | 'complex'>('simple');
  const [tearOffLayers, setTearOffLayers] = useState<'1' | '2' | '3'>('1');
  const [penetrations, setPenetrations] = useState<'none' | 'few' | 'many'>('none');

  // Expanded details states
  const [expandedSection, setExpandedSection] = useState<'lara' | 'deductible' | 'materials'>('lara');

  // Calculation Logic
  const getRatePerSquare = () => {
    switch (shingleType) {
      case '3-tab': return 290;
      case 'architectural': return 380;
      case 'duration': return 410;
      case 'luxury': return 520;
      case 'metal': return 650;
      case 'synthetic': return 880;
    }
  };

  // Labor Surcharge Calculations based on Complexity
  const getPitchSurcharge = () => {
    switch (pitch) {
      case 'standard': return 0;
      case 'steep': return 35; // $35 per square
      case 'extreme': return 70; // $70 per square
    }
  };

  const getStoriesSurcharge = () => {
    switch (stories) {
      case '1': return 0;
      case '2': return 25; // $25 per square
      case '3': return 50; // $50 per square
    }
  };

  const getValleysSurcharge = () => {
    switch (valleys) {
      case 'simple': return 0;
      case 'moderate': return 15; // $15 per square
      case 'complex': return 40; // $40 per square
    }
  };

  const getTearOffSurcharge = () => {
    switch (tearOffLayers) {
      case '1': return 0;
      case '2': return 30; // $30 per square
      case '3': return 60; // $60 per square
    }
  };

  const getPenetrationsSurcharge = () => {
    switch (penetrations) {
      case 'none': return 0;
      case 'few': return 200; // Flat $200
      case 'many': return 450; // Flat $450
    }
  };

  const pitchRate = getPitchSurcharge();
  const storiesRate = getStoriesSurcharge();
  const valleysRate = getValleysSurcharge();
  const tearOffRate = getTearOffSurcharge();
  const penetrationsCost = getPenetrationsSurcharge();

  const complexityLaborSurcharge = Math.round(
    ((pitchRate + storiesRate + valleysRate + tearOffRate) * roofSize) + penetrationsCost
  );

  const rate = getRatePerSquare();
  const baseCost = roofSize * rate;
  const underlaymentFlashings = Math.round(roofSize * 45); // $45 per square for ice shield, underlayment & accessories
  const permitsFees = 350; // Flat local Michigan permit simulation fee
  const totalProjectCost = baseCost + complexityLaborSurcharge + underlaymentFlashings + permitsFees;

  return (
    <div className="space-y-12 animate-fadeIn" id="homepage-root">
      
      {/* 1. HERO BLOCK */}
      <section className="relative bg-gradient-to-br from-navy via-deep-slate to-navy rounded-3xl overflow-hidden p-8 md:p-12 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 bg-amber/15 border border-amber/30 px-4 py-2 rounded-full text-amber font-extrabold text-sm uppercase tracking-wider font-mono">
              <ShieldCheck className="w-6 h-6 text-amber" />
              {t('Free for Homeowners · Consumer Advocacy Platform', 'Gratis para Propietarios · Plataforma de Defensa del Consumidor', language)}
            </div>
            
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[2.75rem] tracking-tight leading-tight">
              <span className="block">{t('Buy Your Next Roof with', 'Compre su Próximo Techo con', language)}</span>
              <span className="text-amber block">{t('Total Confidence.', 'Total Confianza.', language)}</span>
            </h1>
            
            <p className="text-mist text-lg md:text-xl leading-relaxed max-w-xl">
              <strong className="inline-block bg-[#5C6066] text-white rounded px-3 py-1 font-extrabold tracking-wider mb-3 text-sm md:text-base">
                {t('NO Cost. NO Pressure. NO Soliciting. NO Surprises.', 'SIN Costo. SIN Presión. SIN Solicitud. SIN Sorpresas.', language)}
              </strong>
              <span className="block pr-0 md:pr-12">
                {t('Verified roofers competing for your trust. RoofLocker makes sure they earn it.', 'Techadores verificados compiten por su confianza. RoofLocker se asegura de que se la ganen.', language)}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => onNavigate('login')}
                id="hero-cta-directory"
                className="px-6 py-3 bg-teal hover:bg-teal/90 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-teal/20 transition flex items-center justify-center gap-2"
              >
                {t('Homeowners Begin Here', 'Comience Aquí como Propietario', language)}
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onNavigate('protection-suite')}
                id="hero-cta-protection"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base rounded-xl transition flex items-center justify-center gap-2"
              >
                {t('Roofers Begin Here', 'Comience Aquí como Techador', language)}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center justify-center w-full">
            <BrandLogo layout="card" />
          </div>
        </div>

        {/* Live Protection Bullet points bar on the bottom edge */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6" id="hero-bullets-container">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" id="bullet-icon-1" />
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-mono block">{t('Zero Cost', 'Costo Cero', language)}</span>
              <div className="text-sm font-bold text-white font-display" id="bullet-text-1">{t('Free for homeowners. Always.', 'Gratis para propietarios. Siempre.', language)}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" id="bullet-icon-2" />
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-mono block">{t('Zero Hassle', 'Cero Molestias', language)}</span>
              <div className="text-sm font-bold text-white font-display" id="bullet-text-2">{t('No phone tag. No door knockers. No pressure.', 'Sin llamadas molestas. Sin timbrazos. Sin presión.', language)}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" id="bullet-icon-3" />
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-mono block">{t('100% Privacy', '100% Privacidad', language)}</span>
              <div className="text-sm font-bold text-white font-display" id="bullet-text-3">{t('Your data is never sold. Ever.', 'Sus datos nunca se venden. Jamás.', language)}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" id="bullet-icon-4" />
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-mono block">{t('Your Choice', 'Su Elección', language)}</span>
              <div className="text-sm font-bold text-white font-display" id="bullet-text-4">{t('You decide who contacts you, nobody else.', 'Usted decide quién le contacta, nadie más.', language)}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" id="bullet-icon-5" />
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase tracking-wider font-mono block">{t('Control', 'Control', language)}</span>
              <div className="text-sm font-bold text-white font-display" id="bullet-text-5">{t('Browse, compare, and decide at your own pace', 'Explore, compare y decida a su propio ritmo', language)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE ESTIMATOR & ESCROW SCHEDULE DRAFT */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8" id="home-calculator-section">
        {/* Left Inputs (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-mist text-navy font-semibold text-xs px-2.5 py-1 rounded-full mb-2">
              <Calculator className="w-3.5 h-3.5 text-teal" />
              {t('Interactive Simulation', 'Simulación Interactiva', language)}
            </div>
            <h2 className="font-display font-bold text-navy text-2xl tracking-tight">
              {t('Project Cost Estimator', 'Estimador de Costos del Proyecto', language)}
            </h2>
            <p className="text-stone-gray text-xs mt-1.5 italic">
              {t('* Note: This is a simulated interactive estimator for educational purposes only. Actual contractor bids, material prices, and local labor rates will vary based on project scope, roof complexity, and individual installer overhead.', '* Nota: Este es un estimador interactivo simulado únicamente con fines educativos. Las ofertas reales de los contratistas, los precios de los materiales y las tarifas de mano de obra locales variarán según el alcance del proyecto, la complejidad del techo y los gastos generales del instalador.', language)}
            </p>
          </div>

          {/* Redesigned Tab Navigation */}
          <div className="bg-slate-50 p-1.5 rounded-2xl flex flex-wrap md:flex-nowrap gap-1 border border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('size_materials')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'size_materials'
                  ? 'bg-white text-teal shadow-xs border border-slate-100'
                  : 'text-stone-gray hover:text-navy hover:bg-slate-100/50'
              }`}
            >
              <Calculator className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] uppercase opacity-60 tracking-wider">{t('Step 1', 'Paso 1', language)}</span>
                <span className="block leading-tight">{t('Size & Material', 'Tamaño y Material', language)}</span>
              </div>
              <span className="hidden sm:inline-block ml-auto text-[10px] font-mono bg-teal/5 px-2 py-0.5 rounded text-teal">
                {roofSize} Sq
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('complexity')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'complexity'
                  ? 'bg-white text-teal shadow-xs border border-slate-100'
                  : 'text-stone-gray hover:text-navy hover:bg-slate-100/50'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] uppercase opacity-60 tracking-wider">{t('Step 2', 'Paso 2', language)}</span>
                <span className="block leading-tight">{t('Roof Conditions', 'Condiciones de Techo', language)}</span>
              </div>
              <span className="hidden sm:inline-block ml-auto text-[10px] font-mono bg-indigo-500/5 px-2 py-0.5 rounded text-indigo-600">
                {pitch === 'standard' ? t('Standard', 'Estándar', language) : pitch === 'steep' ? t('Steep', 'Inclinado', language) : t('Extreme', 'Extremo', language)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('insurance')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'insurance'
                  ? 'bg-white text-teal shadow-xs border border-slate-100'
                  : 'text-stone-gray hover:text-navy hover:bg-slate-100/50'
              }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] uppercase opacity-60 tracking-wider">{t('Step 3', 'Paso 3', language)}</span>
                <span className="block leading-tight">{t('Funding & Cost Planning', 'Financiamiento y Costos', language)}</span>
              </div>
              <span className={`hidden sm:inline-block ml-auto text-[10px] font-mono px-2 py-0.5 rounded ${includeDeductible ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
                {includeDeductible ? `$${deductible}` : t('Retail', 'Minorista', language)}
              </span>
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="min-h-[320px] transition duration-300">
            {activeTab === 'size_materials' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Roof Squares Slider */}
                <div className="space-y-2 bg-slate-50/40 p-5 rounded-2xl border border-slate-100/50">
                  <div className="flex justify-between items-baseline">
                    <label className="text-sm font-bold text-navy uppercase">{t('Roof Size (Squares)', 'Tamaño del Techo (Cuadrados)', language)}</label>
                    <span className="text-base font-bold text-teal font-mono">{roofSize} Sq. <span className="text-xs text-stone-gray font-normal">({roofSize * 100} sq ft)</span></span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    value={roofSize}
                    onChange={(e) => setRoofSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal"
                  />
                  <p className="text-xs text-stone-gray font-mono">{t('Michigan residential roofs typically range from 20 to 45 squares.', 'Los techos residenciales de Michigan suelen variar de 20 a 45 cuadrados.', language)}</p>
                </div>

                {/* Shingle Type Buttons */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <label className="text-xs font-extrabold text-navy uppercase tracking-wider block">
                      {t('Shingle Quality Standard', 'Estándar de Calidad de Tejas', language)}
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">{t('Click (?) for full product specifications', 'Clic en (?) para especificaciones del producto', language)}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: '3-tab', label: t('Traditional 3-Tab', '3-Tab Tradicional', language), desc: t('Standard 25-yr fiberglass shingle', 'Teja estándar de fibra de vidrio de 25 años', language) },
                      { id: 'architectural', label: t('GAF Timberline® HDZ', 'GAF Timberline® HDZ', language), desc: t('Laminated, 130mph wind rated', 'Laminada, para vientos de 130mph', language) },
                      { id: 'duration', label: t('OC Duration®', 'OC Duration®', language), desc: t('SureNail® patented triple grip', 'Agarre triple patentado SureNail®', language) },
                      { id: 'luxury', label: t('CertainTeed Grand®', 'CertainTeed Grand®', language), desc: t('Luxury designer shake/slate aesthetic', 'Estética de diseño de imitación pizarra', language) },
                      { id: 'metal', label: t('Standing Seam', 'Junta Alzada', language), desc: t('Premium lifetime architectural metal', 'Metal arquitectónico premium de por vida', language) },
                      { id: 'synthetic', label: t('DaVinci® Composite', 'DaVinci® Composite', language), desc: t('Eco-friendly premium synthetic slate', 'Pizarra sintética premium ecológica', language) }
                    ].map(type => (
                      <div
                        key={type.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setShingleType(type.id as any)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShingleType(type.id as any);
                          }
                        }}
                        className={`p-4 rounded-xl border text-left transition flex flex-col justify-between relative group cursor-pointer select-none h-[110px] ${
                          shingleType === type.id 
                            ? 'border-teal bg-teal/5 text-navy font-bold shadow-xs' 
                            : 'border-slate-200 text-stone-gray hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full gap-1">
                          <span className="block text-xs font-bold leading-tight">{type.label}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDetailId(type.id as any);
                            }}
                            className="p-1 rounded-full text-slate-400 hover:text-teal hover:bg-slate-200/50 transition -mr-1 -mt-1 shrink-0 relative z-10"
                            title="View full specs & examples"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-stone-gray leading-normal block mt-2">{type.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'complexity' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Safety Waiver & Ground Inspection Notice */}
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-xs text-rose-950 flex items-start gap-3 shadow-xs">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1.5">
                    <span className="font-extrabold text-rose-800 uppercase tracking-wider text-[10px] block">{t('MANDATORY SAFETY DISCLAIMER', 'AVISO DE SEGURIDAD OBLIGATORIO', language)}</span>
                    <p className="leading-relaxed">
                      <strong>{t('DO NOT CLIMB ONTO THE ROOF!', '¡NO SE SUBA AL TECHO!', language)}</strong> {t('Homeowners should conduct physical checkups strictly from ground-level or window viewpoints. RoofLocker is engineered to allow clean, safe remote evaluations without ladder climbs.', 'Los propietarios deben realizar inspecciones físicas estrictamente desde el nivel del suelo o desde ventanas. RoofLocker está diseñado para permitir evaluaciones remotas limpias y seguras sin necesidad de usar escaleras.', language)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  {/* 1. Pitch / Steepness */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-navy uppercase tracking-wider">{t('Roof Pitch (Steepness)', 'Inclinación del Techo (Pendiente)', language)}</span>
                      <span className="text-[10px] text-teal-700 font-mono font-bold">
                        {pitch === 'standard' ? t('Standard Labor', 'Mano de Obra Estándar', language) : pitch === 'steep' ? t('+$35 / Sq Surcharge', '+$35 / Recargo por Cuadrado', language) : t('+$70 / Sq Surcharge', '+$70 / Recargo por Cuadrado', language)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'standard', label: t('Standard', 'Estándar', language), desc: t('Flat/Low Pitch', 'Plano/Baja Pend.', language) },
                        { id: 'steep', label: t('Steep', 'Inclinado', language), desc: t('Harnesses Req.', 'Requiere Arnés', language) },
                        { id: 'extreme', label: t('Extreme', 'Extremo', language), desc: t('Walk-off Pitch', 'Pend. Vertical', language) }
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPitch(p.id as any)}
                          className={`py-2 px-1.5 rounded-xl border text-center transition ${
                            pitch === p.id 
                              ? 'border-teal bg-teal/10 text-teal-800 font-bold text-xs shadow-xs' 
                              : 'border-slate-200 bg-white text-stone-gray hover:bg-slate-50 text-xs'
                          }`}
                        >
                          <span className="block font-bold text-[11px]">{p.label}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">{p.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Stories / Height */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-navy uppercase tracking-wider">{t('Stories (Height)', 'Pisos (Altura)', language)}</span>
                      <span className="text-[10px] text-teal-700 font-mono font-bold">
                        {stories === '1' ? t('Standard Labor', 'Mano de Obra Estándar', language) : stories === '2' ? t('+$25 / Sq Surcharge', '+$25 / Recargo por Cuadrado', language) : t('+$50 / Sq Surcharge', '+$50 / Recargo por Cuadrado', language)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: '1', label: t('1 Story', '1 Piso', language), desc: t('Ranch/Bungalow', 'Casa Baja', language) },
                        { id: '2', label: t('2 Stories', '2 Pisos', language), desc: t('Rigging Req.', 'Requiere Aparejos', language) },
                        { id: '3', label: t('3+ Stories', '3+ Pisos', language), desc: t('Scaffolding', 'Andamio', language) }
                      ].map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setStories(s.id as any)}
                          className={`py-2 px-1.5 rounded-xl border text-center transition ${
                            stories === s.id 
                              ? 'border-teal bg-teal/10 text-teal-800 font-bold text-xs shadow-xs' 
                              : 'border-slate-200 bg-white text-stone-gray hover:bg-slate-50 text-xs'
                          }`}
                        >
                          <span className="block font-bold text-[11px]">{s.label}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">{s.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Roof Design & Valleys */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-navy uppercase tracking-wider">{t('Design & Valleys', 'Diseño y Valles', language)}</span>
                      <span className="text-[10px] text-teal-700 font-mono font-bold">
                        {valleys === 'simple' ? t('Standard Labor', 'Mano de Obra Estándar', language) : valleys === 'moderate' ? t('+$15 / Sq Surcharge', '+$15 / Recargo por Cuadrado', language) : t('+$40 / Sq Surcharge', '+$40 / Recargo por Cuadrado', language)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'simple', label: t('Simple', 'Simple', language), desc: t('Gable (2 planes)', 'Gable (2 planos)', language) },
                        { id: 'moderate', label: t('Moderate', 'Moderado', language), desc: t('Hipped Roof', 'A Cuatro Aguas', language) },
                        { id: 'complex', label: t('Complex', 'Complejo', language), desc: t('Multi-Gables', 'Múltiples Aguas', language) }
                      ].map(v => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setValleys(v.id as any)}
                          className={`py-2 px-1.5 rounded-xl border text-center transition ${
                            valleys === v.id 
                              ? 'border-teal bg-teal/10 text-teal-800 font-bold text-xs shadow-xs' 
                              : 'border-slate-200 bg-white text-stone-gray hover:bg-slate-50 text-xs'
                          }`}
                        >
                          <span className="block font-bold text-[11px]">{v.label}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5 leading-none truncate">{v.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Old Roof Layers (Tear-off) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-navy uppercase tracking-wider">{t('Existing Roof Layers', 'Capas de Techo Existentes', language)}</span>
                      <span className="text-[10px] text-teal-700 font-mono font-bold">
                        {tearOffLayers === '1' ? t('Standard 1-Layer', '1 Capa Estándar', language) : tearOffLayers === '2' ? t('+$30 / Sq Surcharge', '+$30 / Recargo por Cuadrado', language) : t('+$60 / Sq Surcharge', '+$60 / Recargo por Cuadrado', language)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: '1', label: t('1 Layer', '1 Capa', language), desc: t('Standard Tear', 'Remoción Estándar', language) },
                        { id: '2', label: t('2 Layers', '2 Capas', language), desc: t('Heavy Haul', 'Remoción Pesada', language) },
                        { id: '3', label: t('3+ Layers', '3+ Capas', language), desc: t('Extreme Tear', 'Remoción Extrema', language) }
                      ].map(l => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => setTearOffLayers(l.id as any)}
                          className={`py-2 px-1.5 rounded-xl border text-center transition ${
                            tearOffLayers === l.id 
                              ? 'border-teal bg-teal/10 text-teal-800 font-bold text-xs shadow-xs' 
                              : 'border-slate-200 bg-white text-stone-gray hover:bg-slate-50 text-xs'
                          }`}
                        >
                          <span className="block font-bold text-[11px]">{l.label}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">{l.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Skylights & Chimneys */}
                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-navy uppercase tracking-wider">{t('Chimneys / Skylights (Flashings)', 'Chimeneas / Tragaluces (Tapajuntas)', language)}</span>
                      <span className="text-[10px] text-teal-700 font-mono font-bold">
                        {penetrations === 'none' ? t('Standard Labor', 'Mano de Obra Estándar', language) : penetrations === 'few' ? t('+$200 Flat Cost', '+$200 Costo Fijo', language) : t('+$450 Flat Cost', '+$450 Costo Fijo', language)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'none', label: t('None', 'Ninguno', language), desc: t('No complex flashings', 'Sin tapajuntas complejos', language) },
                        { id: 'few', label: t('1 - 2 Penetrations', '1 - 2 Penetraciones', language), desc: t('Minor hand flashing', 'Tapajuntas menor a mano', language) },
                        { id: 'many', label: t('3+ Or Skylights', '3+ o Tragaluces', language), desc: t('Heavy flash & seal', 'Fuerte sellado y tapajuntas', language) }
                      ].map(pn => (
                        <button
                          key={pn.id}
                          type="button"
                          onClick={() => setPenetrations(pn.id as any)}
                          className={`py-2 px-1.5 rounded-xl border text-center transition ${
                            penetrations === pn.id 
                              ? 'border-teal bg-teal/10 text-teal-800 font-bold text-xs shadow-xs' 
                              : 'border-slate-200 bg-white text-stone-gray hover:bg-slate-50 text-xs'
                          }`}
                        >
                          <span className="block font-bold text-[11px]">{pn.label}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5 leading-none truncate">{pn.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insurance' && (
              <div className="space-y-6 animate-fadeIn bg-slate-50/40 p-5 rounded-2xl border border-slate-150 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <label className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeDeductible}
                      onChange={(e) => setIncludeDeductible(e.target.checked)}
                      className="rounded border-slate-300 text-teal focus:ring-teal w-5 h-5 cursor-pointer accent-teal shrink-0"
                    />
                    {t('Verify Project Co-Funding Share', 'Verificar Co-financiamiento del Proyecto', language)}
                  </label>
                  <span className={`text-xs uppercase px-2.5 py-1 rounded-full font-mono font-bold ${includeDeductible ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-500'}`}>
                    {includeDeductible ? t('Included in Math', 'Incluido en el Cálculo', language) : t('Retail Project (Uncovered)', 'Proyecto Minorista (No Cubierto)', language)}
                  </span>
                </div>

                <div className={`space-y-4 transition-all duration-300 ${includeDeductible ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold text-stone-gray flex items-center gap-1">
                      {t('Your Deductible Contribution', 'Su Contribución de Deducible', language)}
                      <Lock className="w-3.5 h-3.5 text-amber" />
                    </span>
                    <span className={`text-xl font-bold font-mono ${includeDeductible ? 'text-amber' : 'text-slate-400'}`}>
                      ${includeDeductible ? deductible.toLocaleString() : '0'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="100"
                    value={deductible}
                    disabled={!includeDeductible}
                    onChange={(e) => setDeductible(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber"
                  />
                  <div className="bg-amber/5 border border-amber/10 p-4 rounded-xl text-xs text-stone-gray leading-relaxed space-y-2">
                    <p className="flex items-start gap-2">
                      <BadgeAlert className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                      <span>
                        <strong>{t('Michigan Insurance Code MCL § 500.2082:', 'Código de Seguros de Michigan MCL § 500.2082:', language)}</strong> {t('Homeowners are legally required to contribute their policy deductible to roofing claims. Paying, waiving, rebating, or absorbing deductibles by a contractor is illegal class-G insurance fraud.', 'Los propietarios están legalmente obligados a contribuir con el deducible de su póliza en los reclamos de techado. Que un contratista pague, exima, reembolse o absorba los deducibles es un fraude de seguros ilegal de clase G.', language)}
                      </span>
                    </p>
                    <p className="bg-white/60 p-2.5 rounded-lg border border-amber/10 text-[11px] text-amber-900 font-medium">
                      ⚖️ <strong>{t('Legal Disclaimer:', 'Aviso Legal:', language)}</strong> {t('RoofLocker is a project compliance and record-keeping tool. We are not public insurance adjusters, and we do not represent homeowners, assess damage, or negotiate claims with insurance carriers.', 'RoofLocker es una herramienta de cumplimiento y mantenimiento de registros de proyectos. No somos tasadores públicos de seguros y no representamos a propietarios, no evaluamos daños ni negociamos reclamaciones con compañías de seguros.', language)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Footer Controls */}
          <div className="flex justify-between items-center pt-5 border-t border-slate-100 mt-6">
            {activeTab !== 'size_materials' ? (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'complexity') setActiveTab('size_materials');
                  else if (activeTab === 'insurance') setActiveTab('complexity');
                }}
                className="px-5 py-2.5 text-xs font-bold text-stone-gray hover:text-navy border border-slate-200 hover:bg-slate-50 rounded-xl transition flex items-center gap-1.5"
              >
                {t('← Back', '← Atrás', language)}
              </button>
            ) : (
              <div />
            )}

            {activeTab !== 'insurance' ? (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'size_materials') setActiveTab('complexity');
                  else if (activeTab === 'complexity') setActiveTab('insurance');
                }}
                className="px-5 py-2.5 text-xs font-bold bg-teal text-white hover:bg-teal-600 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                {t('Next Step →', 'Siguiente Paso →', language)}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-teal/5 text-teal text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-teal/10 animate-pulse">
                <Lock className="w-3.5 h-3.5" /> {t('Fully Configured', 'Totalmente Configurado', language)}
              </div>
            )}
          </div>
        </div> {/* End lg:col-span-8 */}

        {/* Right Output calculations and milestones (4 Columns) */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col justify-between space-y-6 lg:sticky lg:top-6 self-start">
          
          {/* Calculations Summary */}
          <div>
            <h3 className="font-display font-bold text-navy text-sm uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
              {t('Simulated Financial Breakdown', 'Desglose Financiero Simulado', language)}
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-150/50">
                <span className="text-stone-gray">{t('Roofing Field Material & Labor', 'Materiales y Mano de Obra de Campo', language)} ({roofSize} Squares)</span>
                <span className="font-mono text-navy font-semibold text-sm">${baseCost.toLocaleString()}</span>
              </div>
              {complexityLaborSurcharge > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-150/50 text-amber-800 bg-amber-50/40 px-2 rounded-lg">
                  <span className="font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    {t('Labor Complexity Surcharges', 'Recargos por Complejidad de Mano de Obra', language)}
                  </span>
                  <span className="font-mono font-bold text-sm">+${complexityLaborSurcharge.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-150/50">
                <span className="text-stone-gray">{t('Accessories, Ridge Caps & Underlayment', 'Accesorios, Caballetes y Contrapiso', language)}</span>
                <span className="font-mono text-navy font-semibold text-sm">${underlaymentFlashings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-150/50">
                <span className="text-stone-gray">{t('Michigan Building Code Permit Fees', 'Tarifas de Permisos del Código de MI', language)}</span>
                <span className="font-mono text-navy font-semibold text-sm">${permitsFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-extrabold text-navy">
                <span>{t('Estimated Complete Project Value', 'Valor Estimado del Proyecto Completo', language)}</span>
                <span className="font-mono text-teal">${totalProjectCost.toLocaleString()}</span>
              </div>

              {includeDeductible && (
                <div className="mt-3 pt-3 border-t border-dashed border-slate-200 space-y-1.5 bg-slate-100/50 p-2.5 rounded-xl">
                  <div className="flex justify-between text-xs text-stone-gray">
                    <span>{t('Your Deductible Responsibility:', 'Su Responsabilidad de Deducible:', language)}</span>
                    <span className="font-mono font-bold text-amber-700">${deductible.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verified Project Milestones */}
          <div className="space-y-3.5">
            <h4 className="font-display font-bold text-navy text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal" />
              {t('Verified Project Milestones', 'Hitos de Proyecto Verificados', language)}
            </h4>

            <div className="space-y-2 text-sm">
              {/* Milestone 1 */}
              <div className="bg-white p-3 border border-slate-100 rounded-xl flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal text-white font-bold flex items-center justify-center font-mono shrink-0 text-xs">1</div>
                  <div>
                    <strong className="block text-navy font-semibold text-sm">{t('Driveway Material Delivery', 'Entrega de Materiales en Entrada', language)}</strong>
                    <span className="text-stone-gray text-xs">{t('Verified when shingles are delivered and photo-scanned on-site', 'Verificado cuando las tejas se entregan y escanean en el lugar', language)}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold bg-teal/10 text-teal px-2 py-0.5 rounded shrink-0">{t('Phase 1', 'Fase 1', language)}</span>
              </div>

              {/* Milestone 2 */}
              <div className="bg-white p-3 border border-slate-100 rounded-xl flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center font-mono shrink-0 text-xs">2</div>
                  <div>
                    <strong className="block text-navy font-semibold text-sm">{t('Tear-Off & Deck Inspection', 'Remoción e Inspección de Cubierta', language)}</strong>
                    <span className="text-stone-gray text-xs">{t('Verified upon bare decking photo audit and structural check', 'Verificado tras auditoría de cubierta expuesta y control estructural', language)}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded shrink-0">{t('Phase 2', 'Fase 2', language)}</span>
              </div>

              {/* Milestone 3 */}
              <div className="bg-white p-3 border border-slate-100 rounded-xl flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber text-white font-bold flex items-center justify-center font-mono shrink-0 text-xs">3</div>
                  <div>
                    <strong className="block text-navy font-semibold text-sm">{t('Final Completion & Clean-Up', 'Finalización Completa y Limpieza', language)}</strong>
                    <span className="text-stone-gray text-xs">{t('Verified via homeowner sign-off and magnetic nails sweep audit', 'Verificado con firma del propietario y barrido magnético de clavos', language)}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold bg-amber/10 text-amber-600 px-2 py-0.5 rounded shrink-0">{t('Phase 3', 'Fase 3', language)}</span>
              </div>
            </div>

            <p className="text-xs text-stone-gray leading-relaxed text-center italic">
              {t('*Milestones are tracked sequentially. Contractors submit verified photographic proof of work for each phase.', '*Los hitos se rastrean de forma secuencial. Los contratistas envían pruebas fotográficas para cada fase.', language)}
            </p>
          </div>

        </div>
      </section>

      {/* 3. GENERAL ROOFING PROTECTION SCOPE */}
      <section className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-gradient-to-tr from-deep-slate to-transparent opacity-80 pointer-events-none" />
        
        {/* Left Intro (5 Columns) */}
        <div className="lg:col-span-5 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1 bg-amber/15 text-amber px-3 py-1 rounded-full text-sm font-mono font-bold">
            <FileCheck className="w-3.5 h-3.5" />
            {t('Roofing Protection Scope', 'Alcance de Protección de Techado', language)}
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight leading-tight">
            {t('Verify & Protect Your Roofing Investment', 'Verifique y Proteja su Inversión en Techado', language)}
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {t("Roofing projects are high-stakes, expensive, and filled with complex fine print. Click the protection cards to see how RoofLocker's safety framework shields your project, materials, and funds from start to finish.", 'Los proyectos de techado son costosos, de alto riesgo y con mucha letra pequeña compleja. Haga clic en las tarjetas de protección para ver cómo el marco de seguridad de RoofLocker protege su proyecto, materiales y fondos de principio a fin.', language)}
          </p>
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => onNavigate('protection-suite')}
              className="px-4 py-2 bg-amber hover:bg-amber/90 text-navy text-sm font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              {t('Launch Shield Suite', 'Iniciar Panel de Protección', language)}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Interactive Radar Deck (7 Columns) */}
        <div className="lg:col-span-7 space-y-3 relative z-10">
          
          {/* Scope 1: Hidden Cost Escalation */}
          <div 
            onClick={() => setExpandedSection('lara')}
            className={`p-4 rounded-xl border transition cursor-pointer text-left ${
              expandedSection === 'lara'
                ? 'border-amber bg-deep-slate/80 text-white shadow-lg'
                : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  expandedSection === 'lara' ? 'bg-amber/20 text-amber' : 'bg-slate-800 text-slate-500'
                }`}>
                  {t('Scope 01', 'Alcance 01', language)}
                </span>
                <h3 className="font-display font-bold text-sm md:text-base">
                  {t('Hidden Cost Escalation Protection', 'Protección contra Aumento de Costos Ocultos', language)}
                </h3>
              </div>
              <ChevronRight className={`w-4 h-4 transition ${expandedSection === 'lara' ? 'rotate-90 text-amber' : ''}`} />
            </div>
            {expandedSection === 'lara' && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5 text-xs md:text-sm">
                <p className="text-slate-300">
                  <span className="text-amber font-semibold uppercase font-mono tracking-wider text-[11px] block mb-1">{t('📋 Project Scenario:', '📋 Escenario del Proyecto:', language)}</span>
                  {t('"We found extra rotted wood-decking during tear-off and must charge $2,500 more to proceed with shingles."', '"Encontramos madera de cubierta podrida adicional durante la remoción y debemos cobrar $2,500 más para proceder con las tejas."', language)}
                </p>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                  <strong>{t('The Challenge:', 'El Desafío:', language)}</strong> {t('Roof decking issues (like rotted wood) are often unseen until old shingles are removed. Unforeseen structural repairs can add unexpected costs and timing delays to a project once work has begun.', 'Los problemas con la cubierta del techo (como la madera podrida) a menudo no se ven hasta que se retiran las tejas viejas. Las reparaciones estructurales imprevistas pueden agregar costos inesperados y retrasar los tiempos del proyecto una vez comenzada la obra.', language)}
                </div>
                <div className="p-2.5 rounded bg-teal/10 border border-teal/20 text-teal-300 text-xs flex items-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-teal" />
                  <span>
                    <strong>{t('RoofLocker Defense:', 'Defensa de RoofLocker:', language)}</strong> {t('Required photographic or video evidence of the damage must be logged on-platform before any change order is approved. Change orders are frozen and monitored directly within your dashboard.', 'Se requiere registrar en la plataforma evidencia fotográfica o de video del daño antes de que se apruebe cualquier orden de cambio. Las órdenes de cambio se congelan y monitorean directamente en su panel de control.', language)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Scope 2: Milestone Progress Tracking */}
          <div 
            onClick={() => setExpandedSection('deductible')}
            className={`p-4 rounded-xl border transition cursor-pointer text-left ${
              expandedSection === 'deductible'
                ? 'border-amber bg-deep-slate/80 text-white shadow-lg'
                : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  expandedSection === 'deductible' ? 'bg-amber/20 text-amber' : 'bg-slate-800 text-slate-500'
                }`}>
                  {t('Scope 02', 'Alcance 02', language)}
                </span>
                <h3 className="font-display font-bold text-sm md:text-base">
                  {t('Milestone Progress Tracking', 'Seguimiento de Progreso por Hitos', language)}
                </h3>
              </div>
              <ChevronRight className={`w-4 h-4 transition ${expandedSection === 'deductible' ? 'rotate-90 text-amber' : ''}`} />
            </div>
            {expandedSection === 'deductible' && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5 text-xs md:text-sm">
                <p className="text-slate-300">
                  <span className="text-amber font-semibold uppercase font-mono tracking-wider text-[11px] block mb-1">{t('📋 Deposit Practice:', '📋 Práctica de Depósito:', language)}</span>
                  {t('"We require a 50% upfront cash deposit to secure the crew and order specialized shingles."', '"Requerimos un depósito en efectivo por adelantado del 50% para asegurar la cuadrilla y ordenar las tejas especializadas."', language)}
                </p>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                  <strong>{t('The Challenge:', 'El Desafío:', language)}</strong> {t('Committing large upfront deposits before work starts can create project scheduling risks or material delivery delays if not clearly tracked and documented.', 'Comprometer grandes depósitos antes de comenzar la obra puede generar riesgos de programación o retrasos en la entrega de materiales si no se realiza un seguimiento claro y documentado.', language)}
                </div>
                <div className="p-2.5 rounded bg-teal/10 border border-teal/20 text-teal-300 text-xs flex items-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-teal" />
                  <span>
                    <strong>{t('RoofLocker Defense:', 'Defensa de RoofLocker:', language)}</strong> {t('We provide milestone checks. Progress reports and sign-offs are submitted only as verified milestones are achieved (such as shingles on driveway).', 'Proporcionamos controles de hitos. Los informes de progreso y las aprobaciones se envían solo a medida que se alcanzan los hitos verificados (como tejas en la entrada de su casa).', language)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Scope 3: Material Quality */}
          <div 
            onClick={() => setExpandedSection('materials')}
            className={`p-4 rounded-xl border transition cursor-pointer text-left ${
              expandedSection === 'materials'
                ? 'border-amber bg-deep-slate/80 text-white shadow-lg'
                : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  expandedSection === 'materials' ? 'bg-amber/20 text-amber' : 'bg-slate-800 text-slate-500'
                }`}>
                  {t('Scope 03', 'Alcance 03', language)}
                </span>
                <h3 className="font-display font-bold text-sm md:text-base">
                  {t('Material Verification & Warranty Guard', 'Verificación de Materiales y Protección de Garantía', language)}
                </h3>
              </div>
              <ChevronRight className={`w-4 h-4 transition ${expandedSection === 'materials' ? 'rotate-90 text-amber' : ''}`} />
            </div>
            {expandedSection === 'materials' && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5 text-xs md:text-sm">
                <p className="text-slate-300">
                  <span className="text-amber font-semibold uppercase font-mono tracking-wider text-[11px] block mb-1">{t('📋 Product Specification:', '📋 Especificación del Producto:', language)}</span>
                  {t('"We will install high-grade underlayment and top-tier architectural shingles on your roof."', '"Instalaremos contrapiso de alta calidad y tejas arquitectónicas de primer nivel en su techo."', language)}
                </p>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                  <strong>{t('The Challenge:', 'El Desafío:', language)}</strong> {t('Vague verbal agreements can lead to unintentional product substitutions, resulting in off-brand materials that compromise roof durability or accidentally void your manufacturer warranty.', 'Los acuerdos verbales imprecisos pueden provocar sustituciones involuntarias de productos, dando como resultado materiales inferiores que comprometen la durabilidad del techo o anulan accidentalmente su garantía.', language)}
                </div>
                <div className="p-2.5 rounded bg-teal/10 border border-teal/20 text-teal-300 text-xs flex items-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-teal" />
                  <span>
                    <strong>{t('RoofLocker Defense:', 'Defensa de RoofLocker:', language)}</strong> {t('Material specs are frozen in the contract profile. Contractors must upload barcode photos of actual product wrappers upon delivery to authorize material sign-offs.', 'Las especificaciones del material quedan congeladas en el perfil del contrato. Los contratistas deben subir fotos del código de barras de los envoltorios reales del producto al momento de la entrega para autorizar las firmas de materiales.', language)}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Legal Waiver Disclaimer */}
        <div className="lg:col-span-12 mt-4 pt-4 border-t border-slate-800/80 text-slate-400 text-[11px] leading-relaxed flex items-start gap-2 relative z-10">
          <Info className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
          <p>
            <strong>{t('* Legal Disclaimer:', '* Aviso Legal:', language)}</strong> {t('RoofLocker is an administrative software-as-a-service (SaaS) platform designed for record retention, file hosting, and secure state-law-compliant project record management. RoofLocker is not a licensed law firm, a public adjusting firm, or an insurance advocacy service. We do not provide legal advice, policy coverage arguments, or formal claims settlement representation. Any automated insights, contract analyses (including red-flag clause flags), or template scopes are for educational, guidance, and informational purposes only. Homeowners are advised to consult with a qualified attorney or licensed public adjuster regarding specific local contract disputes or formal insurance carrier negotiations.', 'RoofLocker es una plataforma de software como servicio (SaaS) administrativa diseñada para la retención de registros, alojamiento de archivos y gestión de registros de proyectos segura y conforme a las leyes estatales. RoofLocker no es un bufete de abogados autorizado, una firma de tasación pública ni un servicio de representación de seguros. No brindamos asesoramiento legal, argumentos de cobertura de póliza ni representación formal para la resolución de reclamaciones. Cualquier información automatizada, análisis de contratos (incluidas las cláusulas de alerta) o alcances de plantillas son solo para fines educativos, de orientación e informativos. Se aconseja a los propietarios consultar con un abogado calificado o un tasador público autorizado en relación con disputas de contratos locales específicas o negociaciones formales con compañías de seguros.', language)}
          </p>
        </div>
      </section>

      {/* 4. THREE SYSTEM ENTRY PATHS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" id="three-entry-paths">
        
        {/* Path A: Homeowner suite */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-teal">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-navy text-lg">
              {t('Homeowner Protective Suite', 'Panel de Protección del Propietario', language)}
            </h3>
            <p className="text-stone-gray text-sm leading-relaxed">
              {t('Create a project workspace, use the dynamic satellite roof canvas, scan door-knocker contracts for predatory clauses, and verify your insurance deductible.', 'Cree un espacio de trabajo del proyecto, use el lienzo satelital dinámico de techos, analice contratos de puerta en puerta en busca de cláusulas abusivas y verifique su deducible de seguro.', language)}
            </p>
          </div>
          <button
            onClick={() => onNavigate('protection-suite')}
            id="homepage-cta-homeowner"
            className="mt-6 w-full py-2.5 bg-navy hover:bg-navy/95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            {t('Launch Homeowner Suite', 'Iniciar Panel del Propietario', language)}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Path B: Vetted directory */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-teal">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-navy text-lg">
              {t('Vetted Roofer Directory', 'Directorio de Techadores Evaluados', language)}
            </h3>
            <p className="text-stone-gray text-sm leading-relaxed">
              {t('Browse pre-screened Michigan roofing contractors. Audit their website age, BBB ratings, civil court histories, and official state residential builder licenses.', 'Explore contratistas de techado preseleccionados de Michigan. Audite la antigüedad de su sitio web, calificaciones de BBB, historial en tribunales civiles y licencias oficiales de construcción residencial del estado.', language)}
            </p>
          </div>
          <button
            onClick={() => onNavigate('directory')}
            id="homepage-cta-directory"
            className="mt-6 w-full py-2.5 bg-navy hover:bg-navy/95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            {t('Explore Roofer Directory', 'Explorar Directorio de Techadores', language)}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Path C: Contractor portal */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-teal">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-navy text-lg">
              {t('Vetted Contractor Portal', 'Portal de Contratistas Evaluados', language)}
            </h3>
            <p className="text-stone-gray text-sm leading-relaxed">
              {t('For licensed builders. Review incoming project scopes, access code checklists, generate transparent compliance contracts, and coordinate secure projects.', 'Para constructores autorizados. Revise alcances de proyectos entrantes, acceda a listas de verificación de códigos, genere contratos transparentes de cumplimiento y coordine proyectos seguros.', language)}
            </p>
          </div>
          <button
            onClick={() => onNavigate('portal')}
            id="homepage-cta-contractor"
            className="mt-6 w-full py-2.5 bg-navy hover:bg-navy/95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            {t('Enter Contractor Portal', 'Ingresar al Portal de Contratistas', language)}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

      {/* Shingle Specs Modal Popup */}
      {selectedDetailId && (() => {
        const detail = shingleDetails[selectedDetailId];
        const translatedDetail = {
          name: t(detail.name, selectedDetailId === '3-tab' ? '3-Tab Tradicional' : selectedDetailId === 'architectural' ? 'GAF Timberline® HDZ' : selectedDetailId === 'duration' ? 'OC Duration®' : selectedDetailId === 'luxury' ? 'CertainTeed Grand®' : selectedDetailId === 'metal' ? 'Junta Alzada' : 'DaVinci® Composite', language),
          description: t(detail.description, selectedDetailId === '3-tab' ? 'Teja de asfalto tradicional con diseño plano de tres pestañas. Ofrece una protección básica contra la intemperie a un costo mínimo.' : selectedDetailId === 'architectural' ? 'Tejas laminadas de doble capa con relieve dimensional profundo. El estándar más popular de la industria para durabilidad estética y resistencia al viento.' : selectedDetailId === 'duration' ? 'Tejas premium Owens Corning con tecnología patentada SureNail® que proporciona una resistencia excepcional al viento y agarre triple.' : selectedDetailId === 'luxury' ? 'Tejas de diseño que imitan el aspecto rústico y elegante de la madera o la pizarra natural, con máxima durabilidad.' : selectedDetailId === 'metal' ? 'Techo metálico arquitectónico de junta alzada de larga duración. Ofrece una resistencia extrema y eficiencia energética.' : 'Tejas sintéticas compuestas ecológicas de alta calidad con el aspecto exacto de la pizarra natural sin el peso ni la fragilidad.', language),
          lifespan: t(detail.lifespan, selectedDetailId === '3-tab' ? '20 - 25 Años' : selectedDetailId === 'architectural' ? '25 - 30 Años' : selectedDetailId === 'duration' ? '30 - 40 Años' : selectedDetailId === 'luxury' ? '40 - 50 Años' : selectedDetailId === 'metal' ? '50+ Años (De por vida)' : '50+ Años', language),
          windRating: t(detail.windRating, selectedDetailId === '3-tab' ? '60 mph' : selectedDetailId === 'architectural' ? '110 - 130 mph' : selectedDetailId === 'duration' ? '130 mph' : selectedDetailId === 'luxury' ? '110 - 130 mph' : selectedDetailId === 'metal' ? '140+ mph' : '110 - 130 mph', language),
          brandExample: t(detail.brandExample, selectedDetailId === '3-tab' ? 'GAF Royal Sovereign / CertainTeed XT25' : selectedDetailId === 'architectural' ? 'GAF Timberline HDZ / Owens Corning Oakridge' : selectedDetailId === 'duration' ? 'Owens Corning Duration Series' : selectedDetailId === 'luxury' ? 'CertainTeed Grand Manor / GAF Camelot II' : selectedDetailId === 'metal' ? 'Standing Seam de Acero Galvanizado calibre 24' : 'DaVinci Multi-Width Slate / Bellaforté', language),
          warranty: t(detail.warranty, selectedDetailId === '3-tab' ? 'Garantía Limitada de 25 Años' : selectedDetailId === 'architectural' ? 'Garantía Limitada de por Vida' : selectedDetailId === 'duration' ? 'Garantía Limitada de por Vida Owens Corning' : selectedDetailId === 'luxury' ? 'Garantía de por Vida de Fabricante de Lujo' : selectedDetailId === 'metal' ? 'Garantía de por Vida de Materiales y Mano de Obra' : 'Garantía Limitada de por Vida DaVinci', language),
          idealFor: t(detail.idealFor, selectedDetailId === '3-tab' ? 'Propietarios con presupuesto limitado o propiedades de alquiler.' : selectedDetailId === 'architectural' ? 'Cualquier hogar residencial estándar que busque la mejor relación calidad-precio.' : selectedDetailId === 'duration' ? 'Casas expuestas a fuertes vientos o tormentas frecuentes.' : selectedDetailId === 'luxury' ? 'Residencias de alta gama con pendientes pronunciadas y estilos arquitectónicos tradicionales.' : selectedDetailId === 'metal' ? 'Hogares modernos, climas con fuertes nevadas y propietarios que buscan una solución permanente.' : 'Hogares históricos o de lujo que desean la estética de la pizarra natural sin el costo estructural.', language),
          pros: detail.pros.map((p, idx) => {
            if (language === 'es') {
              if (selectedDetailId === '3-tab') {
                return ['Muy económico', 'Fácil de reparar', 'Lanza el agua rápido'][idx] || p;
              } else if (selectedDetailId === 'architectural') {
                return ['Excelente relación calidad-precio', 'Mayor grosor y resistencia', 'Hermosa textura visual'][idx] || p;
              } else if (selectedDetailId === 'duration') {
                return ['Tecnología patentada de agarre SureNail®', 'Altísima resistencia al viento', 'Garantía de por vida superior'][idx] || p;
              } else if (selectedDetailId === 'luxury') {
                return ['Estética impresionante de pizarra', 'Máxima durabilidad y peso', 'Gran resistencia al impacto'][idx] || p;
              } else if (selectedDetailId === 'metal') {
                return ['Durabilidad prácticamente ilimitada', 'Gran eficiencia térmica', 'Mínimo mantenimiento necesario'][idx] || p;
              } else {
                return ['Apariencia exacta de pizarra', 'Bajo peso y alta resistencia', 'Garantía de por vida premium'][idx] || p;
              }
            }
            return p;
          }),
          cons: detail.cons.map((c, idx) => {
            if (language === 'es') {
              if (selectedDetailId === '3-tab') {
                return ['Menor resistencia al viento', 'Vida útil más corta', 'Aspecto plano básico'][idx] || c;
              } else if (selectedDetailId === 'architectural') {
                return ['Costo moderadamente mayor', 'Requiere instalación experta'][idx] || c;
              } else if (selectedDetailId === 'duration') {
                return ['Ligeramente más caras que las arquitectónicas estándar', 'Sujeto a disponibilidad local'][idx] || c;
              } else if (selectedDetailId === 'luxury') {
                return ['Costo de material elevado', 'Mayor peso estructural sobre el techo'][idx] || c;
              } else if (selectedDetailId === 'metal') {
                return ['Costo inicial muy elevado', 'Puede ser ruidoso bajo lluvia fuerte si falta aislamiento'][idx] || c;
              } else {
                return ['Inversión inicial muy alta', 'Instalación altamente especializada'][idx] || c;
              }
            }
            return c;
          })
        };

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fadeIn"
            onClick={() => setSelectedDetailId(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-scaleUp max-h-[90vh] flex flex-col text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal tracking-wider bg-teal/10 px-2 py-0.5 rounded font-mono">
                    {t('Product Specification Sheet', 'Ficha de Especificaciones del Producto', language)}
                  </span>
                  <h3 className="font-display font-extrabold text-navy text-lg mt-1">
                    {translatedDetail.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDetailId(null)}
                  className="p-1.5 rounded-full text-stone-gray hover:text-navy hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content (Scrollable) */}
              <div className="p-6 overflow-y-auto space-y-5 text-sm leading-relaxed">
                <p className="text-stone-gray text-xs md:text-sm">
                  {translatedDetail.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-xs">
                  <div>
                    <span className="text-stone-gray block font-sans text-[10px] font-bold uppercase tracking-wider mb-0.5">{t('Lifespan', 'Vida Útil', language)}</span>
                    <span className="text-navy font-bold text-xs">{translatedDetail.lifespan}</span>
                  </div>
                  <div>
                    <span className="text-stone-gray block font-sans text-[10px] font-bold uppercase tracking-wider mb-0.5">{t('Wind Rating', 'Resistencia al Viento', language)}</span>
                    <span className="text-navy font-bold text-xs">{translatedDetail.windRating}</span>
                  </div>
                  <div className="col-span-2 border-t border-slate-200/60 pt-2 mt-1">
                    <span className="text-stone-gray block font-sans text-[10px] font-bold uppercase tracking-wider mb-0.5">{t('Example Brands & Line', 'Ejemplo de Marcas y Líneas', language)}</span>
                    <span className="text-navy font-bold text-xs">{translatedDetail.brandExample}</span>
                  </div>
                  <div className="col-span-2 border-t border-slate-200/60 pt-2 mt-1">
                    <span className="text-stone-gray block font-sans text-[10px] font-bold uppercase tracking-wider mb-0.5">{t('Warranty Term', 'Plazo de Garantía', language)}</span>
                    <span className="text-navy font-bold text-xs">{translatedDetail.warranty}</span>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Pros */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-teal uppercase tracking-wider block">{t('Key Advantages', 'Ventajas Clave', language)}</span>
                    <ul className="space-y-1.5 text-xs">
                      {translatedDetail.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-stone-gray">
                          <CheckCircle className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-amber uppercase tracking-wider block">{t('Considerations', 'Consideraciones', language)}</span>
                    <ul className="space-y-1.5 text-xs">
                      {translatedDetail.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-stone-gray">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber shrink-0 mt-2" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ideal For */}
                <div className="bg-teal/5 border border-teal/10 rounded-xl p-3.5 text-xs text-navy flex gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[11px] uppercase tracking-wider text-teal-800">{t('Ideal For', 'Ideal Para', language)}</strong>
                    <p className="text-stone-gray mt-0.5">{translatedDetail.idealFor}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDetailId(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-stone-gray hover:text-navy font-bold text-xs rounded-lg transition"
                >
                  {t('Close', 'Cerrar', language)}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShingleType(selectedDetailId!);
                    setSelectedDetailId(null);
                  }}
                  className="px-4 py-2 bg-teal hover:bg-teal/90 text-white font-bold text-xs rounded-lg transition shadow-xs"
                >
                  {t('Select This Standard', 'Seleccionar Este Estándar', language)}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
