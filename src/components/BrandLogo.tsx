import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  onDark?: boolean;
}

/**
 * Official RoofLocker Logo Mark rendered via the new image or a fallback SVG structure.
 */
export function LogoMark({ className = '', size = 48, onDark = false }: LogoProps) {
  const [src, setSrc] = React.useState('/RoofLocker%20Logo%201024x1024%20.png');
  const [failed, setFailed] = React.useState(false);

  const numericSize = typeof size === 'number' ? size : parseInt(String(size), 10) || 48;

  if (failed) {
    // Elegant fallback SVG similar to the original shield/roof style
    return (
      <svg 
        viewBox="0 0 100 100" 
        className={`${className}`} 
        style={{ width: size, height: size }}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldCheckmarkGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
        <path d="M34 22V30H40V16H34V22Z" fill="#163A56" />
        <path d="M50 12L15 42H24L50 18V12Z" fill="#163A56" />
        <path d="M50 12V18L76 42H85L50 12Z" fill="#2E9CA6" />
        <path d="M24 45C24 65 37 81 50 88V78C42 72 32 58 32 45H24Z" fill="#163A56" />
        <path d="M76 45H68C68 58 58 72 50 78V88C63 81 76 65 76 45Z" fill="#2E9CA6" />
        <path d="M38 52L48 64L76 30" stroke="url(#goldCheckmarkGradient)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (onDark) {
    return (
      <div 
        className="inline-flex items-center justify-center bg-white rounded-xl shadow-sm shrink-0 overflow-hidden" 
        style={{ width: numericSize, height: numericSize }}
      >
        <img 
          src={src} 
          alt="RoofLocker Logo" 
          className={`${className} object-contain scale-[1.35]`} 
          style={{ width: numericSize, height: numericSize }}
          onError={() => {
            if (src === '/RoofLocker%20Logo%201024x1024%20.png') {
              setSrc('/RoofLocker Logo 1024x1024 .png');
            } else {
              setFailed(true);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className="inline-flex items-center justify-center shrink-0 overflow-hidden" 
      style={{ width: numericSize, height: numericSize }}
    >
      <img 
        src={src} 
        alt="RoofLocker Logo" 
        className={`${className} object-contain scale-[1.35]`} 
        style={{ width: numericSize, height: numericSize }}
        onError={() => {
          if (src === '/RoofLocker%20Logo%201024x1024%20.png') {
            setSrc('/RoofLocker Logo 1024x1024 .png');
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}

/**
 * Official Brand Wordmark lockup: uses the premium RoofLocker Wordmark image
 * with a high-fidelity Tailwind/CSS text-based fallback.
 */
export function BrandWordmark({ 
  className = '', 
  onDark = false, 
  height = 24,
  taglineSize
}: { 
  className?: string; 
  onDark?: boolean; 
  height?: number;
  taglineSize?: number;
}) {
  const initialSrc = '/RoofLocker%20Wordmark-tagline%20(1709%20x%20300%20px).png';
  
  const [src, setSrc] = React.useState(initialSrc);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setSrc('/RoofLocker%20Wordmark-tagline%20(1709%20x%20300%20px).png');
  }, [onDark]);

  const isCentered = className.includes('items-center');
  const finalTaglineSize = taglineSize || Math.max(12, Math.round(height * 0.37));

  const taglineStyle = React.useMemo(() => {
    const style: React.CSSProperties = {
      fontFamily: 'Figtree, sans-serif',
      fontSize: `${finalTaglineSize}px`,
    };
    return style;
  }, [finalTaglineSize]);

  if (failed) {
    return (
      <div className={`flex flex-col ${isCentered ? 'items-center text-center' : 'items-start text-left'} ${className}`} id="brand-wordmark-wrapper">
        <div className="flex items-baseline gap-1">
          <h1 className="font-display font-extrabold text-2xl tracking-tight uppercase leading-none">
            <span className={onDark ? 'text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.35)]' : 'text-[#2E9CA6]'}>ROOF</span>
            <span className={onDark ? 'text-white' : 'text-[#163A56]'}>LOCKER</span>
          </h1>
        </div>
        <p 
          className="tracking-wide mt-1 font-sans font-bold text-[#DC9A2C] leading-none"
          style={{ fontFamily: 'Figtree, sans-serif', fontSize: `${finalTaglineSize}px` }}
        >
          We lock in trust.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isCentered ? 'items-center' : 'items-start'} justify-center ${className}`} id="brand-wordmark-wrapper">
      <img 
        src={src} 
        alt="RoofLocker" 
        className="object-contain max-w-full"
        style={{ 
          height: height
        }}
        onError={() => {
          if (src.includes('%20')) {
            setSrc('/RoofLocker Wordmark-tagline (1709 x 300 px).png');
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}

/**
 * Standard complete horizontal, vertical, or card brand lockup.
 */
export default function BrandLogo({ 
  size = 40, 
  onDark = false, 
  className = '',
  layout = 'horizontal'
}: { 
  size?: number; 
  onDark?: boolean; 
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'card';
}) {
  const [imgSrc, setImgSrc] = React.useState('/Family-Hero-Webpage.jpeg');

  if (layout === 'card') {
    return (
      <div 
        className={`w-full aspect-video relative overflow-hidden group select-none rounded-3xl shadow-[0_30px_70px_-15px_rgba(2,23,35,0.55)] border-2 border-[#2E9CA6]/30 bg-[#021723] ${className}`} 
        id="brand-logo-component"
      >
        {/* Main Background Image: Happy family in front of their modern suburban home with a new roof */}
        <img
          src={imgSrc}
          alt="Happy Family with New Roof"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          onError={() => {
            if (imgSrc === '/Family-Hero-Webpage.jpeg') {
              setImgSrc('https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=800&q=80');
            }
          }}
        />
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`} id="brand-logo-component">
        <BrandWordmark onDark={onDark} height={size * 0.9} className="items-center" taglineSize={Math.max(12, Math.round(size * 0.28))} />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`} id="brand-logo-component">
      <BrandWordmark onDark={onDark} height={size * 0.8} taglineSize={Math.max(12, Math.round(size * 0.25))} />
    </div>
  );
}
