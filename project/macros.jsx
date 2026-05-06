// Macro breakdown screen — donut / bar / radial variants

const MacroBreakdown = ({ data, variant = "donut" }) => {
  const totalKcal = data.consumed;
  const pKcal = data.p * 4, cKcal = data.c * 4, fKcal = data.f * 9;
  const sum = pKcal + cKcal + fKcal || 1;
  const pPct = pKcal / sum, cPct = cKcal / sum, fPct = fKcal / sum;

  return (
    <div style={{ padding: "0 0 110px" }}>
      <div style={{ padding: "10px 24px 14px" }}>
        <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>MACROS · TODAY</div>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: "6px 0 0", lineHeight: 1.1 }}>Breakdown</h1>
      </div>

      <div style={{ padding: "0 20px 18px" }}>
        <div className="card" style={{ padding: "24px 22px" }}>
          {variant === "donut" && <DonutChart p={pPct} c={cPct} f={fPct} totalKcal={totalKcal}/>}
          {variant === "bar"   && <StackedBar p={pPct} c={cPct} f={fPct} totalKcal={totalKcal}/>}
          {variant === "radial"&& <RadialChart p={data.p} pG={data.pGoal} c={data.c} cG={data.cGoal} f={data.f} fG={data.fGoal} totalKcal={totalKcal}/>}
        </div>
      </div>

      <div style={{ padding: "0 20px 16px" }}>
        <MacroDetail name="Protein" code="P" value={data.p} goal={data.pGoal} kcal={pKcal} pct={Math.round(pPct*100)} color="var(--m-protein)"
          extras={[["Per kg BW", "2.1g"], ["Last 7d avg", "168g"]]}/>
        <div style={{ height: 12 }}/>
        <MacroDetail name="Carbohydrates" code="C" value={data.c} goal={data.cGoal} kcal={cKcal} pct={Math.round(cPct*100)} color="var(--m-carbs)"
          extras={[["Fiber", "24g"], ["Sugar", "42g"], ["Net carbs", `${data.c - 24}g`]]}/>
        <div style={{ height: 12 }}/>
        <MacroDetail name="Fat" code="F" value={data.f} goal={data.fGoal} kcal={fKcal} pct={Math.round(fPct*100)} color="var(--m-fat)"
          extras={[["Saturated", "18g"], ["Unsaturated", "44g"]]}/>
      </div>

      <div style={{ padding: "0 20px 16px" }}>
        <div className="row between" style={{ padding: "0 4px 10px" }}>
          <span className="section-title">Micros & secondary</span>
        </div>
        <div className="card" style={{ padding: "6px 18px" }}>
          <MicroRow label="Fiber"   value="24" unit="g" goal="38" pct={63}/>
          <MicroRow label="Sugar"   value="42" unit="g" goal="60" pct={70}/>
          <MicroRow label="Sodium"  value="1,840" unit="mg" goal="2,300" pct={80}/>
          <MicroRow label="Water"   value="2.4" unit="L" goal="3.5" pct={68} last/>
        </div>
      </div>
    </div>
  );
};

