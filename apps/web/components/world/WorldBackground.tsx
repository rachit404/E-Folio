"use client";

import { useEffect, useRef, useState } from "react";

interface WorldBackgroundProps {
  src: string;
  opacity?: number;
}

interface BackgroundLayer {
  src: string;
}

export default function WorldBackground({
  src,
  opacity = 0.9,
}: WorldBackgroundProps) {
  const [layers, setLayers] = useState<[BackgroundLayer, BackgroundLayer]>(
    () => [
      {
        src,
      },
      {
        src,
      },
    ],
  );

  const [activeLayer, setActiveLayer] = useState(0);

  const activeLayerRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const currentLayer = activeLayerRef.current;
    const nextLayer = currentLayer === 0 ? 1 : 0;

    setLayers((current) => {
      const next = [...current] as [BackgroundLayer, BackgroundLayer];

      next[nextLayer] = {
        src,
      };

      return next;
    });

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = window.requestAnimationFrame(() => {
      activeLayerRef.current = nextLayer;
      setActiveLayer(nextLayer);
    });

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [src]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[var(--color-void)]"
    >
      {layers.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            backgroundImage: `url("${layer.src}")`,
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            opacity: index === activeLayer ? opacity : 0,
            transform: "scale(1.025)",
            willChange: "opacity",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[var(--color-void)]/10" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_32%,var(--color-void)/75%_100%)]" />

      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-void)]/20 via-transparent to-[var(--color-void)]/30" />
    </div>
  );
}
