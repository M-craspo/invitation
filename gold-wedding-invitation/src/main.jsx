import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { Music2, VolumeX, Heart, CalendarDays, MapPin, Clock3, Check, Sparkles, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import './styles.css';

// Customize these details for the couple and event.
const WEDDING = {
  groom: 'مَحْمُود', bride: 'قَمَر', date: '2026-11-12T19:00:00+02:00',
  dateLabel: 'الخميس، ١٢ نوفمبر ٢٠٢٦', timeLabel: 'السابعة مساءً',
  venue: 'موقع حفل الزفاف', address: '29.962511, 30.926514',
  mapsUrl: 'https://www.google.com/maps?q=29.962511,30.926514',
  musicPath: '/%20today.m4a',
};

function useCountdown(target) {
  const calculate = () => {
    const diff = Math.max(0, new Date(target).getTime() - Date.now());
    return { days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000) % 24, minutes: Math.floor(diff / 60000) % 60, seconds: Math.floor(diff / 1000) % 60, done: diff === 0 };
  };
  const [time, setTime] = useState(calculate);
  useEffect(() => { const id = window.setInterval(() => setTime(calculate()), 1000); return () => window.clearInterval(id); }, [target]);
  return time;
}

function GoldArch() {
  return <svg className="arch-svg" viewBox="0 0 600 760" fill="none" aria-hidden="true">
    <path className="arch-line arch-line-main" d="M42 735V306C42 151 157 35 300 35S558 151 558 306V735" />
    <path className="arch-line arch-line-inner" d="M58 735V308C58 163 164 52 300 52S542 163 542 308V735" />
    <path className="arch-line arch-line-base" d="M25 735H575" />
    <g className="arch-ornament"><path d="M300 20c-12 15-12 28 0 38 12-10 12-23 0-38Z"/><path d="M280 38c-19-1-28 8-28 20 15 3 25-3 28-20Z"/><path d="M320 38c19-1 28 8 28 20-15 3-25-3-28-20Z"/><circle cx="300" cy="66" r="3"/></g>
  </svg>;
}

function Petals() {
  const petals = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ id: i, left: `${(i * 37 + 9) % 100}%`, delay: `${(i % 9) * -1.7}s`, duration: `${13 + (i % 7) * 2}s`, size: 8 + (i % 4) * 3, rotate: (i * 41) % 180 })), []);
  return <div className="petal-layer" aria-hidden="true">{petals.map(p => <span key={p.id} className="petal" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size * 1.45, transform: `rotate(${p.rotate}deg)` }} />)}</div>;
}

