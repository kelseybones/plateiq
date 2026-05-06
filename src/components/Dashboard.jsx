import { useState } from 'react';
import Icon from './Icon.jsx';
import { Ring, ProgressBar, Ticker, Chip } from './Primitives.jsx';

function formatNavDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
}

const DateNav = ({ selectedDate, onPrevDay, onNextDay, isToday }) => (
  <div className="row" style={{ alignItems: "center", gap: 6 }}>
    <button onClick={onPrevDay} style={{
      width: 32, height: 32, borderRadius: 9, background: "var(--card)", border: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)",
    }}>
      <Icon name="back" size={16}/>
    </button>
    <div className="mono" style={{
      fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
      color: isToday ? "var(--accent)" : "var(--text-2)", minWidth: 120, textAlign: "center",
    }}>
      {isToday ? "Today" : formatNavDate(selectedDate)}
    </div>
    <button onClick={onNextDay} disabled={isToday} style={{
      width: 32, height: 32, borderRadius: 9, background: "var(--card)", border: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: isToday ? "var(--text-3)" : "var(--text-2)",
      opacity: isToday ? 0.35 : 1,
    }}>
      <Icon name="chevron" size={16}/>
    </button>
  </div>
);

const ScreenHeader = ({ greeting, selectedDate, isToday, onPrevDay, onNextDay, streak }) => (
  <div style={{ padding: "8px 24px 18px" }}>
    <div className="row between" style={{ alignItems: "center", marginBottom: 10 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{greeting}</div>
      </div>
      <div className="row gap-8" style={{
        padding: "8px 12px", borderRadius: 999,
        border: "1px solid var(--border)", background: "var(--card)",
      }}>
        <Icon name="fire" size={16}/>
        <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{streak} day</span>
      </div>
    </div>
    <DateNav selectedDate={selectedDate} onPrevDay={onPrevDay} onNextDay={onNextDay} isToday={isToday}/>
  </div>
);

const RingHero = ({ consumed, goal }) => {
  const remaining = Math.max(0, goal - consumed);
  return (
    <div className="col center" style={{ padding: "8px 0 24px", position: "relative" }}>
      <Ring
        value={consumed}
        goal={goal}
        size={240}
        stroke={14}
        label={
          <>
            <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>EATEN</div>
            <div className="mono" style={{ fontSize: 56, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.04em", marginTop: 4 }}>
              <Ticker value={consumed}/>
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
              of {goal.toLocaleString()} kcal
            </div>
          </>
        }
      />
      <div className="row" style={{ gap: 32, marginTop: 18 }}>
        <Stat label="REMAINING" value={remaining.toLocaleString()} unit="kcal" highlight/>
        <div style={{ width: 1, background: "var(--border)" }}/>
        <Stat label="BURNED" value="412" unit="kcal"/>
        <div style={{ width: 1, background: "var(--border)" }}/>
        <Stat label="NET" value={(consumed - 412).toLocaleString()} unit="kcal"/>
      </div>
    </div>
  );
};

const Stat = ({ label, value, unit, highlight }) => (
  <div className="col center">
    <div className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.16em" }}>{label}</div>
    <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: highlight ? "var(--accent)" : "var(--text)", marginTop: 4 }}>
      {value}
    </div>
    <div className="mono" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.1em", marginTop: 2 }}>{unit}</div>
  </div>
);

const MacroBar = ({ name, code, value, goal, color, big = false }) => {
  const pct = Math.round((value / goal) * 100);
  return (
    <div className="col gap-8">
      <div className="row between" style={{ alignItems: "baseline" }}>
        <div className="row gap-8" style={{ alignItems: "baseline" }}>
          {big ? (
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>{name}</span>
          ) : (
            <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em" }}>{code}</span>
          )}
        </div>
        <div className="row gap-6" style={{ alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: big ? 18 : 13, fontWeight: 600 }}>{Math.round(value)}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>/ {goal}g</span>
          <span className="mono" style={{ fontSize: 11, color: pct >= 100 ? "var(--accent)" : "var(--text-3)", marginLeft: 6 }}>{pct}%</span>
        </div>
      </div>
      <ProgressBar value={value} goal={goal} accent={color} height={big ? 10 : 6}/>
    </div>
  );
};

const SlotIcon = ({ slot }) => {
  const icons = { breakfast: "sunrise", lunch: "sun", dinner: "moon", snack: "leaf" };
  return (
    <div style={{
      width: 42, height: 42, borderRadius: 11,
      background: "var(--card-2)", display: "flex", alignItems: "center", justifyContent: "center",
      color: "var(--text-2)", flex: "none",
    }}>
      <Icon name={icons[slot] || "leaf"} size={18}/>
    </div>
  );
};

const MealRow = ({ meal, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", width: "100%", padding: "14px 16px",
    background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)",
    alignItems: "center", gap: 12, textAlign: "left",
  }}>
    <SlotIcon slot={meal.slot}/>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {meal.name}
      </div>
      <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 3, letterSpacing: "0.04em" }}>
        {meal.slot.toUpperCase()}{meal.grams ? ` · ${meal.grams}G` : ""} · P {meal.p}g · C {meal.c}g · F {meal.f}g
      </div>
    </div>
    <div className="col" style={{ alignItems: "flex-end" }}>
      <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{meal.kcal}</div>
      <div className="mono" style={{ fontSize: 9, color: "var(--text-3)" }}>kcal</div>
    </div>
  </button>
);

