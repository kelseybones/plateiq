import { useState } from 'react';
import Icon from './Icon.jsx';
import { ProgressBar } from './Primitives.jsx';
import { calcTargets, recalcMacros } from '../utils/calc.js';

const ACTIVITY_LEVELS = [
  { id: "sedentary", title: "Sedentary",         sub: "DESK JOB · LITTLE EXERCISE", mult: 1.2 },
  { id: "light",     title: "Lightly active",    sub: "1–3 SESSIONS / WEEK",        mult: 1.375 },
  { id: "moderate",  title: "Moderately active", sub: "3–5 SESSIONS / WEEK",        mult: 1.55 },
  { id: "very",      title: "Very active",       sub: "6–7 SESSIONS / WEEK",        mult: 1.725 },
  { id: "athlete",   title: "Athlete",           sub: "DAILY · 2-A-DAYS",           mult: 1.9 },
];

const GOAL_OPTIONS = [
  { id: "muscle", icon: "muscle", title: "Muscle gain",  sub: "SURPLUS · +10%" },
  { id: "fat",    icon: "flame",  title: "Fat loss",     sub: "DEFICIT · −20%" },
  { id: "maint",  icon: "scale",  title: "Maintenance",  sub: "RECOMP · TDEE" },
];

// Edit goals + macro targets
const EditGoalsScreen = ({ data, onSave, onBack }) => {
  const [goal, setGoal] = useState(data.goal);
  const [calories, setCalories] = useState(String(data.calorieGoal));
  const [protein, setProtein] = useState(String(data.pGoal));

  const kcal = +calories || data.calorieGoal;
  const prot = +protein || data.pGoal;
  const { fat, carbs } = recalcMacros({ calories: kcal, protein: prot });

  const handleSave = () => {
    onSave({ goal, calorieGoal: kcal, pGoal: prot, cGoal: carbs, fGoal: fat });
  };

  return (
    <div className="phone-body" style={{ padding: "0 0 32px" }}>
      <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, color: "var(--text-2)" }}>
          <Icon name="back" size={20}/>
        </button>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}>Edit goals</div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", padding: "0 4px 10px" }}>GOAL TYPE</div>
        <div className="col gap-8">
          {GOAL_OPTIONS.map(g => (
            <button key={g.id} onClick={() => setGoal(g.id)}
              style={{
                padding: "14px 18px", borderRadius: 14, textAlign: "left",
                background: goal === g.id ? "var(--accent)" : "var(--card)",
                color: goal === g.id ? "var(--accent-ink)" : "var(--text)",
                border: `1px solid ${goal === g.id ? "var(--accent)" : "var(--border)"}`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
              <Icon name={g.icon} size={20}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{g.title}</div>
                <div className="mono" style={{ fontSize: 10, opacity: 0.7, marginTop: 2, letterSpacing: "0.06em" }}>{g.sub}</div>
              </div>
              {goal === g.id && <Icon name="check" size={16}/>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", padding: "0 4px 10px" }}>DAILY TARGETS</div>
        <div className="card" style={{ padding: "18px 20px" }}>
          <EditableNum label="DAILY CALORIES" unit="kcal" value={calories} onChange={setCalories} large/>
          <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }}/>
          <EditableNum label="PROTEIN" unit="g" value={protein} onChange={setProtein}/>
          <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }}/>
          <div className="row between">
            <div>
              <div className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>CARBS (auto)</div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>{carbs}<span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 2 }}>g</span></div>
            </div>
            <div>
              <div className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>FAT (auto)</div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>{fat}<span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 2 }}>g</span></div>
            </div>
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", marginTop: 10, letterSpacing: "0.04em" }}>
            Carbs and fat auto-adjust from total calories and protein.
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <button className="btn btn-primary btn-block" onClick={handleSave}>
          Save goals <Icon name="check" size={18}/>
        </button>
      </div>
    </div>
  );
};

