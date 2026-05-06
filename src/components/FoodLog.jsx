import { useState, useEffect } from 'react';
import Icon from './Icon.jsx';
import { Chip } from './Primitives.jsx';

const FOODS = [
  { id: "f1",  name: "Chicken breast, grilled", brand: "Generic",   servingG: 100, servingLabel: "100g",             kcal: 165, p: 31,   c: 0,   f: 3.6, freq: 18 },
  { id: "f2",  name: "Whey isolate",            brand: "MyProtein", servingG: 30,  servingLabel: "1 scoop · 30g",    kcal: 113, p: 25,   c: 1,   f: 0.6, freq: 32 },
  { id: "f3",  name: "White rice, cooked",      brand: "Generic",   servingG: 100, servingLabel: "100g",             kcal: 130, p: 2.7,  c: 28,  f: 0.3, freq: 14 },
  { id: "f4",  name: "Sweet potato, baked",     brand: "Generic",   servingG: 150, servingLabel: "1 medium · 150g", kcal: 135, p: 2.4,  c: 31,  f: 0.2, freq: 9 },
  { id: "f5",  name: "Greek yogurt 0%",         brand: "Fage",      servingG: 170, servingLabel: "1 pot · 170g",    kcal: 100, p: 18,   c: 6,   f: 0,   freq: 21 },
  { id: "f6",  name: "Banana, medium",          brand: "Generic",   servingG: 118, servingLabel: "1 medium · 118g", kcal: 105, p: 1.3,  c: 27,  f: 0.4, freq: 25 },
  { id: "f7",  name: "Eggs, whole",             brand: "Generic",   servingG: 100, servingLabel: "2 large · 100g",  kcal: 156, p: 12.6, c: 1.2, f: 10.6, freq: 17 },
  { id: "f8",  name: "Almonds, raw",            brand: "Generic",   servingG: 28,  servingLabel: "1 oz · 28g",      kcal: 164, p: 6,    c: 6,   f: 14,  freq: 7 },
  { id: "f9",  name: "Oats, rolled",            brand: "Quaker",    servingG: 40,  servingLabel: "1/2 cup · 40g",   kcal: 150, p: 5,    c: 27,  f: 3,   freq: 12 },
  { id: "f10", name: "Salmon fillet",           brand: "Generic",   servingG: 120, servingLabel: "1 fillet · 120g", kcal: 248, p: 25,   c: 0,   f: 16,  freq: 4 },
  { id: "f11", name: "Avocado",                 brand: "Generic",   servingG: 100, servingLabel: "1/2 medium · 100g", kcal: 160, p: 2, c: 9, f: 15, freq: 6 },
  { id: "f12", name: "Broccoli, steamed",       brand: "Generic",   servingG: 100, servingLabel: "100g",            kcal: 35,  p: 2.4,  c: 7,   f: 0.4, freq: 11 },
];

const TIME_FOR_SLOT = { breakfast: "08:24", lunch: "13:10", dinner: "19:30", snack: "16:45" };

