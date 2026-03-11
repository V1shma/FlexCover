import { useRef, useEffect, useState } from 'react';

const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        // ⚠️ CSS MUST match these exact class names
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        // Must be white for gooey blur+contrast filter trick to work
        particle.style.setProperty('--color', 'white');
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => { element.classList.add('active'); });
        setTimeout(() => {
          try { element.removeChild(particle); } catch { }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index) => {
    const liEl = e.currentTarget.closest('li');
    if (activeIndex === index) return;
    setActiveIndex(index);
    updateEffectPosition(liEl);
    if (filterRef.current) {
      filterRef.current.querySelectorAll('.particle').forEach(p => {
        try { filterRef.current.removeChild(p); } catch { }
      });
    }
    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }
    if (filterRef.current) makeParticles(filterRef.current);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) handleClick({ currentTarget: { closest: () => liEl } }, index);
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }
    const resizeObserver = new ResizeObserver(() => {
      const cur = navRef.current?.querySelectorAll('li')[activeIndex];
      if (cur) updateEffectPosition(cur);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style>{`
        :root {
          --linear-ease: linear(0,0.068,0.19 2.7%,0.804 8.1%,1.037,1.199 13.2%,1.245,1.27 15.8%,1.274,1.272 17.4%,1.249 19.1%,0.996 28%,0.949,0.928 33.3%,0.926,0.933 36.8%,1.001 45.6%,1.013,1.019 50.8%,1.018 54.4%,1 63.1%,0.995 68%,1.001 85%,1);
        }

        /* The gooey effect layer */
        .gooey-effect {
          position: absolute;
          opacity: 1;
          pointer-events: none;
          display: grid;
          place-items: center;
          z-index: 10;
        }

        /* Floating label over the pill */
        .gooey-effect.text {
          color: white;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.3s ease;
          font-family: inherit;
        }
        .gooey-effect.text.active {
          color: #0a0a0a;
        }

        /* The blur+contrast layer that creates gooey merging */
        .gooey-effect.filter {
          filter: blur(7px) contrast(100) blur(0);
          mix-blend-mode: lighten;
        }
        /* Dark area that the white shapes merge into */
        .gooey-effect.filter::before {
          content: "";
          position: absolute;
          inset: -75px;
          z-index: -2;
          background: #000;
        }
        /* The white pill that appears on active */
        .gooey-effect.filter::after {
          content: "";
          position: absolute;
          inset: 0;
          background: white;
          transform: scale(0);
          opacity: 0;
          z-index: -1;
          border-radius: 9999px;
        }
        .gooey-effect.active::after {
          animation: gooey-pill 0.3s ease both;
        }
        @keyframes gooey-pill {
          to { transform: scale(1); opacity: 1; }
        }

        /* ── particle & point — class names MUST match what makeParticles creates ── */
        .particle,
        .point {
          display: block;
          opacity: 0;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          transform-origin: center;
        }
        .particle {
          --time: 5s;
          position: absolute;
          top: calc(50% - 10px);
          left: calc(50% - 10px);
          animation: particle calc(var(--time)) ease -350ms 1;
        }
        .point {
          background: var(--color, white);
          opacity: 1;
          animation: point calc(var(--time)) ease -350ms 1;
        }

        @keyframes particle {
          0% {
            transform: rotate(0deg) translate(var(--start-x), var(--start-y));
            opacity: 1;
            animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
          }
          70% {
            transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
            opacity: 1;
            animation-timing-function: ease;
          }
          85% {
            transform: rotate(calc(var(--rotate) * 0.66)) translate(var(--end-x), var(--end-y));
            opacity: 1;
          }
          100% {
            transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
            opacity: 1;
          }
        }

        @keyframes point {
          0% {
            transform: scale(0);
            opacity: 0;
            animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
          }
          25% { transform: scale(calc(var(--scale) * 0.25)); }
          38% { opacity: 1; }
          65% {
            transform: scale(var(--scale));
            opacity: 1;
            animation-timing-function: ease;
          }
          85% { transform: scale(var(--scale)); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }

        /* Nav list items */
        .gn-li {
          position: relative;
          cursor: pointer;
          list-style: none;
          border-radius: 9999px;
          transition: color 0.3s ease;
        }
        .gn-li.active {
          color: #0a0a0a !important;
          text-shadow: none !important;
        }
        .gn-li::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 8px;
          background: white;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s ease;
          z-index: -1;
        }
        .gn-li.active::after {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>

      <div style={{ position: 'relative' }} ref={containerRef}>
        <nav style={{ display: 'flex', position: 'relative', transform: 'translate3d(0,0,0.01px)' }}>
          <ul
            ref={navRef}
            style={{
              display: 'flex',
              gap: '4px',
              listStyle: 'none',
              padding: '0 4px',
              margin: 0,
              position: 'relative',
              zIndex: 3,
              color: 'white',
              textShadow: '0 1px 1px hsl(205deg 30% 10% / 0.2)',
            }}
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={`gn-li${activeIndex === index ? ' active' : ''}`}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(e, index);
                    item.onClick?.();
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={{
                    outline: 'none',
                    padding: '8px 16px',
                    display: 'inline-block',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'inherit',
                    textDecoration: 'none',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Filter layer — gooey magic happens here */}
        <span className="gooey-effect filter" ref={filterRef} />
        {/* Text layer — sits on top with the correct label */}
        <span className="gooey-effect text" ref={textRef} />
      </div>
    </>
  );
};

export default GooeyNav;
