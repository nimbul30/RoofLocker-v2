import React, { useState } from 'react';
import { Contractor, Review } from '../types';
import { MOCK_CONTRACTORS } from '../mockData';
import { Search, MapPin, BadgeCheck, FileText, Globe, Star, ShieldCheck, UserPlus, Sparkles, Building, AlertCircle, Info, ThumbsUp, Phone } from 'lucide-react';
import { t } from '../translations';

interface ContractorDirectoryProps {
  onSelectContractor: (contractor: Contractor) => void;
  selectedContractorId?: string;
  language?: 'en' | 'es';
}

export default function ContractorDirectory({ onSelectContractor, selectedContractorId, language = 'en' }: ContractorDirectoryProps) {
  const [zipQuery, setZipQuery] = useState('48444');
  const [contractors, setContractors] = useState<Contractor[]>(MOCK_CONTRACTORS);
  const [searchStatus, setSearchStatus] = useState<{
    type: 'initial' | 'all' | 'results' | 'fallback' | 'custom_zip_match';
    query?: string;
    count?: number;
  }>({ type: 'initial' });

  // Custom Invitation Form States
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteCity, setInviteCity] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteWeb, setInviteWeb] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Handle Search
  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = zipQuery.trim();
    const queryLower = query.toLowerCase();

    if (!query) {
      setContractors(MOCK_CONTRACTORS);
      setSearchStatus({ type: 'all' });
      return;
    }

    // Specific legacy ZIP match logic
    const isSpecialZip = ['48444', '48446', '48441', '48003'].includes(query);

    // Filter contractors by name, physicalLocation (for zip code or city), bio, or specialties
    const filtered = MOCK_CONTRACTORS.filter(contractor => {
      const nameMatch = contractor.name.toLowerCase().includes(queryLower);
      const locationMatch = contractor.physicalLocation.toLowerCase().includes(queryLower);
      const bioMatch = contractor.bio.toLowerCase().includes(queryLower);
      const specialtyMatch = contractor.specialties.some(spec => spec.toLowerCase().includes(queryLower));
      return nameMatch || locationMatch || bioMatch || specialtyMatch;
    });

    if (filtered.length > 0) {
      setContractors(filtered);
      if (isSpecialZip) {
        setSearchStatus({ type: 'custom_zip_match', query });
      } else {
        setSearchStatus({ type: 'results', query, count: filtered.length });
      }
    } else {
      // Return a subset or simulated distant matches, explaining how we query external database
      setContractors(MOCK_CONTRACTORS.slice(0, 1));
      setSearchStatus({ type: 'fallback', query });
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !invitePhone) return;

    setInviteSuccess(true);
    setTimeout(() => {
      // Auto reset form after showing feedback
      setInviteName('');
      setInviteEmail('');
      setInviteCity('');
      setInvitePhone('');
      setInviteWeb('');
    }, 5000);
  };

  const getTranslatedSpecialties = (name: string, specialties: string[]) => {
    if (language === 'es') {
      if (name.includes('Apex')) {
        return ['Tejas Asfálticas', 'Inspección con Drones', 'Garantía del Fabricante'];
      } else if (name.includes('Oak')) {
        return ['Techo de Metal', 'Tejas de Madera', 'Restauración Histórica'];
      } else {
        return ['Reparación de Tejas', 'Mantenimiento Preventivo', 'Sistemas de Ventilación'];
      }
    }
    return specialties;
  };

  const getTranslatedBio = (name: string, bio: string) => {
    if (language === 'es') {
      if (name.includes('Apex')) {
        return 'Apex Elite es la empresa de techado de primer nivel de Michigan, conocida por sus estrictos controles de calidad y excelente servicio al cliente.';
      } else if (name.includes('Oak')) {
        return 'Oak & Iron se especializa en techos de metal y restauración histórica de alta gama, brindando durabilidad incomparable a hogares clásicos.';
      } else {
        return 'Metro Detroit Roofing ofrece reparaciones locales confiables, mantenimiento rápido y servicios de diagnóstico de fugas de emergencia.';
      }
    }
    return bio;
  };

  return (
    <div className="space-y-8" id="contractor-directory-root">
      {/* Header and Search Form */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 bg-mist text-navy font-semibold text-xs px-3 py-1 rounded-full mb-3">
              <BadgeCheck className="w-3.5 h-3.5 text-teal" />
              {t('Verified Michigan Database', 'Base de Datos de Michigan Verificada', language)}
            </div>
            <h2 className="font-display font-bold text-navy text-2xl tracking-tight">
              {t('Search Certified Local Builders', 'Buscar Constructores Locales Certificados', language)}
            </h2>
            <p className="text-stone-gray text-sm md:text-base mt-1 max-w-xl">
              {t('Every profile undergoes strict regulatory verification. We crawl LARA builder licenses, county court dockets, BBB directories, and manufacturer certification databases.', 'Cada perfil pasa por una estricta verificación regulatoria. Buscamos en licencias de constructores de LARA, expedientes de tribunales del condado, directorios de BBB y bases de datos de certificación de fabricantes.', language)}
            </p>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={handleZipSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-gray" />
                <input
                  type="text"
                  placeholder={t('Search Company Name, ZIP, or city (e.g. Warren)', 'Buscar nombre de empresa, C.P. o ciudad (ej. Warren)', language)}
                  value={zipQuery}
                  onChange={(e) => setZipQuery(e.target.value)}
                  className="w-full bg-slate-50/80 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-navy placeholder:text-stone-gray/70 focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal/20 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
              <button
                type="submit"
                id="search-contractors-btn"
                className="bg-navy hover:bg-navy/90 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap active:scale-[0.98]"
              >
                {t('Search', 'Buscar', language)}
              </button>
            </form>
            <div className="mt-2 text-xs md:text-sm font-mono text-stone-gray flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
              {searchStatus.type === 'initial' && t('Showing contractors active in Lapeer & Macomb counties (Michigan).', 'Mostrando contratistas activos en los condados de Lapeer y Macomb (Michigan).', language)}
              {searchStatus.type === 'all' && t('Showing all local certified contractors.', 'Mostrando todos los contratistas certificados locales.', language)}
              {searchStatus.type === 'results' && t(`Found ${searchStatus.count} matching certified contractor(s) for "${searchStatus.query}".`, `Se encontraron ${searchStatus.count} contratista(s) de techado certificado(s) para "${searchStatus.query}".`, language)}
              {searchStatus.type === 'custom_zip_match' && t(`Vetted matches found in ZIP code ${searchStatus.query}.`, `Coincidencias evaluadas encontradas en el código postal ${searchStatus.query}.`, language)}
              {searchStatus.type === 'fallback' && t(`No direct matches for "${searchStatus.query}". Displaying state-wide coverage (Apex Elite) while our agents pull regional building permits.`, `Sin de coincidencias directas para "${searchStatus.query}". Mostrando cobertura estatal (Apex Elite) mientras nuestros agentes recopilan permisos regionales.`, language)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Vetted Contractors on Left, Invitation Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contractors list (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {contractors.map(contractor => {
            const isSelected = selectedContractorId === contractor.id;
            const translatedSpecialties = getTranslatedSpecialties(contractor.name, contractor.specialties);
            const translatedBio = getTranslatedBio(contractor.name, contractor.bio);
            return (
              <div
                key={contractor.id}
                id={`contractor-card-${contractor.id}`}
                className={`bg-white border rounded-2xl overflow-hidden transition duration-300 shadow-sm hover:shadow-md ${
                  isSelected ? 'border-amber ring-2 ring-amber/10' : 'border-slate-100'
                }`}
              >
                {/* Visual Header banner */}
                <div className={`h-2.5 bg-gradient-to-r ${contractor.logoColor}`} />

                <div className="p-6">
                  {/* Title block */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-extrabold text-navy text-xl">
                          {contractor.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 bg-teal/10 text-teal border border-teal/20 px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider shadow-xs">
                          <ShieldCheck className="w-3.5 h-3.5" /> {t('Vetted', 'Evaluado', language)}
                        </span>
                      </div>
                      <p className="text-stone-gray text-sm mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal" /> {contractor.physicalLocation}
                      </p>
                    </div>
                  </div>

                  {/* 14 transparency checkpoints list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm mb-4">
                    <div className="flex items-start gap-2.5">
                      <Globe className="w-4 h-4 text-navy shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block text-navy">{t('Website Address & History', 'Dirección Web e Historial', language)}</strong>
                        <a href={`https://${contractor.websiteDomain}`} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline font-mono font-medium block">
                          www.{contractor.websiteDomain} <span className="text-stone-gray text-xs font-sans">({contractor.websiteAge})</span>
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-navy shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block text-navy">{t('Company Phone & Local Office', 'Teléfono y Oficina Local', language)}</strong>
                        <span className="text-stone-gray font-mono font-medium block">
                          {contractor.phone || '(810) 724-1100'} • {contractor.city || 'Imlay City'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <BadgeCheck className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block text-navy">{t('Manufacturer Certifications', 'Certificaciones de Fabricantes', language)}</strong>
                        <span className="text-stone-gray text-xs block">
                          {contractor.manufacturerCredentials.join(' • ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block text-navy">{t('Filing & Scam Check registries', 'Registros de Quejas y Fraudes', language)}</strong>
                        <span className="text-stone-gray text-xs block leading-tight">
                          {contractor.scamReportCheck}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 md:col-span-2 border-t border-slate-200/50 pt-2">
                      <AlertCircle className="w-4 h-4 text-stone-gray shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block text-navy text-xs">{t('Court Docket Records Search', 'Búsqueda de Registros del Tribunal', language)}</strong>
                        <span className="text-stone-gray font-mono text-xs">{contractor.courtDocketsCheck}</span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties & Bio */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {translatedSpecialties.map((spec, i) => (
                        <span key={i} className="bg-mist text-navy text-xs font-mono px-2 py-0.5 rounded-full border border-slate-100">
                          {spec}
                        </span>
                      ))}
                    </div>
                    <p className="text-stone-gray text-sm md:text-base leading-relaxed">
                      {translatedBio}
                    </p>
                  </div>

                  {/* Legal Waiver Block */}
                  <div className="mb-5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/60 hover:border-slate-300/80 rounded-xl p-3.5 text-[11px] leading-relaxed text-stone-gray/90 transition-all duration-200 flex gap-2.5 items-start shadow-xs">
                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-extrabold text-navy/90 block mb-1 uppercase tracking-wider text-[9px] font-mono">
                        {t('Legal Waiver & Disclaimer', 'Exención de Responsabilidad Legal', language)}
                      </span>
                      <p className="font-sans font-medium text-stone-gray/85">
                        {t(
                          'Information displayed is compiled from public LARA registers, court dockets, and state contractor records. Users must independently verify licensing status and active insurance prior to contract execution. RoofLocker acts solely as an independent vetting directory and assumes no liability for contractor performance, property damage, or contractual disputes.',
                          'La información mostrada se recopila de los registros públicos de LARA, expedientes judiciales y registros estatales de contratistas. Los usuarios deben verificar de forma independiente el estado de la licencia y el seguro activo antes de la firma del contrato. RoofLocker actúa únicamente como un directorio de evaluación independiente y no asume ninguna responsabilidad por el desempeño del contratista, daños a la propiedad o disputas contractuales.',
                          language
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Select Action */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
                    <div className="text-xs text-stone-gray italic flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal" />
                      {t('State-verified licensing and public records audit.', 'Licencia estatal y auditoría de registros públicos verificada.', language)}
                    </div>

                    <button
                      onClick={() => onSelectContractor(contractor)}
                      id={`select-contractor-btn-${contractor.id}`}
                      className={`w-full sm:w-auto px-5 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber text-white shadow'
                          : 'bg-navy hover:bg-navy/95 text-white shadow-sm'
                      }`}
                    >
                      {isSelected ? t('✓ Selected Builder', '✓ Constructor Seleccionado', language) : t('Connect securely', 'Conectar de forma segura', language)}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Invite custom roofer sidebar (4 columns) */}
        <div className="lg:col-span-4">
          <div className="bg-white hover:bg-slate-50/50 border-2 border-slate-200/80 hover:border-teal/30 rounded-2xl p-6 shadow-sm hover:shadow-md sticky top-6 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-5 h-5 text-teal" />
              <h3 className="font-display font-bold text-navy text-lg leading-tight">
                {t('Invite Your Own Roofer', 'Invite a su propio Techador', language)}
              </h3>
            </div>

            <p className="text-stone-gray text-sm leading-relaxed mb-4">
              {t('Have a specific contractor in mind (e.g., from a friend referral or door knocker)? Input their details below. Our automated agents will verify their active status and generate a secure space link to invite them.', '¿Tiene un contratista específico en mente (por ejemplo, recomendado por un amigo o que llamó a su puerta)? Ingrese sus datos a continuación. Nuestros agentes automatizados verificarán su estado activo y generarán un enlace seguro para invitarlo.', language)}
            </p>

            {inviteSuccess ? (
              <div className="bg-teal/10 border border-teal/20 text-navy p-4 rounded-xl text-sm space-y-2 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-teal">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  {t('Invitation Active!', '¡Invitación Activa!', language)}
                </div>
                <p>
                  {t('We have processed the roofer information. An invitation with the 3D Satellite Roof Pack link has been dispatched.', 'Hemos procesado la información del techador. Se ha enviado una invitación con el enlace de la Ficha Satelital 3D.', language)}
                </p>
                <p className="font-mono text-xs bg-white p-2 rounded border border-teal/10">
                  {t('Status: Pending Contractor agreement. Secure routing of communications is active.', 'Estado: Pendiente del acuerdo del contratista. El enrutamiento seguro de comunicaciones está activo.', language)}
                </p>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="space-y-3.5" id="invite-contractor-form">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase mb-1">{t('Company/Contractor Name', 'Nombre de la Empresa/Contratista', language)}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spartan Roof Builders"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-teal focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase mb-1">{t('City', 'Ciudad', language)}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Warren"
                      value={inviteCity}
                      onChange={(e) => setInviteCity(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-teal focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase mb-1">{t('Phone Number', 'Número de Teléfono', language)}</label>
                    <input
                      type="tel"
                      required
                      placeholder="(586) 555-0199"
                      value={invitePhone}
                      onChange={(e) => setInvitePhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-teal focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase mb-1">{t('Website Address (Optional)', 'Dirección Web (Opcional)', language)}</label>
                  <input
                    type="text"
                    placeholder="e.g. www.spartanroofing.com"
                    value={inviteWeb}
                    onChange={(e) => setInviteWeb(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-teal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase mb-1">{t('Contact Email (Optional)', 'Correo Electrónico de Contacto (Opcional)', language)}</label>
                  <input
                    type="email"
                    placeholder="sales@spartanroofing.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-teal focus:outline-none"
                  />
                </div>

                <div className="bg-white/60 border border-slate-200 p-2.5 rounded-lg flex gap-2">
                  <Info className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-gray leading-tight">
                    <strong>{t('Zero-leak guarantee:', 'Garantía de cero filtraciones:', language)}</strong> {t('We never share your personal phone or email with them during invitation.', 'Nunca compartimos su teléfono o correo de contacto personal con ellos durante la invitación.', language)}
                  </p>
                </div>

                <button
                  type="submit"
                  id="submit-invite-btn"
                  className="w-full py-2.5 bg-navy hover:bg-navy/95 text-white font-bold text-sm rounded-xl shadow-sm transition"
                >
                  {t('Onboard & Invite Builder', 'Registrar e Invitar Constructor', language)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
