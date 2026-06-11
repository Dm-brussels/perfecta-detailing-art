"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Hero background: poster image shown instantly (LCP),
 * compressed video fades in once it can play.
 * Falls back to the still image when the user prefers reduced motion.
 */
export function HeroBackground({ alt }: { alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [allowVideo, setAllowVideo] = useState(false);

  useEffect(() => {
    // Respect reduced-motion + skip heavy video on very small / save-data contexts
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // @ts-expect-error - non-standard but widely supported
    const saveData = navigator.connection?.saveData === true;
    if (!reduce && !saveData) setAllowVideo(true);
  }, []);

  useEffect(() => {
    if (!allowVideo) return;
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => {
      setReady(true);
      v.play().catch(() => {
        /* autoplay blocked — poster stays, no harm */
      });
    };
    if (v.readyState >= 3) onReady();
    else v.addEventListener("canplay", onReady, { once: true });
    return () => v.removeEventListener("canplay", onReady);
  }, [allowVideo]);

  return (
    <div className="absolute inset-0 -z-10">
      {/* Poster / fallback still */}
      <Image
        src="/photos/hero/main.jpg"
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Video layer */}
      {allowVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1200ms] ease-out ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/photos/hero/main.jpg"
          aria-hidden
          tabIndex={-1}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-noir/80 via-noir/55 to-noir/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-noir/70 via-transparent to-transparent" />
    </div>
  );
}
