export const GlowBackground = () => {
  return (
    <div className="fixed top-0 right-0 w-full h-screen -z-[30] overflow-hidden pointer-events-none">

      {/* Top blur vignette — dark mode */}
      <div
        className="absolute top-0 left-0 w-full hidden dark:block"
        style={{
          height: "35%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
        }}
      />

      {/* Top blur vignette — light mode */}
      <div
        className="absolute top-0 left-0 w-full block dark:hidden"
        style={{
          height: "35%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.5) 60%, transparent 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
        }}
      />

      {/* Primary glow — bottom center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: "80vw", height: "55vh" }}
      >
        {/* dark */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--color-primary) 55%, transparent) 0%, color-mix(in srgb, var(--color-primary) 30%, transparent) 40%, transparent 70%)",
            filter: "blur(48px)",
          }}
        />
        {/* light */}
        <div
          className="absolute inset-0 block dark:hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--color-primary) 20%, transparent) 0%, color-mix(in srgb, var(--color-primary) 10%, transparent) 40%, transparent 70%)",
            filter: "blur(48px)",
          }}
        />
      </div>

      {/* Secondary glow — warm accent, bottom-left */}
      <div
        className="absolute bottom-0 left-0"
        style={{ width: "50vw", height: "40vh" }}
      >
        {/* dark */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              "radial-gradient(ellipse at 20% 100%, color-mix(in srgb, var(--color-primary) 30%, transparent) 0%, transparent 65%)",
            filter: "blur(56px)",
          }}
        />
        {/* light */}
        <div
          className="absolute inset-0 block dark:hidden"
          style={{
            background:
              "radial-gradient(ellipse at 20% 100%, color-mix(in srgb, var(--color-primary) 12%, transparent) 0%, transparent 65%)",
            filter: "blur(56px)",
          }}
        />
      </div>

      {/* Tertiary glow — cool accent, bottom-right */}
      <div
        className="absolute bottom-0 right-0"
        style={{ width: "50vw", height: "40vh" }}
      >
        {/* dark */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              "radial-gradient(ellipse at 80% 100%, color-mix(in srgb, var(--color-primary) 22%, transparent) 0%, transparent 65%)",
            filter: "blur(64px)",
          }}
        />
        {/* light */}
        <div
          className="absolute inset-0 block dark:hidden"
          style={{
            background:
              "radial-gradient(ellipse at 80% 100%, color-mix(in srgb, var(--color-primary) 10%, transparent) 0%, transparent 65%)",
            filter: "blur(64px)",
          }}
        />
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 dark:opacity-[0.035] opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
};