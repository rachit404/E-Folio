"use client";

import { useEffect, useRef } from "react";

export default function HeroAtmosphere() {
  const atmosphereRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = atmosphereRef.current;
    if (!root) return;

    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      root.style.setProperty("--mouse-x", `${x}`);
      root.style.setProperty("--mouse-y", `${y}`);
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={atmosphereRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={
        {
          "--mouse-x": "0",
          "--mouse-y": "0",
        } as React.CSSProperties
      }
    >
      {/* Base atmosphere */}
      <div className="absolute inset-0 bg-[var(--color-void)]" />

      {/* Cyan energy field */}
      <div
        className="
          absolute
          left-[48%]
          top-[42%]
          h-[55vw]
          w-[55vw]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle,rgba(0,229,255,0.10),rgba(0,229,255,0.025)_35%,transparent_70%)]
          blur-3xl
        "
      />

      {/* Red energy field */}
      <div
        className="
          absolute
          left-[12%]
          top-[78%]
          h-[45vw]
          w-[45vw]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle,rgba(255,33,71,0.10),rgba(255,33,71,0.025)_35%,transparent_70%)]
          blur-3xl
        "
      />

      {/* Technical grid */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.12]
          [background-image:linear-gradient(rgba(0,229,255,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.11)_1px,transparent_1px)]
          [background-size:80px_80px]
          [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]
        "
      />

      {/* Fine grid */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.055]
          [background-image:linear-gradient(rgba(244,241,234,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(244,241,234,0.12)_1px,transparent_1px)]
          [background-size:16px_16px]
        "
      />

      {/* Halftone */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.13]
          [background-image:radial-gradient(rgba(244,241,234,0.55)_0.7px,transparent_0.7px)]
          [background-size:6px_6px]
          [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]
        "
      />

      {/* Horizontal scanlines */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.045]
          [background-image:repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(255,255,255,0.35)_4px)]
        "
      />

      {/* Perspective energy lines */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: `
            translate(
              calc(var(--mouse-x) * -12px),
              calc(var(--mouse-y) * -12px)
            )
          `,
        }}
      >
        <div className="absolute left-[8%] top-[28%] h-px w-[34vw] bg-gradient-to-r from-transparent via-[var(--color-cyan)]/40 to-transparent" />

        <div className="absolute right-[5%] top-[24%] h-px w-[30vw] rotate-[18deg] bg-gradient-to-r from-transparent via-[var(--color-red)]/40 to-transparent" />

        <div className="absolute bottom-[18%] left-[5%] h-px w-[38vw] rotate-[-8deg] bg-gradient-to-r from-transparent via-[var(--color-red)]/25 to-transparent" />

        <div className="absolute bottom-[24%] right-[4%] h-px w-[35vw] rotate-[7deg] bg-gradient-to-r from-transparent via-[var(--color-cyan)]/30 to-transparent" />
      </div>

      {/* Corner technical marks */}
      <div className="absolute left-0 top-[18%] h-24 w-px bg-[var(--color-cyan)]/20" />
      <div className="absolute right-[8%] top-[18%] h-16 w-px bg-[var(--color-red)]/20" />
      <div className="absolute bottom-[12%] left-[18%] h-px w-24 bg-[var(--color-cyan)]/20" />
      <div className="absolute bottom-[16%] right-0 h-px w-32 bg-[var(--color-red)]/20" />

      {/* Floating technical particles */}
      <div className="absolute left-[18%] top-[24%] h-1 w-1 bg-[var(--color-cyan)] shadow-[0_0_12px_var(--color-cyan)]" />
      <div className="absolute left-[43%] top-[18%] h-0.5 w-0.5 bg-[var(--color-white)]/60" />
      <div className="absolute left-[61%] top-[73%] h-1 w-1 bg-[var(--color-red)] shadow-[0_0_12px_var(--color-red)]" />
      <div className="absolute right-[18%] top-[31%] h-0.5 w-0.5 bg-[var(--color-cyan)]" />
      <div className="absolute right-[12%] bottom-[25%] h-1 w-1 bg-[var(--color-cyan)] shadow-[0_0_12px_var(--color-cyan)]" />

      {/* Cinematic vignette */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.72)_100%)]
        "
      />

      {/* Top/bottom cinematic fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/65 to-transparent" />
    </div>
  );
}
