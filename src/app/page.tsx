"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mail, RefreshCw, ChevronRight, Baby, Shield, Zap } from 'lucide-react';

interface WeekData {
  week: number;
  icon: string;
  size: string;
  baby: string;
  partner: string;
  dadTip: string;
  hormone: {
    level: string;
    note: string;
  };
}

const weekData: WeekData[] = [
  { week: 1, icon: '🌿', size: 'A poppy seed', baby: "Fertilization hasn't happened yet — this is technically pre-pregnancy. Your partner's body is gearing up, releasing hormones to prepare for ovulation.", partner: "Light spotting or cramping may occur. Her body doesn't know it yet — but the journey is beginning.", dadTip: "Start a conversation about what you both want from this pregnancy. Set the tone early — presence over perfection.", hormone: { level: 'low', note: 'Estrogen and progesterone are at baseline. Mood is relatively stable.' } },
  { week: 2, icon: '🌾', size: 'A sesame seed', baby: "Ovulation happens this week. The egg is released and can be fertilized for 12-24 hours. Conception most likely occurs now.", partner: "She may feel a slight twinge (Mittelschmerz) during ovulation. Increased cervical mucus is normal.", dadTip: "Be supportive and patient. Whether you're trying or just found out — your calm energy matters more than you know.", hormone: { level: 'medium', note: 'LH surges to trigger ovulation. She may feel slightly more energetic or amorous.' } },
  { week: 3, icon: '🌾', size: 'A grain of rice', baby: "The blastocyst is travelling down the fallopian tube toward the uterus. Cell division is happening rapidly — a tiny miracle in progress.", partner: "No noticeable symptoms yet, though some women feel mild bloating or cramping as implantation begins.", dadTip: "If you know you're trying — keep stress low for both of you. A relaxed environment helps implantation.", hormone: { level: 'medium', note: 'hCG is just beginning to rise. The pregnancy hormone is making its first appearance.' } },
  { week: 4, icon: '🔵', size: 'A poppy seed (visible)', baby: "Implantation is complete. The embryo is officially attached to the uterine wall. The neural tube (future brain and spine) is beginning to form.", partner: "Implantation bleeding (light spotting) may occur. Breast tenderness, fatigue, and mild nausea may begin.", dadTip: "Grab a pregnancy test together if you haven't confirmed yet. The moment you see those two lines — let it land.", hormone: { level: 'high', note: 'hCG doubles every 48 hours. This is what pregnancy tests detect. She may feel off before she knows why.' } },
  { week: 5, icon: '🍏', size: 'An apple seed', baby: "The heart begins to beat this week — around 80-85 bpm. The embryo looks like a tiny tadpole. Brain, spinal cord, and heart are forming rapidly.", partner: "Morning sickness often hits hard this week. Fatigue can be extreme. She may be more emotional than usual.", dadTip: "Morning sickness can strike any time of day. Have crackers by the bed and avoid cooking strong-smelling foods without asking first.", hormone: { level: 'high', note: 'Progesterone and hCG are surging. She may feel constantly exhausted — this is normal and necessary.' } },
  { week: 6, icon: '🫛', size: 'A sweet pea', baby: "Facial features are beginning to form — tiny buds where eyes, nose, and ears will be. Arm and leg buds appear. The heart has divided into chambers.", partner: "Nausea peaks for many women this week. Heightened sense of smell. Food aversions are common and intense.", dadTip: "Don't take food aversions personally — if she can't stand the smell of your favorite meal, adapt without complaint. Her nose is basically a superpower right now.", hormone: { level: 'high', note: 'Estrogen is ramping up. She may swing between emotions quickly. Validate, don\'t solve.' } },
  { week: 7, icon: '🫐', size: 'A blueberry', baby: "Hands and feet are emerging from the limb buds. The brain is growing at roughly 100 new cells per minute. Eyelid folds are forming.", partner: "Frequent urination begins as the uterus grows. Heightened emotions, mood swings, bloating, and constipation.", dadTip: "If she's struggling with nausea, ginger tea, vitamin B6, and small frequent meals genuinely help. Be proactive — don't wait to be asked.", hormone: { level: 'high', note: 'hCG is at its pregnancy peak around weeks 7-11. Expect the most intense symptoms in this window.' } },
  { week: 8, icon: '🫘', size: 'A kidney bean', baby: "All major organs are forming. The embryo officially becomes a fetus this week. Fingers and toes are beginning to distinguish from webbed form.", partner: "Fatigue may feel debilitating — growing a human takes massive energy. Round ligament pain may begin.", dadTip: "Handle household tasks without being asked. Cook simple meals she can tolerate. Your consistency right now is an act of love.", hormone: { level: 'high', note: 'Progesterone keeps the uterus relaxed and prevents early contractions. She may feel unusually warm and tired.' } },
  { week: 9, icon: '🍇', size: 'A grape', baby: "The fetus now has distinct fingers and toes. Reproductive organs are forming, though it's still too early to determine sex. Facial features are more defined.", partner: "Nausea may still be strong. Breast growth continues — she may need new bras sooner than expected. Emotional sensitivity is heightened.", dadTip: "Compliment her genuinely — her body is working harder than it ever has. Make her feel seen, not just supported.", hormone: { level: 'high', note: 'High hCG and progesterone continue. Emotional swings are hormonally driven, not personal.' } },
  { week: 10, icon: '🍓', size: 'A strawberry', baby: "All vital organs are formed and functioning (or developing). The fetus can make small movements, though she won't feel them yet. Nails are starting to grow.", partner: "Visible veins on breasts. Mood may feel more intense. Some women experience spotting — usually harmless but always worth mentioning to the doctor.", dadTip: "First prenatal appointment is often around now. Go with her if at all possible — hearing the heartbeat for the first time is something you should not miss.", hormone: { level: 'high', note: 'Still near peak hCG. Physical symptoms remain strong. The end of the first trimester tunnel is in sight.' } },
  { week: 11, icon: '🍈', size: 'A lime', baby: "The fetus is now about 1.6 inches long. Tooth buds are forming. Fingers and toes are fully separated. She can hiccup (how cute is that?).", partner: "Nausea may start to ease slightly. Uterus begins to rise out of the pelvis. Waistband may feel tighter.", dadTip: "Talk to the baby. It sounds weird, but the fetus can eventually hear voices and yours matters. Start early.", hormone: { level: 'high', note: 'hCG begins to plateau. The placenta is taking over hormone production — the worst of nausea may start to lift.' } },
  { week: 12, icon: '🍇', size: 'A plum', baby: "The most critical development phase is nearly complete. Brain, spinal cord, and organs are formed. The fetus is developing reflexes — touching the lips triggers a sucking reflex.", partner: "For many women, nausea starts to ease after week 12. Energy may return. The bump becomes slightly visible.", dadTip: "Share the news if you're ready — week 12 is the traditional 'safe' announcement milestone after the miscarriage risk drops significantly.", hormone: { level: 'medium', note: 'hCG peaks and begins to fall as the placenta takes over. Her mood may stabilize noticeably.' } },
  { week: 13, icon: '🍑', size: 'A peach', baby: "Fingerprints are forming. The fetus can make facial expressions. Bone is replacing cartilage throughout the skeleton. Intestines are moving into the abdomen.", partner: "Welcome to the second trimester! Energy often improves. Nausea fades for most. The 'pregnancy glow' phase is beginning.", dadTip: "Celebrate the end of the first trimester — it's been a hard 12 weeks, especially for her. Acknowledge it. She's been quietly heroic.", hormone: { level: 'medium', note: 'Hormone levels are evening out. Expect a more emotionally stable and energetic partner over the coming weeks.' } },
  { week: 14, icon: '🍋', size: 'A lemon', baby: "The fetus can squint, frown, and grimace. Lanugo (fine hair) is beginning to cover the body. The thyroid gland is working and producing hormones of its own.", partner: "The second trimester honeymoon begins. More energy, reduced nausea, improved mood. Libido may increase — this is completely normal.", dadTip: "Plan a date night or a weekend away if you can. The second trimester is the sweet spot — lean into it while you have the chance.", hormone: { level: 'medium', note: 'Estrogen is rising gradually. Expect more energy and possibly a higher libido. Enjoy this phase.' } },
  { week: 15, icon: '🍎', size: 'An apple', baby: "The fetus is moving vigorously though she still can't feel it. Taste buds are developing. Bones are getting stronger — the fetus can make a fist.", partner: "Round ligament pain (sharp twinges on the sides of the abdomen) is common as the uterus grows. Heartburn may start.", dadTip: "If she mentions round ligament pain, it sounds scarier than it is — but take it seriously. Rest, gentle movement, and no heavy lifting for her.", hormone: { level: 'medium', note: 'Relatively stable. Progesterone continues to relax ligaments and smooth muscle — which can cause heartburn and back pain.' } },
  { week: 16, icon: '🥑', size: 'An avocado', baby: "The heart pumps 25 quarts of blood per day. The fetus is practicing breathing by inhaling amniotic fluid. Ultrasound can now show a sucking thumb.", partner: "The baby bump is now visible to most people. She may start getting comments from strangers — ask how she wants you to handle that.", dadTip: "Ask your partner how she wants to handle unsolicited belly touches and comments. Have her back publicly if she sets limits.", hormone: { level: 'medium', note: 'Estrogen continues to rise. Skin may glow — increased blood volume gives that "radiant" look.' } },
  { week: 17, icon: '🍐', size: 'A pear', baby: "The fetus can hear now — loud sounds may startle it. Fat deposits are forming under the skin. Sweat glands are developing.", partner: "Back pain becomes more common as the center of gravity shifts. She may have trouble sleeping and finding a comfortable position.", dadTip: "Invest in a pregnancy pillow. Seriously — it's one of the best things you can buy. Also: back rubs are never not appropriate.", hormone: { level: 'medium', note: 'Estrogen continues steady rise. She may experience nasal congestion due to increased blood flow — a common but annoying symptom.' } },
  { week: 18, icon: '🍠', size: 'A sweet potato', baby: "The ears are now in final position. The fetus yawns and can recognize your voice. Myelin (nerve coating) is beginning to form, which will speed up nerve signals.", partner: "Many women feel the first flutter of movement this week — like butterflies or popcorn popping. Skin changes: darker areolas, linea nigra may appear.", dadTip: "Ask her to describe the first kick or flutter. Listen fully. This is one of those moments — be present for it even if you can't feel it yet.", hormone: { level: 'medium', note: 'Progesterone keeps the uterus calm. Melanin increases may cause skin darkening. This is normal and temporary.' } },
  { week: 19, icon: '🥭', size: 'A mango', baby: "A protective coating (vernix caseosa) is forming over the skin. The fetus has a regular sleep/wake cycle. Sensory development is accelerating.", partner: "Round ligament pain may intensify. Varicose veins and hemorrhoids are possible. Balance and coordination may feel slightly off.", dadTip: "The anatomy scan (20-week ultrasound) is coming up. Make every effort to attend — this is the big one where you often find out the sex.", hormone: { level: 'medium', note: 'Relatively stable. Some women experience a hormone-driven burst of emotion around this time as the baby starts feeling real.' } },
  { week: 20, icon: '🍌', size: 'A banana', baby: "Halfway mark! The fetus is swallowing more and more amniotic fluid. Its limbs are in proportion now. Hair on the scalp is beginning to grow.", partner: "You are officially halfway. Increased energy usually continues. Heartburn and backaches are common.", dadTip: "Midpoint milestone. Do something nice to celebrate. You're entering the downhill stretch.", hormone: { level: 'medium', note: 'Estrogen and progesterone are high but stable. Mood is generally good.' } },
  { week: 21, icon: '🥕', size: 'A large carrot', baby: "The fetus is moving constantly now. Bone marrow is starting to make blood cells. The digestive system is maturing.", partner: "Steady weight gain. Possible swelling. You can often feel the baby move from the outside now.", dadTip: "Try to catch a kick. It's a surreal moment for a dad. Be patient — the baby has its own schedule.", hormone: { level: 'medium', note: 'Stable. The "honeymoon" phase of the second trimester is in full swing.' } },
  { week: 22, icon: '🌽', size: 'An ear of corn', baby: "The sense of touch is developing — the fetus grabs the umbilical cord and explores its face. Brain development is rapid. Eyes are formed but eyelids are still fused.", partner: "Possible stretch marks as the belly expands. Linea nigra darkens. Outie belly button. She's clearly pregnant to everyone now.", dadTip: "Moisturize her belly if she wants — make it a ritual rather than a chore. It's intimate and practical.", hormone: { level: 'medium', note: 'Levels are holding steady. She may experience a strong sense of connection to the baby as movements become regular.' } },
  { week: 23, icon: '🍆', size: 'An eggplant', baby: "The fetus weighs about a pound now. Fingerprints and footprints are fully formed. It can hear conversations and music — and will respond to familiar voices.", partner: "Increased appetite. Possible swelling in feet and ankles. Braxton Hicks may be more noticeable. Back pain intensifies.", dadTip: "Start talking and reading to the belly regularly. The fetus recognizes voices it hears in the womb — this is your earliest bonding window.", hormone: { level: 'medium', note: 'Stable, but relaxin (the ligament-loosening hormone) is increasing. She may feel physically uncomfortable more frequently.' } },
  { week: 24, icon: '🌽', size: 'A full ear of corn', baby: "Viability milestone — if born now, the baby has a chance of survival with medical support. Lungs are developing rapidly. The fetus is gaining about 6 oz per week.", partner: "Glucose screening test happens this week (gestational diabetes check). Possible linea nigra, melasma (skin darkening). Fatigue may increase.", dadTip: "Week 24 is the viability milestone — emotionally significant for many couples. Check in with her about how she's feeling about it all.", hormone: { level: 'medium', note: 'Insulin resistance increases slightly (preparing for gestational diabetes screening). She may notice more fatigue after meals.' } },
  { week: 25, icon: '🥦', size: 'A head of broccoli', baby: "The fetus responds to touch — pressing on the belly may get a kick back. Hair is growing. Fat continues to fill in under the skin, making the fetus look less translucent.", partner: "Heartburn and indigestion are common. Sleep is getting harder. She may experience restless leg syndrome. The third trimester is approaching.", dadTip: "Research childbirth classes now if you haven't. Most recommend starting around week 28-30. You should both take one.", hormone: { level: 'medium', note: 'Progesterone peaks start to plateau. The discomforts are mostly physical now rather than hormonal — but be patient regardless.' } },
  { week: 26, icon: '🥒', size: 'A cucumber', baby: "Eyes are beginning to open for the first time. The fetus blinks and responds to light. It can hear music and voices clearly. Brain wave activity begins for hearing and sight.", partner: "Her uterus is now about 2.5 inches above the belly button. Braxton Hicks are more frequent. Sciatica pain may develop.", dadTip: "Play music near the belly — studies suggest babies respond to music they hear in the womb after birth. Start a playlist now.", hormone: { level: 'medium', note: 'Estrogen levels continue steady rise. She may start nesting behaviors — don\'t fight it, join it.' } },
  { week: 27, icon: '🥦', size: 'A cauliflower', baby: "Welcome to the third trimester! The fetus sleeps and wakes on a regular schedule. Brain tissue is developing rapidly. It can dream during REM sleep.", partner: "Third trimester begins. Discomforts intensify: shortness of breath, heartburn, frequent urination. Anxiety about labor may surface.", dadTip: "Have an honest conversation about birth plans, fears, and expectations. Don't wait until labor to figure out what you both want.", hormone: { level: 'medium-high', note: 'Cortisol (stress hormone) begins to rise. She may feel more anxious and overwhelmed. This is biological, not irrational.' } },
  { week: 28, icon: '🍆', size: 'A large eggplant', baby: "The brain is developing surface grooves for complex functioning. The fetus can blink open eyes and responds to light. Lungs continue maturing.", partner: "Third trimester check-ups become biweekly. She may feel huge and uncomfortable. Colostrum (early breast milk) may start leaking.", dadTip: "Research your hospital's check-in process, parking, and policies now — before it's an emergency. Preparation is your love language right now.", hormone: { level: 'medium-high', note: 'Prolactin is rising in preparation for milk production. She may be thinking about breastfeeding and support is key.' } },
  { week: 29, icon: '🎃', size: 'A small pumpkin', baby: "The fetus moves vigorously — kicks, rolls, jabs. Muscle and lung development is accelerating. The skeleton is hardening, requiring lots of calcium.", partner: "She may feel the baby's hiccups. Pelvic pressure increases. Walking may become uncomfortable. Varicose veins worsen.", dadTip: "Take on more physical tasks around the house without being asked. Grocery runs, heavy lifting, standing in lines — these fall to you now.", hormone: { level: 'medium-high', note: 'Relaxin continues loosening pelvic joints in preparation for birth. She may waddle slightly — this is biology, not comedy.' } },
  { week: 30, icon: '🥬', size: 'A head of cabbage', baby: "The fetus has a 10% body fat now. Its fingernails are growing. The brain is developing billions of neurons. It can distinguish light from dark through the uterine wall.", partner: "Braxton Hicks are more regular. Sleep is increasingly difficult. She may feel baby hiccups daily. Acid reflux can be intense.", dadTip: "Prepare the hospital bag together this week. Having it ready removes a layer of panic when labor actually starts.", hormone: { level: 'medium-high', note: 'Estrogen peak is approaching. She may have vivid, intense dreams. Don\'t read into the content — it\'s just hormone-fueled brain activity.' } },
  { week: 31, icon: '🥥', size: 'A coconut', baby: "Major development is mostly complete — the remaining weeks are about growth and finishing touches. The fetus turns head-down in preparation for birth.", partner: "Extreme fatigue returns. Swollen feet and ankles. Shortness of breath as the uterus pushes up on the diaphragm. Emotional nesting mode intensifies.", dadTip: "Check in emotionally — she may be feeling anxious about labor and new parenthood. Listen first. Don't jump to solutions.", hormone: { level: 'high', note: 'Cortisol rises as the due date approaches. Labor prep hormones are beginning. She may oscillate between excitement and terror.' } },
  { week: 32, icon: '🥔', size: 'A large potato', baby: "The fetus drinks about a pint of amniotic fluid per day and urinates the same amount. Toenails are fully formed. Brain and nervous system are nearly complete.", partner: "She may feel the baby drop or engage (lightening). Pelvic pressure increases but breathing eases. Colostrum production increases.", dadTip: "Attend any remaining prenatal appointments. Start finalizing the nursery — nesting is real and you should be part of it.", hormone: { level: 'high', note: 'Oxytocin (the bonding hormone) is beginning to ramp up. Her emotional connection to the baby is at its peak.' } },
  { week: 33, icon: '🍍', size: 'A pineapple', baby: "The fetus is practicing all the skills it'll need: breathing, sucking, swallowing. Skull bones remain soft and flexible to allow passage through the birth canal.", partner: "Increased Braxton Hicks. Possible lightening (baby drops lower). Pelvic pressure makes walking uncomfortable. She may feel contractions more clearly.", dadTip: "Know the signs of real labor vs. Braxton Hicks. Timing contractions, water breaking, bloody show — know what to watch for.", hormone: { level: 'high', note: 'Prostaglandins are starting to soften the cervix. Her body is beginning the early prep for labor — even if birth is weeks away.' } },
  { week: 34, icon: '🍈', size: 'A cantaloupe', baby: "The fetus is gaining about half a pound per week. Vernix thickens. Fingernails reach the tips of fingers. Sleep cycles are distinct and regular.", partner: "Extreme pelvic pressure and back pain. Frequent urination intensifies. Sleep quality is very poor. Emotionally — a mixture of readiness and fear.", dadTip: "If she can't sleep, don't remind her how tired she'll be 'when the baby comes.' Just be warm and present. No comparisons.", hormone: { level: 'high', note: 'Estrogen continues to peak. She may experience intense emotional preparation — processing the transition to motherhood.' } },
  { week: 35, icon: '🍈', size: 'A honeydew melon', baby: "The fetus has reached near-full brain development for birth. Kidneys and liver are fully functional. If born now, it would likely need minimal medical support.", partner: "She feels enormous. Every position is uncomfortable. Heartburn, incontinence, swelling, and fatigue are all intensifying.", dadTip: "Pre-cook and freeze meals for after the birth. Having food ready is one of the most practical things you can do before the baby arrives.", hormone: { level: 'high', note: 'Oxytocin receptors in the uterus are increasing, priming the body for labor contractions. The end is genuinely near.' } },
  { week: 36, icon: '🥬', size: 'A head of romaine', baby: "The fetus is dropping lower into the pelvis. Most organ systems are complete. It's continuing to gain weight — about an ounce a day at this point.", partner: "Weekly OB check-ups begin. Cervix may begin to dilate and efface. She may feel more comfortable breathing but increased pelvic pressure.", dadTip: "Know your hospital route, have a backup, and keep your phone charged. The drill: be ready to go at any time after week 37.", hormone: { level: 'high', note: 'Relaxin peaks to allow maximum pelvic joint flexibility for birth. Estrogen is at its pregnancy maximum.' } },
  { week: 37, icon: '🥬', size: 'A bunch of Swiss chard', baby: "Full term milestone. The fetus has a firm grasp and is practicing all survival skills. Gaining about half a pound per week. Head is engaged in the pelvis for most.", partner: "She may experience the 'bloody show' or cervical mucus plug loss. Nesting instinct may be extreme. Braxton Hicks can be intense and regular.", dadTip: "The baby could come any day now. Be present, be available, and make sure the bag is in the car. Clear your schedule as much as possible.", hormone: { level: 'high', note: 'Prostaglandins are actively softening and ripening the cervix. Her body is in active labor preparation mode.' } },
  { week: 38, icon: '🌿', size: 'A leek', baby: "The fetus is about 19-20 inches long and 6.8-7.5 lbs typically. The intestines are full of meconium (first poop). Lungs are fully mature and ready to breathe air.", partner: "Labor could start any day. She may notice mucus plug loss or a 'bloody show.' Contractions may become more regular. Emotional intensity is high.", dadTip: "Practice timing contractions. The 5-1-1 rule: contractions every 5 minutes, lasting 1 minute, for at least 1 hour = time to go to the hospital.", hormone: { level: 'high', note: 'Estrogen surges in the final weeks trigger the onset of labor. She may have a burst of energy (nesting sprint) before labor begins.' } },
  { week: 39, icon: '🍉', size: 'A small watermelon', baby: "Fully developed. The brain and lungs are still maturing slightly. The fetus is in final position, head-down, ready for birth. Skin is smooth and plump.", partner: "Possibly losing the mucus plug. Contractions testing the waters. Anxiety and excitement are at maximum. She is ready, even when she says she isn't.", dadTip: "Let her lead. If she's in the zone cleaning at 3am — help or get out of the way. If she needs to talk, listen. Your job is to follow her lead right now.", hormone: { level: 'high', note: 'Oxytocin and prostaglandins are building toward the cascade that triggers labor. It\'s happening — just a matter of when.' } },
  { week: 40, icon: '🎉', size: 'A pumpkin', baby: "Full term! Typical birth weight is 6-9 lbs, length 18-22 inches. The baby is ready. Everything from this point is about the timing of labor.", partner: "She may be emotionally done. Discomfort is at maximum. If overdue, her OB may discuss induction. Be patient — she is too.", dadTip: "Your only job right now is to be steady. She needs your calm confidence more than anything else. You've got this. You both do.", hormone: { level: 'high', note: 'The hormonal cocktail for labor (oxytocin, prostaglandins, adrenaline) is fully primed. Every day brings you closer to meeting your baby.' } },
];