const FoodLog = ({ onClose, onAdd, onUpdate, mealSlot, setMealSlot, editing, custom: showCustom, quick: showQuick }) => {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(editing ? { entry: editing, food: editing._food } : null);
  const [scanning, setScanning] = useState(false);
  const [customMode, setCustomMode] = useState(showCustom || false);
  const [quickMode, setQuickMode] = useState(showQuick || false);

  const filtered = FOODS.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
  const recent = [...FOODS].sort((a, b) => b.freq - a.freq).slice(0, 6);
  const slots = ["breakfast", "lunch", "dinner", "snack"];

  if (selected) {
    return <FoodDetail
      food={selected.food} entry={selected.entry} mealSlot={mealSlot}
      onBack={() => setSelected(null)}
      onLog={(entry) => {
        if (selected.entry && onUpdate) onUpdate(entry);
        else onAdd(entry);
      }}/>;
  }
  if (scanning) return <Scanner onClose={() => setScanning(false)} onPick={(f) => { setScanning(false); setSelected({ food: f }); }}/>;
  if (customMode) return <CustomFood onBack={() => setCustomMode(false)} onSave={(entry) => { onAdd(entry); }} mealSlot={mealSlot}/>;
  if (quickMode) return <QuickAdd onBack={() => setQuickMode(false)} onSave={(entry) => { onAdd(entry); }} mealSlot={mealSlot}/>;

  return (
    <div className="phone-body" style={{ padding: "0 0 110px" }}>
      <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onClose} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, color: "var(--text-2)" }}>
          <Icon name="back" size={20}/>
        </button>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}>Log food</div>
      </div>

      <div style={{ padding: "0 20px 16px", display: "flex", gap: 8, overflowX: "auto" }}>
        {slots.map(s => (
          <Chip key={s} active={mealSlot === s} onClick={() => setMealSlot(s)}>{s}</Chip>
        ))}
      </div>

      <div style={{ padding: "0 20px 14px", display: "flex", gap: 10 }}>
        <div style={{
          flex: 1, height: 52, background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 14, display: "flex", alignItems: "center", padding: "0 14px", gap: 10,
        }}>
          <Icon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search foods, brands..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 14, fontFamily: "var(--f-display)" }}/>
          {q && <button onClick={() => setQ("")} style={{ color: "var(--text-3)" }}><Icon name="close" size={16}/></button>}
        </div>
        <button onClick={() => setScanning(true)} style={{
          width: 52, height: 52, borderRadius: 14, background: "var(--card)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)",
        }}>
          <Icon name="barcode" size={20}/>
        </button>
      </div>

      <div style={{ padding: "0 20px 18px", display: "flex", gap: 10 }}>
        <QuickAction icon="plus" label="Custom" sub="Add a one-off" onClick={() => setCustomMode(true)}/>
        <QuickAction icon="bolt" label="Quick add" sub="Just kcal" onClick={() => setQuickMode(true)}/>
      </div>

      {!q && (
        <>
          <SectionTitle title="Recents & frequent" right={<span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{recent.length}</span>}/>
          <div className="col gap-6" style={{ padding: "0 20px 18px" }}>
            {recent.map(f => <FoodRow key={f.id} food={f} onClick={() => setSelected({ food: f })}/>)}
          </div>
        </>
      )}

      {q && (
        <>
          <SectionTitle title={`Results for "${q}"`} right={<span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{filtered.length}</span>}/>
          <div className="col gap-6" style={{ padding: "0 20px 18px" }}>
            {filtered.length === 0 ? (
              <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
                No matches. Try Custom, or scan a barcode.
              </div>
            ) : filtered.map(f => <FoodRow key={f.id} food={f} onClick={() => setSelected({ food: f })}/>)}
          </div>
        </>
      )}
    </div>
  );
};

const QuickAction = ({ icon, label, sub, onClick }) => (
  <button onClick={onClick} style={{
    flex: 1, padding: "12px 12px",
    background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14,
    textAlign: "left", display: "flex", flexDirection: "column", gap: 6,
  }}>
    <Icon name={icon} size={18}/>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
      <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{sub}</div>
    </div>
  </button>
);

const SectionTitle = ({ title, right }) => (
  <div className="row between" style={{ padding: "4px 24px 10px" }}>
    <span className="section-title">{title}</span>
    {right}
  </div>
);

const FoodRow = ({ food, onClick }) => (
  <button onClick={onClick} style={{
    width: "100%", padding: "12px 16px",
    background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14,
    display: "flex", alignItems: "center", gap: 12, textAlign: "left",
  }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--card-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)", flex: "none" }}>
      <Icon name="leaf" size={16}/>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{food.name}</div>
      <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 3, letterSpacing: "0.04em" }}>
        {food.servingLabel.toUpperCase()} · P {food.p}g · C {food.c}g · F {food.f}g
      </div>
    </div>
    <div className="col" style={{ alignItems: "flex-end" }}>
      <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{food.kcal}</div>
      <div className="mono" style={{ fontSize: 9, color: "var(--text-3)" }}>kcal</div>
    </div>
  </button>
);

