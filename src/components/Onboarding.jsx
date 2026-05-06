import { useState } from 'react';
import Icon from './Icon.jsx';
import { StatusBar } from './Primitives.jsx';
import { calcTargets } from '../utils/calc.js';

const OnboardingShell = ({ step, total, onBack, children }) => (
  <div className="phone-body" style={{ display: "flex", flexDirection: "column" }}>
    <div style={{ padding: "8px 24px 0", display: "flex", alignItems: "center", gap: 16 }}>
      {step > 0 ? (
        <button onClick={onBack} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, color: "var(--text-2)" }}>
          <Icon name="back" size={20} />
        </button>
      ) : <div style={{ width: 36 }} />}
      <div style={{ flex: 1, display: "flex", gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? "var(--accent)" : "var(--border)",
            transition: "background 0.3s",
          }}/>
        ))}
      </div>
      <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", width: 36, textAlign: "right" }}>
        {String(step + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </div>
    </div>
    {children}
  </div>
);

const StepWelcome = ({ onNext }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "60px 28px 36px" }}>
    <div className="fade-up" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div className="eyebrow" style={{ marginBottom: 28 }}>v1.0 · TRAIN HARD</div>
      <div style={{ position: "relative", marginBottom: 36 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" stroke="var(--border)" strokeWidth="2" fill="none"/>
          <circle cx="60" cy="60" r="52" stroke="var(--accent)" strokeWidth="2" fill="none"
                  strokeDasharray="326" strokeDashoffset="80" strokeLinecap="round" transform="rotate(-90 60 60)"/>
          <circle cx="60" cy="60" r="6" fill="var(--accent)"/>
        </svg>
      </div>
      <h1 style={{ fontFamily: "var(--f-display)", fontWeight: 700, fontSize: 48, lineHeight: 0.95, letterSpacing: "-0.03em", margin: 0 }}>
        PlateIQ.
      </h1>
      <p style={{ fontFamily: "var(--f-display)", fontSize: 19, color: "var(--text-2)", lineHeight: 1.4, margin: "20px 0 0", maxWidth: 280 }}>
        Track smarter. <span style={{ color: "var(--text)" }}>Perform better.</span>
      </p>
    </div>
    <div className="col gap-12">
      <button className="btn btn-primary btn-block" onClick={onNext}>
        Get started <Icon name="chevron" size={18} stroke={2}/>
      </button>
      <button className="btn btn-ghost btn-block" style={{ height: 48, fontSize: 14 }}>I have an account</button>
    </div>
  </div>
);

const NumField = ({ label, unit, value, onChange, maxLen = 4 }) => (
  <div style={{ flex: 1, padding: "14px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14 }}>
    <div className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.16em" }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
      <input value={value} inputMode="numeric"
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, maxLen))}
        className="mono"
        style={{
          fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em",
          background: "transparent", border: "none", outline: "none",
          color: "var(--text)", width: "100%", padding: 0, minWidth: 0,
          caretColor: "var(--accent)",
        }}/>
      <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em" }}>{unit}</span>
    </div>
  </div>
);

const StepBody = ({ weight, onWeight, height, onHeight, level, onLevel, onNext }) => {
  const levels = [
    { id: "sedentary", title: "Sedentary",        sub: "DESK JOB · LITTLE EXERCISE",  mult: 1.2 },
    { id: "light",     title: "Lightly active",   sub: "1–3 SESSIONS / WEEK",         mult: 1.375 },
    { id: "moderate",  title: "Moderately active",sub: "3–5 SESSIONS / WEEK",         mult: 1.55 },
    { id: "very",      title: "Very active",      sub: "6–7 SESSIONS / WEEK",         mult: 1.725 },
    { id: "athlete",   title: "Athlete",          sub: "DAILY · 2-A-DAYS",            mult: 1.9 },
  ];
  const valid = +weight >= 60 && +weight <= 600 && +height >= 100 && +height <= 230 && level;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "44px 28px 28px" }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>STEP 02 · YOUR STATS</div>
      <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.05 }}>
        About you.
      </h2>
      <p style={{ color: "var(--text-2)", margin: "12px 0 22px", fontSize: 14 }}>
        We use these to calculate your targets. Stays private.
      </p>
      <div className="row gap-12" style={{ marginBottom: 14 }}>
        <NumField label="WEIGHT" unit="lb" value={weight} onChange={onWeight} maxLen={3}/>
        <NumField label="HEIGHT" unit="cm" value={height} onChange={onHeight} maxLen={3}/>
      </div>
      <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em", margin: "8px 4px 8px" }}>FITNESS LEVEL</div>
      <div className="col gap-8" style={{ flex: 1 }}>
        {levels.map(l => (
          <button key={l.id} onClick={() => onLevel(l.id)}
            style={{
              padding: "14px 18px", borderRadius: 14, textAlign: "left",
              background: level === l.id ? "var(--accent)" : "var(--card)",
              color: level === l.id ? "var(--accent-ink)" : "var(--text)",
              border: `1px solid ${level === l.id ? "var(--accent)" : "var(--border)"}`,
              display: "flex", alignItems: "center", gap: 12,
            }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{l.title}</div>
              <div className="mono" style={{ fontSize: 10, color: level === l.id ? "inherit" : "var(--text-3)", opacity: level === l.id ? 0.75 : 1, marginTop: 3, letterSpacing: "0.06em" }}>
                {l.sub}
              </div>
            </div>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>×{l.mult}</span>
          </button>
        ))}
      </div>
      <button className="btn btn-primary btn-block" onClick={onNext} disabled={!valid}
        style={{ marginTop: 14, opacity: valid ? 1 : 0.4 }}>
        Continue
      </button>
    </div>
  );
};