export default function Home() {
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [lmpValue, setLmpValue] = useState("");
  const [dueValue, setDueValue] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('dadmode_due');
    if (saved) {
      const d = new Date(saved);
      setDueDate(d);
      calculateStats(d);
    }
  }, []);

  const calculateStats = (d: Date) => {
    const today = new Date();
    const totalDays = 280;
    const msPerDay = 86400000;
    const daysLeft = Math.max(0, Math.floor((d.getTime() - today.getTime()) / msPerDay));
    const daysDone = Math.max(0, totalDays - daysLeft);
    const week = Math.min(40, Math.max(1, Math.floor(daysDone / 7) + 1));
    setCurrentWeek(week);
  };

  const handleCalculate = (type: 'lmp' | 'due') => {
    let d: Date;
    if (type === 'due') {
      if (!dueValue) return;
      d = new Date(dueValue + 'T12:00:00');
    } else {
      if (!lmpValue) return;
      const lmp = new Date(lmpValue + 'T12:00:00');
      d = new Date(lmp);
      d.setDate(d.getDate() + 280);
    }
    setDueDate(d);
    localStorage.setItem('dadmode_due', d.toISOString());
    calculateStats(d);
  };

  const resetApp = () => {
    if (!confirm('Reset your dates and start over?')) return;
    localStorage.removeItem('dadmode_due');
    setDueDate(null);
    setCurrentWeek(0);
    setLmpValue("");
    setDueValue("");
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        body: JSON.stringify({ email, dueDate: dueDate?.toISOString() }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  if (!dueDate) {
    return (
      <div id="onboarding">
        <div className="logo-icon">🍼</div>
        <h1 className="logo-title">Dad<span>Mode</span></h1>
        <p className="logo-sub">YOUR PREGNANCY COMPANION</p>
        
        <div className="onboarding-card">
          <div className="input-group">
            <label>When was her last period?</label>
            <input type="date" value={lmpValue} onChange={(e) => setLmpValue(e.target.value)} />
            <button onClick={() => handleCalculate('lmp')}>Calculate from LMP</button>
          </div>
          
          <div className="divider"><span>OR</span></div>
          
          <div className="input-group">
            <label>Know the due date already?</label>
            <input type="date" value={dueValue} onChange={(e) => setDueValue(e.target.value)} />
            <button onClick={() => handleCalculate('due')}>Use Due Date</button>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date();
  const daysLeft = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / 86400000));
  const daysDone = 280 - daysLeft;
  const pct = Math.min(100, Math.round((daysDone / 280) * 100));
  const trimester = currentWeek <= 13 ? 'First Trimester' : currentWeek <= 26 ? 'Second Trimester' : 'Third Trimester';
  const dueFmt = dueDate.toLocaleDateString('en-US', {month:'short', day:'numeric'});

  const currentWData = weekData[currentWeek - 1] || weekData[39];
  const displayWData = selectedWeek ? weekData[selectedWeek - 1] : currentWData;

  return (
    <div id="dashboard">
      <header className="header">
        <div>
          <div className="trimester-badge">{trimester}</div>
          <div className="due-date-label">Due {dueFmt}</div>
        </div>
        <button className="reset-btn" onClick={resetApp}><RefreshCw size={16} /></button>
      </header>

      <section className="hero-stats">
        <div className="week-display">
          <span className="week-label">WEEK</span>
          <span className="week-number">{currentWeek}</span>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }}></div>
          </div>
          <div className="progress-labels">
            <span>{daysDone} days in</span>
            <span>{daysLeft} left</span>
            <span className="pct-badge">{pct}%</span>
          </div>
        </div>
      </section>

      <div className="timeline-wrapper">
        <div className="timeline-scroller" ref={timelineRef}>
          {weekData.map(w => (
            <div 
              key={w.week}
              className={`t-week-pill ${w.week === currentWeek ? 'current' : ''} ${w.week < currentWeek ? 'past' : ''} ${selectedWeek === w.week ? 'selected' : ''}`}
              onClick={() => setSelectedWeek(w.week)}
            >
              <span className="t-pill-num">{w.week}</span>
              <span className="t-pill-icon">{w.icon}</span>
              <span className="t-pill-label">wk {w.week}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="week-card-container">
        <div className="week-card">
          <div className="card-header">
            <div className="baby-icon">{displayWData.icon}</div>
            <div className="card-header-text">
              <h3>Week {displayWData.week} {displayWData.week === currentWeek && "(Current)"}</h3>
              <div className="baby-size">📏 {displayWData.size}</div>
            </div>
          </div>
          <div className="info-grid">
            <div className="info-block">
              <div className="info-block-label">🍼 Baby</div>
              <div className="info-block-text">{displayWData.baby}</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">💛 Partner</div>
              <div className="info-block-text">{displayWData.partner}</div>
            </div>
          </div>
          <div className="dad-tip">
            <div className="dad-tip-label">⚡ Dad Tip</div>
            <div className="dad-tip-text">{displayWData.dadTip}</div>
          </div>
          <div className="hormone-chip">
            <span className={`hormone-level hl-${displayWData.hormone.level.replace('-', '')}`}>
              {displayWData.hormone.level.toUpperCase()}
            </span>
            <span className="hormone-note">{displayWData.hormone.note}</span>
          </div>
        </div>
      </div>

      <div className="email-capture-card">
        {!submitted ? (
          <form onSubmit={handleSubscribe}>
            <h3>Get Weekly Dad Tips in your inbox</h3>
            <p>I'll send you Week {currentWeek + 1}'s tip automatically.</p>
            <div className="email-input-group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '...' : <Mail size={20} />}
              </button>
            </div>
          </form>
        ) : (
          <div className="success-msg">
            <Zap className="gold" />
            <p>You're in. See you next week.</p>
          </div>
        )}
      </div>

      {selectedWeek && (
        <button className="back-to-current" onClick={() => setSelectedWeek(null)}>
          Back to Current Week <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
