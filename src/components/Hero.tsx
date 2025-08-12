import React from "react";
import hero from "@/assets/hero-tic-nnewi.jpg";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState({ x: 50, y: 50 });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPos({ x, y });
    };
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      <img
        src={hero}
        alt="Hero background with abstract technology gradient for TIC Nnewi Market"
        className="h-[38vh] w-full object-cover sm:h-[48vh] md:h-[60vh]"
        loading="eager"
        fetchPriority="high"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, hsl(0 0% 100% / 0.12), transparent 40%)`,
        }}
      />
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            TIC Products Market
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Discover featured products from our incubatees: electronics, spare parts, and gadgets.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="#featured">
              <Button variant="hero">Shop Featured</Button>
            </a>
            <a href="/incubatees">
              <Button variant="outline">Browse Incubatees</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