const DonutChart = ({ p, c, f, totalKcal }) => {
  const size = 220, stroke = 22, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const segs = [
    { len: p * circ, color: "var(--m-protein)" },
    { len: c * circ, color: "var(--m-carbs)" },
    { len: f * circ, color: "var(--m-fat)" },
  ];
  let offset = 0;
  return (
    <div className="col center" style={{ gap: 18 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {segs.map((s, i) => {
            const dash = `${s.len} ${circ - s.len}`;
            const el = <circle key={i} cx={size/2} cy={size/2} r={r} stroke={s.color} strokeWidth={stroke} fill="none"
                         strokeDasharray={dash} strokeDashoffset={-offset} style={{ transition: "stroke-dasharray 0.9s" }}/>;
            offset += s.len;
            return el;
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>TOTAL</div>
          <div className="mono" style={{ fontSize: 38, fontWeight: 600, letterSpacing: "-0.04em", marginTop: 2 }}>{totalKcal.toLocaleString()}</div>
          <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em", marginTop: 2 }}>kcal</div>
        </div>
      </div>
      <Legend p={p} c={c} f={f}/>
    </div>
  );
};

const StackedBar = ({ p, c, f, totalKcal }) => (
  <div className="col" style={{ gap: 18, padding: "10px 0" }}>
    <div className="col center" style={{ gap: 4 }}>
      <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>TOTAL TODAY</div>
      <div className="mono" style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.04em" }}>{totalKcal.toLocaleString()}<span style={{ fontSize: 14, color: "var(--text-3)", marginLeft: 6 }}>kcal</span></div>
    </div>
    <div style={{ height: 36, borderRadius: 10, overflow: "hidden", display: "flex", border: "1px solid var(--border)" }}>
      <div style={{ width: `${p*100}%`, background: "var(--m-protein)", transition: "width 0.9s" }}/>
      <div style={{ width: `${c*100}%`, background: "var(--m-carbs)", transition: "width 0.9s" }}/>
      <div style={{ width: `${f*100}%`, background: "var(--m-fat)", transition: "width 0.9s" }}/>
    </div>
    <Legend p={p} c={c} f={f}/>
  </div>
);

const RadialChart = ({ p, pG, c, cG, f, fG, totalKcal }) => {
  const size = 220;
  const rings = [
    { r: 92, w: 11, val: p / pG, color: "var(--m-protein)", label: "P" },
    { r: 74, w: 11, val: c / cG, color: "var(--m-carbs)",   label: "C" },
    { r: 56, w: 11, val: f / fG, color: "var(--m-fat)",     label: "F" },
  ];
  return (
    <div className="col center" style={{ gap: 18 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {rings.map((ring, i) => {
            const c2 = 2 * Math.PI * ring.r;
            const offset = c2 * (1 - Math.min(1, ring.val));
            return (
              <g key={i}>
                <circle cx={size/2} cy={size/2} r={ring.r} stroke="var(--border)" strokeWidth={ring.w} fill="none"/>
                <circle cx={size/2} cy={size/2} r={ring.r} stroke={ring.color} strokeWidth={ring.w} fill="none"
                        strokeDasharray={c2} strokeDashoffset={offset} strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1s" }}/>
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.04em" }}>{totalKcal.toLocaleString()}</div>
          <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em", marginTop: 2 }}>kcal</div>
        </div>
      </div>
      <div className="row gap-16">
        {rings.map((r, i) => (
          <div key={i} className="col center" style={{ gap: 2 }}>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: r.color }}>{r.label}</span>
            <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{Math.round(r.val * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Legend = ({ p, c, f }) => (
  <div className="row" style={{ gap: 18 }}>
    <LegendDot color="var(--m-protein)" label="Protein" pct={Math.round(p*100)}/>
    <LegendDot color="var(--m-carbs)"   label="Carbs"   pct={Math.round(c*100)}/>
    <LegendDot color="var(--m-fat)"     label="Fat"     pct={Math.round(f*100)}/>
  </div>
);
const LegendDot = ({ color, label, pct }) => (
  <div className="col center" style={{ gap: 4 }}>
    <div className="row gap-6" style={{ alignItems: "center" }}>
      <div style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
      <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em" }}>{label}</span>
    </div>
    <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{pct}%</span>
  </div>
);

const MacroDetail = ({ name, code, value, goal, kcal, pct, color, extras }) => {
  const remaining = Math.max(0, goal - value);
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div className="row between" style={{ alignItems: "flex-start" }}>
        <div className="row gap-12" style={{ alignItems: "center" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: color, color: "var(--accent-ink)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{code}</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.005em" }}>{name}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 3 }}>{kcal} kcal · {pct}% of intake</div>
          </div>
        </div>
        <div className="col" style={{ alignItems: "flex-end" }}>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
            {value}<span style={{ fontSize: 12, color: "var(--text-3)" }}>g</span>
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>/ {goal}g</div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <ProgressBar value={value} goal={goal} accent={color} height={6}/>
      </div>
      <div className="row" style={{ marginTop: 14, gap: 14, flexWrap: "wrap" }}>
        <ExtraStat label="REMAINING" value={`${remaining}g`}/>
        {extras.map(([k, v], i) => <ExtraStat key={i} label={k.toUpperCase()} value={v}/>)}
      </div>
    </div>
  );
};
const ExtraStat = ({ label, value }) => (
  <div>
    <div className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>{label}</div>
    <div className="mono" style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{value}</div>
  </div>
);
const MicroRow = ({ label, value, unit, goal, pct, last }) => (
  <div style={{ padding: "12px 0", borderBottom: last ? "none" : "1px solid var(--border)" }}>
    <div className="row between" style={{ marginBottom: 6 }}>
      <span style={{ fontSize: 13, color: "var(--text-2)" }}>{label}</span>
      <span className="mono" style={{ fontSize: 12 }}>
        <span style={{ color: "var(--text)", fontWeight: 600 }}>{value}{unit}</span>
        <span style={{ color: "var(--text-3)" }}> / {goal}{unit}</span>
      </span>
    </div>
    <ProgressBar value={pct} goal={100} accent="var(--text-2)" height={4}/>
  </div>
);

window.MacroBreakdown = MacroBreakdown;
