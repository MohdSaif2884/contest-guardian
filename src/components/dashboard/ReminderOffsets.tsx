import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/useProfile";

const offsetOptions = [
  { minutes: 60, label: "60 minutes before" },
  { minutes: 30, label: "30 minutes before" },
  { minutes: 10, label: "10 minutes before" },
  { minutes: 0, label: "When contest goes LIVE" },
];

const ReminderOffsets = () => {
  const { profile, updateProfile } = useProfile();
  const activeOffsets: number[] = (profile?.reminder_offsets as number[]) || [30, 60];

  const toggleOffset = (minutes: number) => {
    const newOffsets = activeOffsets.includes(minutes)
      ? activeOffsets.filter(o => o !== minutes)
      : [...activeOffsets, minutes];
    updateProfile({ reminder_offsets: newOffsets });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <Clock className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">Reminder Offsets</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        When should we remind you?
      </p>
      <div className="space-y-3">
        {offsetOptions.map((offset) => (
          <div
            key={offset.minutes}
            className="flex items-center justify-between"
          >
            <span className="text-sm">{offset.label}</span>
            <Switch
              checked={activeOffsets.includes(offset.minutes)}
              onCheckedChange={() => toggleOffset(offset.minutes)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReminderOffsets;
