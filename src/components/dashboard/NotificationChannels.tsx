import { motion } from "framer-motion";
import { Bell, MessageSquare, Mail, Volume2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { LucideIcon } from "lucide-react";

const channelConfig: { id: string; label: string; Icon: LucideIcon; isPro: boolean }[] = [
  { id: "whatsapp", label: "WhatsApp", Icon: MessageSquare, isPro: true },
  { id: "browser", label: "Web Push", Icon: Bell, isPro: false },
  { id: "email", label: "Email", Icon: Mail, isPro: false },
  { id: "alarm", label: "In-App Alarm", Icon: Volume2, isPro: false },
];

const NotificationChannels = () => {
  const { profile, updateProfile } = useProfile();
  const channels = (profile?.notification_channels as Record<string, boolean>) || {
    browser: true,
    email: false,
    whatsapp: false,
    alarm: true,
  };
  const isPro = profile?.subscription_status === "pro";

  const toggleChannel = (id: string) => {
    const updated = { ...channels, [id]: !channels[id] };
    updateProfile({ notification_channels: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <Bell className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">Notification Channels</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        How should we reach you?
      </p>
      <div className="space-y-3">
        {channelConfig.map(({ id, label, Icon, isPro: requiresPro }) => (
          <div key={id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{label}</span>
              {requiresPro && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/50 text-primary">
                  PRO
                </Badge>
              )}
            </div>
            <Switch
              checked={channels[id] || false}
              onCheckedChange={() => toggleChannel(id)}
              disabled={requiresPro && !isPro}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationChannels;
