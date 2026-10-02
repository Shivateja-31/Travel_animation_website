import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, MapPin, Sparkles, Check, ChevronRight } from 'lucide-react';

interface Landmark {
  id: string;
  name: string;
  travelNote: string;
  vibe: string;
}

const LANDMARKS: Landmark[] = [
  {
    id: 'eiffel',
    name: 'Eiffel Tower',
    vibe: 'Twilight Magic',
    travelNote: 'Golden lights sparkle at dusk while you sit on the lawn with friends watching the sky turn rose.'
  },
  {
    id: 'louvre',
    name: 'Louvre Museum',
    vibe: 'World of Art',
    travelNote: 'Sunlight pours through the glass pyramid into quiet marble halls filled with human history.'
  },
  {
    id: 'arc',
    name: 'Arc de Triomphe',
    vibe: 'Golden Avenues',
    travelNote: 'Twelve grand tree-lined avenues fan out beneath you as evening traffic circles below.'
  },
  {
    id: 'notredame',
    name: 'Notre-Dame',
    vibe: 'Island Heart',
    travelNote: 'Gothic stone towers and ancient bells reflecting peacefully across the gentle waters of the Seine.'
  },
  {
    id: 'sacrecoeur',
    name: 'Sacré-Cœur',
    vibe: 'Hilltop Sunset',
    travelNote: 'Sit on the warm stone steps with street musicians playing as the whole city glows below you.'
  }
];

interface Neighborhood {
  id: string;
  name: string;
  headline: string;
  feeling: string;
  activity: string;
}

const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'marais',
    name: 'Le Marais',
    headline: 'Secret Courtyards & Boutiques',
    feeling: 'Creative, lively, and full of hidden green gardens behind heavy wooden doors.',
    activity: 'Afternoon coffee in Place des Vosges'
  },
  {
    id: 'montmartre',
    name: 'Montmartre',
    headline: 'Winding Village Alleys',
    feeling: 'A hilltop village of quiet cobblestones, small vineyards, and artists working in the afternoon light.',
    activity: 'Wandering the quiet backstreets at dawn'
  },
  {
    id: 'saintgermain',
    name: 'Saint-Germain',
    headline: 'Literary Cafés & Boulevard Walks',
    feeling: 'The heart of classic Parisian elegance with sidewalk tables, antique bookstalls, and chestnut trees.',
    activity: 'Reading on a green chair in Luxembourg Gardens'
  },
  {
    id: 'canalsaintmartin',
    name: 'Canal Saint-Martin',
    headline: 'Waterside Strolls & Sunset Picnics',
    feeling: 'Tree-lined water, arched iron footbridges, and young locals sharing wine and bread along the quay.',
    activity: 'Picnic by the water with fresh pastries'
  }
];

interface TasteExperience {
  icon: string;
  name: string;
  travelMoment: string;
  mustTry: string;
}

const TASTE_EXPERIENCES: TasteExperience[] = [
  {
    icon: '🥐',
    name: 'Bakeries',
    travelMoment: 'The irresistible smell of butter and hot bread on a crisp morning.',
    mustTry: 'Warm, flaky croissants & crispy sourdough baguettes'
  },
  {
    icon: '☕',
    name: 'Cafés',
    travelMoment: 'Sitting outdoors on small round tables watching Paris wake up.',
    mustTry: 'Hot café crème with a morning newspaper'
  },
  {
    icon: '🥖',
    name: 'Local Markets',
    travelMoment: 'Sampling fresh cheeses and ripe berries from friendly vendors.',
    mustTry: 'Creamy raw-milk Comté cheese & fresh cherries'
  },
  {
    icon: '🍷',
    name: 'French Dining',
    travelMoment: 'Intimate candlelit bistros with friendly waiters and unforgettable wine.',
    mustTry: 'Classic steak frites, duck confit & red wine'
  },
  {
    icon: '🍰',
    name: 'Pâtisseries',
    travelMoment: 'Tiny jewel-like cakes made with delicate layers of fruit and cream.',
    mustTry: 'Raspberry macarons & light vanilla mille-feuille'
  }
];

