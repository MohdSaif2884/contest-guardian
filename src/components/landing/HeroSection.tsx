import { motion } from "framer-motion";
import { Bell, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CircuitBellGraphic = () => {
  return (
    <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px] flex items-center justify-center">
      {/* SVG Circuit Lines with animated pulses */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 360 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circuit line paths radiating from center */}
        {/* Top */}
        <path d="M180 80 L180 20 L240 20" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M180 80 L180 40 L120 40 L120 10" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        {/* Top-right */}
        <path d="M230 110 L290 50 L340 50" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M240 130 L310 80 L340 80" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        {/* Right */}
        <path d="M260 180 L320 180 L340 160" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M260 200 L310 200 L340 230" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        {/* Bottom-right */}
        <path d="M230 250 L290 310 L340 310" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M220 260 L260 320 L300 340" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        {/* Bottom */}
        <path d="M180 280 L180 330 L220 350" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M160 270 L140 330 L100 350" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        {/* Bottom-left */}
        <path d="M130 250 L70 310 L20 310" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M120 240 L60 280 L20 280" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        {/* Left */}
        <path d="M100 180 L40 180 L20 160" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M100 200 L50 200 L20 230" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        {/* Top-left */}
        <path d="M130 110 L70 50 L20 50" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M120 120 L60 80 L20 80" stroke="url(#line-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

        {/* Animated pulse dots traveling along lines */}
        <circle r="3" fill="hsl(199 89% 48%)" opacity="0.9">
          <animateMotion dur="3s" repeatCount="indefinite" path="M180 80 L180 20 L240 20" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="hsl(263 70% 58%)" opacity="0.9">
          <animateMotion dur="3.5s" repeatCount="indefinite" path="M230 110 L290 50 L340 50" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle r="2.5" fill="hsl(199 89% 48%)" opacity="0.9">
          <animateMotion dur="4s" repeatCount="indefinite" path="M260 180 L320 180 L340 160" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="hsl(263 70% 58%)" opacity="0.9">
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M230 250 L290 310 L340 310" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle r="2.5" fill="hsl(199 89% 48%)" opacity="0.9">
          <animateMotion dur="3.8s" repeatCount="indefinite" path="M180 280 L180 330 L220 350" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3.8s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="hsl(263 70% 58%)" opacity="0.9">
          <animateMotion dur="4.2s" repeatCount="indefinite" path="M130 250 L70 310 L20 310" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4.2s" repeatCount="indefinite" />
        </circle>
        <circle r="2.5" fill="hsl(199 89% 48%)" opacity="0.9">
          <animateMotion dur="3.6s" repeatCount="indefinite" path="M100 180 L40 180 L20 160" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3.6s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="hsl(263 70% 58%)" opacity="0.9">
          <animateMotion dur="3.4s" repeatCount="indefinite" path="M130 110 L70 50 L20 50" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3.4s" repeatCount="indefinite" />
        </circle>

        {/* Node dots at line endpoints */}
        <circle cx="240" cy="20" r="3" fill="hsl(199 89% 48%)" opacity="0.5" />
        <circle cx="120" cy="10" r="3" fill="hsl(263 70% 58%)" opacity="0.4" />
        <circle cx="340" cy="50" r="3" fill="hsl(199 89% 48%)" opacity="0.5" />
        <circle cx="340" cy="80" r="3" fill="hsl(263 70% 58%)" opacity="0.4" />
        <circle cx="340" cy="160" r="3" fill="hsl(199 89% 48%)" opacity="0.5" />
        <circle cx="340" cy="230" r="3" fill="hsl(263 70% 58%)" opacity="0.4" />
        <circle cx="340" cy="310" r="3" fill="hsl(199 89% 48%)" opacity="0.5" />
        <circle cx="300" cy="340" r="3" fill="hsl(263 70% 58%)" opacity="0.4" />
        <circle cx="220" cy="350" r="3" fill="hsl(199 89% 48%)" opacity="0.5" />
        <circle cx="100" cy="350" r="3" fill="hsl(263 70% 58%)" opacity="0.4" />
        <circle cx="20" cy="310" r="3" fill="hsl(199 89% 48%)" opacity="0.5" />
        <circle cx="20" cy="280" r="3" fill="hsl(263 70% 58%)" opacity="0.4" />
        <circle cx="20" cy="160" r="3" fill="hsl(199 89% 48%)" opacity="0.5" />
        <circle cx="20" cy="230" r="3" fill="hsl(263 70% 58%)" opacity="0.4" />
        <circle cx="20" cy="50" r="3" fill="hsl(199 89% 48%)" opacity="0.5" />
        <circle cx="20" cy="80" r="3" fill="hsl(263 70% 58%)" opacity="0.4" />

        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(263 70% 58%)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Outer glow ring */}
      <div className="absolute w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full border border-primary/20 animate-[pulse-ring_3s_ease-in-out_infinite]" />

      {/* Main bell circle */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
        className="relative w-[140px] h-[140px] md:w-[170px] md:h-[170px] rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 40% 35%, hsl(222 30% 18%) 0%, hsl(222 47% 8%) 70%)",
          boxShadow: "0 0 80px 20px hsl(199 89% 48% / 0.15), 0 0 40px 10px hsl(263 70% 58% / 0.1), inset 0 1px 0 0 hsl(0 0% 100% / 0.1)",
        }}
      >
        <Bell
          className="h-16 w-16 md:h-20 md:w-20"
          strokeWidth={1.2}
          style={{
            color: "hsl(199 89% 60%)",
            filter: "drop-shadow(0 0 20px hsl(199 89% 48% / 0.6)) drop-shadow(0 0 40px hsl(263 70% 58% / 0.3))",
          }}
        />
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient pt-16">
      {/* Subtle background orbs */}
      <div className="gradient-orb w-[500px] h-[500px] bg-primary/20 -top-20 -left-20" />
      <div className="gradient-orb w-[400px] h-[400px] bg-accent/20 top-1/3 -right-20" style={{ animationDelay: "2s" }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="gradient-text text-glow">Coding Contest</span>{" "}
              Again
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8"
            >
              The smart reminder service for your latest online coding contest
              moods can keep your platforms how the dreams contest again or by AlgoBell.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10"
            >
              {[
                { icon: Clock, text: "30 min before" },
                { icon: Bell, text: "WhatsApp & Email" },
                { icon: CheckCircle2, text: "5 Platforms" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm backdrop-blur-sm"
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
              transition={{ duration: 0.5, delay: 0.4 }}
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

          {/* Right: Circuit Bell Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-shrink-0"
          >
            <CircuitBellGraphic />
          </motion.div>
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 flex flex-col items-center lg:items-start"
        >
          <div className="flex -space-x-3 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-xs font-bold"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Trusted by <span className="text-foreground font-semibold">2,500+</span> competitive programmers
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
