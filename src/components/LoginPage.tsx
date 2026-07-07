import React, { useState } from 'react';
import { User, Briefcase, Settings, ShieldCheck, Lock, ArrowRight, Mail, Key, Hammer, RotateCcw, Phone, Building } from 'lucide-react';
import { t } from '../translations';

interface LoginPageProps {
  onLogin: (role: 'home' | 'portal' | 'admin') => void;
  language?: 'en' | 'es';
  initialRole?: 'home' | 'portal' | 'admin';
  initialIsSignUp?: boolean;
}

export default function LoginPage({ onLogin, language = 'en', initialRole = 'home', initialIsSignUp = false }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<'home' | 'portal' | 'admin'>(initialRole);
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);

  // Form Fields
  const [email, setEmail] = useState(() => {
    if (initialIsSignUp) return '';
    if (initialRole === 'home') return 'homeowner@rooflocker.com';
    if (initialRole === 'portal') return 'contractor@apexroofing.com';
    return 'guardian.admin@rooflocker.com';
  });
  const [password, setPassword] = useState(() => {
    if (initialIsSignUp) return '';
    return '••••••••••••';
  });
  
  // Custom Sign Up Fields
  const [homeownerName, setHomeownerName] = useState('');
  const [homeownerZip, setHomeownerZip] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const handleRoleChange = (role: 'home' | 'portal' | 'admin') => {
    setSelectedRole(role);
    setIsSignUp(false); // Reset to sign in on role change for security/simplicity
    
    if (role === 'home') {
      setEmail('homeowner@rooflocker.com');
      setPassword('••••••••••••');
    } else if (role === 'portal') {
      setEmail('contractor@apexroofing.com');
      setPassword('••••••••••••');
    } else {
      setEmail('guardian.admin@rooflocker.com');
      setPassword('••••••••••••');
    }
  };

  const handleReset = () => {
    setSelectedRole('home');
    setIsSignUp(true);
    setEmail('');
    setPassword('');
    setHomeownerName('');
    setHomeownerZip('');
    setCompanyName('');
    setCity('');
    setPhone('');
    setWebsite('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="max-w-md mx-auto my-8 animate-fadeIn" id="login-container">
      {/* Security Shield Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal/10 border border-teal/20 text-teal mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-3xl text-navy tracking-tight">
          {isSignUp ? t('Create Account', 'Crear Cuenta', language) : t('Secure Access', 'Acceso Seguro', language)}
        </h1>
        <p className="text-stone-gray text-sm mt-2">
          {t('MCL-compliant encrypted gateway. Choose your entry point below.', 'Portal encriptado que cumple con MCL. Seleccione su punto de acceso abajo.', language)}
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6" id="login-role-selector">
        {/* Homeowner Option */}
        <button
          type="button"
          onClick={() => handleRoleChange('home')}
          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition text-center ${
            selectedRole === 'home'
              ? 'border-teal bg-teal/5 text-teal'
              : 'border-slate-200 bg-white text-stone-gray hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <User className="w-6 h-6 mb-2" />
          <span className="text-xs font-bold block">{t('Homeowner', 'Propietario', language)}</span>
        </button>

        {/* Contractor Option */}
        <button
          type="button"
          onClick={() => handleRoleChange('portal')}
          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition text-center ${
            selectedRole === 'portal'
              ? 'border-teal bg-teal/5 text-teal'
              : 'border-slate-200 bg-white text-stone-gray hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Hammer className="w-6 h-6 mb-2" />
          <span className="text-xs font-bold block">{t('Contractor', 'Contratista', language)}</span>
        </button>

        {/* Admin Option */}
        <button
          type="button"
          onClick={() => handleRoleChange('admin')}
          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition text-center ${
            selectedRole === 'admin'
              ? 'border-amber bg-amber/5 text-amber-700 border-amber/30'
              : 'border-slate-200 bg-white text-stone-gray hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-6 h-6 mb-2" />
          <span className="text-xs font-bold block">{t('Admin', 'Admin', language)}</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md mb-6">
        {/* Login / Sign Up Toggle (Not for Admin) */}
        {selectedRole !== 'admin' && (
          <div className="flex border-b border-slate-100 mb-5 p-1 bg-slate-50 rounded-xl" id="auth-mode-selector">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setEmail(selectedRole === 'home' ? 'homeowner@rooflocker.com' : 'contractor@apexroofing.com');
                setPassword('••••••••••••');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-white text-teal shadow-xs'
                  : 'text-stone-gray hover:text-navy'
              }`}
            >
              {t('Sign In', 'Iniciar Sesión', language)}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                handleReset(); // Clear for fresh signup
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isSignUp
                  ? 'bg-white text-teal shadow-xs'
                  : 'text-stone-gray hover:text-navy'
              }`}
            >
              {t('Sign Up', 'Registrarse', language)}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sign Up Fields - Homeowner */}
          {isSignUp && selectedRole === 'home' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  {t('Full Name', 'Nombre Completo', language)}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={homeownerName}
                    onChange={(e) => setHomeownerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  {t('ZIP Code / City', 'Código Postal / Ciudad', language)}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={homeownerZip}
                    onChange={(e) => setHomeownerZip(e.target.value)}
                    placeholder="e.g. 48444 (Imlay City)"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sign Up Fields - Contractor */}
          {isSignUp && selectedRole === 'portal' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  {t('Company Name', 'Nombre de Empresa', language)}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Spartan Roofing LLC"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    {t('City', 'Ciudad', language)}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Warren"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    {t('Phone Number', 'Número Telefónico', language)}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(586) 555-0199"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  {t('Website Address (Optional)', 'Dirección Web (Opcional)', language)}
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. www.spartanroofing.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                />
              </div>
            </div>
          )}

          {/* Core Login/Sign-up Credential Fields */}
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              {t('Authorized Email', 'Correo Autorizado', language)}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isSignUp ? "your.email@example.com" : "email@rooflocker.com"}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
              {t('Security Token / Password', 'Token de Seguridad / Contraseña', language)}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                required
              />
            </div>
          </div>

          {/* Action Row containing Submit and Reset Button */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={handleReset}
              id="reset-form-btn"
              className="flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl font-bold text-stone-gray text-xs transition-all shadow-xs shrink-0"
              title={isSignUp ? t('Clear all input fields', 'Limpiar campos', language) : t('Reset credentials to defaults', 'Restablecer credenciales por defecto', language)}
            >
              <RotateCcw className="w-4 h-4 text-stone-gray/80" />
              <span>{t('Reset', 'Restablecer', language)}</span>
            </button>

            <button
              type="submit"
              className={`flex-1 py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 shadow-sm ${
                selectedRole === 'admin'
                  ? 'bg-amber hover:bg-amber/95 text-navy'
                  : 'bg-teal hover:bg-teal/95'
              }`}
            >
              {isSignUp ? (
                <span>{t('Register & Enter', 'Registrar y Entrar', language)}</span>
              ) : (
                <span>{t('Authenticate', 'Autenticar', language)} {selectedRole === 'home' ? t('Homeowner', 'Propietario', language) : selectedRole === 'portal' ? t('Contractor', 'Contratista', language) : t('Admin', 'Administrador', language)}</span>
              )}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Quick Direct-Access Shortcuts */}
      <div className="space-y-3">
        <div className="text-center">
          <span className="text-[10px] font-mono font-bold text-stone-gray uppercase tracking-widest block mb-1">
            ⚡ {t('Quick Direct Gateways', 'Accesos Rápidos Directos', language)}
          </span>
        </div>
        
        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={() => onLogin('home')}
            id="login-home-direct"
            className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-xl transition text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs text-navy block font-display">{t('Enter as Homeowner', 'Entrar como Propietario', language)}</strong>
                <span className="text-[11px] text-stone-gray block">
                  {t('View consumer dashboard, protection dockets & scanner.', 'Ver panel de control de consumidor, expedientes de protección y detector.', language)}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onLogin('portal')}
            id="login-contractor-direct"
            className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-xl transition text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs text-navy block font-display">{t('Enter Contractor Desk', 'Entrar al Escritorio de Contratista', language)}</strong>
                <span className="text-[11px] text-stone-gray block">
                  {t('Check real-time lead boards, compliance status & active projects.', 'Ver tableros de clientes potenciales en tiempo real, estado de cumplimiento y proyectos activos.', language)}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onLogin('admin')}
            id="login-admin-direct"
            className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-xl transition text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber/10 text-amber-700 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs text-navy block font-display">{t('Enter Admin Panel', 'Entrar al Panel de Admin', language)}</strong>
                <span className="text-[11px] text-stone-gray block">
                  {t('Audit state complaints, security logs & compliance rosters.', 'Auditar quejas estatales, registros de seguridad y listas de cumplimiento.', language)}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Trust Seal Footer */}
      <div className="mt-8 text-center flex items-center justify-center gap-1.5 text-stone-gray text-[10px]">
        <ShieldCheck className="w-4 h-4 text-teal" />
        {t('RoofLocker Guard V2.0 Secured Gateway', 'RoofLocker Guard V2.0 Portal Asegurado', language)}
      </div>
    </div>
  );
}