const FoodDetail = ({ food, entry, mealSlot, onBack, onLog }) => {
  const editing = !!entry;
  const initialGrams = editing ? entry.grams : food.servingG;
  const [grams, setGrams] = useState(String(initialGrams));
  const g = +grams || 0;
  const ratio = g / food.servingG;
  const round = (n) => +(n * ratio).toFixed(1);
  const kcal = Math.round(food.kcal * ratio);
  const p = round(food.p), c = round(food.c), f = round(food.f);
  const valid = g > 0;

  return (
    <div className="phone-body" style={{ padding: "0 0 32px" }}>
      <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, color: "var(--text-2)" }}>
          <Icon name="back" size={20}/>
        </button>
        <div style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>{editing ? "Edit entry" : "Add entry"}</div>
        <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em" }}>{mealSlot}</span>
      </div>

      <div style={{ padding: "8px 24px 24px" }}>
        <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>{food.brand.toUpperCase()}</div>
        <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", margin: "6px 0 14px", lineHeight: 1.1 }}>{food.name}</h2>

        <div className="card" style={{ padding: "20px 22px" }}>
          <div className="row between" style={{ alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>WEIGHT</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
                <input value={grams} inputMode="numeric"
                  onChange={(e) => setGrams(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="mono"
                  style={{
                    fontSize: 44, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1,
                    background: "transparent", border: "none", outline: "none",
                    color: "var(--text)", width: "100%", padding: 0, minWidth: 0,
                    caretColor: "var(--accent)",
                  }}/>
                <span className="mono up" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.14em" }}>g</span>
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", marginTop: 6, letterSpacing: "0.04em" }}>
                1 SERVING = {food.servingG}g · {food.servingLabel.toUpperCase()}
              </div>
            </div>
            <div style={{ textAlign: "right", paddingLeft: 16 }}>
              <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>TOTAL</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, justifyContent: "flex-end", marginTop: 6 }}>
                <div className="mono" style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--accent)" }}>{kcal}</div>
              </div>
              <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em", marginTop: 4 }}>kcal</div>
            </div>
          </div>

          <div className="row gap-6" style={{ marginTop: 14, flexWrap: "wrap" }}>
            {[food.servingG, food.servingG * 0.5, food.servingG * 1.5, food.servingG * 2, 100].map((v, i) => {
              const val = Math.round(v);
              return (
                <button key={i} onClick={() => setGrams(String(val))}
                  style={{
                    padding: "6px 12px", borderRadius: 999,
                    background: g === val ? "var(--text)" : "transparent",
                    color: g === val ? "var(--shell)" : "var(--text-2)",
                    border: `1px solid ${g === val ? "var(--text)" : "var(--border-2)"}`,
                    fontFamily: "var(--f-mono)", fontSize: 11, fontWeight: 500,
                  }}>{val}g</button>
              );
            })}
          </div>
        </div>

        <div className="row between" style={{ padding: "16px 4px 8px" }}>
          <span className="section-title">Macros</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>per {g}g</span>
        </div>
        <div className="card" style={{ padding: "18px 20px" }}>
          <MacroLine label="Protein" value={p} unit="g" color="var(--m-protein)"/>
          <Divider/>
          <MacroLine label="Carbs"   value={c} unit="g" color="var(--m-carbs)"/>
          <Divider/>
          <MacroLine label="Fat"     value={f} unit="g" color="var(--m-fat)"/>
          <Divider/>
          <MacroLine label="Fiber"   value={(2.4 * ratio).toFixed(1)} unit="g" muted/>
          <Divider/>
          <MacroLine label="Sodium"  value={(78 * ratio).toFixed(0)} unit="mg" muted/>
        </div>

        <button className="btn btn-primary btn-block" disabled={!valid} style={{ marginTop: 22, opacity: valid ? 1 : 0.4 }}
          onClick={() => onLog({
            id: editing ? entry.id : "m" + Date.now(),
            name: food.name,
            slot: mealSlot,
            time: editing ? entry.time : TIME_FOR_SLOT[mealSlot],
            grams: g,
            kcal, p, c, f,
            _food: food,
          })}>
          {editing ? "Save changes" : `Log to ${mealSlot}`} <Icon name="chevron" size={18} stroke={2}/>
        </button>
      </div>
    </div>
  );
};

const CustomFood = ({ onBack, onSave, mealSlot }) => {
  const [name, setName] = useState("");
  const [grams, setGrams] = useState("100");
  const [kcal, setKcal] = useState("");
  const [p, setP] = useState("");
  const [c, setC] = useState("");
  const [f, setF] = useState("");
  const valid = name && +grams > 0 && +kcal >= 0;
  return (
    <div className="phone-body" style={{ padding: "0 0 32px" }}>
      <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, color: "var(--text-2)" }}>
          <Icon name="back" size={20}/>
        </button>
        <div style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>Custom food</div>
        <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em" }}>{mealSlot}</span>
      </div>
      <div style={{ padding: "8px 24px 24px" }}>
        <div className="card" style={{ padding: "16px 18px", marginBottom: 12 }}>
          <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>NAME</div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Homemade chicken curry"
            style={{ marginTop: 6, fontSize: 18, fontWeight: 500, background: "transparent", border: "none", outline: "none", color: "var(--text)", width: "100%", fontFamily: "var(--f-display)" }}/>
        </div>
        <div className="row gap-10" style={{ marginBottom: 12 }}>
          <CustomNum label="WEIGHT" unit="g" value={grams} onChange={setGrams}/>
          <CustomNum label="CALORIES" unit="kcal" value={kcal} onChange={setKcal}/>
        </div>
        <div className="row gap-10">
          <CustomNum label="PROTEIN" unit="g" value={p} onChange={setP} small/>
          <CustomNum label="CARBS"   unit="g" value={c} onChange={setC} small/>
          <CustomNum label="FAT"     unit="g" value={f} onChange={setF} small/>
        </div>
        <button className="btn btn-primary btn-block" disabled={!valid} style={{ marginTop: 22, opacity: valid ? 1 : 0.4 }}
          onClick={() => onSave({
            id: "m" + Date.now(),
            name, slot: mealSlot, time: TIME_FOR_SLOT[mealSlot],
            grams: +grams, kcal: +kcal, p: +p || 0, c: +c || 0, f: +f || 0,
            _food: { name, brand: "Custom", servingG: +grams, servingLabel: `${grams}g`, kcal: +kcal, p: +p||0, c: +c||0, f: +f||0 },
          })}>
          Add to {mealSlot}
        </button>
      </div>
    </div>
  );
};

