"use client";

import { FormEvent, useEffect, useState } from "react";

type AttendanceEntry = {
  id: string;
  memberName: string;
  session: string;
  date: string;
  time: string;
};

type Goal = "fat-loss" | "lean-muscle" | "performance";
type Activity = "starter" | "consistent" | "athlete";
type Focus = "All" | "Strength" | "Fat Burn" | "Conditioning" | "Mobility";

const gym = {
  name: "Arcfit Gym",
  area: "Bangla Nagar",
  city: "Bikaner",
  rating: "5.0",
  ratingsCount: "24",
  category: "Gym",
  hours: "05:00 - 10:00",
  openingNote: "Opens at 5:00 AM",
  address: "Tirupati Appartment, Pugal Road, Bangla Nagar, Bikaner-334004, Rajasthan",
  justdialUrl:
    "https://www.justdial.com/Bikaner/Arcfit-Gym-Bangla-Nagar/9999PX151-X151-250703141843-L4I7_BZDET",
};

const heroStats = [
  { value: "5.0", label: "Justdial rating" },
  { value: "24", label: "ratings logged" },
  { value: "05:00", label: "doors open" },
  { value: "Bangla Nagar", label: "Bikaner base" },
];

const highlightCards = [
  {
    title: "Spacious workout floor",
    copy: "The listing review points to a roomy setup with enough variety to keep sessions from feeling repetitive.",
  },
  {
    title: "Supportive trainers",
    copy: "Coaching is described as knowledgeable and available when members need help with form or progression.",
  },
  {
    title: "Clean, practical setup",
    copy: "Members specifically call out a clean environment and restrooms, which matters in a daily-use training space.",
  },
];

const programs = [
  {
    title: "Strength Build",
    tag: "Primary",
    copy: "Progressive barbell, dumbbell, and machine work for stronger compound lifts and cleaner technique.",
    details: "4-day split",
  },
  {
    title: "Cardio Burn",
    tag: "Conditioning",
    copy: "Intervals, treadmill ladders, bike rounds, and battle-rope finishers built for stamina and calorie output.",
    details: "25-40 min blocks",
  },
  {
    title: "Body Recomp",
    tag: "Transformation",
    copy: "A balanced mix of resistance training and conditioning for members chasing muscle gain with fat loss.",
    details: "Coach-led progression",
  },
  {
    title: "Mobility Reset",
    tag: "Recovery",
    copy: "Warm-up flows, posture work, and cooldown routines to keep joints moving and recovery on track.",
    details: "Before and after lift",
  },
];

const schedule = [
  { name: "Early Grind", time: "05:00 - 07:00", coach: "Open floor + warm-up guidance" },
  { name: "Strength Lane", time: "07:30 - 10:00", coach: "Compound focus and lift support" },
  { name: "Evening Burn", time: "17:30 - 20:00", coach: "Cardio circuits and finishers" },
];

const exerciseFilters: Focus[] = ["All", "Strength", "Fat Burn", "Conditioning", "Mobility"];

const exerciseLibrary = [
  {
    name: "Barbell Back Squat",
    focus: "Strength" as const,
    level: "Intermediate",
    dose: "4 sets x 5 reps",
    note: "Drive knees out, brace before descent, and own the full depth you can control.",
  },
  {
    name: "Flat Dumbbell Press",
    focus: "Strength" as const,
    level: "Beginner",
    dose: "3 sets x 10 reps",
    note: "Keep shoulder blades pinned to the bench and finish with a smooth lockout.",
  },
  {
    name: "Treadmill Sprint Ladder",
    focus: "Fat Burn" as const,
    level: "All levels",
    dose: "20 min alternating rounds",
    note: "Push hard on the work intervals and recover fully enough to keep form sharp.",
  },
  {
    name: "Kettlebell Swing",
    focus: "Conditioning" as const,
    level: "Intermediate",
    dose: "5 sets x 20 reps",
    note: "Hinge hard, snap the hips, and let the bell float instead of lifting with the arms.",
  },
  {
    name: "Walking Lunge Circuit",
    focus: "Fat Burn" as const,
    level: "Beginner",
    dose: "3 rounds x 16 steps",
    note: "Use controlled steps and finish each round with a short pulse set for added burn.",
  },
  {
    name: "Rowing Erg Push",
    focus: "Conditioning" as const,
    level: "All levels",
    dose: "8 rounds x 250 m",
    note: "Keep stroke rate controlled and focus on leg drive before the pull.",
  },
  {
    name: "Thoracic Mobility Flow",
    focus: "Mobility" as const,
    level: "All levels",
    dose: "8 min sequence",
    note: "Open the upper back before pressing days and reset posture after long desk hours.",
  },
  {
    name: "Ankle and Hip Primer",
    focus: "Mobility" as const,
    level: "Beginner",
    dose: "2 rounds x 60 sec each",
    note: "A short prep block that makes squats and lunges feel cleaner before load goes up.",
  },
];

