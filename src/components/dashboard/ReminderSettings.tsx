import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/useProfile";

const offsetOptions = [
  { minutes: 60, label: "60 minutes before" },
  { minutes: 30, label: "30 minutes before" },
  { minutes: 10, label: "10 minutes before" },
  { minutes: 0, label: "When contest goes LIVE" },
];

const channelConfig = [
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "browser", label: "Web Push", icon: "🔔" },
  { id: "email", label: "Email", icon: "📧" },
  { id: "alarm", label: "In-App Alarm", icon: "⏰" },
];

const ReminderSettings = () => {
  const { profile, updateProfile } = useProfile();
  const activeOffsets: number[] = (profile?.reminder_offsets as number[]) || [30, 60];
  const channels = (profile?.notification_channels as Record<string, boolean>) || {
    browser: true,
    email: false,
    whatsapp: false,
    alarm: false,
  };

  const toggleOffset = (minutes: number) => {
    const newOffsets = activeOffsets.includes(minutes)
      ? activeOffsets.filter(o => o !== minutes)
      : [...activeOffsets, minutes];
    updateProfile({ reminder_offsets: newOffsets });
  };

  const toggleChannel = (id: string) => {
    const updated = { ...channels, [id]: !channels[id] };
    updateProfile({ notification_channels: updated });
  };

  return (
    <div className="space-y-8">
      {/* Reminder Offsets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Reminder Timing</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose when you want to be reminded before a contest starts.
        </p>
        <div className="space-y-3">
          {offsetOptions.map((offset) => (
            <label
              key={offset.minutes}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 cursor-pointer transition-colors"
            >
              <div
                onClick={() => toggleOffset(offset.minutes)}
                className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer ${
                  activeOffsets.includes(offset.minutes)
                    ? "bg-primary text-white"
                    : "border border-white/20 bg-white/5"
                }`}
              >
                {activeOffsets.includes(offset.minutes) && <Check className="h-3 w-3" />}
              </div>
              <span className="text-sm">{offset.label}</span>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Notification Channels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose how you want to receive your contest reminders.
        </p>
        <div className="space-y-4">
          {channelConfig.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{channel.icon}</span>
                <span className="text-sm font-medium">{channel.label}</span>
              </div>
              <Switch
                checked={channels[channel.id] || false}
                onCheckedChange={() => toggleChannel(channel.id)}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReminderSettings;
