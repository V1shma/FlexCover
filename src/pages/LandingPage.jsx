import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GooeyNav from '../components/GooeyNav';
import {
    Shield, Zap, Brain, BarChart3, ArrowRight, CheckCircle,
    Clock, Globe, Star, TrendingUp, Users, Activity,
    DollarSign, Bike, Package, ShoppingBag, Truck,
    ChevronDown, Cpu, AlertTriangle, Sparkles, Lock, Wifi, Play
} from 'lucide-react';

/* ─── Scroll Reveal ─── */
function useReveal(t = 0.1) {
    const ref = useRef(null);
    const [v, setV] = useState(false);
    useEffect(() => {
        const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
        if (ref.current) o.observe(ref.current);
        return () => o.disconnect();
    }, []);
    return [ref, v];
}
function Reveal({ children, delay = 0, style = {}, className = '' }) {
    const [ref, v] = useReveal();
    return (
        <div ref={ref} className={className} style={{
            opacity: v ? 1 : 0,
            transform: v ? 'translateY(0)' : 'translateY(22px)',
            transition: `opacity .65s ease ${delay}ms, transform .65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
            ...style,
        }}>{children}</div>
    );
}

/* ─── Counter ─── */
function Counter({ target, suffix = '', prefix = '' }) {
    const [n, setN] = useState(0);
    const [ref, v] = useReveal();
    useEffect(() => {
        if (!v) return;
        const steps = 55, step = target / steps;
        let cur = 0, fr = 0;
        const id = setInterval(() => {
            fr++; cur = Math.min(cur + step, target);
            setN(fr >= steps ? target : (target % 1 !== 0 ? parseFloat(cur.toFixed(1)) : Math.floor(cur)));
            if (fr >= steps) clearInterval(id);
        }, 1800 / steps);
        return () => clearInterval(id);
    }, [v, target]);
    return <span ref={ref}>{prefix}{target % 1 !== 0 ? n.toFixed(1) : n.toLocaleString()}{suffix}</span>;
}

/* ════════════════════════════════════════════
   TRUE 3D COIN — CSS preserve-3d cylinder
   Matches the Spline "Rotating Coins ✨" scene:
   purple/indigo metallic disc, ★ symbol, gloss rim
   ════════════════════════════════════════════ */
const VARIANTS = [
    { face: 'linear-gradient(160deg,#6d28d9 0%,#7c3aed 30%,#a855f7 55%,#7c3aed 80%,#4c1d95 100%)', rim: '#4c1d95', shine: 'rgba(167,139,250,.55)', shadow: 'rgba(109,40,217,.9)', textColor: '#ede9fe' },
    { face: 'linear-gradient(160deg,#ede9fe 0%,#c4b5fd 30%,#e9d5ff 55%,#a78bfa 80%,#ddd6fe 100%)', rim: '#7c3aed', shine: 'rgba(255,255,255,.75)', shadow: 'rgba(167,139,250,.7)', textColor: '#4c1d95' },
    { face: 'linear-gradient(160deg,#1e1b4b 0%,#312e81 30%,#4338ca 55%,#3730a3 80%,#1e1b4b 100%)', rim: '#1e1b4b', shine: 'rgba(129,140,248,.45)', shadow: 'rgba(55,48,163,.8)', textColor: '#a5b4fc' },
    { face: 'linear-gradient(160deg,#9333ea 0%,#c084fc 30%,#d8b4fe 55%,#a855f7 80%,#7e22ce 100%)', rim: '#6b21a8', shine: 'rgba(216,180,254,.65)', shadow: 'rgba(147,51,234,.8)', textColor: '#faf5ff' },
    { face: 'linear-gradient(160deg,#2e1065 0%,#4a1d96 30%,#7c3aed 55%,#5b21b6 80%,#2e1065 100%)', rim: '#1e0a46', shine: 'rgba(139,92,246,.5)', shadow: 'rgba(76,29,149,.9)', textColor: '#ddd6fe' },
];

/* Number of rim segments — more = smoother cylinder edge */
const RIM_SEGS = 18;

function Coin3D({ size = 64, spinDur = '6s', floatDur = '7s', delay = '0s' }) {
    const v = useMemo(() => VARIANTS[Math.floor(Math.random() * VARIANTS.length)], []);
    const thick = Math.round(size * 0.14); // coin thickness

    return (
        <div style={{
            width: size, height: size,
            perspective: size * 6,
            animation: `fc3d-float ${floatDur} ease-in-out ${delay} infinite`,
        }}>
            <div style={{
                width: '100%', height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                animation: `fc3d-spin ${spinDur} linear ${delay} infinite`,
            }}>
                {/* ── Front face ── */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: v.face,
                    backfaceVisibility: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: `translateZ(${thick / 2}px)`,
                    boxShadow: `inset 0 3px 10px ${v.shine}, inset 0 -3px 8px rgba(0,0,0,.5)`,
                    overflow: 'hidden',
                }}>
                    {/* specular highlight sweep */}
                    <div style={{
                        position: 'absolute', top: 0, left: '-60%', width: '40%', height: '100%',
                        background: `linear-gradient(90deg,transparent,${v.shine},transparent)`,
                        animation: `fc3d-sheen ${spinDur} linear ${delay} infinite`,
                        borderRadius: '50%',
                    }} />
                    {/* Raised ring border */}
                    <div style={{
                        position: 'absolute', inset: size * 0.08,
                        borderRadius: '50%',
                        border: `${Math.max(1, size * 0.025)}px solid ${v.shine}`,
                        opacity: 0.7,
                    }} />
                    {/* Star symbol */}
                    <span style={{
                        fontSize: size * 0.42, color: v.textColor, lineHeight: 1,
                        userSelect: 'none', position: 'relative', zIndex: 1,
                        filter: `drop-shadow(0 0 ${size * 0.05}px ${v.textColor})`,
                        textShadow: `0 0 ${size * 0.1}px ${v.shine}`,
                    }}>★</span>
                </div>

                {/* ── Back face ── */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: v.face,
                    backfaceVisibility: 'hidden',
                    transform: `rotateY(180deg) translateZ(${thick / 2}px)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `inset 0 3px 10px ${v.shine}, inset 0 -3px 8px rgba(0,0,0,.5)`,
                }}>
                    <span style={{ fontSize: size * 0.34, color: v.textColor, opacity: 0.8, userSelect: 'none' }}>₹</span>
                </div>

                {/* ── Rim (cylinder edge) — thin vertical strips rotated around Y ── */}
                {Array.from({ length: RIM_SEGS }).map((_, i) => {
                    const angle = (360 / RIM_SEGS) * i;
                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            top: 0, left: '50%',
                            width: thick,
                            height: '100%',
                            marginLeft: -thick / 2,
                            background: `linear-gradient(to bottom,
                ${v.rim}cc 0%,
                ${v.shine} 25%,
                ${v.rim} 50%,
                ${v.shine}99 75%,
                ${v.rim}cc 100%)`,
                            transform: `rotateY(${angle}deg) translateZ(${size / 2 - 1}px)`,
                            backfaceVisibility: 'hidden',
                        }} />
                    );
                })}

                {/* ── Drop shadow plane ── */}
                <div style={{
                    position: 'absolute', inset: '10%',
                    borderRadius: '50%',
                    background: 'transparent',
                    boxShadow: `0 ${size * 0.3}px ${size * 0.5}px ${size * 0.1}px ${v.shadow}`,
                    transform: `translateZ(-${thick}px)`,
                    backfaceVisibility: 'hidden',
                }} />
            </div>
        </div>
    );
}