// Edit body stats + optional recalculation
const EditBodyScreen = ({ data, onSave, onBack }) => {
  const [weight, setWeight] = useState(String(data.weight || 180));
  const [height, setHeight] = useState(String(data.height || 180));
  const [level, setLevel] = useState(data.level || "moderate");
  const [recalcResult, setRecalcResult] = useState(null);

  const handleRecalculate = () => {
    const targets = calcTargets({ weightLb: weight, heightCm: height, level, goal: data.goal });
    setRecalcResult(targets);
  };

  const handleSave = (applyRecalc) => {
    const update = { weight: +weight, height: +height, level };
    if (applyRecalc && recalcResult) {
      update.calorieGoal = recalcResult.calories;
      update.pGoal = recalcResult.protein;
      update.cGoal = recalcResult.carbs;
      update.fGoal = recalcResult.fat;
    }
    onSave(update);
  };

  return (
    <div className="phone-body" style={{ padding: "0 0 32px" }}>
      <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, color: "var(--text-2)" }}>
          <Icon name="back" size={20}/>
        </button>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}>Body stats</div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div className="card" style={{ padding: "18px 20px" }}>
          <div className="row gap-12">
            <div style={{ flex: 1 }}>
              <div className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>WEIGHT</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                <input value={weight} inputMode="numeric"
                  onChange={(e) => { setWeight(e.target.value.replace(/\D/g, "").slice(0, 3)); setRecalcResult(null); }}
                  className="mono"
                  style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", background: "transparent", border: "none", outline: "none", color: "var(--text)", width: "100%", padding: 0, minWidth: 0, caretColor: "var(--accent)" }}/>
                <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)" }}>lb</span>
              </div>
            </div>
            <div style={{ width: 1, background: "var(--border)" }}/>
            <div style={{ flex: 1 }}>
              <div className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>HEIGHT</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                <input value={height} inputMode="numeric"
                  onChange={(e) => { setHeight(e.target.value.replace(/\D/g, "").slice(0, 3)); setRecalcResult(null); }}
                  className="mono"
                  style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", background: "transparent", border: "none", outline: "none", color: "var(--text)", width: "100%", padding: 0, minWidth: 0, caretColor: "var(--accent)" }}/>
                <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)" }}>cm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", padding: "0 4px 10px" }}>ACTIVITY LEVEL</div>
        <div className="col gap-6">
          {ACTIVITY_LEVELS.map(l => (
            <button key={l.id} onClick={() => { setLevel(l.id); setRecalcResult(null); }}
              style={{
                padding: "12px 16px", borderRadius: 12, textAlign: "left",
                background: level === l.id ? "var(--accent)" : "var(--card)",
                color: level === l.id ? "var(--accent-ink)" : "var(--text)",
                border: `1px solid ${level === l.id ? "var(--accent)" : "var(--border)"}`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{l.title}</div>
                <div className="mono" style={{ fontSize: 9, opacity: 0.75, marginTop: 2, letterSpacing: "0.06em" }}>{l.sub}</div>
              </div>
              <span className="mono" style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>×{l.mult}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recalculate targets */}
      {!recalcResult ? (
        <div style={{ padding: "0 20px 16px" }}>
          <button className="btn btn-ghost btn-block" onClick={handleRecalculate}>
            <Icon name="bolt" size={18}/> Get new calorie recommendation
          </button>
        </div>
      ) : (
        <div style={{ padding: "0 20px 16px" }}>
          <div className="card" style={{ padding: "18px 20px", marginBottom: 12 }}>
            <div className="row between" style={{ alignItems: "center", marginBottom: 14 }}>
              <div>
                <div className="mono up" style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "0.16em" }}>NEW RECOMMENDATION</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4, color: "var(--text-2)" }}>Based on updated weight & activity</div>
              </div>
              <Icon name="bolt" size={20} style={{ color: "var(--accent)" }}/>
            </div>
            <div className="row gap-8" style={{ alignItems: "baseline", marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em", color: "var(--accent)" }}>
                {recalcResult.calories.toLocaleString()}
              </span>
              <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>kcal / day</span>
            </div>
            <div className="row gap-10">
              <RecalcPill label="P" value={recalcResult.protein} color="var(--m-protein)"/>
              <RecalcPill label="C" value={recalcResult.carbs}   color="var(--m-carbs)"/>
              <RecalcPill label="F" value={recalcResult.fat}     color="var(--m-fat)"/>
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", marginTop: 10, letterSpacing: "0.04em" }}>
              TDEE {recalcResult.tdee.toLocaleString()} · BMR {recalcResult.bmr.toLocaleString()}
            </div>
          </div>
          <div className="col gap-8">
            <button className="btn btn-primary btn-block" onClick={() => handleSave(true)}>
              Apply new targets <Icon name="check" size={18}/>
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => handleSave(false)}>
              Save stats only
            </button>
          </div>
        </div>
      )}

      {!recalcResult && (
        <div style={{ padding: "0 20px" }}>
          <button className="btn btn-primary btn-block" onClick={() => handleSave(false)}>
            Save stats <Icon name="check" size={18}/>
          </button>
        </div>
      )}
    </div>
  );
};