export default function App() {
  const [activeLandmark, setActiveLandmark] = useState<string>('eiffel');
  const [activeTaste, setActiveTaste] = useState<number>(0);
  const [selectedDays, setSelectedDays] = useState<string>('5 Days');
  const [selectedVibe, setSelectedVibe] = useState<string>('Quiet Cafés & Streets');
  const [savedPlan, setSavedPlan] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    
    const frameCount = 300;
    const currentFrame = (index: number) => `/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

    const img = new Image();
    img.src = currentFrame(1);
    
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
    }

    const updateImage = (index: number) => {
        img.src = currentFrame(index);
        context.drawImage(img, 0, 0);
    }

    const handleScroll = () => {  
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );
        
        requestAnimationFrame(() => updateImage(frameIndex + 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Preload images
    for (let i = 1; i <= frameCount; i++) {
        const preImg = new Image();
        preImg.src = currentFrame(i);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentLandmark = LANDMARKS.find((l) => l.id === activeLandmark) || LANDMARKS[0];

  return (
    <div className="min-h-screen bg-transparent text-[#FFFFFF] font-['DM_Sans',sans-serif] selection:bg-white selection:text-black relative">
      {/* Background Canvas */}
      <div className="fixed top-0 left-0 w-full h-full z-[-1] flex justify-center items-center bg-black overflow-hidden pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full object-cover opacity-50"></canvas>
      </div>

      {/* ---------------- NAVIGATION ---------------- */}
      <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-18 sm:h-20 flex items-center justify-between">
          <a
            href="#"
            className="text-xs uppercase tracking-[0.28em] font-semibold text-white hover:text-white/70 transition-colors"
          >
            PARIS, YOUR WAY
          </a>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-white/45">
            <button
              onClick={() => scrollTo('hero')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              01 Discover
            </button>
            <button
              onClick={() => scrollTo('iconic')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              02 Landmarks
            </button>
            <button
              onClick={() => scrollTo('hidden')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              03 Local Spots
            </button>
            <button
              onClick={() => scrollTo('taste')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              04 Food
            </button>
            <button
              onClick={() => scrollTo('story')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              05 Journey
            </button>
          </nav>

          <button
            onClick={() => scrollTo('story')}
            className="text-xs uppercase tracking-wider px-5 py-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            Plan Journey
          </button>
        </div>
      </header>

      {/* ---------------- 1. HERO — DISCOVER PARIS (Airy, Minimal & Centered) ---------------- */}
      <section
        id="hero"
        className="max-w-4xl mx-auto px-6 h-screen flex flex-col items-center justify-center text-center border-b border-white/10"
      >
        <div className="flex flex-col items-center justify-center -mt-18 sm:-mt-20 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.02] text-[11px] uppercase tracking-[0.25em] text-white/50 mb-10">
            <span>01</span>
            <span>·</span>
            <span>Discover Paris</span>
          </div>

          <h1 className="font-serif-cormorant text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            PARIS, YOUR WAY
          </h1>

          <p className="mt-4 font-serif-cormorant text-xl sm:text-2xl text-white/70 italic font-normal tracking-wide">
            Where timeless beauty meets modern adventure.
          </p>

          <p className="mt-5 text-sm sm:text-base text-white/55 max-w-lg leading-relaxed font-light">
            Wander sunlit sidewalks, stop for coffee on outdoor terraces, and discover the moments
            that make traveling to Paris unforgettable.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('iconic')}
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black text-xs font-medium uppercase tracking-wider hover:bg-white/90 transition-all cursor-pointer"
            >
              <span>EXPLORE PARIS</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo('story')}
              className="px-6 py-3 rounded-full border border-white/20 text-white text-xs font-medium uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
            >
              Start Planning
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- 2. ICONIC PARIS (Fresh Layout: Interactive Horizontal Deck + Travel Cards) ---------------- */}
      <section id="iconic" className="max-w-6xl mx-auto px-6 py-28 sm:py-36 border-b border-white/10">
        <div className="flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-white/40 mb-8">
          <span>02 · ICONIC SIGHTS</span>
          <span>THE CITY YOU'VE DREAMED OF</span>
        </div>

        <div className="max-w-2xl mb-14">
          <h2 className="font-serif-cormorant text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            THE CITY YOU'VE DREAMED OF
          </h2>
          <p className="mt-3 text-sm text-white/60 font-light leading-relaxed">
            From the glowing sunset at the Eiffel Tower to the quiet steps of Sacré-Cœur, these are
            the places that make your first journey to Paris feel like a dream.
          </p>
        </div>

        {/* Horizontal Navigation Pills for Landmarks */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {LANDMARKS.map((lm) => {
            const isActive = activeLandmark === lm.id;
            return (
              <button
                key={lm.id}
                onClick={() => setActiveLandmark(lm.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-medium shadow-md'
                    : 'bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:border-white/25'
                }`}
              >
                {lm.name}
              </button>
            );
          })}
        </div>

        {/* Feature Spotlight Card for the Selected Landmark */}
        <div className="border border-white/15 rounded-3xl p-8 sm:p-12 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
          <div className="max-w-xl">
            <span className="text-[11px] uppercase tracking-widest text-white/40 font-mono block mb-2">
              {currentLandmark.vibe}
            </span>
            <h3 className="font-serif-cormorant text-3xl sm:text-5xl font-bold text-white mb-4">
              {currentLandmark.name}
            </h3>
            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
              {currentLandmark.travelNote}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-8">
            <span className="text-xs text-white/40 uppercase tracking-widest">Travel Tip</span>
            <span className="text-xs text-white/80 max-w-xs md:text-right font-light">
              Visit early in the morning for quiet moments, or just after dusk when the city lights
              begin to shimmer.
            </span>
            <button
              onClick={() => scrollTo('story')}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-white font-medium hover:text-white/70 transition-colors cursor-pointer uppercase tracking-wider"
            >
              <span>Add to journey</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5 Compact Travel Snapshot Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {LANDMARKS.map((lm) => {
            const isCurrent = activeLandmark === lm.id;
            return (
              <div
                key={lm.id}
                onClick={() => setActiveLandmark(lm.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] ${
                  isCurrent
                    ? 'border-white/50 bg-white/[0.06]'
                    : 'border-white/10 bg-white/[0.015] hover:border-white/30'
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                    {lm.vibe}
                  </span>
                  <h4 className="font-serif-cormorant text-xl font-bold text-white">
                    {lm.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/50 pt-3 border-t border-white/10 mt-3">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => scrollTo('hidden')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            <span>DISCOVER LANDMARKS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ---------------- 3. PARIS BEYOND THE TOURIST MAP (Asymmetric Local Neighborhood Cards) ---------------- */}
      <section id="hidden" className="max-w-6xl mx-auto px-6 py-28 sm:py-36 border-b border-white/10">
        <div className="flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-white/40 mb-8">
          <span>03 · LOCAL SPOTS</span>
          <span>FIND THE PARIS LOCALS LOVE</span>
        </div>

        <div className="max-w-2xl mb-14">
          <h2 className="font-serif-cormorant text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            FIND THE PARIS LOCALS LOVE
          </h2>
          <p className="mt-3 text-sm text-white/60 font-light leading-relaxed">
            Step away from the crowds. Paris reveals its true soul in quiet neighborhood corners,
            tree-shaded benches, and little side streets where time slows down.
          </p>
        </div>

        {/* 4 Spacious Neighborhood Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NEIGHBORHOODS.map((quartier, idx) => (
            <div
              key={quartier.id}
              className="border border-white/15 p-8 sm:p-10 rounded-3xl bg-white/[0.02] hover:border-white/35 transition-all flex flex-col justify-between min-h-[260px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    Neighborhood 0{idx + 1}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-white/40" />
                </div>

                <h3 className="font-serif-cormorant text-3xl font-bold text-white mb-2">
                  {quartier.name}
                </h3>
                <span className="text-xs text-white/70 italic block mb-4">
                  {quartier.headline}
                </span>

                <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed">
                  {quartier.feeling}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-0.5">
                    Favorite Moment
                  </span>
                  <span className="text-xs text-white/90 font-light">{quartier.activity}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => scrollTo('taste')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            <span>EXPLORE HIDDEN PARIS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ---------------- 4. TASTE OF PARIS (Spacious Culinary Cards & Interactive Spotlight) ---------------- */}
      <section id="taste" className="max-w-6xl mx-auto px-6 py-28 sm:py-36 border-b border-white/10">
        <div className="flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-white/40 mb-8">
          <span>04 · FOOD & WINE</span>
          <span>A CITY BEST EXPERIENCED THROUGH FOOD</span>
        </div>

        <div className="max-w-2xl mb-14">
          <h2 className="font-serif-cormorant text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            A CITY BEST EXPERIENCED THROUGH FOOD
          </h2>
          <p className="mt-3 text-sm text-white/60 font-light leading-relaxed">
            Start your morning with a buttery croissant. Stop for coffee on a sunlit terrace. End the
            evening with classic French cuisine and a glass of wine.
          </p>
        </div>

        {/* 5 Distinct Food Experience Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {TASTE_EXPERIENCES.map((food, idx) => {
            const isSelected = activeTaste === idx;
            return (
              <div
                key={food.name}
                onClick={() => setActiveTaste(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[190px] ${
                  isSelected
                    ? 'border-white bg-white text-black'
                    : 'border-white/10 bg-white/[0.02] text-white hover:border-white/30'
                }`}
              >
                <span className="text-3xl">{food.icon}</span>

                <div className="mt-6">
                  <h3 className="font-serif-cormorant text-2xl font-bold mb-1">{food.name}</h3>
                  <p
                    className={`text-xs leading-snug font-light ${
                      isSelected ? 'text-black/80' : 'text-white/60'
                    }`}
                  >
                    {food.travelMoment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tasting Highlight Strip */}
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">
              Must-Try Recommendation · {TASTE_EXPERIENCES[activeTaste].name}
            </span>
            <p className="text-sm sm:text-base text-white font-serif-cormorant italic">
              “{TASTE_EXPERIENCES[activeTaste].mustTry}”
            </p>
          </div>

          <button
            onClick={() => scrollTo('story')}
            className="shrink-0 px-6 py-2.5 rounded-full bg-white text-black text-xs font-medium uppercase tracking-wider hover:bg-white/90 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>TASTE PARIS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ---------------- 5. YOUR PARIS STORY (Wide Open Statement Card + Travel Customizer) ---------------- */}
      <section id="story" className="max-w-6xl mx-auto px-6 py-28 sm:py-36">
        <div className="flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-white/40 mb-8">
          <span>05 · YOUR JOURNEY</span>
          <span>PARIS IS WAITING</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Invitation Card */}
          <div className="lg:col-span-6 border border-white/15 rounded-3xl p-8 sm:p-12 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 block mb-4">
                DON'T JUST VISIT PARIS. EXPERIENCE IT.
              </span>

              <h2 className="font-serif-cormorant text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-tight">
                PARIS IS WAITING.
              </h2>

              <p className="mt-5 text-sm sm:text-base text-white/60 font-light leading-relaxed">
                Whether it's your first adventure or your tenth visit, Paris always has another
                street to wander, another café to discover, and another story waiting around the
                corner.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-white/10 flex items-center gap-6 text-xs text-white/40 font-light">
              <span>Warm Morning Baguettes</span>
              <span>·</span>
              <span>Golden River Evenings</span>
            </div>
          </div>

          {/* Right Travel Customizer Card */}
          <div className="lg:col-span-6 border border-white/15 rounded-3xl p-8 sm:p-12 bg-white/[0.03] flex flex-col justify-between">
            <div>
              <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-white mb-2">
                Plan Your Paris Journey
              </h3>
              <p className="text-xs text-white/50 font-light mb-6">
                Choose your ideal pace and let Paris unfold at your own tempo.
              </p>

              {/* Trip length */}
              <div className="mb-6">
                <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-2 font-mono">
                  Length of Stay
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['3 Days', '5 Days', '7 Days'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDays(d)}
                      className={`py-2.5 text-xs rounded-xl border transition-all cursor-pointer ${
                        selectedDays === d
                          ? 'border-white bg-white text-black font-medium'
                          : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Vibe */}
              <div>
                <span className="text-[11px] uppercase tracking-wider text-white/40 block mb-2 font-mono">
                  What You Love
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Quiet Cafés & Streets',
                    'Iconic Sights & Sunsets',
                    'Bakeries & Wine Trails',
                    'Slow Wandering'
                  ].map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVibe(v)}
                      className={`p-3 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                        selectedVibe === v
                          ? 'border-white bg-white text-black font-medium'
                          : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50 font-light">
                {selectedDays} · {selectedVibe}
              </span>

              <button
                onClick={() => {
                  setSavedPlan(true);
                  setTimeout(() => setSavedPlan(false), 2400);
                }}
                className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-medium uppercase tracking-wider hover:bg-white/90 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {savedPlan ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Itinerary Ready</span>
                  </>
                ) : (
                  <>
                    <span>PLAN YOUR JOURNEY</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/35 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-white/70 font-medium">PARIS, YOUR WAY</span>
            <span>·</span>
            <span>48.8566° N, 2.3522° E</span>
          </div>
          <span>© {new Date().getFullYear()} Paris, Your Way. Minimal & Clean.</span>
        </footer>
      </section>
    </div>
  );
}