const galleryItems = [
  {
    title: "Power Floor",
    copy: "Poster-led hero direction translated into a full-width training floor visual.",
    position: "object-top",
  },
  {
    title: "Lift Focus",
    copy: "A tighter crop for the strength zone and serious early-morning energy.",
    position: "object-center",
  },
  {
    title: "Conditioning Edge",
    copy: "Lower framing used to make the cardio and floor-work sections feel more cinematic.",
    position: "object-bottom",
  },
];

const recoveryPillars = [
  "Structured warm-up before heavy sets",
  "Hydration and meal timing prompts",
  "Cooldown mobility after sessions",
  "Visible attendance consistency tracking",
];

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getAttendanceStreak(entries: AttendanceEntry[]) {
  const uniqueDays = new Set(entries.map((entry) => entry.date));
  let streak = 0;
  const cursor = new Date();

  while (uniqueDays.has(formatDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getWeeklyAttendanceRate(entries: AttendanceEntry[]) {
  const uniqueDays = new Set(entries.map((entry) => entry.date));
  let activeDays = 0;

  for (let offset = 0; offset < 7; offset += 1) {
    const probe = new Date();
    probe.setDate(probe.getDate() - offset);

    if (uniqueDays.has(formatDateKey(probe))) {
      activeDays += 1;
    }
  }

  return Math.round((activeDays / 7) * 100);
}

function buildDietPlan({
  weight,
  goal,
  activity,
  meals,
}: {
  weight: number;
  goal: Goal;
  activity: Activity;
  meals: number;
}) {
  const activityMultiplier = {
    starter: 28,
    consistent: 32,
    athlete: 36,
  } satisfies Record<Activity, number>;

  const calorieShift = {
    "fat-loss": -260,
    "lean-muscle": 220,
    performance: 120,
  } satisfies Record<Goal, number>;

  const proteinFactor = {
    "fat-loss": 2.2,
    "lean-muscle": 2,
    performance: 1.8,
  } satisfies Record<Goal, number>;

  const fatFactor = {
    "fat-loss": 0.8,
    "lean-muscle": 0.9,
    performance: 1,
  } satisfies Record<Goal, number>;

  const calories = Math.round(weight * activityMultiplier[activity] + calorieShift[goal]);
  const protein = Math.round(weight * proteinFactor[goal]);
  const fats = Math.round(weight * fatFactor[goal]);
  const carbs = Math.max(90, Math.round((calories - protein * 4 - fats * 9) / 4));
  const water = (weight * 0.035).toFixed(1);
  const perMeal = Math.round(calories / meals);

  const timing =
    goal === "fat-loss"
      ? "Keep the biggest carbs around training, and keep late meals lighter but protein-first."
      : goal === "lean-muscle"
        ? "Place a solid carb and protein meal 60-90 minutes before training, then eat again within 2 hours after."
        : "Use carbs before and after sessions so hard training days do not feel flat.";

  const focusNote =
    goal === "fat-loss"
      ? "Aim for high protein, vegetables in most meals, and tighter snack control."
      : goal === "lean-muscle"
        ? "Push consistent calories, lift with progression, and avoid skipping meals on training days."
        : "Stay near maintenance with enough carbs to support volume, pace, and recovery.";

  return {
    calories,
    protein,
    carbs,
    fats,
    water,
    perMeal,
    timing,
    focusNote,
  };
}

export default function Home() {
  const [activeFocus, setActiveFocus] = useState<Focus>("All");
  const [memberName, setMemberName] = useState("");
  const [selectedSession, setSelectedSession] = useState(schedule[0].name);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [attendanceMessage, setAttendanceMessage] = useState(
    "Local demo mode: attendance is saved only in this browser."
  );
  const [hydrated, setHydrated] = useState(false);
  const [dietInputs, setDietInputs] = useState<{
    weight: number;
    goal: Goal;
    activity: Activity;
    meals: number;
  }>({
    weight: 72,
    goal: "lean-muscle",
    activity: "consistent",
    meals: 4,
  });

  useEffect(() => {
    const stored = window.localStorage.getItem("arcfit-attendance");

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AttendanceEntry[];
        setAttendance(parsed);
      } catch {
        window.localStorage.removeItem("arcfit-attendance");
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem("arcfit-attendance", JSON.stringify(attendance));
  }, [attendance, hydrated]);

  const dietPlan = buildDietPlan(dietInputs);
  const visibleExercises =
    activeFocus === "All"
      ? exerciseLibrary
      : exerciseLibrary.filter((exercise) => exercise.focus === activeFocus);
  const todayKey = formatDateKey(new Date());
  const todayCount = attendance.filter((entry) => entry.date === todayKey).length;
  const streak = getAttendanceStreak(attendance);
  const weeklyRate = getWeeklyAttendanceRate(attendance);
  const recentEntries = attendance.slice(0, 4);

  function handleAttendanceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = memberName.trim();

    if (!trimmedName) {
      setAttendanceMessage("Enter a member name before marking attendance.");
      return;
    }

    const alreadyMarked = attendance.some(
      (entry) =>
        entry.date === todayKey &&
        entry.memberName.toLowerCase() === trimmedName.toLowerCase()
    );

    if (alreadyMarked) {
      setAttendanceMessage(`${trimmedName} is already marked present for today.`);
      return;
    }

    const now = new Date();
    const entry: AttendanceEntry = {
      id: `${now.getTime()}`,
      memberName: trimmedName,
      session: selectedSession,
      date: todayKey,
      time: new Intl.DateTimeFormat("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      }).format(now),
    };

    setAttendance((current) => [entry, ...current].slice(0, 18));
    setAttendanceMessage(`${trimmedName} checked into ${selectedSession}.`);
    setMemberName("");
  }

  return (
    <main className="relative overflow-x-clip bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none fixed inset-0 z-0 gym-grid opacity-40" />
      <div className="pointer-events-none fixed inset-0 z-0 gym-noise" />

      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/12 bg-[rgba(10,10,10,0.72)] px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
          <a href="#top" className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] font-black text-black">
              A
            </span>
            <span className="leading-none">
              <span className="block text-sm font-semibold uppercase tracking-[0.32em] text-white">
                Arcfit
              </span>
              <span className="block text-[0.65rem] uppercase tracking-[0.3em] text-white/55">
                Bangla Nagar
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm uppercase tracking-[0.18em] text-white/70 lg:flex">
            <a href="#about" className="transition-colors duration-300 hover:text-[var(--accent)]">
              About
            </a>
            <a href="#workouts" className="transition-colors duration-300 hover:text-[var(--accent)]">
              Workouts
            </a>
            <a href="#gallery" className="transition-colors duration-300 hover:text-[var(--accent)]">
              Gallery
            </a>
            <a href="#member-hub" className="transition-colors duration-300 hover:text-[var(--accent)]">
              Member Hub
            </a>
            <a href="#visit" className="transition-colors duration-300 hover:text-[var(--accent)]">
              Visit
            </a>
          </nav>

          <a
            href={gym.justdialUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-transform duration-300 hover:-translate-y-0.5"
          >
            View Listing
          </a>
        </div>
      </header>

      <section id="top" className="relative isolate min-h-screen overflow-hidden">
        <img
          src="/c39bc6fc8ed076108ee5c1d7f2d4bfc5.jpg"
          alt="Arcfit Gym training poster inspired hero"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.62),rgba(8,8,8,0.84)_54%,rgba(8,8,8,0.97))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(247,119,31,0.24),transparent_20%),radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.16),transparent_18%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-4 pb-10 pt-28 sm:px-6 lg:px-10 lg:pb-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end">
            <div className="space-y-7">
              <div className="fade-slide inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                {gym.area} • {gym.city}
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] pulse-dot" />
              </div>

              <div className="space-y-4">
                <p className="fade-slide delay-1 text-sm uppercase tracking-[0.42em] text-white/55">
                  Built for daily discipline
                </p>
                <h1 className="fade-slide delay-2 max-w-5xl text-[clamp(4.5rem,13vw,10.6rem)] font-black uppercase leading-[0.88] tracking-[-0.06em] text-white">
                  Built By
                  <span className="block text-[var(--accent)]">Effort.</span>
                  <span className="block">Powered By You.</span>
                </h1>
                <p className="fade-slide delay-3 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                  A poster-inspired Arcfit Gym website for Bangla Nagar, Bikaner, built around the Justdial listing details,
                  high-energy visuals, and practical member tools for training, attendance, and diet planning.
                </p>
              </div>

              <div className="fade-slide delay-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#member-hub"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(247,119,31,0.32)]"
                >
                  Start Member Hub
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/6 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  Explore Arcfit
                </a>
              </div>

              <div className="fade-slide delay-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="glass-card rounded-[1.5rem] px-4 py-4 backdrop-blur"
                  >
                    <p className="text-2xl font-black uppercase tracking-[-0.04em] text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/55">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="fade-slide delay-3 rounded-[2rem] border border-white/12 bg-[rgba(7,7,7,0.72)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Arcfit Snapshot</p>
                  <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">
                    {gym.name}
                  </h2>
                </div>
                <div className="rounded-full bg-[rgba(247,119,31,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  {gym.category}
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-[1.4rem] bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Listing hours</p>
                  <p className="mt-2 text-xl font-bold uppercase text-white">{gym.hours}</p>
                  <p className="mt-2 text-sm leading-7 text-white/65">{gym.openingNote}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {schedule.map((slot) => (
                    <div
                      key={slot.name}
                      className="rounded-[1.35rem] border border-white/10 bg-black/35 p-4"
                    >
                      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                        {slot.name}
                      </p>
                      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-white">
                        {slot.time}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/58">{slot.coach}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="#visit"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/16 bg-white/6 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Check Address and Access
                </a>
              </div>
            </aside>
          </div>

          <div className="mt-10 overflow-hidden rounded-full border border-white/10 bg-black/45">
            <div className="marquee-track">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`marquee-${index}`}
                  className="marquee-group flex min-w-full items-center justify-around gap-6 px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/65"
                >
                  <span>Strength Blocks</span>
                  <span>Cardio Burn</span>
                  <span>Attendance Tracking</span>
                  <span>Diet Helper</span>
                  <span>Mobility Finishers</span>
                  <span>Bangla Nagar Energy</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 bg-[var(--surface)] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[120px_minmax(0,1fr)] lg:gap-10">
          <div className="hidden lg:flex">
            <span className="vertical-word text-[clamp(5rem,10vw,8.5rem)] font-black uppercase tracking-[0.22em] text-[var(--accent)]">
              About
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
            <div className="space-y-5">
              <p className="section-tag">Arcfit Story</p>
              <h2 className="text-[clamp(2.8rem,6vw,5.2rem)] font-black uppercase leading-[0.92] tracking-[-0.05em] text-black">
                Local gym energy, rebuilt as a sharp digital brand.
              </h2>
              <p className="max-w-xl text-base leading-8 text-black/72">
                Arcfit Gym is listed in Bangla Nagar, Bikaner with a 5.0 rating and 24 ratings on Justdial. The listing
                positions it as an accessible neighborhood training space on Pugal Road, and the site now turns that
                basic listing into a complete gym experience with motion, conversion sections, and member utilities.
              </p>
              <div className="rounded-[2rem] border border-black/8 bg-black px-6 py-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Visit Address</p>
                <p className="mt-4 text-lg leading-8 text-white/85">{gym.address}</p>
                <a
                  href={gym.justdialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Open Justdial Listing
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlightCards.map((item, index) => (
                <article
                  key={item.title}
                  className={`lift-card rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] delay-${index + 1}`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-6 text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-black">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-black/65">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workouts" className="relative z-10 overflow-hidden bg-[var(--accent)] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_20%,rgba(255,255,255,0.18),transparent_16%),radial-gradient(circle_at_10%_70%,rgba(0,0,0,0.16),transparent_18%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-tag section-tag-dark">Workouts</p>
              <h2 className="text-[clamp(3.1rem,8vw,6.7rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-black">
                Training lanes for every goal.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-black/72">
              The poster mood carries into a bold orange training section with dedicated programs, an exercise library,
              and movement guidance that feels like a real gym website instead of a static flyer.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {programs.map((program) => (
              <article
                key={program.title}
                className="lift-card rounded-[2rem] border border-black/10 bg-[rgba(7,7,7,0.92)] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">{program.tag}</p>
                <h3 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em]">
                  {program.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/68">{program.copy}</p>
                <p className="mt-6 inline-flex rounded-full border border-white/12 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
                  {program.details}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[2.4rem] border border-black/10 bg-[rgba(255,245,238,0.78)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.12)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/45">Exercise Library</p>
                <h3 className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-black">
                  Filter the floor by focus.
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {exerciseFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFocus(filter)}
                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                      activeFocus === filter
                        ? "bg-black text-white"
                        : "border border-black/10 bg-white text-black hover:border-black/40"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {visibleExercises.map((exercise) => (
                <article
                  key={exercise.name}
                  className="rounded-[1.7rem] border border-black/8 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-[rgba(247,119,31,0.14)] px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                      {exercise.focus}
                    </span>
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-black/45">
                      {exercise.level}
                    </span>
                  </div>
                  <h4 className="mt-5 text-2xl font-black uppercase leading-[1] tracking-[-0.03em] text-black">
                    {exercise.name}
                  </h4>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-black/58">
                    {exercise.dose}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-black/68">{exercise.note}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="relative z-10 bg-[#111111] px-4 py-16 text-white sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div>
              <p className="section-tag">Gallery</p>
              <h2 className="mt-4 text-[clamp(3rem,7vw,6.2rem)] font-black uppercase leading-[0.9] tracking-[-0.06em]">
                Visuals with gym weight, not template polish.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
                This gallery keeps the same intense visual language as the reference poster: dense contrast, orange
                accents, oversized type, and photography treated as atmosphere instead of filler.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Member Signal</p>
              <p className="mt-4 text-5xl font-black uppercase tracking-[-0.05em] text-[var(--accent)]">
                {gym.rating}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/58">
                Justdial rating from {gym.ratingsCount} ratings
              </p>
              <p className="mt-5 text-sm leading-7 text-white/68">
                Review sentiment highlights a spacious layout, varied workout options, clean restrooms, and trainers who
                help members stay on track.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[0.95fr_1.1fr_0.95fr]">
            {galleryItems.map((item) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black"
              >
                <img
                  src="/c39bc6fc8ed076108ee5c1d7f2d4bfc5.jpg"
                  alt={item.title}
                  className={`h-[25rem] w-full ${item.position} object-cover transition-transform duration-700 group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.78))]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Arcfit Frame</p>
                  <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="member-hub" className="relative z-10 bg-[var(--surface)] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="section-tag">Member Hub</p>
            <h2 className="mt-4 text-[clamp(3rem,7vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-black">
              Attendance, schedule, and diet support in one place.
            </h2>
            <p className="mt-5 text-base leading-8 text-black/68">
              This section turns the gym page into something useful. Attendance is handled as a browser-saved demo, the
              schedule stays visible, and the diet helper gives quick macro estimates for common training goals.
            </p>
          </div>

          <div className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <section className="rounded-[2.3rem] border border-black/10 bg-black p-6 text-white shadow-[0_26px_70px_rgba(0,0,0,0.18)] sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Attendance System</p>
                  <h3 className="mt-3 text-[clamp(2rem,4vw,3.3rem)] font-black uppercase leading-[0.94] tracking-[-0.04em]">
                    Mark today&apos;s session.
                  </h3>
                </div>
                <div className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/62">
                  {hydrated ? "Browser storage active" : "Loading saved logs"}
                </div>
              </div>

              <form onSubmit={handleAttendanceSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                    Member Name
                  </span>
                  <input
                    value={memberName}
                    onChange={(event) => setMemberName(event.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-[1.2rem] border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none transition-colors duration-300 placeholder:text-white/28 focus:border-[var(--accent)]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                    Session
                  </span>
                  <select
                    value={selectedSession}
                    onChange={(event) => setSelectedSession(event.target.value)}
                    className="w-full rounded-[1.2rem] border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none transition-colors duration-300 focus:border-[var(--accent)]"
                  >
                    {schedule.map((slot) => (
                      <option key={slot.name} value={slot.name} className="bg-black text-white">
                        {slot.name} • {slot.time}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-[1.2rem] bg-[var(--accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Mark Present
                </button>

                <p className="rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-3 text-sm leading-7 text-white/72">
                  {attendanceMessage}
                </p>
              </form>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Check-ins today", value: `${todayCount}` },
                  { label: "Active streak", value: `${streak} day${streak === 1 ? "" : "s"}` },
                  { label: "7-day rate", value: `${weeklyRate}%` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-5"
                  >
                    <p className="text-3xl font-black uppercase tracking-[-0.04em] text-[var(--accent)]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/48">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-white">Recent entries</p>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/42">Latest four logs</span>
                </div>

                <div className="mt-4 space-y-3">
                  {recentEntries.length > 0 ? (
                    recentEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-white/8 bg-black/35 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
                            {entry.memberName}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/48">
                            {entry.session}
                          </p>
                        </div>
                        <div className="text-right text-xs uppercase tracking-[0.18em] text-white/48">
                          <p>{entry.date}</p>
                          <p className="mt-1">{entry.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.2rem] border border-dashed border-white/12 px-4 py-6 text-sm leading-7 text-white/62">
                      No attendance logged yet. Add a member name and mark a session to generate the first check-in.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="grid gap-5">
              <section className="rounded-[2.3rem] border border-black/10 bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.12)] sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-black/42">Diet Helper</p>
                    <h3 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black uppercase leading-[0.94] tracking-[-0.04em] text-black">
                      Quick macro planner.
                    </h3>
                  </div>
                  <p className="max-w-sm text-sm leading-7 text-black/58">
                    Justdial does not confirm a nutritionist on the listing, so this is presented as an on-site estimate tool.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
                  <div className="grid gap-4">
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
                        Body Weight
                      </span>
                      <input
                        type="number"
                        min="35"
                        max="180"
                        value={dietInputs.weight}
                        onChange={(event) =>
                          setDietInputs((current) => ({
                            ...current,
                            weight: Number(event.target.value) || current.weight,
                          }))
                        }
                        className="w-full rounded-[1.2rem] border border-black/10 bg-[#f5f1ec] px-4 py-3 text-sm text-black outline-none transition-colors duration-300 focus:border-black"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
                        Goal
                      </span>
                      <select
                        value={dietInputs.goal}
                        onChange={(event) =>
                          setDietInputs((current) => ({
                            ...current,
                            goal: event.target.value as Goal,
                          }))
                        }
                        className="w-full rounded-[1.2rem] border border-black/10 bg-[#f5f1ec] px-4 py-3 text-sm text-black outline-none transition-colors duration-300 focus:border-black"
                      >
                        <option value="fat-loss">Fat loss</option>
                        <option value="lean-muscle">Lean muscle</option>
                        <option value="performance">Performance</option>
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
                        Training Frequency
                      </span>
                      <select
                        value={dietInputs.activity}
                        onChange={(event) =>
                          setDietInputs((current) => ({
                            ...current,
                            activity: event.target.value as Activity,
                          }))
                        }
                        className="w-full rounded-[1.2rem] border border-black/10 bg-[#f5f1ec] px-4 py-3 text-sm text-black outline-none transition-colors duration-300 focus:border-black"
                      >
                        <option value="starter">Starter: 2-3 sessions</option>
                        <option value="consistent">Consistent: 4-5 sessions</option>
                        <option value="athlete">Athlete: 6+ sessions</option>
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
                        Meals Per Day
                      </span>
                      <input
                        type="number"
                        min="3"
                        max="6"
                        value={dietInputs.meals}
                        onChange={(event) =>
                          setDietInputs((current) => ({
                            ...current,
                            meals: Math.min(6, Math.max(3, Number(event.target.value) || current.meals)),
                          }))
                        }
                        className="w-full rounded-[1.2rem] border border-black/10 bg-[#f5f1ec] px-4 py-3 text-sm text-black outline-none transition-colors duration-300 focus:border-black"
                      />
                    </label>
                  </div>

                  <div className="rounded-[1.8rem] bg-black p-5 text-white">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { label: "Calories", value: `${dietPlan.calories} kcal` },
                        { label: "Protein", value: `${dietPlan.protein} g` },
                        { label: "Carbs", value: `${dietPlan.carbs} g` },
                        { label: "Fats", value: `${dietPlan.fats} g` },
                      ].map((macro) => (
                        <div
                          key={macro.label}
                          className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4"
                        >
                          <p className="text-xs uppercase tracking-[0.22em] text-white/42">{macro.label}</p>
                          <p className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-[var(--accent)]">
                            {macro.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/42">Per meal target</p>
                      <p className="mt-2 text-xl font-black uppercase tracking-[-0.04em] text-white">
                        {dietPlan.perMeal} kcal across {dietInputs.meals} meals
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/68">Hydration target: {dietPlan.water} L daily.</p>
                    </div>

                    <div className="mt-5 space-y-4 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-white/42">Focus note</p>
                        <p className="mt-2 text-sm leading-7 text-white/74">{dietPlan.focusNote}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-white/42">Meal timing</p>
                        <p className="mt-2 text-sm leading-7 text-white/74">{dietPlan.timing}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <div className="rounded-[2rem] border border-black/10 bg-[var(--accent)] p-6 text-black shadow-[0_22px_55px_rgba(0,0,0,0.12)]">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/48">Recovery Layer</p>
                  <h3 className="mt-4 text-4xl font-black uppercase leading-[0.94] tracking-[-0.04em]">
                    Keep members consistent.
                  </h3>
                  <div className="mt-6 space-y-3">
                    {recoveryPillars.map((pillar) => (
                      <div
                        key={pillar}
                        className="rounded-[1.2rem] border border-black/10 bg-white/35 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em]"
                      >
                        {pillar}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_22px_55px_rgba(0,0,0,0.12)]">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/45">Live Schedule</p>
                  <div className="mt-5 space-y-4">
                    {schedule.map((slot) => (
                      <article
                        key={slot.name}
                        className="rounded-[1.4rem] border border-black/8 bg-[#f5f1ec] px-5 py-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h4 className="text-xl font-black uppercase tracking-[-0.03em] text-black">
                            {slot.name}
                          </h4>
                          <span className="rounded-full border border-black/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black/55">
                            {slot.time}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-black/65">{slot.coach}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section id="visit" className="relative z-10 bg-black px-4 py-16 text-white sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] lg:items-end">
          <div>
            <p className="section-tag">Visit Arcfit</p>
            <h2 className="mt-4 text-[clamp(3rem,7vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.06em]">
              Train in Bangla Nagar with a sharper first impression online.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
              The site now covers the essentials a gym needs: branding, credibility, workouts, a gallery, an attendance
              flow, and a diet helper. The live business details used here are grounded in the Arcfit Gym Justdial listing.
            </p>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Address</p>
            <p className="mt-4 text-lg leading-8 text-white/82">{gym.address}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-white/10 bg-black/35 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/42">Area</p>
                <p className="mt-2 text-xl font-black uppercase tracking-[-0.03em]">{gym.area}</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-black/35 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/42">Hours shown</p>
                <p className="mt-2 text-xl font-black uppercase tracking-[-0.03em]">{gym.hours}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={gym.justdialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black transition-transform duration-300 hover:-translate-y-0.5"
              >
                Open Justdial
              </a>
              <a
                href="#top"
                className="inline-flex items-center justify-center rounded-full border border-white/14 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Back To Top
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
