import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/useProfile";
import { Badge } from "@/components/ui/badge";

const platforms = [
  { id: "codeforces", label: "Codeforces", initial: "CF", color: "from-blue-500 to-blue-600" },
  { id: "leetcode", label: "LeetCode", initial: "LC", color: "from-amber-500 to-orange-500" },
  { id: "codechef", label: "CodeChef", initial: "CC", color: "from-amber-600 to-yellow-500" },
  { id: "atcoder", label: "AtCoder", initial: "AC", color: "from-gray-600 to-gray-700" },
  { id: "hackerearth", label: "HackerEarth", initial: "HE", color: "from-indigo-500 to-purple-600" },
  { id: "hackerrank", label: "HackerRank", initial: "HR", color: "from-green-500 to-emerald-600" },
  { id: "kaggle", label: "Kaggle", initial: "KG", color: "from-sky-400 to-blue-500" },
];

const PlatformAutoReminders = () => {
  const { profile, updateProfile } = useProfile();
  const autoReminders: string[] = (profile?.auto_reminder_platforms as string[]) || [];

  const togglePlatform = (id: string) => {
    const updated = autoReminders.includes(id)
      ? autoReminders.filter((p) => p !== id)
      : [...autoReminders, id];
    updateProfile({ auto_reminder_platforms: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <Zap className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">Platform Auto Reminders</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Auto-subscribe to all contests from these platforms.
      </p>
      <div className="space-y-3">
        {platforms.map((platform) => {
          const isActive = autoReminders.includes(platform.id);
          return (
            <div
              key={platform.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-md bg-gradient-to-br ${platform.color} flex items-center justify-center text-white text-[9px] font-bold`}
                >
                  {platform.initial}
                </div>
                <span className="text-sm">{platform.label}</span>
                {isActive && (
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
                    🔔 Auto
                  </Badge>
                )}
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={() => togglePlatform(platform.id)}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PlatformAutoReminders;
