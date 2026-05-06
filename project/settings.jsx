// Settings / Profile screen

const Settings = ({ data, onUpdate }) => {
  const [units, setUnits] = React.useState("metric");
  const [notif, setNotif] = React.useState(true);
  const [reminders, setReminders] = React.useState(true);
  const [weekly, setWeekly] = React.useState(false);

  const goalLabel = { muscle: "Muscle gain", fat: "Fat loss", maint: "Maintenance" }[data.goal] || "Maintenance";

  return (
    <div style={{ padding: "0 0 110px" }}>
      <div style={{ padding: "10px 24px 14px" }}>
        <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>PROFILE</div>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: "6px 0 0", lineHeight: 1.1 }}>Settings</h1>
      </div>

      {/* Profile card */}
      <div style={{ padding: "0 20px 16px" }}>
        <div className="card" style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "var(--accent)", color: "var(--accent-ink)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 700,
          }}>AK</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>Alex Kowalski</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 3 }}>alex@plateiq.app · Member since Jan</div>
          </div>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: "var(--card-2)", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="edit" size={16}/>
          </button>
        </div>
      </div>

      {/* Goals section */}
      <SettingSection title="Goals">
        <SettingRow icon="target" label="Goal type" value={goalLabel} chevron/>
        <SettingRow icon="flame" label="Daily calories" value={`${data.calorieGoal.toLocaleString()} kcal`} chevron/>
      </SettingSection>

      {/* Macro split */}
      <div style={{ padding: "0 20px 16px" }}>
        <div className="row between" style={{ padding: "0 4px 10px" }}>
          <span className="section-title">Macro split</span>
          <button className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>EDIT</button>
        </div>
        <div className="card" style={{ padding: "18px 20px" }}>
          <div className="row" style={{ gap: 10, marginBottom: 14 }}>
            <SplitPill label="P" pct={26} grams={data.pGoal} color="var(--m-protein)"/>
            <SplitPill label="C" pct={45} grams={data.cGoal} color="var(--m-carbs)"/>
            <SplitPill label="F" pct={29} grams={data.fGoal} color="var(--m-fat)"/>
          </div>
          <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex", border: "1px solid var(--border)" }}>
            <div style={{ width: "26%", background: "var(--m-protein)" }}/>
            <div style={{ width: "45%", background: "var(--m-carbs)" }}/>
            <div style={{ width: "29%", background: "var(--m-fat)" }}/>
          </div>
        </div>
      </div>

      {/* Body stats */}
      <SettingSection title="Body stats">
        <SettingRow icon="scale" label="Weight" value="82.4 kg" chevron/>
        <SettingRow icon="ruler" label="Height" value="180 cm" chevron/>
        <SettingRow icon="bolt"  label="Activity level" value="Very active · 5–6×/wk" chevron/>
        <SettingRow icon="trend" label="Body fat %" value="14.2%" chevron last/>
      </SettingSection>

      {/* Preferences */}
      <SettingSection title="Preferences">
        <SettingRow icon="ruler" label="Units">
          <SegToggle value={units} onChange={setUnits} options={[["metric", "Metric"], ["imperial", "Imperial"]]}/>
        </SettingRow>
        <SettingRow icon="bell" label="Push notifications"><Toggle value={notif} onChange={setNotif}/></SettingRow>
        <SettingRow icon="check" label="Meal reminders"><Toggle value={reminders} onChange={setReminders}/></SettingRow>
        <SettingRow icon="trend" label="Weekly recap email" last><Toggle value={weekly} onChange={setWeekly}/></SettingRow>
      </SettingSection>

      <SettingSection title="Account">
        <SettingRow icon="user" label="Connected apps" value="Apple Health · Strava" chevron/>
        <SettingRow icon="settings" label="Privacy & data" chevron/>
        <SettingRow icon="trash" label="Sign out" danger last/>
      </SettingSection>

      <div style={{ padding: "16px 24px 0", textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>PLATEIQ · v1.0.4</div>
      </div>
    </div>
  );
};

const SettingSection = ({ title, children }) => (
  <div style={{ padding: "0 20px 16px" }}>
    <div className="row between" style={{ padding: "0 4px 10px" }}>
      <span className="section-title">{title}</span>
    </div>
    <div className="card" style={{ padding: "0 18px" }}>{children}</div>
  </div>
);

const SettingRow = ({ icon, label, value, chevron, danger, last, children }) => (
  <div style={{
    padding: "14px 0", display: "flex", alignItems: "center", gap: 14,
    borderBottom: last ? "none" : "1px solid var(--border)",
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: "var(--card-2)", color: danger ? "var(--danger)" : "var(--text-2)",
      display: "flex", alignItems: "center", justifyContent: "center", flex: "none",
    }}>
      <Icon name={icon} size={15}/>
    </div>
    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: danger ? "var(--danger)" : "var(--text)" }}>{label}</span>
    {value && <span className="mono" style={{ fontSize: 12, color: "var(--text-2)" }}>{value}</span>}
    {children}
    {chevron && <Icon name="chevron" size={16} stroke={1.75}/>}
  </div>
);

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)} style={{
    width: 44, height: 26, borderRadius: 999, padding: 3,
    background: value ? "var(--accent)" : "var(--border-2)", transition: "background 0.2s",
  }}>
    <div style={{
      width: 20, height: 20, borderRadius: 999,
      background: value ? "var(--accent-ink)" : "var(--shell)",
      transform: `translateX(${value ? 18 : 0}px)`, transition: "transform 0.2s",
    }}/>
  </button>
);

const SegToggle = ({ value, onChange, options }) => (
  <div style={{ display: "flex", padding: 3, background: "var(--card-2)", borderRadius: 10 }}>
    {options.map(([id, label]) => (
      <button key={id} onClick={() => onChange(id)} style={{
        padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
        background: value === id ? "var(--text)" : "transparent",
        color: value === id ? "var(--shell)" : "var(--text-2)",
        transition: "all 0.15s",
      }}>{label}</button>
    ))}
  </div>
);

const SplitPill = ({ label, pct, grams, color }) => (
  <div style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 12 }}>
    <div className="row gap-6" style={{ alignItems: "center" }}>
      <div style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
      <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em" }}>{label}</span>
    </div>
    <div className="mono" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 6 }}>{pct}%</div>
    <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{grams}g</div>
  </div>
);

window.Settings = Settings;
