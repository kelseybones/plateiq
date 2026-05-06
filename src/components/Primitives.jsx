import { useState, useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

export const StatusBar = ({ time = "9:41" }) => (
  <div className="phone-status">
    <span>{time}</span>
    <div className="right">
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="6" rx="1"/><rect x="10" y="3" width="3" height="8" rx="1"/></svg>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4a11 11 0 0 1 14 0"/><path d="M3.5 6.5a7 7 0 0 1 9 0"/><path d="M6 9a3 3 0 0 1 4 0"/></svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/><rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor"/></svg>
    </div>
  </div>
);

export const Ring = ({ value, goal, size = 220, stroke = 16, label, sublabel, accentVar = "--accent", animate = true }) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(1, value / goal);
  const target = circ * (1 - pct);

  const [draw, setDraw] = useState(animate ? circ : target);
  useEffect(() => {
    if (!animate) { setDraw(target); return; }
    const t = setTimeout(() => setDraw(target), 120);
    return () => clearTimeout(t);
  }, [target, animate]);

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={radius} stroke="var(--border)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={radius}
          stroke={`var(${accentVar})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={draw}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
      }}>
        {label}
        {sublabel}
      </div>
    </div>
  );
};

export const ProgressBar = ({ value, goal, accent = "var(--accent)", height = 10, animate = true }) => {
  const pct = Math.min(100, (value / goal) * 100);
  const [w, setW] = useState(animate ? 0 : pct);
  useEffect(() => {
    if (!animate) { setW(pct); return; }
    const t = setTimeout(() => setW(pct), 150);
    return () => clearTimeout(t);
  }, [pct, animate]);
  return (
    <div className="bar" style={{ height }}>
      <div className="bar-fill" style={{ width: `${w}%`, background: accent }} />
    </div>
  );
};

// TabBar: home, macros, [FAB], progress, profile — search/log tab removed
export const TabBar = ({ active, onChange, onPlus }) => {
  const left = [
    { id: "home", icon: "home", label: "Home" },
    { id: "macros", icon: "macros", label: "Macros" },
  ];
  const right = [
    { id: "progress", icon: "chart", label: "Stats" },
    { id: "profile", icon: "user", label: "Profile" },
  ];
  return (
    <div className="tabbar">
      <div className="tabbar-inner">
        {left.map(t => (
          <button key={t.id} className={`tab ${active === t.id ? "active" : ""}`} onClick={() => onChange(t.id)}>
            <Icon name={t.icon} size={22} />
          </button>
        ))}
        <button className="tab-fab" onClick={onPlus} aria-label="Log food">
          <Icon name="plus" size={26} stroke={2.2} />
        </button>
        {right.map(t => (
          <button key={t.id} className={`tab ${active === t.id ? "active" : ""}`} onClick={() => onChange(t.id)}>
            <Icon name={t.icon} size={22} />
          </button>
        ))}
      </div>
    </div>
  );
};

export const Ticker = ({ value, duration = 900, format = (v) => Math.round(v).toLocaleString() }) => {
  const [v, setV] = useState(0);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = v;
    startRef.current = null;
    let raf;
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(fromRef.current + (value - fromRef.current) * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{format(v)}</>;
};

export const Chip = ({ children, active = false, onClick }) => (
  <button
    onClick={onClick}
    style={{
      height: 34,
      padding: "0 14px",
      borderRadius: 999,
      border: `1px solid ${active ? "var(--text)" : "var(--border-2)"}`,
      background: active ? "var(--text)" : "transparent",
      color: active ? "var(--shell)" : "var(--text-2)",
      fontFamily: "var(--f-mono)",
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      transition: "all 0.15s",
    }}
  >{children}</button>
);
