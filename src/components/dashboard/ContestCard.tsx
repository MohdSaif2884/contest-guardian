import { motion } from "framer-motion";
import { Clock, ExternalLink, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ContestCardProps {
  id: string;
  name: string;
  platform: string;
  platformColor: string;
  platformInitial: string;
  startTime: Date;
  duration: string;
  link: string;
  isSubscribed?: boolean;
  isAutoEnabled?: boolean;
  onToggleSubscription?: (id: string) => void;
}

const ContestCard = ({
  id,
  name,
  platform,
  platformColor,
  platformInitial,
  startTime,
  duration,
  link,
  isSubscribed = false,
  isAutoEnabled = false,
  onToggleSubscription,
}: ContestCardProps) => {
  const handleToggle = () => {
    if (onToggleSubscription) {
      onToggleSubscription(id);
    }
  };

  const getTimeUntilStart = () => {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();
    
    if (diff < 0) return "Live Now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const timeUntil = getTimeUntilStart();
  const isLive = timeUntil === "Live Now";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="contest-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platformColor} flex items-center justify-center text-white text-sm font-bold shadow-lg`}
          >
            {platformInitial}
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {platform}
            </span>
            <h3 className="font-semibold line-clamp-1">{name}</h3>
          </div>
        </div>
        <Button
          variant={isSubscribed ? "success" : "glass"}
          size="icon"
          onClick={handleToggle}
          className="shrink-0"
        >
          {isSubscribed ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {isLive ? (
              <span className="text-success font-medium">Live Now</span>
            ) : (
              `Starts in ${timeUntil}`
            )}
          </span>
          <span className="text-xs">{duration}</span>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {(isSubscribed || isAutoEnabled) && (
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-success">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            {isAutoEnabled ? "🔔 Auto-enabled" : "Reminders set"}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ContestCard;