export const MEAL_SLOTS = [
  { id: "breakfast", label: "Breakfast", icon: "sunrise", window: "06–10" },
  { id: "lunch",     label: "Lunch",     icon: "sun",     window: "12–14" },
  { id: "dinner",    label: "Dinner",    icon: "moon",    window: "18–21" },
  { id: "snack",     label: "Snacks",    icon: "leaf",    window: "ANY" },
];

const LogViewToggle = ({ view, onChange }) => (
  <div className="row" style={{
    background: "var(--card-2)", borderRadius: 10, padding: 3, gap: 0,
    border: "1px solid var(--border)",
  }}>
    {[["list", "List"], ["meals", "By meal"]].map(([id, label]) => (
      <button key={id} onClick={() => onChange(id)}
        style={{
          padding: "6px 12px", borderRadius: 8,
          background: view === id ? "var(--card)" : "transparent",
          border: view === id ? "1px solid var(--border-2)" : "1px solid transparent",
          color: view === id ? "var(--text)" : "var(--text-3)",
          fontFamily: "var(--f-mono)", fontSize: 10.5, fontWeight: 600,
          letterSpacing: "0.06em", textTransform: "uppercase",
        }}>{label}</button>
    ))}
  </div>
);

const MealGroupCard = ({ slot, meals, onOpen }) => {
  const totals = meals.reduce((a, m) => ({
    kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f,
  }), { kcal: 0, p: 0, c: 0, f: 0 });
  const empty = meals.length === 0;
  return (
    <button onClick={onOpen} style={{
      width: "100%", textAlign: "left",
      padding: "16px 18px", borderRadius: 14,
      background: "var(--card)", border: "1px solid var(--border)",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flex: "none",
        background: empty ? "var(--card-2)" : "var(--accent)",
        color: empty ? "var(--text-2)" : "var(--accent-ink)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={slot.icon} size={20}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row between" style={{ alignItems: "baseline" }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{slot.label}</span>
          <span className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>{slot.window}</span>
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4, letterSpacing: "0.04em" }}>
          {empty ? "NO ITEMS" : `${meals.length} ${meals.length === 1 ? "ITEM" : "ITEMS"} · P ${Math.round(totals.p)}G · C ${Math.round(totals.c)}G · F ${Math.round(totals.f)}G`}
        </div>
      </div>
      <div className="col" style={{ alignItems: "flex-end" }}>
        <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: empty ? "var(--text-3)" : "var(--text)" }}>
          {empty ? "—" : totals.kcal}
        </div>
        <div className="mono" style={{ fontSize: 9, color: "var(--text-3)" }}>kcal</div>
      </div>
      <Icon name="chevron" size={16} stroke={2}/>
    </button>
  );
};

