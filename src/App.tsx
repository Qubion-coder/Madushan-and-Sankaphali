import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, ChevronDown } from "lucide-react";

import { TRANSLATIONS } from "./translations";

type Language = 'en' | 'si';

const backgroundMusic = "/handawaka-various-artists.mp3";
const googleScriptUrl =
  "https://script.google.com/macros/s/AKfycbyZr2MCtXFfCkKtqF1CPKbpf7rsksOQAIPqDYlm-ZKm1r5v272wdEf4AIaSNOQXQf6l/exec";

const publicImagePath = (fileName: string) => `/images/${fileName.replaceAll(" ", "%20")}`;
const preImagePath = (fileName: string) => `/pre/${fileName.replaceAll(" ", "%20")}`;

const PRE_IMAGES = [
  publicImagePath("a.jpg"),
  publicImagePath("b.jpg"),
  publicImagePath("c.jpg"),
  publicImagePath("d.jpg"),
  publicImagePath("e.jpg"),
];

const HERO_BACKGROUND_IMAGE = PRE_IMAGES[4];

function FloatingPetals() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [petals, setPetals] = useState<
    Array<{
      id: number;
      x: number;
      size: number;
      rotation: number;
      duration: number;
      delay: number;
      color: string;
      drift: number;
    }>
  >([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#d27658", "#a5b49a", "#4a5741", "#b7563c", "#f2dfd3"];
    const petalCount = isMobile ? 10 : 18;

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 7 + 7,
      rotation: Math.random() * 360,
      duration: Math.random() * 11 + 16,
      delay: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 24 - 12,
    }));

    setPetals(newPetals);
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-40 ${isLowPowerMode ? "opacity-70" : ""}`}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_2px_10px_rgba(42,51,36,0.3)]"
          style={{ color: petal.color }}
          initial={{
            x: `${petal.x}vw`,
            y: "-10vh",
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotate: petal.rotation + (isLowPowerMode ? 360 : 720),
            opacity: [0, 0.9, 0.8, 0],
          }}
          transition={{
            duration: isLowPowerMode ? petal.duration * 1.2 : petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12,2 10,6 10,10C10,14 12,22 12,22C12,22 14,14 14,10C14,6 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CountdownTimer({ isDark = false, lang }: { isDark?: boolean, lang: Language }) {
  const t = TRANSLATIONS[lang];
  const targetDate = new Date(t.date.countdownTarget).getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: t.countdown.days, value: days },
    { label: t.countdown.hours, value: hours },
    { label: t.countdown.minutes, value: minutes },
    { label: t.countdown.seconds, value: seconds },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-8 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative group"
        >
          <div
            className={`relative w-[4.5rem] h-[6.5rem] sm:w-20 sm:h-28 md:w-32 md:h-44 rounded-t-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 group-hover:-translate-y-3 ${isDark ? "bg-[#4a5741] " : "bg-white "
              }`}
          >
            <div
              className={`absolute inset-1.5 sm:inset-2 md:inset-3 ] rounded-t-full pointer-events-none ${isDark ? "" : ""
                }`}
            />

            <span
              className={`font-numeric text-2xl sm:text-3xl md:text-5xl leading-none relative z-10 drop-shadow-sm mt-3 sm:mt-4 md:mt-6 transition-transform duration-500 group-hover:scale-110 ${isDark ? "text-white" : "text-[#4a5741]"
                }`}
            >
              {Math.max(0, stat.value).toString().padStart(2, "0")}
            </span>

            <div className="w-full flex justify-center mt-2 sm:mt-3 md:mt-6 mb-1 sm:mb-2 relative z-10">
              <span
                className={`text-[5px] sm:text-[6px] md:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm whitespace-nowrap ${isDark
                  ? "bg-white/10 text-white "
                  : "bg-stone-50 text-stone-500 "
                  }`}
              >
                {stat.label}
              </span>
            </div>

            <div
              className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 rotate-45 ${isDark ? "bg-white/40" : "bg-[#d27658]"
                }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Gallery({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang];
  const marqueeImages = [...PRE_IMAGES, ...PRE_IMAGES, ...PRE_IMAGES];

  return (
    <section className="relative py-14 md:py-40 bg-transparent overflow-hidden">
      <div className="w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-10 md:mb-16 px-6"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[#2a3324] font-bold tracking-[0.8em] text-sm md:text-base opacity-40 uppercase">
              {t.gallery.subtitle}
            </span>
            <div className="h-px w-16 bg-[#7d8b74]/30" />
          </div>
          <h2 className="text-5xl md:text-8xl bg-gradient-to-r from-[#b7563c] via-[#4a5741] to-[#b7563c] bg-clip-text text-transparent italic leading-none">
            {t.gallery.title}
          </h2>
          <p className="text-[#4a5741]/70 text-sm md:text-base tracking-[0.3em] font-medium max-w-2xl mx-auto pt-2 leading-loose">
            {t.gallery.description}
          </p>
        </motion.div>

        <div className="relative flex overflow-x-hidden w-full py-4 mask-gradient">
          <motion.div
            className="flex gap-6 md:gap-10 pr-6 md:pr-10 shrink-0"
            animate={{
              x: [0, "-33.33%"],
            }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
          >
            {marqueeImages.map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative w-[280px] h-[380px] md:w-[350px] md:h-[480px] shrink-0 overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(74,87,65,0.15)] group"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-4 rounded-[2rem] z-20 pointer-events-none group-hover:inset-6 transition-all duration-700" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingInvitation() {
  const [language, setLanguage] = useState<Language>('si');
  const [hasStarted, setHasStarted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get("to");

  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    guests: "1",
  });

  const [wishForm, setWishForm] = useState({
    name: "",
    wish: "",
  });

  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [wishStatus, setWishStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  const submitToGoogleSheet = async (payload: Record<string, string>) => {
    if (!googleScriptUrl) {
      throw new Error("Google Script URL tl ilid ke;");
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      body: new URLSearchParams(payload),
    });

    if (!response.ok) {
      throw new Error("b,a,Su id¾:l fkdùh");
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rsvpForm.name.trim()) {
      setRsvpStatus("error");
      return;
    }

    setRsvpStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "rsvp",
        name: rsvpForm.name.trim(),
        guests: rsvpForm.guests,
      });

      setRsvpStatus("success");
      setRsvpForm({ name: "", guests: "1" });
    } catch {
      setRsvpStatus("error");
    }
  };

  const handleWishSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!wishForm.name.trim() || !wishForm.wish.trim()) {
      setWishStatus("error");
      return;
    }

    setWishStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "wish",
        name: wishForm.name.trim(),
        wish: wishForm.wish.trim(),
      });

      setWishStatus("success");
      setWishForm({ name: "", wish: "" });
    } catch {
      setWishStatus("error");
    }
  };



  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isOpened && !isPlaying && !hasAttemptedAutoplay && audioRef.current) {
      setHasAttemptedAutoplay(true);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const playOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  window.removeEventListener("click", playOnInteraction);
                })
                .catch(() => { });
            }
          };

          window.addEventListener("click", playOnInteraction);
        });
    }
  }, [isOpened, isPlaying, hasAttemptedAutoplay]);

  useEffect(() => {
    if (introVideoRef.current && !hasStarted) {
      introVideoRef.current.play().catch((err) => {
        console.log("Intro video autoplay failed:", err);
      });
    }
  }, [hasStarted]);

  const t = TRANSLATIONS[language || 'en'];

  return (
    <main
      className={`dl-manel-bold h-[100dvh] w-full bg-[#f5ebd9] transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden flex items-center justify-center"
        } relative scroll-smooth`}
    >
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="video-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              ref={introVideoRef}
              muted={true}
              playsInline
              preload="auto"
              autoPlay
              loop={!hasStarted}
              className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out ${!hasStarted ? "blur-md scale-105 opacity-80" : "blur-0 scale-100 opacity-100"
                }`}
              onEnded={() => setIsOpened(true)}
              onError={(e) => { console.error("Video error:", e); setIsOpened(true); }}
            >
              <source src="/intro_videooo.mp4" type="video/mp4" />
            </video>

            {/* Language Toggle in Top Right */}
            {!isOpened && (
              <div className="absolute top-6 right-6 z-[150]">
                <div className="flex bg-black/40 backdrop-blur-md rounded-full border border-white/20 p-1 shadow-lg">
                  <button
                    onClick={() => setLanguage('si')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-all ${
                      language === 'si' 
                        ? 'bg-white/20 text-white shadow-sm' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    සිං
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-all ${
                      language === 'en' 
                        ? 'bg-white/20 text-white shadow-sm' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            )}

            {!hasStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[120] bg-black/40 backdrop-blur-[2px]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-12"
                  >
                    <h2 className="text-4xl md:text-6xl text-[#f5ebd9] mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                      {t.intro.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-[#f5ebd9]/90 tracking-[0.3em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                      {t.couple.bride} {t.couple.and} {t.couple.groom}
                    </p>
                  </motion.div>

                  <button
                    onClick={() => {
                      setHasStarted(true);

                      if (introVideoRef.current) {
                        introVideoRef.current.loop = false;
                        introVideoRef.current.currentTime = 0;
                        introVideoRef.current.play().catch((err) => console.log(err));
                      }

                      if (audioRef.current && !isPlaying) {
                        audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log("Audio play failed:", err));
                      }
                    }}
                    className="group relative px-12 py-5 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 active:scale-95 border border-white/40 bg-black/20 backdrop-blur-md"
                  >
                    <div className="absolute inset-0 bg-[#f5ebd9]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative z-10 font-bold text-[#f5ebd9] text-sm tracking-[0.35em] drop-shadow-md">
                      {t.intro.openBtn}
                    </span>
                  </button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 1.5 }}
                    className="mt-8 text-[#f5ebd9]/80 text-xs tracking-[0.35em]"
                  >
                    {t.intro.clickToStart}
                  </motion.div>
                </motion.div>
              </div>
            )}

            {hasStarted && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-start pt-[30vh] md:pt-32 z-[105] pointer-events-none text-center px-6"
                >
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.8 }}
                    className="text-3xl md:text-7xl text-[#f5ebd9] mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                  >
                    {t.intro.title}!
                  </motion.h2>

                  <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.2 }}
                      className="text-3xl md:text-6xl text-[#f5ebd9] tracking-[0.3em] font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] self-start"
                    >
                      {t.couple.bride}
                    </motion.p>

                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                      className="text-2xl md:text-4xl text-[#f5ebd9]/90 italic drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] my-1"
                    >
                      {t.couple.ampersand}
                    </motion.span>

                    <motion.p
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.8 }}
                      className="text-3xl md:text-6xl text-[#f5ebd9] tracking-[0.4em] font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] self-end"
                    >
                      {t.couple.groom}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsOpened(true)}
                  className="absolute bottom-10 right-10 z-[110] px-8 py-3 bg-white/40 backdrop-blur-md text-[#4a5741] text-xs tracking-[0.35em] rounded-full hover:bg-white/60 transition-all font-bold"
                >
                  {t.intro.enterBtn}
                </motion.button>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
          >
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-[#4a5741] hover:bg-[#f6e6de] transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[11px] tracking-widest font-bold">{t.main.close}</div>
              </div>
            </motion.button>

            <section className="w-full relative flex items-start justify-center overflow-hidden bg-transparent min-h-[100dvh] md:min-h-[85vh] pt-20 md:pt-32">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("/ChatGPT%20Image%20Jun%208,%202026,%2002_43_56%20AM.png")` }}
                aria-hidden="true"
              />

              <div className="relative z-10 w-full max-w-5xl px-6 text-center mt-12 md:mt-0">
                {guestName && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2"
                  >
                    <p className="text-sm md:text-base font-medium text-[#4a5741]/80 tracking-[0.2em] uppercase mb-1">
                      {t.main.cordiallyInvite}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[#b7563c] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                      {guestName}
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.8 }}
                  className="mt-10"
                >
                  <h1 className="text-6xl sm:text-7xl md:text-8xl text-[#4a5741] italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    {t.couple.bride}
                  </h1>

                  <div className="mt-6 flex items-center justify-center gap-5">
                    <div className="h-px w-14 bg-[#4a5741]/40" />
                    <span className="text-4xl md:text-5xl text-[#4a5741] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] font-bold">{t.couple.and}</span>
                    <div className="h-px w-14 bg-[#4a5741]/40" />
                  </div>

                  <h1 className="mt-6 text-6xl sm:text-7xl md:text-8xl text-[#4a5741] italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    {t.couple.groom}
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                  className="mt-4 md:mt-12"
                >
                  <p className="mt-1 md:mt-5 text-[#4a5741]/70 text-sm md:text-base tracking-[0.15em] font-medium leading-loose max-w-2xl mx-auto">
                    {t.main.heroDescription}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
              >
                <div className="w-px h-14 bg-gradient-to-b from-[#4a5741]/30 to-transparent rounded-full overflow-hidden">
                  <motion.div
                    animate={{ y: [-56, 56] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-1/2 bg-[#b7563c]/45"
                  />
                </div>
              </motion.div>
            </section>

            <section
              id="details"
              className="relative pt-8 md:pt-20 pb-12 md:pb-32 w-full flex flex-col items-center overflow-hidden"
              style={{
                backgroundImage: 'url("/vintage_paper.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-4 md:inset-8 ] pointer-events-none z-10" />
              <div className="absolute inset-5 md:inset-10 ] pointer-events-none z-10" />

              <div className="max-w-[1100px] w-full flex flex-col items-center text-center relative z-20 px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center mb-16 space-y-6"
                >
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="h-px w-8 bg-[#4a5741]" />
                    <Sparkles className="w-4 h-4 text-[#b7563c]" />
                    <div className="h-px w-8 bg-[#4a5741]" />
                  </div>

                  <div className="text-[#4a5741] space-y-4 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
                    {t.main.invitationTop && (
                      <p className="text-slate-700 whitespace-pre-line">
                        {t.main.invitationTop}
                      </p>
                    )}
                    {t.main.parentsNames && (
                      <h3 className="text-xl md:text-2xl font-bold text-[#b7563c] my-2 whitespace-pre-line">
                        {t.main.parentsNames}
                      </h3>
                    )}
                    {t.main.invitationMiddle && (
                      <p className="text-slate-700 whitespace-pre-line">
                        {t.main.invitationMiddle}
                      </p>
                    )}

                    <h3 className="text-4xl md:text-5xl font-bold text-[#b7563c] my-8">
                      {t.couple.bride} {t.couple.ampersand} {t.couple.groom}
                    </h3>

                    {t.main.invitationBottom && (
                      <p className="text-slate-700 whitespace-pre-line">
                        {t.main.invitationBottom}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2 className="text-xl md:text-2xl text-[#b7563c] tracking-[0.5em] font-bold">
                    {t.main.auspicious}
                  </h2>
                </motion.div>

                <div className="relative w-full flex flex-col items-center justify-center my-8 md:my-12 mb-12 md:mb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-20 w-full max-w-[560px] bg-gradient-to-b from-white to-[#fcfcfc] p-8 md:p-14 rounded-3xl border border-[#b7563c]/30 shadow-[0_0_50px_-12px_rgba(74,87,65,0.25)] flex flex-col items-center justify-center text-center overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4a5741] via-[#7d8b74] to-[#4a5741]" />
                    <div className="absolute inset-2 border border-[#b7563c]/10 rounded-[1.5rem] pointer-events-none" />

                    <div className="w-full text-left grid grid-cols-1 gap-8 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#b7563c]/10 flex items-center justify-center shrink-0 border border-[#b7563c]/20 shadow-inner">
                          <Calendar className="w-5 h-5 text-[#b7563c]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#4a5741]/50 mb-1">
                            {t.main.dateLabel}
                          </div>
                          <div className="text-base md:text-lg text-[#4a5741] tracking-wide font-bold">
                            {t.date.displayLong}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#4a5741]/10 flex items-center justify-center shrink-0 border border-[#4a5741]/20 shadow-inner">
                          <Clock className="w-5 h-5 text-[#4a5741]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#4a5741]/50 mb-1">
                            {t.main.timeLabel}
                          </div>
                          <div className="text-base md:text-lg text-[#4a5741] tracking-wide font-bold whitespace-pre-line">
                            {t.main.schedule}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#4a5741]/10 flex items-center justify-center shrink-0 border border-[#4a5741]/20 shadow-inner">
                          <MapPin className="w-5 h-5 text-[#4a5741]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#4a5741]/50 mb-1">
                            {t.main.locationLabel}
                          </div>
                          <div className="text-base md:text-lg text-[#4a5741] tracking-wide font-bold">
                            {t.venue.name}, {t.venue.city}
                          </div>
                          <a
                            href={t.venue.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex text-[10px] md:text-xs text-[#b7563c] hover:text-[#2a3324] font-bold tracking-widest uppercase border-b border-[#b7563c]/30 hover:border-[#2a3324] transition-colors pb-0.5"
                          >
                            {t.main.viewOnMap}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#b7563c]/10 flex items-center justify-center shrink-0 border border-[#b7563c]/20 shadow-inner">
                          <Sparkles className="w-5 h-5 text-[#b7563c]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#4a5741]/50 mb-1">
                            {t.main.themeLabel}
                          </div>
                          <div className="text-base md:text-lg text-[#4a5741] tracking-wide font-bold whitespace-pre-line">
                            {t.main.themeDesc}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="relative py-14 md:py-48 bg-[#4a5741] flex flex-col items-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-24 -right-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                className="absolute -bottom-24 -left-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />

              <div className="w-full max-w-[1200px] px-6 flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative mb-12 md:mb-20"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "80px" }}
                      viewport={{ once: true }}
                      className="h-px bg-white/40 mb-8"
                    />

                    <h2 className="text-3xl md:text-6xl text-white tracking-[0.25em] md:tracking-[0.4em] font-bold leading-tight">
                      {t.main.save} <span className="mx-2 md:mx-4 text-[#f2dfd3]">{t.main.theDate}</span>
                    </h2>

                    <div className="mt-10 flex items-center justify-center gap-6">
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#f2dfd3]/50" />
                      <span className="font-numeric text-3xl md:text-5xl text-[#f2dfd3] drop-shadow-md">
                        {t.date.displayNumeric}
                      </span>
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#f2dfd3]/50" />
                    </div>
                  </div>
                </motion.div>

                <CountdownTimer isDark lang={language} />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.8 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 md:mt-20 flex flex-col items-center gap-4"
                >
                  <p className="text-sm md:text-base tracking-[0.6em] text-white font-bold text-center">
                    {t.main.stayTuned}
                  </p>

                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        className="w-1 h-1 bg-[#f2dfd3] rotate-45"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            <Gallery lang={language} />

            <section 
              className="w-full relative py-14 md:py-32 flex flex-col items-center overflow-hidden"
              style={{
                backgroundImage: 'url("/vintage_paper.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-4 md:inset-8 pointer-events-none z-10" />
              <div className="max-w-[700px] w-full mx-auto px-6 relative z-20 text-center space-y-24">
                
                {/* RSVP Form */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex items-center gap-4 opacity-40 mb-6">
                      <div className="h-px w-8 bg-[#4a5741]" />
                      <Sparkles className="w-4 h-4 text-[#b7563c]" />
                      <div className="h-px w-8 bg-[#4a5741]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl text-[#b7563c] font-bold tracking-widest mb-4">
                      {t.main.rsvpTitle}
                    </h2>
                    <p className="text-[#4a5741]/70 text-sm md:text-base tracking-widest mb-12">
                      {t.main.rsvpDesc}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-[560px] bg-gradient-to-b from-white to-[#fcfcfc] p-8 md:p-12 rounded-3xl border border-[#b7563c]/30 shadow-[0_0_50px_-12px_rgba(74,87,65,0.25)] flex flex-col overflow-hidden text-left"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4a5741] via-[#7d8b74] to-[#4a5741]" />
                    <div className="absolute inset-2 border border-[#b7563c]/10 rounded-[1.5rem] pointer-events-none" />

                    <div className="relative z-10 w-full">
                      {rsvpStatus === "success" ? (
                        <div className="p-8 text-center text-[#4a5741]">
                          <p className="text-xl font-bold mb-2">{t.main.successMsg}</p>
                        </div>
                      ) : (
                        <form onSubmit={handleRsvpSubmit} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[#4a5741] text-xs font-bold tracking-[0.2em] uppercase">
                              {t.main.nameLabel}
                            </label>
                            <input
                              type="text"
                              required
                              value={rsvpForm.name}
                              onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                              className="w-full px-6 py-4 bg-white/50 border border-[#b7563c]/20 rounded-full focus:outline-none focus:border-[#b7563c] focus:bg-white transition-all text-[#4a5741]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[#4a5741] text-xs font-bold tracking-[0.2em] uppercase">
                              {t.main.guestsLabel}
                            </label>
                            <select
                              value={rsvpForm.guests}
                              onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                              className="w-full px-6 py-4 bg-white/50 border border-[#b7563c]/20 rounded-full focus:outline-none focus:border-[#b7563c] focus:bg-white transition-all text-[#4a5741] appearance-none cursor-pointer"
                            >
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>

                          {rsvpStatus === "error" && (
                            <p className="text-red-500 text-sm text-center">{t.main.errorMsg}</p>
                          )}

                          <button
                            type="submit"
                            disabled={rsvpStatus === "sending"}
                            className="group relative w-full py-4 mt-6 overflow-hidden rounded-full transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                          >
                            <div className="absolute inset-0 bg-[#4a5741] opacity-90 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <span className="relative z-10 font-bold text-white text-sm tracking-[0.35em] uppercase">
                              {rsvpStatus === "sending" ? t.main.sending : t.main.submitBtn}
                            </span>
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Wishes Form */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex items-center gap-4 opacity-40 mb-6">
                      <div className="h-px w-8 bg-[#4a5741]" />
                      <Sparkles className="w-4 h-4 text-[#b7563c]" />
                      <div className="h-px w-8 bg-[#4a5741]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl text-[#b7563c] font-bold tracking-widest mb-4">
                      {t.main.wishesTitle}
                    </h2>
                    <p className="text-[#4a5741]/70 text-sm md:text-base tracking-widest mb-12">
                      {t.main.wishesDesc}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-[560px] bg-gradient-to-b from-white to-[#fcfcfc] p-8 md:p-12 rounded-3xl border border-[#b7563c]/30 shadow-[0_0_50px_-12px_rgba(74,87,65,0.25)] flex flex-col overflow-hidden text-left"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#b7563c] via-[#dd8b7a] to-[#b7563c]" />
                    <div className="absolute inset-2 border border-[#b7563c]/10 rounded-[1.5rem] pointer-events-none" />

                    <div className="relative z-10 w-full">
                      {wishStatus === "success" ? (
                        <div className="p-8 text-center text-[#4a5741]">
                          <p className="text-xl font-bold mb-2">{t.main.successMsg}</p>
                        </div>
                      ) : (
                        <form onSubmit={handleWishSubmit} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[#4a5741] text-xs font-bold tracking-[0.2em] uppercase">
                              {t.main.nameLabel}
                            </label>
                            <input
                              type="text"
                              required
                              value={wishForm.name}
                              onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                              className="w-full px-6 py-4 bg-white/50 border border-[#b7563c]/20 rounded-full focus:outline-none focus:border-[#b7563c] focus:bg-white transition-all text-[#4a5741]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[#4a5741] text-xs font-bold tracking-[0.2em] uppercase">
                              {t.main.wishLabel}
                            </label>
                            <textarea
                              required
                              rows={4}
                              value={wishForm.wish}
                              onChange={(e) => setWishForm({ ...wishForm, wish: e.target.value })}
                              className="w-full px-6 py-4 bg-white/50 border border-[#b7563c]/20 rounded-3xl focus:outline-none focus:border-[#b7563c] focus:bg-white transition-all text-[#4a5741] resize-none"
                            />
                          </div>

                          {wishStatus === "error" && (
                            <p className="text-red-500 text-sm text-center">{t.main.errorMsg}</p>
                          )}

                          <button
                            type="submit"
                            disabled={wishStatus === "sending"}
                            className="group relative w-full py-4 mt-6 overflow-hidden rounded-full transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                          >
                            <div className="absolute inset-0 bg-[#4a5741] opacity-90 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <span className="relative z-10 font-bold text-white text-sm tracking-[0.35em] uppercase">
                              {wishStatus === "sending" ? t.main.sending : t.main.submitBtn}
                            </span>
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                </div>

              </div>
            </section>

            <section className="w-full relative overflow-hidden bg-transparent py-14 md:py-32">
              <div className="container mx-auto px-6 max-w-5xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-center gap-3 opacity-70">
                    <div className="h-px w-10 bg-[#4a5741]/20" />
                    <Sparkles className="w-4 h-4 text-[#b7563c]" />
                    <div className="h-px w-10 bg-[#4a5741]/20" />
                  </div>

                  <h2 className="text-5xl md:text-7xl bg-gradient-to-r from-[#b7563c] via-[#4a5741] to-[#b7563c] bg-clip-text text-transparent italic">
                    {t.main.thankYou}
                  </h2>

                  <p className="text-[#4a5741]/70 text-sm md:text-base tracking-[0.25em] font-medium leading-loose max-w-3xl mx-auto">
                    {t.main.thankYouDesc}
                  </p>

                  <p className="text-sm md:text-base tracking-[0.5em] text-[#4a5741]/50 font-bold pt-12">
                    © 2027 {t.couple.bride} {t.couple.and} {t.couple.groom}
                  </p>
                  
                  <p className="text-[#4a5741]/50 text-xs mt-4 font-sans tracking-wider">
                    Want a beautiful wedding website like this? Create yours with <a target="_blank" rel="noreferrer" className="text-[#b7563c] font-bold hover:text-[#4a5741] underline transition-colors" href="https://wa.me/94707819074">invitemint</a>
                  </p>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundMusic} loop />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-[60] bg-white text-[#87937a] p-3 rounded-full shadow-lg hover:bg-[#87937a]/10 transition-colors"
      >
        <div className="flex flex-col items-center">
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </div>
      </motion.button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dl-manel-bold,
            .dl-manel-bold * {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            input,
            textarea,
            button {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            .animate-spin-slow {
              animation: spin-slow linear infinite;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background: #ccbaa233;
            }

            ::-webkit-scrollbar-thumb {
              background: #87937a66;
              border-radius: 10px;
            }
          `,
        }}
      />
    </main>
  );
}