function App() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef(null);
  const countdown = useCountdown(WEDDING.date);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio.play().then(() => setMusicOn(true)).catch(() => {});
  }, []);
  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try { await audio.play(); setMusicOn(true); } catch { setMusicOn(false); }
  };
  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) { audio.pause(); setMusicOn(false); return; }
    await startMusic();
  };
  const copyAddress = async () => {
    try { await navigator.clipboard.writeText(`${WEDDING.venue} — ${WEDDING.address}`); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { window.open(WEDDING.mapsUrl, '_blank', 'noopener,noreferrer'); }
  };

  return <main className="site-shell">
    <audio ref={audioRef} src={WEDDING.musicPath} loop autoPlay preload="auto" />
    <Petals />
    <button className={`music-button ${musicOn ? 'is-playing' : ''}`} onClick={toggleMusic} aria-label={musicOn ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}>
      {musicOn ? <Music2 size={17} /> : <VolumeX size={17} />}<span>{musicOn ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}</span>
      {musicOn && <i className="sound-bars"><b/><b/><b/></i>}
    </button>

    <AnimatePresence mode="wait">
      {!opened ? <motion.section key="cover" className="cover-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: .8 }}>
        <div className="cover-grain" />
        <GoldArch />
        <motion.div className="cover-flower flower-one" animate={{ rotate: [0, 5, -3, 0], y: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity }}><Floral /></motion.div>
        <motion.div className="cover-flower flower-two" animate={{ rotate: [0, -5, 4, 0], y: [0, 4, 0] }} transition={{ duration: 8, repeat: Infinity }}><Floral /></motion.div>
        <motion.div className="cover-content" initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .45, duration: 1 }}>
          <span className="eyebrow"><span/> دعوة لحضور حفل خطوبة <span/></span>
          <p className="bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيم</p>
          <div className="cover-monogram cover-names"><span>{WEDDING.groom}</span><i>&amp;</i><span>{WEDDING.bride}</span></div>
          <p className="cover-caption">يَسُرُّنَا دَعْوَتُكُمْ لِمُشَارَكَتِنَا فَرْحَةَ خِطْبَتِنَا</p>
          <button className="open-button" onClick={() => { setOpened(true); if (!musicOn) startMusic(); }}><span>افتحوا دعوتنا</span><Heart size={17} strokeWidth={1.5}/></button>
          <span className="cover-date">{WEDDING.dateLabel}</span>
        </motion.div>
        <div className="cover-bottom"><span/> حكاية حب تُكتب بالذهب <span/></div>
      </motion.section> : <motion.div key="invitation" className="invitation" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <header className="hero" id="home">
          <GoldArch />
          <div className="hero-floral floral-a"><Floral /></div><div className="hero-floral floral-b"><Floral /></div>
          <motion.div className="hero-content" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .22, delayChildren: .2 } } }}>
            <motion.p className="bismillah" variants={rise}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيم</motion.p>
            <motion.div className="names" variants={rise}><span>{WEDDING.groom}</span><i>&</i><span>{WEDDING.bride}</span></motion.div>
            <motion.div className="gold-divider" variants={rise}><span/><Heart size={15}/><span/></motion.div>
            <motion.h1 variants={rise}>حكاية حب.. وبداية عمر</motion.h1>
            <motion.p className="hero-copy" variants={rise}>بفرحة تملأ قلوبنا، نتشرف بدعوتكم لتكونوا جزءًا من يومنا الأجمل، ونحتفل سويًا ببداية حكاية جديدة.</motion.p>
            <motion.div className="date-pill" variants={rise}><CalendarDays size={17}/>{WEDDING.dateLabel}</motion.div>
            <motion.a className="scroll-cue" href="#details" variants={rise}><span>اكتشفوا التفاصيل</span><ChevronDown size={17}/></motion.a>
          </motion.div>
          <div className="hero-bottom-note">بوجودكم تكتمل فرحتنا</div>
        </header>

        <section className="countdown-section section-pad" id="details">
          <p className="section-kicker">اللحظة المنتظرة</p><h2>باقي على فرحتنا</h2><p className="section-subtitle">نعدّ اللحظات حتى نلتقي بكم</p>
          <div className="countdown" dir="rtl">{[['days','يوم'],['hours','ساعة'],['minutes','دقيقة'],['seconds','ثانية']].map(([key,label]) => <div className="count-box" key={key}><strong>{String(countdown[key]).padStart(2,'0')}</strong><span>{label}</span></div>)}</div>
          {countdown.done && <p className="countdown-done">اليوم هو يوم فرحتنا، في انتظاركم بكل حب ❤️</p>}
        </section>

        <section className="event-section section-pad">
          <p className="section-kicker">يسعدنا حضوركم</p><h2>موعدنا مع السعادة</h2>
          <div className="event-grid">
            <article className="event-card"><div className="event-icon"><CalendarDays size={22}/></div><span className="card-label">التاريخ</span><h3>{WEDDING.dateLabel}</h3><p>احفظوا اليوم لتشاركونا فرحتنا</p></article>
            <article className="event-card"><div className="event-icon"><Clock3 size={22}/></div><span className="card-label">الساعة</span><h3>{WEDDING.timeLabel}</h3><p>ننتظركم قبل الموعد بقليل</p></article>
            <article className="event-card"><div className="event-icon"><MapPin size={22}/></div><span className="card-label">المكان</span><h3>{WEDDING.venue}</h3><p>{WEDDING.address}</p><div className="location-actions"><a href={WEDDING.mapsUrl} target="_blank" rel="noreferrer">افتح الخريطة <ExternalLink size={14}/></a><button onClick={copyAddress} aria-label="نسخ العنوان">{copied ? <Check size={14}/> : <Copy size={14}/>}</button></div></article>
          </div>
        </section>

        <footer className="footer"><div className="footer-heart"><Heart size={17}/></div><p>وجودكم هو أجمل هدية</p><div className="footer-names">{WEDDING.groom} <span>&</span> {WEDDING.bride}</div><small>صُنعت بكل حب لتوثيق أجمل يوم</small></footer>
      </motion.div>}
    </AnimatePresence>
  </main>;
}

const rise = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: .8, ease: [0.22,1,0.36,1] } } };
function Floral() { return <svg viewBox="0 0 180 180" fill="none" aria-hidden="true" className="floral-svg"><g stroke="currentColor" strokeWidth=".9"><path d="M88 168C92 130 66 103 42 89 24 78 17 57 26 39"/><path d="M89 145c26-20 36-43 32-69-2-14 5-28 18-34"/><path d="M52 100c-18-1-29-13-30-27 17-2 28 8 30 27Z"/><path d="M72 122c-20 2-34-7-38-23 18-5 31 4 38 23Z"/><path d="M111 95c-2-19 7-32 23-37 5 17-4 30-23 37Z"/><path d="M101 119c3-18 15-28 31-28 2 17-9 28-31 28Z"/><path d="M27 39c-7-13-1-25 11-31 8 12 4 23-11 31Z"/><path d="M27 39c-14-3-19-15-15-27 14 3 20 13 15 27Z"/><circle cx="27" cy="39" r="4"/><path d="M138 42c-2-12 6-20 17-20 3 12-4 20-17 20Z"/><path d="M138 42c-12-6-13-17-6-26 12 6 15 16 6 26Z"/><circle cx="138" cy="42" r="3"/></g></svg>; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
