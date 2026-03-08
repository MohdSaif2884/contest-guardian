import { motion } from "framer-motion";
import { Bell, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CircuitBackground = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.12]"
    viewBox="0 0 1280 720"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    {/* Horizontal circuit lines */}
    {[100, 180, 260, 340, 420, 500, 580, 660].map((y, i) => (
      <g key={`h-${i}`}>
        <line x1="0" y1={y} x2="1280" y2={y} stroke="hsl(199 89% 48%)" strokeWidth="0.5" opacity="0.4" />
        {/* Nodes on horizontal lines */}
        {[160, 320, 480, 640, 800, 960, 1120].map((x, j) => (
          <circle key={`hn-${i}-${j}`} cx={x} cy={y} r="2" fill="hsl(199 89% 48%)" opacity={(i + j) % 3 === 0 ? 0.6 : 0.2} />
        ))}
      </g>
    ))}
    {/* Vertical circuit lines */}
    {[160, 320, 480, 640, 800, 960, 1120].map((x, i) => (
      <g key={`v-${i}`}>
        <line x1={x} y1="0" x2={x} y2="720" stroke="hsl(263 70% 58%)" strokeWidth="0.5" opacity="0.3" />
      </g>
    ))}
    {/* Diagonal accents */}
    <path d="M800 0 L1280 400" stroke="hsl(199 89% 48%)" strokeWidth="0.8" opacity="0.15" />
    <path d="M900 0 L1280 300" stroke="hsl(263 70% 58%)" strokeWidth="0.8" opacity="0.1" />
    <path d="M700 720 L1280 200" stroke="hsl(199 89% 48%)" strokeWidth="0.8" opacity="0.1" />
  </svg>
);

const CircuitBellGraphic = () => {
  const lines = [
    { path: "M180 80 L180 0", dur: "2.5s" },
    { path: "M180 80 L250 10", dur: "3s" },
    { path: "M250 130 L340 50", dur: "2.8s" },
    { path: "M260 160 L360 120", dur: "3.2s" },
    { path: "M260 180 L360 180", dur: "2.6s" },
    { path: "M260 200 L360 240", dur: "3.4s" },
    { path: "M250 230 L340 310", dur: "3s" },
    { path: "M230 260 L280 360", dur: "2.9s" },
    { path: "M180 280 L180 360", dur: "2.7s" },
    { path: "M130 260 L80 360", dur: "3.1s" },
    { path: "M110 230 L20 310", dur: "2.8s" },
    { path: "M100 200 L0 240", dur: "3.3s" },
    { path: "M100 180 L0 180", dur: "2.5s" },
    { path: "M100 160 L0 120", dur: "3s" },
    { path: "M110 130 L20 50", dur: "2.9s" },
    { path: "M130 100 L60 10", dur: "3.2s" },
  ];

  const colors = ["hsl(199 89% 48%)", "hsl(263 70% 58%)"];

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 360 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main circuit lines */}
        {lines.map((line, i) => (
          <g key={i}>
            <path
              d={line.path}
              stroke="url(#circuit-grad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.35"
            />
            {/* Secondary parallel line for thickness feel */}
            <path
              d={line.path}
              stroke={colors[i % 2]}
              strokeWidth="0.5"
              strokeLinecap="round"
              opacity="0.15"
              strokeDasharray="4 8"
            />
            {/* Animated pulse dot */}
            <circle r="3.5" fill={colors[i % 2]} opacity="0">
              <animateMotion dur={line.dur} repeatCount="indefinite" path={line.path} />
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0"
                dur={line.dur}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="2;3.5;2"
                dur={line.dur}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* Endpoint glow nodes */}
        {[
          [180, 0], [250, 10], [340, 50], [360, 120], [360, 180], [360, 240],
          [340, 310], [280, 360], [180, 360], [80, 360], [20, 310], [0, 240],
          [0, 180], [0, 120], [20, 50], [60, 10],
        ].map(([cx, cy], i) => (
          <g key={`node-${i}`}>
            <circle cx={cx} cy={cy} r="3" fill={colors[i % 2]} opacity="0.5" />
            <circle cx={cx} cy={cy} r="6" fill={colors[i % 2]} opacity="0.1">
              <animate
                attributeName="opacity"
                values="0.05;0.2;0.05"
                dur={`${2 + (i % 3)}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        <defs>
          <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(263 70% 58%)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Outer pulsing rings */}
      <div className="absolute w-[200px] h-[200px] md:w-[260px] md:h-[260px] rounded-full border border-primary/10 animate-[pulse-ring_4s_ease-in-out_infinite]" />
      <div className="absolute w-[170px] h-[170px] md:w-[220px] md:h-[220px] rounded-full border border-accent/15 animate-[pulse-ring_3s_ease-in-out_infinite_0.5s]" />

      {/* Main bell sphere */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.3 }}
        className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 40% 35%, hsl(222 30% 20%) 0%, hsl(222 47% 6%) 80%)",
          boxShadow:
            "0 0 100px 30px hsl(199 89% 48% / 0.12), 0 0 60px 15px hsl(263 70% 58% / 0.08), inset 0 2px 0 0 hsl(0 0% 100% / 0.08), inset 0 -2px 4px 0 hsl(0 0% 0% / 0.3)",
        }}
      >
        {/* Inner subtle ring */}
        <div
          className="absolute inset-3 rounded-full border border-white/5"
          style={{
            boxShadow: "inset 0 0 30px 5px hsl(199 89% 48% / 0.05)",
          }}
        />
        <Bell
          className="h-16 w-16 md:h-20 md:w-20 relative z-10"
          strokeWidth={1.2}
          style={{
            color: "hsl(199 89% 60%)",
            filter:
              "drop-shadow(0 0 25px hsl(199 89% 48% / 0.7)) drop-shadow(0 0 50px hsl(263 70% 58% / 0.3))",
          }}
        />
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient pt-16">
      {/* Circuit board background pattern */}
      <CircuitBackground />

      {/* Ambient glow orbs */}
      <div className="gradient-orb w-[600px] h-[600px] bg-primary/15 -top-40 -left-40" />
      <div className="gradient-orb w-[500px] h-[500px] bg-accent/15 top-1/4 right-0" style={{ animationDelay: "2s" }} />
      <div className="gradient-orb w-[300px] h-[300px] bg-primary/10 bottom-0 left-1/3" style={{ animationDelay: "4s" }} />

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
            >
              <span className="gradient-text text-glow">Coding Contest</span>{" "}
              <span className="text-foreground">Again</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              The smart reminder service for your latest online coding contest.
              Never miss another round — AlgoBell keeps you on track across all platforms.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10"
            >
              {[
                { icon: Clock, text: "30 min before" },
                { icon: Bell, text: "WhatsApp & Email" },
                { icon: CheckCircle2, text: "5 Platforms" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm backdrop-blur-md"
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/dashboard">
                <Button variant="hero" size="xl" className="group">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="hero-outline" size="xl">
                  See How It Works
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Right: Circuit Bell */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.2 }}
            className="flex-shrink-0 lg:mr-8"
          >
            <CircuitBellGraphic />
          </motion.div>
        </div>

        {/* Sparkle decoration bottom-right */}
        <motion.div
          initial={{ opacity: 0, rotate: -30 }}
          animate={{ opacity: 0.6, rotate: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 right-10 hidden lg:block"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 0 L18 13 L32 16 L18 19 L16 32 L14 19 L0 16 L14 13 Z"
              fill="hsl(210 20% 60%)"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