const RecalcPill = ({ label, value, color }) => (
  <div style={{ flex: 1, padding: "8px 10px", background: "var(--card-2)", borderRadius: 10, border: "1px solid var(--border)" }}>
    <div className="row gap-4">
      <div style={{ width: 6, height: 6, borderRadius: 2, background: color }}/>
      <span className="mono up" style={{ fontSize: 8, color: "var(--text-3)" }}>{label}</span>
    </div>
    <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{value}<span style={{ fontSize: 10, color: "var(--text-3)", marginLeft: 2 }}>g</span></div>
  </div>
);

// Edit profile info
const EditProfileScreen = ({ name, email, onSave, onBack }) => {
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);

  return (
    <div className="phone-body" style={{ padding: "0 0 32px" }}>
      <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, color: "var(--text-2)" }}>
          <Icon name="back" size={20}/>
        </button>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}>Edit profile</div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 22,
            background: "var(--accent)", color: "var(--accent-ink)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--f-display)", fontSize: 32, fontWeight: 700,
          }}>
            {editName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="col gap-12">
          <div className="card" style={{ padding: "16px 18px" }}>
            <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>FULL NAME</div>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name"
              style={{ marginTop: 6, fontSize: 18, fontWeight: 500, background: "transparent", border: "none", outline: "none", color: "var(--text)", width: "100%", fontFamily: "var(--f-display)" }}/>
          </div>
          <div className="card" style={{ padding: "16px 18px" }}>
            <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>EMAIL</div>
            <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="your@email.com" inputMode="email"
              style={{ marginTop: 6, fontSize: 16, fontWeight: 500, background: "transparent", border: "none", outline: "none", color: "var(--text)", width: "100%", fontFamily: "var(--f-display)" }}/>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <button className="btn btn-primary btn-block" onClick={() => onSave({ name: editName, email: editEmail })}>
          Save profile <Icon name="check" size={18}/>
        </button>
      </div>
    </div>
  );
};

const EditableNum = ({ label, unit, value, onChange, large }) => (
  <div>
    <div className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
      <input value={value} inputMode="numeric"
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 5))}
        className="mono"
        style={{
          fontSize: large ? 40 : 28, fontWeight: 600, letterSpacing: "-0.03em",
          background: "transparent", border: "none", outline: "none",
          color: large ? "var(--accent)" : "var(--text)", width: "100%", padding: 0, minWidth: 0,
          caretColor: "var(--accent)",
        }}/>
      <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em" }}>{unit}</span>
    </div>
  </div>
);

