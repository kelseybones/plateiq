// Progress tracking — weekly chart with time-range toggle, streak, adherence

const Progress = ({ data }) => {
  const [range, setRange] = React.useState("7d");
  const [metric, setMetric] = React.useState("kcal");

  const RANGES = {
    "7d": { days: 7, label: "Last 7 days" },
    "30d": { days: 30, label: "Last 30 days" },
    "3m":  { days: 90, label: "Last 3 months" },
  };
  const r = RANGES[range];

  // Generate deterministic-feeling demo data
  const series = React.useMemo(() => {
    const seed = range.length;
    const arr = [];
    for (let i = 0; i < r.days; i++) {
      const noise = Math.sin((i + seed) * 1.3) * 220 + Math.cos(i * 0.7) * 120;
      const base = metric === "kcal" ? 2750 : metric === "protein" ? 175 : metric === "carbs" ? 280 : 90;
      arr.push(Math.max(0, base + noise * (metric === "kcal" ? 1 : 0.15)));
    }
    return arr;
  }, [range, metric, r.days]);

  const goal = metric === "kcal" ? 2800 : metric === "protein" ? 180 : metric === "carbs" ? 320 : 80;
  const avg = Math.round(series.reduce((a,b) => a+b, 0) / series.length);
  const max = Math.max(...series, goal * 1.05);

  return (
    <div style={{ padding: "0 0 110px" }}>
      <div style={{ padding: "10px 24px 14px" }}>
        <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>PERFORMANCE · TRENDS</div>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: "6px 0 0", lineHeight: 1.1 }}>Progress</h1>
      </div>

      {/* Top stats row */}
      <div style={{ padding: "0 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <KpiCard label="STREAK" big="42" unit="days" sub="Personal best" icon="fire" highlight/>
        <KpiCard label="ADHERENCE" big="92" unit="%" sub="Last 30 days" icon="target"/>
        <KpiCard label="AVG KCAL" big={avg.toLocaleString()} unit={`/ ${goal}`} sub="Within ±3% of goal" icon="trend"/>
        <KpiCard label="LOGGED" big="28" unit="/ 30" sub="Days last month" icon="check"/>
      </div>

      {/* Chart card */}
      <div style={{ padding: "0 20px 16px" }}>
        <div className="card" style={{ padding: "18px 18px 14px" }}>
          <div className="row between" style={{ marginBottom: 14, alignItems: "center" }}>
            <div>
              <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em" }}>{r.label.toUpperCase()}</div>
              <div className="row gap-8" style={{ alignItems: "baseline", marginTop: 4 }}>
                <span className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>{avg.toLocaleString()}</span>
                <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>avg {metric === "kcal" ? "kcal" : "g"}</span>
              </div>
            </div>
            <div className="row gap-6">
              {Object.keys(RANGES).map(k => (
                <Chip key={k} active={range === k} onClick={() => setRange(k)}>{k}</Chip>
              ))}
            </div>
          </div>

          <BarChart series={series} max={max} goal={goal} days={r.days}/>

          <div className="row gap-6" style={{ marginTop: 14, flexWrap: "wrap" }}>
            {[["kcal", "Calories"], ["protein", "Protein"], ["carbs", "Carbs"], ["fat", "Fat"]].map(([id, label]) => (
              <Chip key={id} active={metric === id} onClick={() => setMetric(id)}>{label}</Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div style={{ padding: "0 20px 16px" }}>
        <div className="row between" style={{ padding: "0 4px 10px" }}>
          <span className="section-title">Achievements</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>3 NEW</span>
        </div>
        <div className="card" style={{ padding: "4px 18px" }}>
          <Achievement icon="trophy" title="14-day streak" sub="Logged every day for 2 weeks" date="2 days ago" earned/>
          <Achievement icon="bolt"   title="Protein hero" sub="Hit protein goal 7 days straight" date="Yesterday" earned/>
          <Achievement icon="target" title="Within range" sub="±5% of calorie goal · 30 days" date="Today" earned/>
          <Achievement icon="fire"   title="50-day streak" sub="8 days to go" progress={42/50} last/>
        </div>
      </div>

      {/* Weekly summary cards */}
      <div style={{ padding: "0 20px 16px" }}>
        <div className="row between" style={{ padding: "0 4px 10px" }}>
          <span className="section-title">This week</span>
        </div>
        <div className="card" style={{ padding: "4px 18px" }}>
          <WeeklyRow label="Mon" kcal={2750} pct={98}/>
          <WeeklyRow label="Tue" kcal={2820} pct={101}/>
          <WeeklyRow label="Wed" kcal={data.consumed} pct={Math.round(data.consumed/2800*100)} today/>
          <WeeklyRow label="Thu" kcal={null} pct={null} future/>
          <WeeklyRow label="Fri" kcal={null} pct={null} future/>
          <WeeklyRow label="Sat" kcal={null} pct={null} future/>
          <WeeklyRow label="Sun" kcal={null} pct={null} future last/>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ label, big, unit, sub, icon, highlight }) => (
  <div className="card" style={{ padding: "16px 16px", position: "relative" }}>
    <div className="row between">
      <span className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>{label}</span>
      <Icon name={icon} size={14}/>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 10 }}>
      <span className="mono" style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.03em", color: highlight ? "var(--accent)" : "var(--text)" }}>{big}</span>
      <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{unit}</span>
    </div>
    <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 4, letterSpacing: "0.04em" }}>{sub}</div>
  </div>
);

