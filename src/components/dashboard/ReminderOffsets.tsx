import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const defaultOffsets = [
  { id: "60min", label: "60 minutes before", checked: true },
  { id: "30min", label: "30 minutes before", checked: true },
  { id: "10min", label: "10 minutes before", checked: false },
  { id: "live", label: "When contest goes LIVE", checked: true },
];

const ReminderOffsets = () => {
  const [offsets, setOffsets] = useLocalStorage("algobell-reminder-offsets", defaultOffsets);

  const toggleOffset = (id: string) => {
    setOffsets(
      offsets.map((o) => (o.id === id ? { ...o, checked: !o.checked } : o))
    );
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
        {offsets.map((offset) => (
          <div
            key={offset.id}
            className="flex items-center justify-between"
          >
            <span className="text-sm">{offset.label}</span>
            <Switch
              checked={offset.checked}
              onCheckedChange={() => toggleOffset(offset.id)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReminderOffsets;
