import React from 'react';
import { HelpCircle, ShieldCheck, ClipboardCheck, ArrowRight, Landmark, Lock, Sparkles } from 'lucide-react';
import { t } from '../translations';

interface HowItWorksProps {
  onNavigate: (view: 'home' | 'directory' | 'login') => void;
  language?: 'en' | 'es';
}

export default function HowItWorks({ onNavigate, language = 'en' }: HowItWorksProps) {
  const steps = [
    {
      number: '01',
      title: t('Analyze & Document Damage', 'Analizar y Documentar Daños', language),
      description: t('Use our Damage Canvas to mark storm impact spots on your roof. Create a cryptographically secure, unalterable digital twin of your roof damage before speaking to anyone.', 'Utilice nuestro Lienzo de Daños para marcar los puntos de impacto de tormentas en su techo. Cree un gemelo digital criptográficamente seguro e inalterable de los daños en su techo antes de hablar con nadie.', language),
      icon: <ClipboardCheck className="w-6 h-6 text-teal" />,
    },
    {
      number: '02',
      title: t('Browse Vetted Contractors', 'Explorar Contratistas Evaluados', language),
      description: t('Filter through contractors with state-verified licenses, active physical offices, clean litigation histories, and solid track records. Absolutely no storm-chasers allowed.', 'Filtre entre contratistas con licencias verificadas por el estado, oficinas físicas activas, historial de litigios limpio y trayectoria sólida. No se permiten cazadores de tormentas bajo ninguna circunstancia.', language),
      icon: <Sparkles className="w-6 h-6 text-teal" />,
    },
    {
      number: '03',
      title: t('Safe Communication', 'Comunicación Segura', language),
      description: t('All messaging occurs in the RoofLocker Secure Hub. Contractors are contractually forbidden from using high-pressure tactics, soliciting unrequested services, or bypassing the safe compliance flows.', 'Todos los mensajes se realizan en el Centro Seguro de RoofLocker. Los contratistas tienen prohibido contractualmente utilizar tácticas de alta presión, solicitar servicios no requeridos o eludir los flujos de cumplimiento.', language),
      icon: <Lock className="w-6 h-6 text-teal" />,
    },
    {
      number: '04',
      title: t('Milestone Project Tracking', 'Seguimiento del Proyecto por Hitos', language),
      description: t("Track your project's progress (including insurance scoping, material deliveries, and builds) inside our milestone timeline. Release sign-offs only when you inspect the verified proof of work.", 'Siga el progreso de su proyecto (incluida la evaluación del seguro, entrega de materiales y construcción) en nuestra línea de tiempo de hitos. Libere las aprobaciones solo cuando inspeccione la prueba de trabajo verificada.', language),
      icon: <Landmark className="w-6 h-6 text-teal" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0 animate-fadeIn" id="how-it-works-view">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal/10 text-teal mb-4">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl text-navy tracking-tight">
          {t('How RoofLocker Protects You', 'Cómo le Protege RoofLocker', language)}
        </h1>
        <p className="text-stone-gray text-base md:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
          {t('The traditional roofing process is broken, high-pressure, and full of legal trapdoors. RoofLocker wraps your entire project in an unbreakable shield of compliance.', 'El proceso tradicional de techado está roto, lleno de presiones y trampas legales. RoofLocker envuelve todo su proyecto en un escudo inquebrantable de cumplimiento normativo.', language)}
        </p>
      </div>

      {/* Compliance Standard Badge */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-teal" />
        </div>
        <div>
          <strong className="text-sm font-semibold text-navy block font-display">{t('Compliant with MCL § 500.2082 & State Consumer Laws', 'Cumple con MCL § 500.2082 y Leyes Estatales de Consumidores', language)}</strong>
          <span className="text-xs text-stone-gray leading-relaxed block mt-0.5">
            {t('By state law, offering to waive, rebate, or pay a homeowner’s deductible is illegal and voids your policy. RoofLocker is legally engineered to keep your claim completely clean and valid.', 'Según la ley estatal, ofrecer eximir, reembolsar o pagar el deducible de un propietario es ilegal y anula su póliza. RoofLocker está diseñado legalmente para mantener su reclamo completamente limpio y válido.', language)}
          </span>
        </div>
      </div>

      {/* Step Sequence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {steps.map((step) => (
          <div key={step.number} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal/5 rounded-bl-full flex items-center justify-center translate-x-4 -translate-y-4 transition-all group-hover:scale-110">
              <span className="font-mono text-3xl font-extrabold text-teal/20 pr-4 pt-4">{step.number}</span>
            </div>
            
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
              {step.icon}
            </div>

            <h3 className="font-display font-bold text-lg text-navy mb-2">
              {step.title}
            </h3>
            
            <p className="text-stone-gray text-xs md:text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Call To Action Card */}
      <div className="bg-navy border border-deep-slate rounded-2xl p-8 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal/5 blur-3xl pointer-events-none" />
        <h2 className="font-display font-black text-2xl mb-3 relative z-10">
          {t('Ready to experience safe, stress-free roofing?', '¿Listo para experimentar un techado seguro y sin estrés?', language)}
        </h2>
        <p className="text-mist text-sm max-w-xl mx-auto mb-6 leading-relaxed relative z-10">
          {t('Take control of your home’s shield today. Analyze storm damages yourself, find certified builders, and secure your claim under RoofLocker compliance protection.', 'Tome el control del escudo de su hogar hoy. Analice los daños por tormentas usted mismo, encuentre constructores certificados y asegure su reclamo bajo la protección de cumplimiento de RoofLocker.', language)}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('directory')}
            className="w-full sm:w-auto px-6 py-3 bg-teal hover:bg-teal/95 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            {t('Explore Vetted Directory', 'Explorar Directorio Evaluado', language)}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl transition"
          >
            {t('Back to Home', 'Volver al Inicio', language)}
          </button>
        </div>
      </div>
    </div>
  );
}