// Main settings screen
const Settings = ({ data, onUpdate }) => {
  const [editSection, setEditSection] = useState(null); // null | 'goals' | 'body' | 'profile'
  const [units, setUnits] = useState("metric");
  const [notif, setNotif] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [profileName, setProfileName] = useState("Alex Kowalski");
  const [profileEmail, setProfileEmail] = useState("alex@plateiq.app");

  const goalLabel = { muscle: "Muscle gain", fat: "Fat loss", maint: "Maintenance" }[data.goal] || "Maintenance";
  const levelLabel = ACTIVITY_LEVELS.find(l => l.id === data.level)?.title || "Moderately active";
  const initials = profileName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  if (editSection === "goals") {
    return <EditGoalsScreen data={data} onBack={() => setEditSection(null)}
      onSave={(updates) => { onUpdate({ ...data, ...updates }); setEditSection(null); }}/>;
  }
  if (editSection === "body") {
    return <EditBodyScreen data={data} onBack={() => setEditSection(null)}
      onSave={(updates) => { onUpdate({ ...data, ...updates }); setEditSection(null); }}/>;
  }
  if (editSection === "profile") {
    return <EditProfileScreen name={profileName} email={profileEmail} onBack={() => setEditSection(null)}
      onSave={({ name, email }) => { setProfileName(name); setProfileEmail(email); setEditSection(null); }}/>;
  }

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
          }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>{profileName}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 3 }}>{profileEmail}</div>
          </div>
          <button onClick={() => setEditSection("profile")} style={{ width: 36, height: 36, borderRadius: 10, background: "var(--card-2)", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="edit" size={16}/>
          </button>
        </div>
      </div>

      {/* Goals section */}
      <SettingSection title="Goals">
        <SettingRow icon="target" label="Goal type" value={goalLabel} chevron onClick={() => setEditSection("goals")}/>
        <SettingRow icon="flame"  label="Daily calories" value={`${data.calorieGoal.toLocaleString()} kcal`} chevron onClick={() => setEditSection("goals")} last/>
      </SettingSection>

      {/* Macro split */}
      <div style={{ padding: "0 20px 16px" }}>
        <div className="row between" style={{ padding: "0 4px 10px" }}>
          <span className="section-title">Macro split</span>
          <button onClick={() => setEditSection("goals")} className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>EDIT</button>
        </div>
        <div className="card" style={{ padding: "18px 20px" }}>
          <div className="row" style={{ gap: 10, marginBottom: 14 }}>
            <SplitPill label="P" grams={data.pGoal} color="var(--m-protein)" total={data.calorieGoal}/>
            <SplitPill label="C" grams={data.cGoal} color="var(--m-carbs)"   total={data.calorieGoal}/>
            <SplitPill label="F" grams={data.fGoal} color="var(--m-fat)"     total={data.calorieGoal}/>
          </div>
          <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex", border: "1px solid var(--border)" }}>
            {[
              { g: data.pGoal, cal: data.pGoal * 4, color: "var(--m-protein)" },
              { g: data.cGoal, cal: data.cGoal * 4, color: "var(--m-carbs)" },
              { g: data.fGoal, cal: data.fGoal * 9, color: "var(--m-fat)" },
            ].map(({ cal, color }, i) => {
              const pct = (cal / data.calorieGoal) * 100;
              return <div key={i} style={{ width: `${pct}%`, background: color }}/>;
            })}
          </div>
        </div>
      </div>

      {/* Body stats */}
      <SettingSection title="Body stats">
        <SettingRow icon="scale" label="Weight" value={data.weight ? `${data.weight} lb` : "Not set"} chevron onClick={() => setEditSection("body")}/>
        <SettingRow icon="ruler" label="Height" value={data.height ? `${data.height} cm` : "Not set"} chevron onClick={() => setEditSection("body")}/>
        <SettingRow icon="bolt"  label="Activity level" value={levelLabel} chevron onClick={() => setEditSection("body")} last/>
      </SettingSection>

      {/* Preferences */}
      <SettingSection title="Preferences">
        <SettingRow icon="ruler" label="Units">
          <SegToggle value={units} onChange={setUnits} options={[["metric", "Metric"], ["imperial", "Imperial"]]}/>
        </SettingRow>
        <SettingRow icon="bell"  label="Push notifications"><Toggle value={notif} onChange={setNotif}/></SettingRow>
        <SettingRow icon="check" label="Meal reminders"><Toggle value={reminders} onChange={setReminders}/></SettingRow>
        <SettingRow icon="trend" label="Weekly recap email" last><Toggle value={weekly} onChange={setWeekly}/></SettingRow>
      </SettingSection>

      <SettingSection title="Account">
        <SettingRow icon="user"     label="Connected apps" value="Apple Health · Strava" chevron/>
        <SettingRow icon="settings" label="Privacy & data" chevron/>
        <SettingRow icon="trash"    label="Sign out" danger last/>
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

const SettingRow = ({ icon, label, value, chevron, danger, last, children, onClick }) => (
  <button onClick={onClick}
    style={{
      width: "100%", padding: "14px 0", display: "flex", alignItems: "center", gap: 14,
      borderBottom: last ? "none" : "1px solid var(--border)",
      cursor: onClick ? "pointer" : "default",
    }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: "var(--card-2)", color: danger ? "var(--danger)" : "var(--text-2)",
      display: "flex", alignItems: "center", justifyContent: "center", flex: "none",
    }}>
      <Icon name={icon} size={15}/>
    </div>
    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: danger ? "var(--danger)" : "var(--text)", textAlign: "left" }}>{label}</span>
    {value && <span className="mono" style={{ fontSize: 12, color: "var(--text-2)" }}>{value}</span>}
    {children}
    {chevron && <Icon name="chevron" size={16} stroke={1.75}/>}
  </button>
);

const Toggle = ({ value, onChange }) => (
  <button onClick={(e) => { e.stopPropagation(); onChange(!value); }} style={{
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
      <button key={id} onClick={(e) => { e.stopPropagation(); onChange(id); }} style={{
        padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
        background: value === id ? "var(--text)" : "transparent",
        color: value === id ? "var(--shell)" : "var(--text-2)",
        transition: "all 0.15s",
      }}>{label}</button>
    ))}
  </div>
);

const SplitPill = ({ label, grams, color, total }) => {
  const calPerG = label === "F" ? 9 : 4;
  const pct = Math.round((grams * calPerG / total) * 100);
  return (
    <div style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 12 }}>
      <div className="row gap-6" style={{ alignItems: "center" }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
        <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em" }}>{label}</span>
      </div>
      <div className="mono" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 6 }}>{pct}%</div>
      <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{grams}g</div>
    </div>
  );
};

export default Settings;