const GoalCard = ({ icon, title, sub, target, active, onClick }) => (
  <button onClick={onClick}
    style={{
      width: "100%", textAlign: "left",
      padding: "20px 22px",
      borderRadius: 18,
      background: active ? "var(--accent)" : "var(--card)",
      color: active ? "var(--accent-ink)" : "var(--text)",
      border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
      display: "flex", alignItems: "center", gap: 18,
      transition: "all 0.18s",
    }}>
    <div style={{
      width: 56, height: 56, borderRadius: 14,
      background: active ? "rgba(0,0,0,0.12)" : "var(--card-2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flex: "none",
    }}>
      <Icon name={icon} size={26} stroke={1.75}/>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
      <div className="mono" style={{ fontSize: 11, opacity: active ? 0.75 : 1, color: active ? "inherit" : "var(--text-3)", marginTop: 4, letterSpacing: "0.04em" }}>
        {sub}
      </div>
    </div>
    <div className="mono" style={{ fontSize: 12, fontWeight: 600, opacity: active ? 0.85 : 0.7 }}>
      {target}
    </div>
  </button>
);

const StepGoal = ({ value, onChange, onNext }) => {
  const goals = [
    { id: "muscle", icon: "muscle", title: "Muscle gain", sub: "SURPLUS · +10%",  target: "+250 kcal" },
    { id: "fat",    icon: "flame",  title: "Fat loss",    sub: "DEFICIT · −20%",  target: "−500 kcal" },
    { id: "maint",  icon: "scale",  title: "Maintenance", sub: "RECOMP · TDEE",   target: "±0 kcal" },
  ];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "44px 28px 28px" }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>STEP 03 · OBJECTIVE</div>
      <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.05 }}>
        What's your<br/>primary goal?
      </h2>
      <p style={{ color: "var(--text-2)", margin: "12px 0 28px", fontSize: 14 }}>
        Pick one. You can change it later.
      </p>
      <div className="col gap-12" style={{ flex: 1 }}>
        {goals.map(g => (
          <GoalCard key={g.id} {...g} active={value === g.id} onClick={() => onChange(g.id)} />
        ))}
      </div>
      <button className="btn btn-primary btn-block" disabled={!value} onClick={onNext}
        style={{ marginTop: 16, opacity: value ? 1 : 0.4 }}>
        Continue
      </button>
    </div>
  );
};

const MacroPill = ({ label, g, color }) => (
  <div style={{ flex: 1, padding: "14px 14px", border: "1px solid var(--border)", borderRadius: 14, background: "var(--card)" }}>
    <div className="row gap-6" style={{ alignItems: "center" }}>
      <div style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
      <span className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>{label}</span>
    </div>
    <div className="mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 6 }}>
      {g}<span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 2 }}>g</span>
    </div>
  </div>
);

