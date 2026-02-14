import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  name: string;
  initial: string;
  color: string;
}

const majorPlatforms: Platform[] = [
  { id: "all", name: "All", initial: "ALL", color: "from-primary to-accent" },
  { id: "CodeChef", name: "CodeChef", initial: "CC", color: "from-amber-600 to-yellow-500" },
  { id: "Codeforces", name: "Codeforces", initial: "CF", color: "from-blue-500 to-blue-600" },
  { id: "LeetCode", name: "LeetCode", initial: "LC", color: "from-amber-500 to-orange-500" },
  { id: "AtCoder", name: "AtCoder", initial: "AC", color: "from-gray-600 to-gray-700" },
  { id: "HackerEarth", name: "HackerEarth", initial: "HE", color: "from-indigo-500 to-purple-600" },
  { id: "HackerRank", name: "HackerRank", initial: "HR", color: "from-green-500 to-emerald-600" },
  { id: "Kaggle", name: "Kaggle", initial: "KG", color: "from-sky-400 to-blue-500" },
];

const otherPlatforms: Platform[] = [
  { id: "TopCoder", name: "TopCoder", initial: "TC", color: "from-cyan-500 to-blue-600" },
  { id: "CodeSignal", name: "CodeSignal", initial: "CS", color: "from-violet-500 to-purple-600" },
  { id: "CodeStudio", name: "CodeStudio", initial: "CN", color: "from-orange-500 to-red-500" },
  { id: "GeeksforGeeks", name: "GfG", initial: "GF", color: "from-green-600 to-green-700" },
  { id: "InterviewBit", name: "IB", initial: "IB", color: "from-teal-500 to-cyan-600" },
];

interface PlatformFilterProps {
  selected: string;
  onSelect: (platform: string) => void;
  contestCounts?: Record<string, number>;
}

const PlatformButton = ({
  platform,
  isSelected,
  count,
  onClick,
}: {
  platform: Platform;
  isSelected: boolean;
  count: number;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
      isSelected
        ? "bg-gradient-to-r text-white shadow-lg"
        : "glass-card hover:bg-secondary/50"
    )}
  >
    {isSelected && (
      <motion.div
        layoutId="platformFilter"
        className={cn("absolute inset-0 rounded-xl bg-gradient-to-r", platform.color)}
        initial={false}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-1.5">
      <span
        className={cn(
          "w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold",
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

const PlatformFilter = ({ selected, onSelect, contestCounts = {} }: PlatformFilterProps) => {
  const getCount = (id: string) =>
    id === "all"
      ? Object.values(contestCounts).reduce((a, b) => a + b, 0)
      : contestCounts[id] || 0;

  const hasOtherContests = otherPlatforms.some((p) => (contestCounts[p.id] || 0) > 0);

  return (
    <div className="space-y-3 mb-6">
      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
          Major Platforms
        </span>
        <div className="flex flex-wrap gap-2">
          {majorPlatforms.map((platform) => (
            <PlatformButton
              key={platform.id}
              platform={platform}
              isSelected={selected === platform.id}
              count={getCount(platform.id)}
              onClick={() => onSelect(platform.id)}
            />
          ))}
        </div>
      </div>

      {(hasOtherContests || otherPlatforms.some((p) => selected === p.id)) && (
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Others
          </span>
          <div className="flex flex-wrap gap-2">
            {otherPlatforms.map((platform) => (
              <PlatformButton
                key={platform.id}
                platform={platform}
                isSelected={selected === platform.id}
                count={getCount(platform.id)}
                onClick={() => onSelect(platform.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformFilter;
