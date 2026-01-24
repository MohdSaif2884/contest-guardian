import { motion } from "framer-motion";
import { Bell, MessageSquare, Mail, Volume2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const channelsData = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare, enabled: false, isPro: true },
  { id: "webpush", label: "Web Push", icon: Bell, enabled: true, isPro: false },
  { id: "email", label: "Email", icon: Mail, enabled: false, isPro: false },
  { id: "alarm", label: "In-App Alarm", icon: Volume2, enabled: true, isPro: false },
];

const NotificationChannels = () => {
  const [channels, setChannels] = useState(channelsData);

  const toggleChannel = (id: string) => {
    setChannels(
      channels.map((c) =>
        c.id === id ? { ...c, enabled: !c.enabled } : c
      )
    );
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
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <channel.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{channel.label}</span>
              {channel.isPro && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/50 text-primary">
                  PRO
                </Badge>
              )}
            </div>
            <Switch
              checked={channel.enabled}
              onCheckedChange={() => toggleChannel(channel.id)}
              disabled={channel.isPro}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationChannels;
