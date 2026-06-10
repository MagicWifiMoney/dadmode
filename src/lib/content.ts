// Expanded, week-aware content that layers on top of the core weekData. Used by
// the dashboard, the per-week SEO pages, and the Pro "what to say" scripts.

import { trimesterLabel } from './pregnancy';

// ------------------------- Prenatal appointment schedule -------------------
// A typical low-risk US schedule. `nextAppointment` finds the next visit due so
// the dashboard can nudge "book your 20-week anatomy scan" at the right time.

export interface Appointment {
  week: number;
  title: string;
  what: string;
  ask: string;
}

export const appointmentSchedule: Appointment[] = [
  { week: 8, title: 'First prenatal visit', what: 'Confirms the pregnancy, dates it by ultrasound, and runs baseline bloodwork.', ask: 'Which prenatal vitamin do you recommend, and what should she avoid eating?' },
  { week: 12, title: 'First-trimester screening', what: 'NT ultrasound and/or NIPT blood test for chromosomal conditions. Often the first clear heartbeat on doppler.', ask: 'Do we want genetic screening, and what do the results actually tell us?' },
  { week: 16, title: 'Routine check-up', what: 'Weight, blood pressure, and fundal height. Quick and reassuring.', ask: 'Is everything measuring on track for the due date?' },
  { week: 20, title: 'Anatomy scan', what: 'The big detailed ultrasound — checks every organ and, if you want, reveals the sex.', ask: 'Are all the organs and the placenta developing normally?' },
  { week: 24, title: 'Glucose screening', what: 'The 1-hour glucose drink test for gestational diabetes.', ask: 'What happens if the screening comes back high?' },
  { week: 28, title: '28-week visit', what: 'Glucose follow-up if needed, Rhogam shot for Rh-negative moms, and the Tdap vaccine.', ask: 'Should I get a Tdap booster too so I’m protected around the baby?' },
  { week: 32, title: 'Growth check', what: 'Confirms baby’s growth and starts tracking position.', ask: 'Is the baby head-down yet, and does it matter at this point?' },
  { week: 36, title: 'Group B strep + weekly visits', what: 'GBS swab and the switch to weekly appointments for the home stretch.', ask: 'What’s the plan if her water breaks or contractions start before the next visit?' },
  { week: 38, title: 'Weekly check', what: 'Cervix check, position, and birth-plan review.', ask: 'What are the signs it’s time to go to the hospital?' },
];

/** The next appointment due at or after the current week. */
export function nextAppointment(week: number): Appointment | null {
  return appointmentSchedule.find((a) => a.week >= week) ?? null;
}

/** The most recent appointment due at or before the current week. */
export function currentAppointment(week: number): Appointment | null {
  const past = appointmentSchedule.filter((a) => a.week <= week);
  return past.length ? past[past.length - 1] : null;
}

// ------------------------------ Weekly to-dos ------------------------------
// One concrete action per week — the single most useful thing a dad can do.

export const weekTodos: Record<number, string> = {
  1: 'Talk about the kind of parents you both want to be. Set the tone early.',
  2: 'Cut back on the drinking together — solidarity makes it easier for her.',
  3: 'Stock the kitchen with folate-rich foods and pick up a prenatal vitamin.',
  4: 'Buy a couple of pregnancy tests and be there when she takes one.',
  5: 'Put crackers by the bed and learn which smells set off her nausea.',
  6: 'Take over the cooking for anything that smells strong. No complaints.',
  7: 'Pick up ginger tea, vitamin B6, and easy snacks for the nausea.',
  8: 'Quietly handle the chores she usually does. Consistency is the gift.',
  9: 'Tell her she’s doing something incredible — and mean it. She needs to hear it.',
  10: 'Book the first prenatal appointment and put it in your calendar too.',
  11: 'Start talking to the bump. Feels silly, builds a habit that matters.',
  12: 'Decide together when and how you’ll announce. There’s no wrong answer.',
  13: 'Acknowledge how hard the first trimester was for her. Out loud.',
  14: 'Plan a date night — the second trimester is the window. Use it.',
  15: 'No heavy lifting for her. You’ve got the groceries and the laundry now.',
  16: 'Ask how she wants you to handle belly comments and touches from others.',
  17: 'Order a pregnancy pillow. It’s one of the best things you’ll buy.',
  18: 'Be present the moment she feels the first flutter. Ask her to describe it.',
  19: 'Block out the 20-week anatomy scan. Do not miss this one.',
  20: 'Go to the anatomy scan. Bring tissues — it hits harder than you expect.',
  21: 'Put your hand on her belly and wait. You’ll start feeling kicks soon.',
  22: 'Make belly moisturizing a nightly ritual, not a chore.',
  23: 'Start reading or talking to the bump nightly — the baby learns your voice.',
  24: 'Research childbirth classes and book one for around week 30.',
  25: 'Build a calming bedtime routine — her sleep is about to get harder.',
  26: 'Make a pregnancy playlist and play it near the bump.',
  27: 'Have the real conversation about birth plans, fears, and expectations.',
  28: 'Map the hospital route, parking, and check-in. Know it cold.',
  29: 'Take over all the heavy and standing tasks. Groceries, lines, lifting.',
  30: 'Pack the hospital bag together this week. Remove the panic later.',
  31: 'Check in emotionally. Listen first; resist jumping to fix-it mode.',
  32: 'Finish the nursery basics and finalize the car seat install plan.',
  33: 'Learn real labor vs. Braxton Hicks. Know what triggers the hospital trip.',
  34: 'If she can’t sleep, just be warm and present. No “you’ll be more tired” jokes.',
  35: 'Batch-cook and freeze meals for the first weeks home.',
  36: 'Install the car seat and get it checked. Most fire stations will help.',
  37: 'Charge everything, gas up the car, keep your phone on loud. Be on call.',
  38: 'Confirm the birth plan and your contact list. Stay close to home.',
  39: 'Keep the bag by the door and your calendar clear. It’s any day now.',
  40: 'Stay calm, stay ready. You’ve done the prep — now you show up for her.',
};