/* ─── Background coins scattered across full page ─── */
const COIN_CONFIGS = [
    { top: '4%', left: '2%', size: 78, spin: '7s', float: '8s', delay: '0s', op: 0.65 },
    { top: '5%', left: '87%', size: 56, spin: '5s', float: '9.5s', delay: '-1.5s', op: 0.55 },
    { top: '16%', left: '93%', size: 92, spin: '4.5s', float: '7s', delay: '-0.7s', op: 0.70 },
    { top: '20%', left: '78%', size: 48, spin: '8s', float: '11s', delay: '-3s', op: 0.45 },
    { top: '26%', left: '-1%', size: 70, spin: '6s', float: '9s', delay: '-1s', op: 0.55 },
    { top: '33%', left: '84%', size: 44, spin: '9s', float: '12s', delay: '-4s', op: 0.40 },
    { top: '40%', left: '4%', size: 60, spin: '5.5s', float: '8.5s', delay: '-0.5s', op: 0.60 },
    { top: '46%', left: '94%', size: 84, spin: '4s', float: '7.5s', delay: '-2s', op: 0.65 },
    { top: '52%', left: '72%', size: 50, spin: '7.5s', float: '10s', delay: '-1.8s', op: 0.45 },
    { top: '57%', left: '-2%', size: 88, spin: '5s', float: '8s', delay: '-0.3s', op: 0.60 },
    { top: '63%', left: '90%', size: 64, spin: '6.5s', float: '9s', delay: '-2.5s', op: 0.50 },
    { top: '68%', left: '6%', size: 46, spin: '8.5s', float: '11s', delay: '-1.2s', op: 0.40 },
    { top: '74%', left: '80%', size: 80, spin: '4.8s', float: '7s', delay: '-3.5s', op: 0.65 },
    { top: '79%', left: '91%', size: 52, spin: '7s', float: '10s', delay: '-0.4s', op: 0.45 },
    { top: '84%', left: '1%', size: 68, spin: '5.8s', float: '8.5s', delay: '-2s', op: 0.55 },
    { top: '89%', left: '83%', size: 42, spin: '9.5s', float: '12s', delay: '-0.8s', op: 0.38 },
    { top: '93%', left: '10%', size: 74, spin: '6.2s', float: '9s', delay: '-3s', op: 0.50 },
    { top: '12%', left: '48%', size: 36, spin: '10s', float: '13s', delay: '-1s', op: 0.22 },
    { top: '50%', left: '43%', size: 32, spin: '11s', float: '14s', delay: '-4s', op: 0.18 },
    { top: '71%', left: '54%', size: 38, spin: '9s', float: '11s', delay: '-2.5s', op: 0.22 },
];

