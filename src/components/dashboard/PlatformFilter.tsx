import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  name: string;
  initial: string;
  color: string;
}

const platforms: Platform[] = [
  { id: "all", name: "All", initial: "ALL", color: "from-primary to-accent" },
  { id: "Codeforces", name: "Codeforces", initial: "CF", color: "from-blue-500 to-blue-600" },
  { id: "LeetCode", name: "LeetCode", initial: "LC", color: "from-amber-500 to-orange-500" },
  { id: "CodeChef", name: "CodeChef", initial: "CC", color: "from-amber-600 to-yellow-500" },
  { id: "AtCoder", name: "AtCoder", initial: "AC", color: "from-gray-600 to-gray-700" },
];

interface PlatformFilterProps {
  selected: string;
  onSelect: (platform: string) => void;
  contestCounts?: Record<string, number>;
}

const PlatformFilter = ({ selected, onSelect, contestCounts = {} }: PlatformFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {platforms.map((platform) => {
        const isSelected = selected === platform.id;
        const count = platform.id === "all" 
          ? Object.values(contestCounts).reduce((a, b) => a + b, 0)
          : contestCounts[platform.id] || 0;
        
        return (
          <motion.button
            key={platform.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(platform.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              isSelected
                ? "bg-gradient-to-r text-white shadow-lg"
                : "glass-card hover:bg-secondary/50"
            )}
            style={isSelected ? { backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` } : {}}
          >
            {isSelected && (
              <motion.div
                layoutId="platformFilter"
                className={cn("absolute inset-0 rounded-xl bg-gradient-to-r", platform.color)}
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span
                className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold",
                  isSelected 
                    ? "bg-white/20" 
                    : `bg-gradient-to-br ${platform.color} text-white`
                )}
              >
                {platform.initial}
              </span>
              <span className={isSelected ? "" : "text-foreground"}>
                {platform.name}
              </span>
              {count > 0 && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-xs",
                    isSelected ? "bg-white/20" : "bg-muted"
                  )}
                >
                  {count}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default PlatformFilter;
