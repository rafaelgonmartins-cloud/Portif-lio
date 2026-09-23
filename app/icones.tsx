// Ícones desenhados à mão em SVG, todos no mesmo traço (1.8) e caixa 24x24.
type P = { className?: string };
const base = {
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true,
};

export const IconeWhats = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.3 20.7l4.4-1.1A8.8 8.8 0 1 0 12 3.2Z" />
    <path d="M9.1 8.3c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.1.6 0l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .6-.4.8-.6.4-1.4.6-2.2.4-2.6-.6-4.9-2.9-5.5-5.5-.2-.8 0-1.6.4-2.2Z" />
  </svg>
);

export const IconeInsta = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const IconePlay = ({ className }: P) => (
  <svg {...base} className={className}><path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" /></svg>
);

export const IconePausa = ({ className }: P) => (
  <svg {...base} className={className}><path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth={2.4} /></svg>
);

export const IconeSom = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4v-5Z" />
    <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.5a8 8 0 0 1 0 11" />
  </svg>
);

export const IconeFechar = ({ className }: P) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6 6 18" strokeWidth={2.2} /></svg>
);

export const IconeSeta = ({ className }: P) => (
  <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

// Estrela de quatro pontas do logo, usada como marca gráfica.
export const Estrela = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path d="M12 1.5c.9 5.6 4.9 9.6 10.5 10.5-5.6.9-9.6 4.9-10.5 10.5C11.1 16.9 7.1 12.9 1.5 12 7.1 11.1 11.1 7.1 12 1.5Z" fill="currentColor" />
  </svg>
);
