import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function CodexMotion({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsapMod = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsapMod.registerPlugin(ScrollTrigger);

      const ctx = gsapMod.context(() => {
        /* ── 1. Hero text entrance (immediate, no scrollTrigger) ── */
        const heroEl = root.querySelector<HTMLElement>(".cx-hero");
        if (heroEl) {
          gsapMod.from(heroEl.querySelectorAll<HTMLElement>(".cx-reveal"), {
            y: 60,
            opacity: 0,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.12,
          });

          gsapMod.to(heroEl, {
            scale: 0.96,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: heroEl,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }

        /* ── 2. Marquee strip ── */
        const marquee = root.querySelector<HTMLElement>(".cx-marquee-track");
        if (marquee) {
          gsapMod.to(marquee, {
            x: "-50%",
            ease: "none",
            duration: 22,
            repeat: -1,
          });
        }

        /* ── 3. Headings – slide up ONLY (no opacity, elements stay visible) ── */
        root.querySelectorAll<HTMLElement>(".cx-heading").forEach((el) => {
          gsapMod.from(el, {
            y: 32,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        /* ── 4. Fade-up elements – subtle slide only ── */
        root.querySelectorAll<HTMLElement>(".cx-fade").forEach((el) => {
          gsapMod.from(el, {
            y: 20,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          });
        });

        /* ── 5. Cards – stagger slide on scroll (no opacity lock) ── */
        root.querySelectorAll<HTMLElement>(".cx-cards-row").forEach((row) => {
          const cards = row.querySelectorAll<HTMLElement>(".cx-card");
          if (!cards.length) return;
          gsapMod.from(cards, {
            y: 36,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          });
        });

        /* ── 6. Count-up numbers ── */
        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const target = parseFloat(el.dataset.count ?? "0");
          const isInt = Number.isInteger(target);
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => {
              const proxy = { val: 0 };
              gsapMod.to(proxy, {
                val: target,
                duration: 1.8,
                ease: "power2.out",
                onUpdate() {
                  el.textContent = isInt
                    ? Math.round(proxy.val).toLocaleString()
                    : proxy.val.toFixed(1);
                },
              });
            },
          });
        });

        /* ── 7. Parallax images ── */
        root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
          gsapMod.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest("section") ?? img,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        });

        /* ── 8. Ambient blobs ── */
        root.querySelectorAll<HTMLElement>(".cx-blob").forEach((blob, i) => {
          gsapMod.to(blob, {
            x: i % 2 === 0 ? 30 : -30,
            y: i % 2 === 0 ? -20 : 20,
            duration: 6 + i * 1.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });

        ScrollTrigger.refresh();
        window.addEventListener("load", () => ScrollTrigger.refresh());
      }, root);

      cleanup = () => ctx.revert();
    })();

    return () => { cleanup?.(); };
  }, []);

  return (
    <div ref={ref} className="cx-motion-root">
      {children}
    </div>
  );
}