export function weekTodo(week: number): string {
  return weekTodos[week] ?? 'Show up, stay present, and take one thing off her plate today.';
}

// --------------------- "What to say / What not to say" ---------------------
// The Pro partner-scripts feature. Curated for high-friction moments, with a
// trimester-level fallback so every week has something useful.

export interface PartnerScript {
  say: string;
  dont: string;
  why: string;
}

const scripts: Record<number, PartnerScript> = {
  5: {
    say: '“Tell me what sounds good and I’ll go get it.”',
    dont: '“Are you sure you’re even that nauseous?”',
    why: 'Nausea is invisible and exhausting. Offering logistics beats questioning her experience.',
  },
  9: {
    say: '“You’re growing a whole person. I see how hard that is.”',
    dont: '“You’ve been so moody lately.”',
    why: 'Naming the effort lands as support; naming the mood lands as blame for something hormonal.',
  },
  16: {
    say: '“Want me to tell people to back off the belly?”',
    dont: '“It’s just a friendly touch, relax.”',
    why: 'Her body, her call. Offering to enforce the boundary makes you a teammate.',
  },
  20: {
    say: '“However today’s scan goes, we’re in it together.”',
    dont: '“I’m sure it’s totally fine, don’t worry.”',
    why: 'Anatomy-scan nerves are real. Presence reassures more than blanket optimism.',
  },
  27: {
    say: '“What are you most nervous about for the birth?”',
    dont: '“Let’s not think about that yet.”',
    why: 'Third-trimester anxiety needs an outlet. Open the door instead of closing it.',
  },
  34: {
    say: '“Come here — let’s just get through tonight.”',
    dont: '“Imagine how tired you’ll be once the baby’s here.”',
    why: 'When she can’t sleep, comfort beats comparison every time.',
  },
};

const trimesterFallback: Record<string, PartnerScript> = {
  'First Trimester': {
    say: '“What can I take off your plate today?”',
    dont: '“You don’t even look pregnant yet.”',
    why: 'The first trimester is the hardest and least visible. Lead with help, not appearance.',
  },
  'Second Trimester': {
    say: '“You look incredible — and you’re doing something incredible.”',
    dont: '“Wow, you’re really getting big.”',
    why: 'Affirm the effort and the glow; never editorialize the size.',
  },
  'Third Trimester': {
    say: '“Tell me how you’re feeling — I’m not going anywhere.”',
    dont: '“Still pregnant, huh?”',
    why: 'The home stretch is uncomfortable and anxious. Steady presence is the whole job.',
  },
};

export function partnerScript(week: number): PartnerScript {
  return scripts[week] ?? trimesterFallback[trimesterLabel(week)];
}

// --------------------------- Hospital bag presets --------------------------

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface ChecklistGroup {
  key: string;
  title: string;
  items: ChecklistItem[];
}

export const hospitalBagPreset: ChecklistGroup[] = [
  {
    key: 'partner',
    title: 'For her',
    items: [
      'ID, insurance card, and hospital paperwork',
      'Birth plan (a few printed copies)',
      'Robe, slippers, and warm socks',
      'Going-home outfit (loose, comfortable)',
      'Toiletries and hair ties',
      'Phone charger (extra-long cable)',
      'Lip balm and hard candies',
    ].map((label, i) => ({ id: `partner-${i}`, label })),
  },
  {
    key: 'dad',
    title: 'For you',
    items: [
      'Snacks and a refillable water bottle',
      'Change of clothes + a hoodie',
      'Phone, charger, and a backup battery',
      'Cash/card for parking and vending',
      'Toiletries and deodorant',
      'Pillow from home (label it)',
      'List of who to call, and when',
    ].map((label, i) => ({ id: `dad-${i}`, label })),
  },
  {
    key: 'baby',
    title: 'For the baby',
    items: [
      'Installed + inspected car seat',
      'Going-home outfit (newborn + 0–3mo)',
      'Swaddle blanket and a hat',
      'Mittens and socks',
      'A few newborn diapers (the hospital has some)',
    ].map((label, i) => ({ id: `baby-${i}`, label })),
  },
];