function CoinsBackground() {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {COIN_CONFIGS.map((c, i) => (
                <div key={i} style={{ position: 'absolute', top: c.top, left: c.left, opacity: c.op }}>
                    <Coin3D size={c.size} spinDur={c.spin} floatDur={c.float} delay={c.delay} />
                </div>
            ))}
        </div>
    );
}

/* ─── Data ─── */
const PLATFORMS = [
    { icon: Bike, name: 'Zomato', color: '#E23744' },
    { icon: ShoppingBag, name: 'Swiggy', color: '#FC8019' },
    { icon: Package, name: 'Amazon', color: '#FF9900' },
    { icon: Truck, name: 'Zepto', color: '#9154FF' },
    { icon: Bike, name: 'Blinkit', color: '#F7C404' },
    { icon: ShoppingBag, name: 'Dunzo', color: '#00C566' },
];
const STEPS = [
    { n: '01', icon: Cpu, color: '#7c3aed', title: 'AI Risk Scan', body: 'Continuous ingestion of weather, traffic, platform uptime, city density — computing a live risk score every second for every rider.' },
    { n: '02', icon: AlertTriangle, color: '#db2777', title: 'Parametric Trigger', body: 'Smart-contract triggers fire the instant pre-agreed thresholds are crossed — no forms, no calls, no disputes, no delays.' },
    { n: '03', icon: Zap, color: '#0891b2', title: 'Instant Payout', body: 'Verified funds hit your UPI wallet in under 60 seconds. Transparent, direct, immutable — without exception.' },
];
const FEATURES = [
    { icon: Brain, accent: '#7c3aed', label: 'Predictive AI Engine', body: '50M+ delivery events train our ML models to forecast disruptions before they hurt your income.', tag: '50M+ events', wide: true },
    { icon: Zap, accent: '#0891b2', label: 'Sub-60s Payouts', body: 'Fastest parametric insurance payouts in the industry. Funds arrive before you even refresh the page.', tag: '<60 seconds', wide: false },
    { icon: Globe, accent: '#059669', label: 'City-Grid Coverage', body: 'Hyperlocal triggers mapped to your exact delivery zone — not city level, but street-grid level.', tag: '24 cities', wide: false },
    { icon: DollarSign, accent: '#d97706', label: 'Pay Per Shift', body: 'Premiums as low as ₹2/hr. Cover switches on when your shift starts, off when it ends.', tag: 'From ₹2/hr', wide: false },
    { icon: BarChart3, accent: '#db2777', label: 'Transparent Ledger', body: 'Every model output, trigger event, payout logged immutably — you see exactly what the AI sees.', tag: '100% open', wide: false },
    { icon: Lock, accent: '#7c3aed', label: 'Bank-Grade Security', body: 'AES-256 encrypted, IRDAI-compliant, ISO 27001 certified. Your income data, fully locked down.', tag: 'ISO 27001', wide: true },
];
const TESTIMONIALS = [
    { av: 'RK', name: 'Ravi Kumar', city: 'Bengaluru', plat: 'Zomato', quote: 'Heavy rains wiped my income for 3 days. FlexCover auto-paid ₹1,800 before I even opened the app. I didn\'t do a thing.' },
    { av: 'PS', name: 'Priya Sharma', city: 'Mumbai', plat: 'Swiggy', quote: 'Platform went down for 4 hours. Money was in my account in 90 seconds. No form. No call. Just instant protection.' },
    { av: 'AN', name: 'Arjun Nair', city: 'Delhi', plat: 'Amazon', quote: '₹2/hr is less than chai. Knowing I\'m covered lets me focus on riding — not worrying about tomorrow.' },
];
const FEED = [
    '🌧️ Rain event — Bengaluru Zone 4 — ₹4.2L auto-paid to 847 riders in 58s',
    '⚡ Swiggy outage detected — 2,300 riders protected — payouts triggered',
    '🚦 NH-48 gridlock — Delhi — ₹12.4L income gap covered automatically',
    '⛈️ Cyclone warning — Chennai — Pre-emptive cover for 1,100 riders activated',
    '📡 Network disruption — Mumbai — ₹8.7L compensation issued instantly',
    '🌧️ Flash flooding — Hyderabad — Active payouts: 612 riders compensated',
];

