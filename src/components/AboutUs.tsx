import React from 'react';
import { Building2, ShieldCheck, Heart, Sparkles, Scale, Mail, MapPin } from 'lucide-react';
import { t } from '../translations';

interface AboutUsProps {
  language?: 'en' | 'es';
}

export default function AboutUs({ language = 'en' }: AboutUsProps) {
  const coreValues = [
    {
      title: t('Radical Transparency', 'Transparencia Radical', language),
      description: t('We believe you should see exactly who is stepping onto your roof, their active licensing records, and physical corporate registers. No hidden subcontractors.', 'Creemos que debe ver exactamente quién se sube a su techo, sus registros de licencia activos y sus registros corporativos físicos. Sin subcontratistas ocultos.', language),
      icon: <Sparkles className="w-5 h-5 text-teal" />,
    },
    {
      title: t('Legally Engineered Defenses', 'Defensas Diseñadas Legalmente', language),
      description: t('Our software is built around state consumer protection mandates (MCL § 500.2082). We prevent illicit waiver arrangements, safeguarding homeowners from policy voidance.', 'Nuestro software está diseñado en torno a los mandatos estatales de protección al consumidor (MCL § 500.2082). Evitamos acuerdos ilícitos de exención de deducibles, protegiendo a los propietarios de la anulación de pólizas.', language),
      icon: <Scale className="w-5 h-5 text-teal" />,
    },
    {
      title: t('Structured Progress Verification', 'Verificación Estructurada del Progreso', language),
      description: t('By documenting project specifications and recording milestone achievements, we provide clear verification before you sign off on any completed phases of work.', 'Al documentar las especificaciones del proyecto y registrar el progreso de los hitos, proporcionamos una verificación clara antes de aprobar cualquier fase completada.', language),
      icon: <ShieldCheck className="w-5 h-5 text-teal" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0 animate-fadeIn" id="about-us-view">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal/10 text-teal mb-4">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl text-navy tracking-tight">
          {t('Our Mission: Defending Homeowners', 'Nuestra Misión: Defender a los Propietarios', language)}
        </h1>
        <p className="text-stone-gray text-base md:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
          {t('RoofLocker was founded by consumers, policy experts, and local builders who grew tired of watching storm-chasing solicitors exploit vulnerable communities.', 'RoofLocker fue fundado por consumidores, expertos en pólizas y constructores locales cansados de ver cómo los promotores que persiguen tormentas explotan a las comunidades vulnerables.', language)}
        </p>
      </div>

      {/* Origin Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
        <div className="space-y-4">
          <span className="text-[10px] font-mono font-bold tracking-wider text-teal uppercase block">
            {t('HOW IT STARTED', 'CÓMO EMPEZÓ', language)}
          </span>
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy">
            {t('Rebuilding Trust After the Storm', 'Reconstruir la Confianza Tras la Tormenta', language)}
          </h2>
          <p className="text-stone-gray text-xs md:text-sm leading-relaxed">
            {t('Every year, severe wind and hail storms sweep across our cities, leaving thousands of homes with damaged shingles. In their wake come the "storm chasers"—unlicensed, high-pressure out-of-state solicitors knocking on doors, demanding quick contract signatures, and promising to "waive" deductibles.', 'Cada año, fuertes vientos y tormentas de granizo azotan nuestras ciudades, dejando miles de viviendas con tejas dañadas. A su paso llegan los "cazadores de tormentas": promotores de fuera del estado, sin licencia y de alta presión que tocan puertas, exigen firmas rápidas de contratos y prometen "eximir" los deducibles.', language)}
          </p>
          <p className="text-stone-gray text-xs md:text-sm leading-relaxed">
            {t('Homeowners are left with poorly installed roofs, cancelled insurance policies, and legal headaches. We decided to build a platform that turns the tables. RoofLocker is a digital fortress where homeowners retain full control over their property records, communication, and project documentation.', 'Los propietarios se quedan con techos mal instalados, pólizas de seguro canceladas y dolores de cabeza legales. Decidimos construir una plataforma que cambie las reglas del juego. RoofLocker es una fortaleza digital donde los propietarios conservan el control total de sus registros de propiedad, comunicación y documentación del proyecto.', language)}
          </p>
        </div>

        {/* Brand Shield Illustration */}
        <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-3xl text-center flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal/5 rounded-bl-full" />
          <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center text-teal mb-4 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <strong className="text-sm font-semibold text-navy block font-display">{t('The RoofLocker Quality Guarantee', 'La Garantía de Calidad de RoofLocker', language)}</strong>
          <p className="text-xs text-stone-gray leading-relaxed mt-2 max-w-xs">
            {t('Every building contractor on our roster is fully licensed, physically domiciled, and contractually bound to state-compliant practices.', 'Todos los contratistas de construcción en nuestra lista están totalmente autorizados, domiciliados físicamente y vinculados contractualmente a prácticas que cumplen con las normas estatales.', language)}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-teal font-bold uppercase tracking-wider">
            🛡️ {t('100% SECURE & COMPLIANT', '100% SEGURO Y CONFORME', language)}
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="mb-16">
        <h2 className="font-display font-bold text-xl text-center text-navy mb-8">
          {t('Our Core Pillars', 'Nuestros Pilares Fundamentales', language)}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((val) => (
            <div key={val.title} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                {val.icon}
              </div>
              <strong className="text-sm font-bold text-navy block font-display mb-2">
                {val.title}
              </strong>
              <p className="text-stone-gray text-xs leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Location Footer */}
      <div className="bg-navy border border-deep-slate rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-display font-bold text-lg">{t('Have questions about compliance?', '¿Tiene preguntas sobre cumplimiento?', language)}</h3>
          <p className="text-xs text-mist leading-relaxed">{t('Our consumer protection specialists are here to provide educational resources on construction guidelines and project compliance.', 'Nuestros especialistas en protección al consumidor están aquí para ofrecer recursos educativos sobre pautas de construcción y cumplimiento de proyectos.', language)}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-slate-800 rounded-xl text-xs text-mist justify-center">
            <Mail className="w-4 h-4 text-teal" />
            <span>compliance@rooflocker.com</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-slate-800 rounded-xl text-xs text-mist justify-center">
            <MapPin className="w-4 h-4 text-teal" />
            <span>Metro Detroit Office, MI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