const BarChart = ({ series, max, goal, days }) => {
  const H = 160;
  const w = 100 / series.length;
  const goalY = (1 - goal / max) * H;
  return (
    <div style={{ position: "relative", height: H + 24 }}>
      <svg width="100%" height={H} viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
        {/* goal line */}
        <line x1="0" y1={goalY} x2="100" y2={goalY} stroke="var(--text-3)" strokeWidth="0.3" strokeDasharray="1 1.5"/>
        {series.map((v, i) => {
          const h = (v / max) * H;
          const isToday = i === series.length - 1;
          return (
            <rect key={i}
              x={i * w + w * 0.18}
              y={H - h}
              width={w * 0.64}
              height={h}
              rx="0.6"
              fill={isToday ? "var(--accent)" : "var(--border-2)"}
              style={{ transition: "all 0.3s" }}
            />
          );
        })}
      </svg>
      <div className="row between" style={{ padding: "8px 0 0", color: "var(--text-3)" }}>
        <span className="mono" style={{ fontSize: 10 }}>{days === 7 ? "MON" : "−" + days + "d"}</span>
        <span className="mono" style={{ fontSize: 10 }}>GOAL <span style={{ color: "var(--text)" }}>{goal.toLocaleString()}</span></span>
        <span className="mono" style={{ fontSize: 10 }}>TODAY</span>
      </div>
    </div>
  );
};

const Achievement = ({ icon, title, sub, date, earned, progress, last }) => (
  <div style={{ padding: "14px 0", display: "flex", alignItems: "center", gap: 14, borderBottom: last ? "none" : "1px solid var(--border)" }}>
    <div style={{
      width: 40, height: 40, borderRadius: 10, flex: "none",
      background: earned ? "var(--accent)" : "var(--card-2)",
      color: earned ? "var(--accent-ink)" : "var(--text-3)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon name={icon} size={18}/>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
      <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{sub}</div>
      {progress != null && (
        <div style={{ marginTop: 8, maxWidth: 180 }}>
          <ProgressBar value={progress * 100} goal={100} accent="var(--text-2)" height={4}/>
        </div>
      )}
    </div>
    {date && <span className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", letterSpacing: "0.04em" }}>{date}</span>}
  </div>
);

const WeeklyRow = ({ label, kcal, pct, today, future, last }) => (
  <div style={{ padding: "12px 0", borderBottom: last ? "none" : "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14 }}>
    <span className="mono up" style={{ fontSize: 11, color: today ? "var(--accent)" : "var(--text-3)", letterSpacing: "0.12em", width: 36 }}>{label}</span>
    <div style={{ flex: 1 }}>
      {future ? (
        <div style={{ height: 4, background: "var(--border)", borderRadius: 2 }}/>
      ) : (
        <ProgressBar value={Math.min(pct, 100)} goal={100} accent={today ? "var(--accent)" : "var(--text-2)"} height={4}/>
      )}
    </div>
    <span className="mono" style={{ fontSize: 12, color: future ? "var(--text-3)" : "var(--text)", fontWeight: 600, minWidth: 70, textAlign: "right" }}>
      {future ? "—" : `${kcal.toLocaleString()} · ${pct}%`}
    </span>
  </div>
);

window.Progress = Progress;