export default function LandingPage() {
    const nav = useNavigate();
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const h = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, []);

    const navItems = [
        { label: 'Features', href: '#', onClick: () => { } },
        { label: 'How it works', href: '#', onClick: () => { } },
        { label: 'Pricing', href: '#', onClick: () => { } },
        { label: 'Dashboard', href: '#', onClick: () => nav('/dashboard') },
    ];

    return (
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#07040f', color: '#e2e8f0', overflowX: 'hidden', position: 'relative' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        /* ── Coin keyframes ── */
        @keyframes fc3d-spin  { from{transform:rotateY(0deg)} to{transform:rotateY(360deg)} }
        @keyframes fc3d-float { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-20px) rotate(4deg)} 66%{transform:translateY(-8px) rotate(-3deg)} }
        @keyframes fc3d-sheen { 0%{left:-60%} 100%{left:150%} }

        /* ── Page keyframes ── */
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes ticker    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes ripple    { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.4);opacity:0} }
        @keyframes scanLine  { 0%{top:-2px;opacity:0} 6%{opacity:1} 94%{opacity:.8} 100%{top:100%;opacity:0} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 24px rgba(124,58,237,.4)} 50%{box-shadow:0 0 40px rgba(219,39,119,.45)} }

        .tg {
          background:linear-gradient(135deg,#a78bfa 0%,#7c3aed 35%,#db2777 70%,#f472b6 100%);
          background-size:300%; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; animation:gradShift 5s ease infinite;
        }
        .gc {
          background:rgba(255,255,255,.028); border:1px solid rgba(255,255,255,.07);
          backdrop-filter:blur(28px) saturate(160%); -webkit-backdrop-filter:blur(28px) saturate(160%);
          border-radius:20px; position:relative; overflow:hidden;
          transition:all .3s cubic-bezier(.22,1,.36,1);
        }
        .gc::before { content:''; position:absolute; inset:0; border-radius:20px; background:linear-gradient(135deg,rgba(255,255,255,.042) 0%,transparent 55%); pointer-events:none; }
        .gc:hover { border-color:rgba(124,58,237,.32); transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,.55),0 0 0 1px rgba(124,58,237,.14),inset 0 1px 0 rgba(255,255,255,.07); }

        .bp { position:relative; display:inline-flex; align-items:center; gap:9px; padding:14px 32px; border-radius:14px; border:none; cursor:pointer; font-size:15px; font-weight:600; color:#fff; overflow:hidden; background:linear-gradient(135deg,#7c3aed,#db2777); background-size:200%; animation:gradShift 4s ease infinite; transition:transform .25s,box-shadow .25s; box-shadow:0 4px 28px rgba(124,58,237,.42); font-family:inherit; }
        .bp:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 12px 44px rgba(124,58,237,.62); }
        .bp::after { content:''; position:absolute; top:0; left:-60%; width:40%; height:100%; background:rgba(255,255,255,.13); transform:skewX(-20deg); transition:left .5s; }
        .bp:hover::after { left:130%; }

        .bg { display:inline-flex; align-items:center; gap:9px; padding:14px 32px; border-radius:14px; cursor:pointer; font-size:15px; font-weight:500; color:#94a3b8; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); backdrop-filter:blur(12px); transition:all .25s; font-family:inherit; }
        .bg:hover { border-color:rgba(124,58,237,.5); color:#e2e8f0; background:rgba(124,58,237,.1); transform:translateY(-2px); }

        .tag { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:999px; font-size:11px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; }

        .sc { padding:28px 16px; text-align:center; border-right:1px solid rgba(255,255,255,.05); }
        .sc:last-child { border-right:none; }

        .bento { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; max-width:1120px; margin:0 auto; }
        .bw    { grid-column:span 2; }
        @media(max-width:900px){ .bento{grid-template-columns:1fr 1fr;} }
        @media(max-width:560px){ .bento{grid-template-columns:1fr;} .bw{grid-column:span 1;} }

        .tw { overflow:hidden; white-space:nowrap; }
        .ti { display:inline-flex; animation:ticker 36s linear infinite; }
        .ti:hover { animation-play-state:paused; }

        .step { flex:1; min-width:260px; padding:32px 28px; background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07); backdrop-filter:blur(24px); border-radius:24px; position:relative; overflow:hidden; transition:all .3s cubic-bezier(.22,1,.36,1); }
        .step:hover { transform:translateY(-5px); box-shadow:0 24px 60px rgba(0,0,0,.5); }
        .step .sl { position:absolute; left:0; right:0; height:1.5px; background:linear-gradient(90deg,transparent,currentColor,transparent); animation:scanLine 4.5s ease-in-out infinite; }

        .sh { font-family:'Space Grotesk',sans-serif; font-size:clamp(1.9rem,4vw,3rem); font-weight:700; letter-spacing:-.04em; line-height:1.1; }
        .li { width:38px; height:38px; border-radius:12px; background:linear-gradient(135deg,#7c3aed,#db2777); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:18px; color:#fff; box-shadow:0 0 24px rgba(124,58,237,.5); animation:glowPulse 3s ease-in-out infinite; flex-shrink:0; }

        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(124,58,237,.35); border-radius:99px; }
      `}</style>

            {/* ════ COINS BACKGROUND ════ */}
            <CoinsBackground />

            {/* ════ NAV ════ */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
                height: 66, padding: '0 5%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'transparent',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="li">F</div>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '-.03em' }}>
                        Flex<span className="tg">Cover</span>
                    </span>
                </div>

                {/* GooeyNav — middle links */}
                <GooeyNav
                    items={navItems}
                    animationTime={500}
                    particleCount={12}
                    colors={[1, 2, 3, 4, 1, 2]}
                    initialActiveIndex={0}
                />

                {/* Get Protected CTA */}
                <button onClick={() => nav('/onboarding')} className="bp" style={{ padding: '9px 22px', fontSize: 13 }}>
                    Get Protected <ArrowRight size={14} />
                </button>
            </nav>

            {/* ════ HERO ════ */}
            <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '68px 5% 80px', position: 'relative', zIndex: 1 }}>
                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse,rgba(124,58,237,.12) 0%,rgba(219,39,119,.05) 55%,transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)', zIndex: 0 }} />

                <Reveal delay={0}><div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 26 }}>
                    <span className="tag" style={{ background: 'rgba(124,58,237,.12)', border: '1px solid rgba(124,58,237,.3)', color: '#a78bfa' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 10px #7c3aed', animation: 'pulse 2s ease infinite' }} />
                        AI-Powered Parametric Insurance
                    </span>
                </div></Reveal>

                <Reveal delay={80}><h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(3rem,7.5vw,6.5rem)', fontWeight: 800, letterSpacing: '-.05em', lineHeight: .98, marginBottom: 28 }}>
                    Protect Your Earnings.<br /><span className="tg">Automatically.</span>
                </h1></Reveal>

                <Reveal delay={180}><p style={{ fontSize: 'clamp(.98rem,1.7vw,1.18rem)', color: '#64748b', lineHeight: 1.82, maxWidth: 560, marginBottom: 44 }}>
                    FlexCover detects income threats in real-time — storms, outages, traffic gridlocks — and pays Zomato, Swiggy, Amazon &amp; Zepto riders{' '}
                    <strong style={{ color: '#cbd5e1', fontWeight: 600 }}>automatically in under 60 seconds</strong>. Zero forms. Zero waiting.
                </p></Reveal>

                <Reveal delay={260}><div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
                    <button onClick={() => nav('/onboarding')} className="bp" style={{ fontSize: 16, padding: '16px 40px' }}>Start Free — No Card Needed <ArrowRight size={18} /></button>
                    <button onClick={() => nav('/demo')} className="bg" style={{ fontSize: 16, padding: '16px 40px' }}><Play size={14} style={{ fill: 'currentColor' }} /> Watch Demo</button>
                </div></Reveal>

                {/* Social proof */}
                <Reveal delay={340}><div style={{ display: 'flex', alignItems: 'center', gap: 22, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {['RK', 'PS', 'AN', 'MV', 'SK'].map((a, i) => (
                            <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg,hsl(${230 + i * 45},70%,52%),hsl(${270 + i * 40},60%,38%))`, border: '2px solid #07040f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', marginLeft: i === 0 ? 0 : -9, zIndex: 5 - i }}>{a}</div>
                        ))}
                        <div style={{ display: 'flex', gap: 2, marginLeft: 12 }}>{[0, 1, 2, 3, 4].map(i => <Star key={i} size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 32 }}>
                        {[{ v: '48K+', l: 'Riders Protected' }, { v: '₹14Cr', l: 'Paid Out' }, { v: '<60s', l: 'Avg Payout' }].map(({ v, l }, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
                                <div style={{ fontSize: 12, color: '#475569' }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div></Reveal>

                <Reveal delay={420}><p style={{ fontSize: 11, color: '#334155', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 14 }}>Covering riders on</p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {PLATFORMS.map((p, i) => {
                            const I = p.icon; return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 999, transition: 'all .2s', cursor: 'default' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + '55'; e.currentTarget.style.background = p.color + '12'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'; e.currentTarget.style.background = 'rgba(255,255,255,.03)'; }}>
                                    <I size={13} style={{ color: p.color }} /><span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{p.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </Reveal>

                <div style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', opacity: scrollY > 60 ? 0 : .55, transition: 'opacity .3s' }}>
                    <ChevronDown size={17} style={{ color: '#7c3aed', display: 'block', animation: 'fc3d-float 2s ease-in-out infinite' }} />
                </div>
            </section>

            {/* ════ LIVE TICKER ════ */}
            <div style={{ position: 'relative', zIndex: 1, background: 'rgba(124,58,237,.04)', borderTop: '1px solid rgba(124,58,237,.1)', borderBottom: '1px solid rgba(255,255,255,.04)', padding: '10px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 5% 8px' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 10px #22c55e', animation: 'pulse 1.4s ease infinite', flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '.14em' }}>Live AI Feed</span>
                </div>
                <div className="tw"><div className="ti">
                    {[...FEED, ...FEED].map((m, i) => (
                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 40px', fontSize: 13, color: '#64748b' }}>
                            {m} <span style={{ color: '#1c1128', margin: '0 10px' }}>◆</span>
                        </span>
                    ))}
                </div></div>
            </div>

            {/* ════ STATS ════ */}
            <section style={{ position: 'relative', zIndex: 1, padding: '64px 5%' }}>
                <Reveal><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'rgba(255,255,255,.018)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 24, overflow: 'hidden', maxWidth: 960, margin: '0 auto' }}>
                    {[
                        { icon: Users, color: '#7c3aed', label: 'Riders Protected', val: 48200, suf: '+' },
                        { icon: DollarSign, color: '#db2777', label: 'Total Payouts', val: 14, suf: 'Cr+', pre: '₹' },
                        { icon: Clock, color: '#0891b2', label: 'Avg Payout Speed', val: 58, suf: 's' },
                        { icon: Globe, color: '#059669', label: 'Cities Active', val: 24, suf: '' },
                    ].map((s, i) => {
                        const Ic = s.icon; return (
                            <div key={i} className="sc">
                                <div style={{ width: 44, height: 44, borderRadius: 13, background: s.color + '1A', border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><Ic size={19} style={{ color: s.color }} /></div>
                                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-.05em', lineHeight: 1 }}>
                                    <Counter target={s.val} suffix={s.suf} prefix={s.pre || ''} />
                                </div>
                                <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{s.label}</div>
                            </div>
                        );
                    })}
                </div></Reveal>
            </section>

            {/* ════ HOW IT WORKS ════ */}
            <section style={{ position: 'relative', zIndex: 1, padding: '0 5% 100px' }}>
                <Reveal><div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <span className="tag" style={{ background: 'rgba(8,145,178,.1)', border: '1px solid rgba(8,145,178,.25)', color: '#22d3ee', marginBottom: 20, display: 'inline-flex' }}><Sparkles size={11} /> How It Works</span>
                    <h2 className="sh" style={{ marginBottom: 14 }}>From Risk to Relief in <span className="tg">60 Seconds</span></h2>
                    <p style={{ color: '#475569', maxWidth: 440, margin: '0 auto', lineHeight: 1.7, fontSize: 15 }}>Three autonomous steps that turn unpredictable gig income into guaranteed earnings.</p>
                </div></Reveal>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', maxWidth: 1120, margin: '0 auto' }}>
                    {STEPS.map((s, i) => {
                        const Ic = s.icon; return (
                            <Reveal key={i} delay={i * 110} style={{ flex: '1', minWidth: 260 }}>
                                <div className="step">
                                    <div className="sl" style={{ color: s.color, animationDelay: `${i * 1.5}s` }} />
                                    <div style={{ position: 'absolute', top: 12, right: 18, fontFamily: "'Space Grotesk',sans-serif", fontSize: 90, fontWeight: 900, color: s.color + '09', lineHeight: 1, userSelect: 'none' }}>{s.n}</div>
                                    <div style={{ width: 56, height: 56, borderRadius: 17, background: s.color + '15', border: `1px solid ${s.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, position: 'relative' }}>
                                        <Ic size={25} style={{ color: s.color }} />
                                        <div style={{ position: 'absolute', inset: -4, borderRadius: 21, border: `1px solid ${s.color}25`, animation: 'ripple 3s ease-out infinite' }} />
                                    </div>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 10 }}>Step {s.n}</div>
                                    <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 21, fontWeight: 700, color: '#f1f5f9', marginBottom: 12, letterSpacing: '-.03em' }}>{s.title}</h3>
                                    <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: 14 }}>{s.body}</p>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </section>

            {/* ════ BENTO FEATURES ════ */}
            <section style={{ position: 'relative', zIndex: 1, padding: '0 5% 100px' }}>
                <Reveal><div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <span className="tag" style={{ background: 'rgba(219,39,119,.1)', border: '1px solid rgba(219,39,119,.25)', color: '#f472b6', marginBottom: 20, display: 'inline-flex' }}><Activity size={11} /> Platform Capabilities</span>
                    <h2 className="sh" style={{ marginBottom: 14 }}>Built for the <span className="tg">Future of Work</span></h2>
                    <p style={{ color: '#475569', maxWidth: 450, margin: '0 auto', lineHeight: 1.7, fontSize: 15 }}>Every feature designed around the real income risks of India's 15M+ gig delivery workers.</p>
                </div></Reveal>
                <div className="bento">
                    {FEATURES.map((f, i) => {
                        const Ic = f.icon; return (
                            <Reveal key={i} delay={i * 65} className={f.wide ? 'bw' : ''}>
                                <div className={`gc${f.wide ? ' bw' : ''}`} style={{ borderColor: f.accent + '22', padding: 28, minHeight: f.wide && i === 0 ? 240 : 170, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <div style={{ position: 'absolute', width: 100, height: 100, background: `radial-gradient(circle,${f.accent}18,transparent)`, top: -18, right: -18, borderRadius: '50%', pointerEvents: 'none' }} />
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                                        <div style={{ width: 48, height: 48, borderRadius: 15, background: f.accent + '15', border: `1px solid ${f.accent}2A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={21} style={{ color: f.accent }} /></div>
                                        <span style={{ padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: f.accent + '12', border: `1px solid ${f.accent}25`, color: f.accent }}>{f.tag}</span>
                                    </div>
                                    <div>
                                        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 8, letterSpacing: '-.02em' }}>{f.label}</h3>
                                        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65 }}>{f.body}</p>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </section>

            {/* ════ TESTIMONIALS ════ */}
            <section style={{ position: 'relative', zIndex: 1, padding: '0 5% 100px' }}>
                <Reveal><div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <span className="tag" style={{ background: 'rgba(5,150,105,.1)', border: '1px solid rgba(5,150,105,.25)', color: '#34d399', marginBottom: 20, display: 'inline-flex' }}><Star size={11} /> Rider Stories</span>
                    <h2 className="sh">Real Riders. <span className="tg">Real Results.</span></h2>
                </div></Reveal>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(285px,1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
                    {TESTIMONIALS.map((t, i) => (
                        <Reveal key={i} delay={i * 90}>
                            <div className="gc" style={{ padding: 28 }}>
                                <div style={{ fontSize: 48, lineHeight: 1, color: '#7c3aed', opacity: .2, fontFamily: 'Georgia,serif', marginBottom: 2 }}>"</div>
                                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>{[0, 1, 2, 3, 4].map(j => <Star key={j} size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}</div>
                                <p style={{ color: '#cbd5e1', lineHeight: 1.75, fontSize: 14, marginBottom: 22, fontStyle: 'italic' }}>"{t.quote}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 13, background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,.3)', flexShrink: 0 }}>{t.av}</div>
                                    <div><div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{t.name}</div><div style={{ fontSize: 12, color: '#475569' }}>{t.plat} · {t.city}</div></div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ════ PRICING CTA ════ */}
            <section style={{ position: 'relative', zIndex: 1, padding: '0 5% 100px' }}>
                <Reveal><div style={{ maxWidth: 920, margin: '0 auto', background: 'rgba(124,58,237,.07)', border: '1px solid rgba(124,58,237,.22)', borderRadius: 32, padding: 'clamp(36px,6vw,72px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 260, background: 'radial-gradient(ellipse,rgba(124,58,237,.13),transparent)', pointerEvents: 'none' }} />
                    <span className="tag" style={{ background: 'rgba(124,58,237,.12)', border: '1px solid rgba(124,58,237,.3)', color: '#a78bfa', marginBottom: 22, display: 'inline-flex' }}><TrendingUp size={11} /> Starting at ₹2 / hour</span>
                    <h2 className="sh" style={{ marginBottom: 18 }}>Protection That <span className="tg">Fits Your Shift</span></h2>
                    <p style={{ color: '#475569', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>No lock-ins. No sign-up fees. FlexCover starts the moment your shift begins and pauses when it ends.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(185px,1fr))', gap: 10, maxWidth: 720, margin: '0 auto 44px' }}>
                        {['Zero paperwork to claim', 'Pay-per-shift flexibility', '60-second auto-payouts', 'Weather & storm triggers', 'Platform outage coverage', 'No minimum commitment'].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#94a3b8', fontSize: 14, padding: '11px 14px', background: 'rgba(255,255,255,.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,.06)' }}>
                                <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0 }} />{item}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => nav('/onboarding')} className="bp" style={{ fontSize: 16, padding: '16px 52px' }}>Get Started — It's Free <ArrowRight size={19} /></button>
                </div></Reveal>
            </section>

            {/* ════ FINAL CTA ════ */}
            <section style={{ position: 'relative', zIndex: 1, padding: '20px 5% 120px', textAlign: 'center' }}>
                <div style={{ position: 'absolute', top: 0, left: '20%', width: 600, height: 380, background: 'radial-gradient(ellipse,rgba(124,58,237,.1),transparent)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <Reveal>
                    <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(2.3rem,5.5vw,4.5rem)', fontWeight: 800, letterSpacing: '-.05em', lineHeight: 1.1, marginBottom: 18 }}>
                        Your next shift.<br /><span className="tg">Fully covered.</span>
                    </h2>
                    <p style={{ color: '#475569', fontSize: 17, marginBottom: 48 }}>Join 48,000+ riders who never worry about income loss again.</p>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => nav('/onboarding')} className="bp" style={{ fontSize: 17, padding: '17px 54px' }}>Protect My Income <Shield size={19} /></button>
                        <button onClick={() => nav('/demo')} className="bg" style={{ fontSize: 17, padding: '17px 54px' }}>See It Live <Activity size={19} /></button>
                    </div>
                </Reveal>
            </section>

            {/* ════ FOOTER ════ */}
            <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,.05)', padding: '28px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="li" style={{ width: 28, height: 28, borderRadius: 9, fontSize: 13 }}>F</div>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#e2e8f0', fontSize: 15 }}>FlexCover</span>
                    <span style={{ color: '#1e1a30', fontSize: 13 }}>© 2026</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Wifi size={12} style={{ color: '#22c55e' }} />
                    <span style={{ fontSize: 12, color: '#334155' }}>All systems operational</span>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'pulse 2s ease infinite' }} />
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                    {['Privacy', 'Terms', 'Support', 'IRDAI'].map(l => (
                        <a key={l} href="#" style={{ color: '#1e293b', fontSize: 13, textDecoration: 'none', transition: 'color .2s' }}
                            onMouseEnter={e => e.target.style.color = '#a78bfa'} onMouseLeave={e => e.target.style.color = '#1e293b'}>{l}</a>
                    ))}
                </div>
            </footer>
        </div>
    );
}