const CustomNum = ({ label, unit, value, onChange, small }) => (
  <div style={{ flex: 1, padding: "12px 14px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}>
    <div className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.16em" }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
      <input value={value} inputMode="decimal"
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, "").slice(0, 5))}
        placeholder="0"
        className="mono"
        style={{ fontSize: small ? 20 : 24, fontWeight: 600, letterSpacing: "-0.03em", background: "transparent", border: "none", outline: "none", color: "var(--text)", width: "100%", padding: 0, minWidth: 0, caretColor: "var(--accent)" }}/>
      <span className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.12em" }}>{unit}</span>
    </div>
  </div>
);

const QuickAdd = ({ onBack, onSave, mealSlot }) => {
  const [kcal, setKcal] = useState("");
  const [name, setName] = useState("");
  const valid = +kcal > 0;
  return (
    <div className="phone-body" style={{ padding: "0 0 32px" }}>
      <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, color: "var(--text-2)" }}>
          <Icon name="back" size={20}/>
        </button>
        <div style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>Quick add</div>
        <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em" }}>{mealSlot}</span>
      </div>
      <div style={{ padding: "8px 24px 24px" }}>
        <div className="card" style={{ padding: "26px 22px", textAlign: "center" }}>
          <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>CALORIES</div>
          <input value={kcal} inputMode="numeric"
            onChange={(e) => setKcal(e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="0"
            className="mono"
            style={{ marginTop: 8, fontSize: 72, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1, background: "transparent", border: "none", outline: "none", color: "var(--accent)", width: "100%", textAlign: "center", caretColor: "var(--accent)" }}/>
          <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em", marginTop: 8 }}>KCAL</div>
        </div>
        <div className="card" style={{ padding: "14px 18px", marginTop: 12 }}>
          <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>LABEL <span style={{ opacity: 0.6 }}>· OPTIONAL</span></div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Coffee, snack..."
            style={{ marginTop: 4, fontSize: 16, fontWeight: 500, background: "transparent", border: "none", outline: "none", color: "var(--text)", width: "100%", fontFamily: "var(--f-display)" }}/>
        </div>
        <button className="btn btn-primary btn-block" disabled={!valid} style={{ marginTop: 22, opacity: valid ? 1 : 0.4 }}
          onClick={() => onSave({
            id: "m" + Date.now(),
            name: name || "Quick add",
            slot: mealSlot, time: TIME_FOR_SLOT[mealSlot],
            grams: 0, kcal: +kcal, p: 0, c: 0, f: 0, quick: true,
          })}>
          Add to {mealSlot}
        </button>
      </div>
    </div>
  );
};

const MacroLine = ({ label, value, unit, color, muted }) => (
  <div className="row between" style={{ padding: "10px 0" }}>
    <div className="row gap-12">
      {color && <div style={{ width: 6, height: 22, borderRadius: 3, background: color }}/>}
      <span style={{ fontSize: 14, color: muted ? "var(--text-3)" : "var(--text)", fontWeight: 500 }}>{label}</span>
    </div>
    <span className="mono" style={{ fontSize: 16, fontWeight: 600, color: muted ? "var(--text-2)" : "var(--text)" }}>
      {value}<span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 3 }}>{unit}</span>
    </span>
  </div>
);

const Divider = () => <div style={{ height: 1, background: "var(--border)" }}/>;

const Scanner = ({ onClose, onPick }) => {
  useEffect(() => {
    const t = setTimeout(() => onPick(FOODS[1]), 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="phone-body" style={{ background: "#000", color: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ color: "#fff" }}><Icon name="close" size={22}/></button>
        <div className="mono up" style={{ fontSize: 11, letterSpacing: "0.14em" }}>SCAN BARCODE</div>
        <div style={{ width: 22 }}/>
      </div>
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 260, height: 160, border: "2px solid var(--accent)", borderRadius: 14, position: "relative", boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "var(--accent)", animation: "scanLine 1.6s ease-in-out infinite", boxShadow: "0 0 16px var(--accent)" }}/>
        </div>
      </div>
      <div style={{ padding: "20px 24px 36px", textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 13, opacity: 0.7 }}>Align barcode within frame...</div>
      </div>
    </div>
  );
};

export default FoodLog;
