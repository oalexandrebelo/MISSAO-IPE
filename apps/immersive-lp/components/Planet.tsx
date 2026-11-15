export function Planet({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  return <div className={`planet ${className}`} aria-hidden="true">
    <div className="planet-atmosphere" />
    <div className="planet-surface">
      <picture><source media="(max-width: 600px)" srcSet="/assets/earth-mobile.webp" />
        {/* Native picture preserves the static export and the local, optimized NASA asset. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/earth.webp" alt="" width="1600" height="1600" fetchPriority={priority ? 'high' : 'auto'} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </picture>
      <div className="planet-shade" />
    </div>
  </div>;
}

export function Satellite({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 520 360" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="sat-body" x1="180" y1="80" x2="330" y2="280" gradientUnits="userSpaceOnUse"><stop stopColor="#f5df9a" /><stop offset=".45" stopColor="#998554" /><stop offset="1" stopColor="#4b493b" /></linearGradient>
      <linearGradient id="sat-panel" x1="60" y1="100" x2="400" y2="290" gradientUnits="userSpaceOnUse"><stop stopColor="#29474f" /><stop offset="1" stopColor="#09191d" /></linearGradient>
      <pattern id="sat-cells" width="18" height="21" patternUnits="userSpaceOnUse"><path d="M0 0h18v21H0Z" stroke="#648e96" strokeWidth=".7" /><path d="M9 0v21" stroke="#466e78" strokeWidth=".4" /></pattern>
    </defs>
    <g transform="translate(260 180) rotate(-22) translate(-260 -180)">
      <path d="m50 147 120-32 26 87-120 32Z" fill="url(#sat-panel)" stroke="#91a5a0" strokeWidth="2" />
      <path d="m50 147 120-32 26 87-120 32Z" fill="url(#sat-cells)" />
      <path d="m319 124 132 34-28 88-132-34Z" fill="url(#sat-panel)" stroke="#91a5a0" strokeWidth="2" />
      <path d="m319 124 132 34-28 88-132-34Z" fill="url(#sat-cells)" />
      <path d="M184 163h37m81 0h35" stroke="#cbd0bd" strokeWidth="5" />
      <path d="m207 108 65-26 52 30-64 28Z" fill="#d6c897" stroke="#f0e0b1" />
      <path d="m207 108 53 32v116l-53-32Z" fill="url(#sat-body)" stroke="#c3b58d" />
      <path d="m260 140 64-28v113l-64 31Z" fill="#252d2c" stroke="#b3af90" />
      <path d="m213 124 37 23v87l-37-21Z" fill="#a18d5e" stroke="#e2d3a0" />
      <path d="m213 124 37 110m0-87-37 66" stroke="#e0c888" strokeWidth="1" />
      <path d="m271 149 41-18v28l-41 18Z" fill="#465c58" stroke="#a3b2a0" />
      <ellipse cx="291" cy="202" rx="17" ry="24" transform="rotate(20 291 202)" fill="#080e12" stroke="#adb5a4" strokeWidth="3" />
      <ellipse cx="291" cy="202" rx="9" ry="15" transform="rotate(20 291 202)" fill="#387384" />
      <path d="m240 94-11-47m42 43 15-40M220 233l-13 41m69-25 8 38" stroke="#acb4a8" strokeWidth="2" />
      <circle cx="229" cy="47" r="3" fill="#e5f7ae" />
      <path d="m225 161 16 10v19l-16-10Z" fill="#eaf0c9" /><path d="m230 167 5 3v9l-5-3Z" fill="#57684e" />
    </g>
  </svg>;
}
