const Icon = ({ name, size = 22, stroke = 1.75, ...rest }) => {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor",
    strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round",
    ...rest,
  };
  switch (name) {
    case "home":
      return <svg {...props}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></svg>;
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "plus":
      return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "chart":
      return <svg {...props}><path d="M4 20V10M10 20V4M16 20v-6M22 20H2"/></svg>;
    case "user":
      return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>;
    case "macros":
      return <svg {...props}><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 3v9h9"/></svg>;
    case "back":
      return <svg {...props}><path d="m15 6-6 6 6 6"/></svg>;
    case "close":
      return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "barcode":
      return <svg {...props}><path d="M3 5v14M7 5v14M10 5v14M14 5v14M17 5v14M21 5v14"/></svg>;
    case "flame":
      return <svg {...props}><path d="M12 3s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-1 5 3 5 4-3 4-5"/></svg>;
    case "bolt":
      return <svg {...props}><path d="M13 3 4 14h7l-1 7 9-11h-7z"/></svg>;
    case "muscle":
      return <svg {...props}><path d="M3 12c2-3 5-3 7-1 1.5 1.5 4 2 7 0 2 1 3 3 3 6"/><path d="M5 16c2 1 4 1 6 0"/></svg>;
    case "scale":
      return <svg {...props}><path d="M4 6h16l-2 14H6z"/><path d="M9 6V4h6v2"/></svg>;
    case "leaf":
      return <svg {...props}><path d="M5 19c4-9 9-13 16-14-1 7-5 12-14 16"/><path d="M5 19c2-2 5-3 8-3"/></svg>;
    case "check":
      return <svg {...props}><path d="m5 12 5 5L20 6"/></svg>;
    case "chevron":
      return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "arrow-up":
      return <svg {...props}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case "arrow-down":
      return <svg {...props}><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "trophy":
      return <svg {...props}><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M17 6h3v2a3 3 0 0 1-3 3M7 6H4v2a3 3 0 0 0 3 3"/><path d="M9 17h6l-1 4h-4z"/></svg>;
    case "fire":
      return <svg {...props}><path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4-1 4 2 5 2 5s-2-5 0-9z"/></svg>;
    case "bell":
      return <svg {...props}><path d="M6 17V11a6 6 0 0 1 12 0v6"/><path d="M4 17h16M10 21h4"/></svg>;
    case "ruler":
      return <svg {...props}><path d="m3 17 14-14 4 4L7 21z"/><path d="m7 7 2 2M10 4l2 2M13 13l2 2M16 10l2 2"/></svg>;
    case "target":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>;
    case "trend":
      return <svg {...props}><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    case "dot":
      return <svg {...props}><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>;
    case "sunrise":
      return <svg {...props}><path d="M3 18h18"/><path d="M5 18a7 7 0 0 1 14 0"/><path d="M12 4v3M5.5 7.5l2 2M18.5 7.5l-2 2"/></svg>;
    case "sun":
      return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg>;
    case "moon":
      return <svg {...props}><path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/></svg>;
    case "edit":
      return <svg {...props}><path d="M4 20h4l10-10-4-4L4 16z"/><path d="m14 6 4 4"/></svg>;
    case "trash":
      return <svg {...props}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>;
    default:
      return null;
  }
};

export default Icon;