const LogSection = ({ meals, view, onView, onMeal, onOpenMeal, isToday, onLog }) => (
  <div style={{ padding: "8px 20px 0" }}>
    <div className="row between" style={{ marginBottom: 12, padding: "0 4px", alignItems: "center" }}>
      <span className="section-title">Food log</span>
      <LogViewToggle view={view} onChange={onView}/>
    </div>
    {view === "meals" ? (
      <div className="col gap-8">
        {MEAL_SLOTS.map(s => (
          <MealGroupCard key={s.id} slot={s}
            meals={meals.filter(m => m.slot === s.id)}
            onOpen={() => onOpenMeal(s.id)}/>
        ))}
      </div>
    ) : meals.length === 0 ? (
      <div className="card" style={{ padding: 28, textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)" }}>
          Nothing logged
        </div>
        {isToday && (
          <button className="btn btn-primary" onClick={onLog} style={{ marginTop: 14, height: 44, fontSize: 14 }}>
            <Icon name="plus" size={16} stroke={2.2}/> Add first meal
          </button>
        )}
      </div>
    ) : (
      <div className="col gap-8">
        {meals.map((m) => <MealRow key={m.id} meal={m} onClick={() => onMeal(m)}/>)}
      </div>
    )}
  </div>
);

const DashRingFirst = ({ data, onLog, onMeal, view, onView, onOpenMeal, selectedDate, onPrevDay, onNextDay, isToday }) => (
  <div style={{ padding: "0 0 110px" }}>
    <ScreenHeader greeting="Hey, Alex." selectedDate={selectedDate} isToday={isToday} onPrevDay={onPrevDay} onNextDay={onNextDay} streak={42}/>
    <RingHero consumed={data.consumed} goal={data.calorieGoal}/>
    <div style={{ padding: "0 20px 16px" }}>
      <div className="card" style={{ padding: "20px 22px" }}>
        <MacroBar name="Protein" value={data.p} goal={data.pGoal} color="var(--m-protein)" big/>
        <div style={{ height: 16 }}/>
        <div className="row gap-20">
          <div style={{ flex: 1 }}><MacroBar name="Carbs" code="CARBS" value={data.c} goal={data.cGoal} color="var(--m-carbs)"/></div>
          <div style={{ flex: 1 }}><MacroBar name="Fat" code="FAT" value={data.f} goal={data.fGoal} color="var(--m-fat)"/></div>
        </div>
      </div>
    </div>
    {isToday && (
      <div style={{ padding: "0 20px 16px" }}>
        <button className="btn btn-primary btn-block" onClick={onLog}>
          <Icon name="plus" size={18} stroke={2.2}/> Log a meal
        </button>
      </div>
    )}
    <LogSection meals={data.meals} view={view} onView={onView} onMeal={onMeal} onOpenMeal={onOpenMeal} isToday={isToday} onLog={onLog}/>
  </div>
);

export const Dashboard = ({ data, layout, onLog, onMeal, view, onView, onOpenMeal, selectedDate, onPrevDay, onNextDay, isToday }) => {
  return (
    <DashRingFirst
      data={data} onLog={onLog} onMeal={onMeal} view={view} onView={onView} onOpenMeal={onOpenMeal}
      selectedDate={selectedDate} onPrevDay={onPrevDay} onNextDay={onNextDay} isToday={isToday}
    />
  );
};

const MiniMacro = ({ label, value, color }) => (
  <div style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 10, background: "var(--card-2)" }}>
    <div className="row gap-6">
      <div style={{ width: 6, height: 6, borderRadius: 2, background: color }}/>
      <span className="mono up" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em" }}>{label}</span>
    </div>
    <div className="mono" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>
      {value}<span style={{ fontSize: 10, color: "var(--text-3)", marginLeft: 2 }}>g</span>
    </div>
  </div>
);

export const MealDetail = ({ slotId, meals, onBack, onEdit, onAdd }) => {
  const slot = MEAL_SLOTS.find(s => s.id === slotId) || MEAL_SLOTS[0];
  const items = meals.filter(m => m.slot === slotId);
  const totals = items.reduce((a, m) => ({
    kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f,
  }), { kcal: 0, p: 0, c: 0, f: 0 });

  return (
    <div className="phone-body" style={{ padding: "0 0 110px" }}>
      <div style={{ padding: "10px 20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, color: "var(--text-2)" }}>
          <Icon name="back" size={20}/>
        </button>
        <div style={{ flex: 1 }}>
          <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>{slot.window}</div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>{slot.label}</div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 11, background: "var(--accent)", color: "var(--accent-ink)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={slot.icon} size={18}/>
        </div>
      </div>

      <div style={{ padding: "0 20px 16px" }}>
        <div className="card" style={{ padding: "18px 20px" }}>
          <div className="row between" style={{ alignItems: "baseline" }}>
            <div>
              <div className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>MEAL TOTAL</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <div className="mono" style={{ fontSize: 38, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>{totals.kcal}</div>
                <span className="mono up" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.16em" }}>kcal</span>
              </div>
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", textAlign: "right" }}>
              {items.length} {items.length === 1 ? "item" : "items"}
            </div>
          </div>
          <div className="row gap-12" style={{ marginTop: 14 }}>
            <MiniMacro label="P" value={Math.round(totals.p)} color="var(--m-protein)"/>
            <MiniMacro label="C" value={Math.round(totals.c)} color="var(--m-carbs)"/>
            <MiniMacro label="F" value={Math.round(totals.f)} color="var(--m-fat)"/>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px 16px" }}>
        <button className="btn btn-primary btn-block" onClick={() => onAdd(slotId)}>
          <Icon name="plus" size={18} stroke={2.2}/> Add to {slot.label.toLowerCase()}
        </button>
      </div>

      <div style={{ padding: "8px 20px 0" }}>
        <div className="row between" style={{ marginBottom: 12, padding: "0 4px" }}>
          <span className="section-title">Items</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{items.length}</span>
        </div>
        {items.length === 0 ? (
          <div className="card" style={{ padding: 28, textAlign: "center" }}>
            <div className="mono up" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.14em" }}>NOTHING LOGGED YET</div>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 8 }}>Tap "Add to {slot.label.toLowerCase()}" to start tracking.</div>
          </div>
        ) : (
          <div className="col gap-8">
            {items.map(m => <MealRow key={m.id} meal={m} onClick={() => onEdit(m)}/>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
