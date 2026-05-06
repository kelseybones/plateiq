import { useState, useEffect } from 'react';
import { StatusBar, TabBar } from './components/Primitives.jsx';
import Onboarding from './components/Onboarding.jsx';
import { Dashboard, MealDetail } from './components/Dashboard.jsx';
import FoodLog from './components/FoodLog.jsx';
import MacroBreakdown from './components/MacroBreakdown.jsx';
import Progress from './components/Progress.jsx';
import Settings from './components/Settings.jsx';

const SEED_MEALS = [
  { id: "m1",  name: "Whey isolate",          slot: "breakfast", time: "08:24", grams: 30,  kcal: 113, p: 25,   c: 1,   f: 0.6,
    _food: { name: "Whey isolate", brand: "MyProtein", servingG: 30, servingLabel: "1 scoop · 30g", kcal: 113, p: 25, c: 1, f: 0.6 } },
  { id: "m1b", name: "Oats, rolled",           slot: "breakfast", time: "08:25", grams: 80,  kcal: 300, p: 10,   c: 54,  f: 6,
    _food: { name: "Oats, rolled", brand: "Quaker", servingG: 40, servingLabel: "1/2 cup · 40g", kcal: 150, p: 5, c: 27, f: 3 } },
  { id: "m2",  name: "Chicken breast, grilled",slot: "lunch",     time: "13:10", grams: 200, kcal: 330, p: 62,   c: 0,   f: 7.2,
    _food: { name: "Chicken breast, grilled", brand: "Generic", servingG: 100, servingLabel: "100g", kcal: 165, p: 31, c: 0, f: 3.6 } },
  { id: "m2b", name: "White rice, cooked",     slot: "lunch",     time: "13:11", grams: 180, kcal: 234, p: 4.9,  c: 50,  f: 0.5,
    _food: { name: "White rice, cooked", brand: "Generic", servingG: 100, servingLabel: "100g", kcal: 130, p: 2.7, c: 28, f: 0.3 } },
  { id: "m3",  name: "Greek yogurt 0%",        slot: "snack",     time: "16:45", grams: 170, kcal: 100, p: 18,   c: 6,   f: 0,
    _food: { name: "Greek yogurt 0%", brand: "Fage", servingG: 170, servingLabel: "1 pot · 170g", kcal: 100, p: 18, c: 6, f: 0 } },
  { id: "m3b", name: "Banana, medium",         slot: "snack",     time: "16:46", grams: 118, kcal: 105, p: 1.3,  c: 27,  f: 0.4,
    _food: { name: "Banana, medium", brand: "Generic", servingG: 118, servingLabel: "1 medium · 118g", kcal: 105, p: 1.3, c: 27, f: 0.4 } },
];

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfile] = useState({
    goal: "muscle",
    calorieGoal: 2800, pGoal: 180, cGoal: 320, fGoal: 90,
    weight: 180, height: 180, level: "very",
  });
  const [meals, setMeals] = useState(SEED_MEALS);
  const [tab, setTab] = useState("home");
  const [route, setRoute] = useState({ name: "home" });
  const [mealSlot, setMealSlot] = useState("lunch");
  const [logView, setLogView] = useState("list");

  const totals = meals.reduce((acc, m) => ({
    kcal: acc.kcal + m.kcal,
    p: acc.p + (+m.p),
    c: acc.c + (+m.c),
    f: acc.f + (+m.f),
  }), { kcal: 0, p: 0, c: 0, f: 0 });

  const data = {
    consumed: totals.kcal,
    calorieGoal: profile.calorieGoal,
    p: Math.round(totals.p), c: Math.round(totals.c), f: Math.round(totals.f),
    pGoal: profile.pGoal, cGoal: profile.cGoal, fGoal: profile.fGoal,
    meals,
  };

  const handleOnboard = ({ goal, weight, height, level, calories, protein, carbs, fat }) => {
    setProfile({ goal, calorieGoal: calories, pGoal: protein, cGoal: carbs, fGoal: fat, weight, height, level });
    setOnboarded(true);
  };

  const handleAddMeal = (entry) => {
    setMeals(m => [...m, entry]);
    if (route.fromMealDetail) setRoute({ name: "mealDetail", slot: route.slot });
    else setRoute({ name: "home" });
    setTab("home");
  };

  const handleUpdateMeal = (entry) => {
    setMeals(m => m.map(x => x.id === entry.id ? entry : x));
    if (route.fromMealDetail) setRoute({ name: "mealDetail", slot: entry.slot });
    else setRoute({ name: "home" });
    setTab("home");
  };

  const openLog = (slot, opts = {}) => {
    if (slot) setMealSlot(slot);
    setRoute({ name: "log", slot: slot || mealSlot, ...opts });
  };

  const openMealDetail = (slot) => {
    setMealSlot(slot);
    setRoute({ name: "mealDetail", slot });
  };

  const editEntry = (entry, fromMealDetail) => {
    setMealSlot(entry.slot);
    setRoute({ name: "log", slot: entry.slot, editing: entry, fromMealDetail });
  };

  const backFromLog = () => {
    if (route.fromMealDetail) setRoute({ name: "mealDetail", slot: route.slot || mealSlot });
    else setRoute({ name: "home" });
  };

  const logging = route.name === "log";
  const inMealDetail = route.name === "mealDetail";
  const showTabbar = onboarded && !logging;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      gap: 24,
    }}>
      <BackdropDots/>

      <div className="phone" data-screen-label={
        !onboarded    ? "Onboarding" :
        logging       ? "Food log" :
        inMealDetail  ? "Meal detail" :
        tab === "home"     ? "Dashboard" :
        tab === "macros"   ? "Macros" :
        tab === "progress" ? "Progress" :
        "Settings"
      }>
        {!onboarded ? (
          <Onboarding onComplete={handleOnboard}/>
        ) : (
          <>
            <StatusBar/>
            {logging ? (
              <FoodLog
                onClose={backFromLog}
                onAdd={handleAddMeal}
                onUpdate={handleUpdateMeal}
                mealSlot={mealSlot}
                setMealSlot={setMealSlot}
                editing={route.editing}
                custom={route.custom}
                quick={route.quick}
              />
            ) : inMealDetail ? (
              <MealDetail
                slotId={route.slot}
                meals={meals}
                onBack={() => setRoute({ name: "home" })}
                onEdit={(m) => editEntry(m, true)}
                onAdd={(slot) => { setMealSlot(slot); setRoute({ name: "log", slot, fromMealDetail: true }); }}
              />
            ) : (
              <div className="phone-body">
                {tab === "home" && (
                  <Dashboard
                    data={data}
                    layout="ring"
                    onLog={() => openLog()}
                    onMeal={(m) => editEntry(m, false)}
                    view={logView}
                    onView={setLogView}
                    onOpenMeal={openMealDetail}
                  />
                )}
                {tab === "macros"   && <MacroBreakdown data={data} variant="donut"/>}
                {tab === "progress" && <Progress data={data}/>}
                {tab === "profile"  && <Settings data={profile} onUpdate={setProfile}/>}
              </div>
            )}
            {showTabbar && (
              <TabBar
                active={tab}
                onChange={(t) => { setTab(t); setRoute({ name: "home" }); }}
                onPlus={() => openLog()}
              />
            )}
          </>
        )}
      </div>

      <PhoneCaption tab={tab} logging={logging} inMealDetail={inMealDetail} onboarded={onboarded}/>
    </div>
  );
}

const PhoneCaption = ({ tab, logging, inMealDetail, onboarded }) => {
  const labels = {
    home:     "Dashboard · ring-first layout",
    macros:   "Macro breakdown",
    progress: "Progress tracking",
    profile:  "Settings & profile",
  };
  const text = !onboarded   ? "Onboarding · 5 steps · auto-calc" :
               logging      ? "Food logging · grams-based detail" :
               inMealDetail ? "Meal detail · items + add more" :
               labels[tab];
  return (
    <div style={{
      fontFamily: "var(--f-mono)", fontSize: 11,
      color: "var(--text-3)", letterSpacing: "0.16em",
      textTransform: "uppercase",
    }}>{text}</div>
  );
};

const BackdropDots = () => (
  <div style={{
    position: "fixed", inset: 0, pointerEvents: "none",
    backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    opacity: 0.35,
    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
  }}/>
);
