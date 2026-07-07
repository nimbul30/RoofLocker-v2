import React, { useState } from 'react';
import { Contractor, DamagePin } from './types';
import { MOCK_CONTRACTORS, MOCK_INITIAL_PINS } from './mockData';
import ExplainerVideo from './components/ExplainerVideo';
import DamageCanvas from './components/DamageCanvas';
import ContractorDirectory from './components/ContractorDirectory';
import RedFlagScanner from './components/RedFlagScanner';
import CommunicationHub from './components/CommunicationHub';
import ProjectDisputeCenter from './components/ProjectDisputeCenter';
import Homepage from './components/Homepage';
import ContractorPortal from './components/ContractorPortal';
import BrandLogo from './components/BrandLogo';
import LoginPage from './components/LoginPage';
import HowItWorks from './components/HowItWorks';
import Guides from './components/Guides';
import AboutUs from './components/AboutUs';
import { t } from './translations';
import { 
  ShieldCheck, 
  User, 
  Briefcase, 
  Settings, 
  MapPin, 
  FileSearch, 
  MessageSquare, 
  Scale, 
  CheckCircle, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  HelpCircle,
  AlertTriangle,
  Info,
  Home,
  Lock,
  Search,
  Hammer,
  BookOpen,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'directory' | 'portal' | 'protection-suite' | 'admin' | 'login' | 'how-it-works' | 'guides' | 'about'>('home');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [hasUnlockedPortal, setHasUnlockedPortal] = useState(false);
  const [activeTab, setActiveTab] = useState<'canvas' | 'chat' | 'scanner' | 'disputes'>('canvas');
  const [loginInitialRole, setLoginInitialRole] = useState<'home' | 'portal' | 'admin'>('home');
  const [loginInitialIsSignUp, setLoginInitialIsSignUp] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dynamic State for interactive parts
  const [selectedContractor, setSelectedContractor] = useState<Contractor>(MOCK_CONTRACTORS[0]);
  const [pins, setPins] = useState<DamagePin[]>(MOCK_INITIAL_PINS);

  // Simulation parameters
  const [adminLogs, setAdminLogs] = useState<string[]>([
    'System: CRAWLED Michigan LARA dockets - 0 alerts found for Apex Elite.',
    'Privacy Guard: Scanned 12 incoming message packets. No email leaks found.',
    'Security: Auto-verified statutory $1,000 deductible compliance.'
  ]);

  const handleSelectContractor = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setCurrentView('protection-suite');
    setActiveTab('chat'); // Auto jump to secure chat when connected
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" id="app-viewport">
      
      {/* BRAND NAVIGATION HEADER */}
      <header className="bg-navy border-b border-deep-slate text-white shrink-0 shadow-md">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          
          <div className="flex items-center justify-between w-full lg:w-auto">
            {/* Logo Brand Lockup */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}>
              <BrandLogo size={95} onDark={true} />
            </div>

            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-mist hover:text-white hover:bg-white/5 rounded-lg transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Interactive Navigation Hub */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden lg:flex'} flex-col lg:flex-row lg:items-center gap-3 lg:gap-2 w-full lg:w-auto pt-4 lg:pt-0 border-t border-slate-800 lg:border-t-0`}>
            {(currentView !== 'home' || isMobileMenuOpen) && (
              <button
                onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
                id="nav-home-btn"
                className={`px-3 py-2 lg:py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-1.5 w-full lg:w-auto ${
                  currentView === 'home'
                    ? 'text-[#DC9A2C] bg-[#DC9A2C]/10 shadow-sm font-extrabold'
                    : 'text-mist hover:text-[#DC9A2C] hover:bg-white/5'
                }`}
              >
                <Home className="w-4 h-4" />
                {t('Home', 'Inicio', language)}
              </button>
            )}
            <button
              onClick={() => { setCurrentView('directory'); setIsMobileMenuOpen(false); }}
              id="nav-directory-btn"
              className={`px-3 py-2 lg:py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-1.5 w-full lg:w-auto ${
                currentView === 'directory'
                  ? 'text-[#DC9A2C] bg-[#DC9A2C]/10 shadow-sm font-extrabold'
                  : 'text-mist hover:text-[#DC9A2C] hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4" />
              {t('Vetted Directory', 'Directorio Verificado', language)}
            </button>
            
            <button
              onClick={() => { setCurrentView('how-it-works'); setIsMobileMenuOpen(false); }}
              id="nav-how-it-works-btn"
              className={`px-3 py-2 lg:py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-1.5 w-full lg:w-auto ${
                currentView === 'how-it-works'
                  ? 'text-[#DC9A2C] bg-[#DC9A2C]/10 shadow-sm font-extrabold'
                  : 'text-mist hover:text-[#DC9A2C] hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              {t('How This Works', 'Cómo Funciona', language)}
            </button>

            <button
              onClick={() => { setCurrentView('guides'); setIsMobileMenuOpen(false); }}
              id="nav-guides-btn"
              className={`px-3 py-2 lg:py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-1.5 w-full lg:w-auto ${
                currentView === 'guides'
                  ? 'text-[#DC9A2C] bg-[#DC9A2C]/10 shadow-sm font-extrabold'
                  : 'text-mist hover:text-[#DC9A2C] hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t('Guides', 'Guías', language)}
            </button>

            <button
              onClick={() => { setCurrentView('about'); setIsMobileMenuOpen(false); }}
              id="nav-about-btn"
              className={`px-3 py-2 lg:py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-1.5 w-full lg:w-auto ${
                currentView === 'about'
                  ? 'text-[#DC9A2C] bg-[#DC9A2C]/10 shadow-sm font-extrabold'
                  : 'text-mist hover:text-[#DC9A2C] hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4" />
              {t('About Us', 'Sobre Nosotros', language)}
            </button>

            {/* Language Selector Next to Login */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-2 pt-3 lg:pt-0 border-t border-slate-800 lg:border-t-0 mt-2 lg:mt-0 w-full lg:w-auto">
              <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1.5 lg:py-1 rounded-lg border border-white/20 text-xs font-bold w-fit" id="lang-toggle-container">
                <button
                  onClick={() => setLanguage('en')}
                  id="lang-btn-en"
                  className={`px-2 py-0.5 rounded-md transition ${language === 'en' ? 'bg-[#DC9A2C] text-navy shadow-sm' : 'text-mist hover:text-white'}`}
                  title="Switch to English"
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('es')}
                  id="lang-btn-es"
                  className={`px-2 py-0.5 rounded-md transition ${language === 'es' ? 'bg-[#DC9A2C] text-navy shadow-sm' : 'text-mist hover:text-white'}`}
                  title="Cambiar a Español"
                >
                  ES
                </button>
              </div>

              {currentView !== 'login' && (
                <button
                  onClick={() => {
                    setLoginInitialRole('home');
                    setLoginInitialIsSignUp(false);
                    setCurrentView('login');
                    setIsMobileMenuOpen(false);
                  }}
                  id="nav-admin-btn"
                  className="px-3 py-2 lg:py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-1.5 text-amber hover:text-[#DC9A2C] hover:bg-[#DC9A2C]/10 w-full lg:w-auto justify-start"
                >
                  <User className="w-4 h-4" />
                  {t('Login', 'Iniciar sesión', language)}
                </button>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* MAIN CONTAINER WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {/* VIEW 0: MOCK LOGIN GATEWAY */}
        {currentView === 'login' && (
          <LoginPage 
            onLogin={(role) => {
              if (role === 'home') {
                setCurrentView('protection-suite');
              } else {
                setCurrentView(role);
              }
            }} 
            language={language} 
            initialRole={loginInitialRole}
            initialIsSignUp={loginInitialIsSignUp}
          />
        )}
        
        {/* VIEW 1: HOMEPAGE */}
        {currentView === 'home' && (
          <Homepage 
            onNavigate={(view) => {
              if (view === 'login') {
                setLoginInitialRole('home');
                setLoginInitialIsSignUp(false);
              }
              setCurrentView(view);
            }} 
            hasUnlockedPortal={hasUnlockedPortal} 
            language={language}
          />
        )}

        {/* NEW VIEW: HOW THIS WORKS */}
        {currentView === 'how-it-works' && (
          <HowItWorks onNavigate={(view) => setCurrentView(view)} language={language} />
        )}

        {/* NEW VIEW: DEFENSE GUIDES */}
        {currentView === 'guides' && (
          <Guides language={language} />
        )}

        {/* NEW VIEW: ABOUT US */}
        {currentView === 'about' && (
          <AboutUs language={language} />
        )}

        {/* VIEW 2: VETTED ROOFER DIRECTORY */}
        {currentView === 'directory' && (
          <ContractorDirectory
            onSelectContractor={handleSelectContractor}
            selectedContractorId={selectedContractor.id}
            language={language}
          />
        )}

        {/* VIEW 3: CONTRACTOR PORTAL */}
        {currentView === 'portal' && (
          <ContractorPortal />
        )}

        {/* VIEW 4: SYSTEM GUARDIAN (ADMIN) VIEW */}
        {currentView === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn" id="admin-guardian-screen">
            {/* Left Column (8 columns): Compliance Queues */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <h2 className="font-display font-bold text-navy text-xl mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-teal" />
                  Platform Security Guardian Queue
                </h2>

                <div className="space-y-3">
                  <div className="p-4 border rounded-xl bg-red-50/30 border-red-100 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-mono bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">CRITICAL BYPASS FLAG</span>
                      <strong className="text-xs text-navy block">Contractor: Spartan Roofing Inc.</strong>
                      <p className="text-stone-gray text-[11px] leading-relaxed">
                        System caught phone number string pattern in chat sequence: 'Call me at 586-555-0123 to negotiate deductible'.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-red-500 font-bold">BLOCKED / UNDER REVIEW</span>
                  </div>

                  <div className="p-4 border rounded-xl bg-slate-50 border-slate-100 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-mono bg-teal/15 text-teal px-1.5 py-0.5 rounded font-bold">LARA EXPIRY CHECK</span>
                      <strong className="text-xs text-navy block">Apex Elite Roofing License Renewal</strong>
                      <p className="text-stone-gray text-[11px] leading-relaxed">
                        Verified active Residential Builder license with Michigan State registers. Clean civil litigation history.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-teal font-bold">VERIFIED CLEAN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 columns): System Logs */}
            <div className="lg:col-span-4 bg-navy border border-deep-slate rounded-2xl p-5 md:p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber" />
                <h3 className="font-display font-bold text-white text-lg">System Audit Feed</h3>
              </div>

              <div className="space-y-3 font-mono text-[10px] text-slate-400">
                {adminLogs.map((log, idx) => (
                  <div key={idx} className="p-2 bg-deep-slate rounded border border-slate-800">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: HOMEOWNER PROTECTION SUITE */}
        {currentView === 'protection-suite' && (
          <div>
            {!hasUnlockedPortal ? (
              /* ONBOARDING FLOW GATE */
              <div className="py-6 animate-fadeIn">
                <ExplainerVideo onComplete={() => setHasUnlockedPortal(true)} />
              </div>
            ) : (
              /* SECURED PORTAL APPLICATION */
              <div className="space-y-6">
                
                {/* Consumer Protection Notice Banner */}
                <div className="bg-gradient-to-r from-navy to-deep-slate p-5 rounded-2xl border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
                      <Lock className="w-8 h-8 text-navy" />
                    </div>
                    <div>
                      <strong className="text-[17px] sm:text-[19px] font-bold block font-display text-white">
                        {t('Your Locker', 'Su Casillero', language)}
                      </strong>
                      <span className="text-[16px] text-mist leading-relaxed block mt-1">
                        {t('All communication is recorded. Contractors are contractually forbidden from offering deductible waivers or high-pressure signatures.', 'Toda la comunicación queda registrada. Los contratistas tienen prohibido contractualmente ofrecer exenciones de deducibles o firmas bajo presión.', language)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-[#10b981] bg-[#10b981]/10 px-3.5 py-1.5 rounded-lg border border-[#10b981]/30 font-extrabold uppercase tracking-wider shrink-0 text-center animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    {t('🔐 Locker Locked Down', '🔐 Casillero Bloqueado', language)}
                  </div>
                </div>

                {/* TAB NAVIGATION HEADER (Advanced protective tools) */}
                <div className="flex flex-wrap border-b border-slate-200 gap-1 sm:gap-2">
                  <button
                    onClick={() => setActiveTab('canvas')}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 -mb-px border-b-2 ${
                      activeTab === 'canvas'
                        ? 'border-teal text-teal bg-white font-extrabold'
                        : 'border-transparent text-stone-gray hover:text-navy'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    {t('Damage Canvas Map', 'Mapa de Daños', language)}
                  </button>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 -mb-px border-b-2 ${
                      activeTab === 'chat'
                        ? 'border-teal text-teal bg-white font-extrabold'
                        : 'border-transparent text-stone-gray hover:text-navy'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    {t('Secure Messaging Hub', 'Centro de Mensajería Seguro', language)}
                  </button>

                  <button
                    onClick={() => setActiveTab('scanner')}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 -mb-px border-b-2 ${
                      activeTab === 'scanner'
                        ? 'border-teal text-teal bg-white font-extrabold'
                        : 'border-transparent text-stone-gray hover:text-navy'
                    }`}
                  >
                    <FileSearch className="w-4 h-4" />
                    {t('Red-Flag Contract Checker', 'Detector de Alertas en Contratos', language)}
                  </button>

                  <button
                    onClick={() => setActiveTab('disputes')}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 -mb-px border-b-2 ${
                      activeTab === 'disputes'
                        ? 'border-teal text-teal bg-white font-extrabold'
                        : 'border-transparent text-stone-gray hover:text-navy'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    {t('Three-Tier Disputes Center', 'Centro de Disputas de Tres Niveles', language)}
                  </button>
                </div>

                {/* Sub tab workspace panels */}
                <div className="transition-all duration-300">
                  {activeTab === 'canvas' && (
                    <DamageCanvas pins={pins} onPinsChange={setPins} />
                  )}
                  {activeTab === 'chat' && (
                    <CommunicationHub contractor={selectedContractor} />
                  )}
                  {activeTab === 'scanner' && (
                    <RedFlagScanner />
                  )}
                  {activeTab === 'disputes' && (
                    <ProjectDisputeCenter />
                  )}
                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-deep-slate border-t border-slate-800 py-8 shrink-0 mt-12 text-mist text-xs">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BrandLogo size={48} onDark={true} />
          </div>
          <div className="text-center md:text-left md:max-w-md">
            <p className="text-[11px] text-[#D9E5E7] leading-relaxed">
              {t('RoofLocker exists to turn dread into certainty. We offer a trust-first protective environment for one of the biggest purchases of your life.', 'RoofLocker existe para convertir el temor en certeza. Ofrecemos un entorno de protección basado en la confianza para una de las compras más importantes de su vida.', language)}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 font-mono text-[10px] text-[#D9E5E7]">
            <div className="flex gap-4">
              <span>MCL § 500.1227</span>
              <span>MCL § 500.2082</span>
            </div>
            <span className="text-[9px] text-[#5C6066]">Stripe Connect Compliant • Brand Guidelines v1.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