// StepPlan: shows auto-calculated targets but lets users edit calories and protein
const StepPlan = ({ targets, onNext }) => {
  const [calories, setCalories] = useState(String(targets.calories));
  const [protein, setProtein] = useState(String(targets.protein));

  const kcal = +calories || targets.calories;
  const prot = +protein || targets.protein;
  const fatKcal = kcal * 0.25;
  const fat = Math.round(fatKcal / 9);
  const carbs = Math.max(0, Math.round((kcal - fatKcal - prot * 4) / 4));

  const customTargets = { ...targets, calories: kcal, protein: prot, fat, carbs };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "44px 28px 28px" }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>STEP 04 · YOUR PLAN</div>
      <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.05 }}>
        We did<br/>the math.
      </h2>
      <p style={{ color: "var(--text-2)", margin: "12px 0 22px", fontSize: 14 }}>
        Tap any value to adjust it.
      </p>

      {/* Editable calorie card */}
      <div className="card" style={{ padding: "20px 22px" }}>
        <div className="row between" style={{ alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>DAILY CALORIES</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
              <input
                value={calories}
                inputMode="numeric"
                onChange={(e) => setCalories(e.target.value.replace(/\D/g, "").slice(0, 5))}
                className="mono"
                style={{
                  fontSize: 52, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1,
                  background: "transparent", border: "none", outline: "none",
                  color: "var(--accent)", width: "100%", padding: 0, minWidth: 0,
                  caretColor: "var(--accent)",
                }}
              />
              <span className="mono up" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.14em" }}>kcal</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>TDEE {targets.tdee.toLocaleString()}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>BMR {targets.bmr.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Editable macros row */}
      <div className="row gap-10" style={{ marginTop: 14 }}>
        {/* Protein — editable */}
        <div style={{ flex: 1, padding: "14px 14px", border: "1px solid var(--border)", borderRadius: 14, background: "var(--card)" }}>
          <div className="row gap-6" style={{ alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--m-protein)" }}/>
            <span className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>PROTEIN</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginTop: 6 }}>
            <input
              value={protein}
              inputMode="numeric"
              onChange={(e) => setProtein(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="mono"
              style={{
                fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em",
                background: "transparent", border: "none", outline: "none",
                color: "var(--text)", width: "100%", padding: 0, minWidth: 0,
                caretColor: "var(--accent)",
              }}
            />
            <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 2 }}>g</span>
          </div>
        </div>
        <MacroPill label="CARBS" g={carbs} color="var(--m-carbs)"/>
        <MacroPill label="FAT"   g={fat}   color="var(--m-fat)"/>
      </div>

      <div className="card" style={{ padding: "12px 16px", marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="bolt" size={16}/>
        <span style={{ fontSize: 12, color: "var(--text-2)" }}>Mifflin-St Jeor · Activity-adjusted · Carbs auto-adjust</span>
      </div>

      <div style={{ flex: 1 }}/>

      <button className="btn btn-primary btn-block" onClick={() => onNext(customTargets)} style={{ marginTop: 16 }}>
        Set my plan <Icon name="chevron" size={18} stroke={2}/>
      </button>
    </div>
  );
};

const SummaryRow = ({ label, value, last }) => (
  <div style={{
    padding: "14px 22px",
    borderBottom: last ? "none" : "1px solid var(--border)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  }}>
    <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--text-3)" }}>{label}</div>
    <div className="mono" style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
  </div>
);

const StepDone = ({ goal, targets, onNext }) => {
  const goalLabel = { muscle: "Muscle gain", fat: "Fat loss", maint: "Maintenance" }[goal] || "—";
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "44px 28px 28px" }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>STEP 05 · CONFIRMED</div>
      <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.05 }}>
        You're all set.
      </h2>
      <p style={{ color: "var(--text-2)", margin: "12px 0 28px", fontSize: 14 }}>
        Your daily plan is locked in.
      </p>
      <div className="card" style={{ padding: "8px 0", flex: 1 }}>
        <SummaryRow label="GOAL"     value={goalLabel}/>
        <SummaryRow label="CALORIES" value={`${targets.calories.toLocaleString()} kcal`}/>
        <SummaryRow label="PROTEIN"  value={`${targets.protein} g`}/>
        <SummaryRow label="CARBS"    value={`${targets.carbs} g`}/>
        <SummaryRow label="FAT"      value={`${targets.fat} g`} last/>
      </div>
      <div className="row gap-8" style={{ marginTop: 16, padding: "12px 0", color: "var(--text-2)" }}>
        <Icon name="check" size={18}/>
        <span style={{ fontSize: 13 }}>Apple Health & Strava sync available</span>
      </div>
      <button className="btn btn-primary btn-block" onClick={onNext} style={{ marginTop: 8 }}>
        Go to dashboard <Icon name="chevron" size={18} stroke={2}/>
      </button>
    </div>
  );
};

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [weight, setWeight] = useState("180");
  const [height, setHeight] = useState("180");
  const [level, setLevel] = useState("very");
  const [goal, setGoal] = useState("muscle");
  const [customTargets, setCustomTargets] = useState(null);

  const autoTargets = calcTargets({ weightLb: weight, heightCm: height, level, goal });
  const targets = customTargets || autoTargets;

  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handlePlanNext = (t) => {
    setCustomTargets(t);
    next();
  };

  const screens = [
    <StepWelcome key="0" onNext={next}/>,
    <StepBody key="1" weight={weight} onWeight={setWeight} height={height} onHeight={setHeight}
              level={level} onLevel={setLevel} onNext={next}/>,
    <StepGoal key="2" value={goal} onChange={(g) => { setGoal(g); setCustomTargets(null); }} onNext={next}/>,
    <StepPlan key="3" targets={autoTargets} onNext={handlePlanNext}/>,
    <StepDone key="4" goal={goal} targets={targets}
              onNext={() => onComplete({ goal, weight: +weight, height: +height, level, ...targets })}/>,
  ];

  return (
    <>
      <StatusBar/>
      <OnboardingShell step={step} total={5} onBack={back}>
        {screens[step]}
      </OnboardingShell>
    </>
  );
};

export default Onboarding;
