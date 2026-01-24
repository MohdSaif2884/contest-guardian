import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  isNative, 
  scheduleContestNotification, 
  cancelContestNotification 
} from "@/lib/capacitor";

interface ScheduledAlarm {
  id: string;
  contestId: string;
  contestName: string;
  platform: string;
  triggerTime: Date;
  offsetMinutes: number;
  nativeNotificationId?: number;
}

interface AlarmState {
  isRinging: boolean;
  currentAlarm: ScheduledAlarm | null;
}

export const useAlarm = () => {
  const [alarms, setAlarms] = useState<ScheduledAlarm[]>([]);
  const [alarmState, setAlarmState] = useState<AlarmState>({
    isRinging: false,
    currentAlarm: null,
  });

  // Schedule an alarm for a contest
  const scheduleAlarm = useCallback(
    async (
      contestId: string,
      contestName: string,
      platform: string,
      contestStartTime: Date,
      offsetMinutes: number
    ) => {
      const triggerTime = new Date(
        contestStartTime.getTime() - offsetMinutes * 60 * 1000
      );

      // Don't schedule if trigger time is in the past
      if (triggerTime.getTime() <= Date.now()) {
        return null;
      }

      const alarmId = `${contestId}-${offsetMinutes}`;
      
      // Schedule native notification if on mobile
      let nativeNotificationId: number | undefined;
      if (isNative()) {
        const notifId = await scheduleContestNotification(
          contestId,
          contestName,
          platform,
          triggerTime,
          offsetMinutes
        );
        nativeNotificationId = notifId ?? undefined;
      }

      const alarm: ScheduledAlarm = {
        id: alarmId,
        contestId,
        contestName,
        platform,
        triggerTime,
        offsetMinutes,
        nativeNotificationId,
      };

      setAlarms((prev) => {
        // Remove existing alarm with same id
        const filtered = prev.filter((a) => a.id !== alarm.id);
        return [...filtered, alarm];
      });

      toast.success(`Alarm set for ${offsetMinutes} min before ${contestName}`);
      return alarm.id;
    },
    []
  );

  // Cancel an alarm
  const cancelAlarm = useCallback(async (alarmId: string) => {
    const alarmToCancel = alarms.find((a) => a.id === alarmId);
    if (alarmToCancel?.nativeNotificationId && isNative()) {
      await cancelContestNotification(alarmToCancel.nativeNotificationId);
    }
    setAlarms((prev) => prev.filter((a) => a.id !== alarmId));
  }, [alarms]);

  // Dismiss current ringing alarm
  const dismissAlarm = useCallback(() => {
    setAlarmState({ isRinging: false, currentAlarm: null });
  }, []);

  // Snooze current alarm
  const snoozeAlarm = useCallback((minutes: number = 5) => {
    const current = alarmState.currentAlarm;
    if (current) {
      const newTriggerTime = new Date(Date.now() + minutes * 60 * 1000);
      const snoozedAlarm: ScheduledAlarm = {
        ...current,
        id: `${current.id}-snoozed`,
        triggerTime: newTriggerTime,
      };

      setAlarms((prev) => [...prev, snoozedAlarm]);
      toast.info(`Alarm snoozed for ${minutes} minutes`);
    }
    setAlarmState({ isRinging: false, currentAlarm: null });
  }, [alarmState.currentAlarm]);

  // Trigger alarm manually (for testing)
  const triggerAlarm = useCallback(
    (contestName: string, platform: string, timeUntil: string) => {
      const testAlarm: ScheduledAlarm = {
        id: "test-alarm",
        contestId: "test",
        contestName,
        platform,
        triggerTime: new Date(),
        offsetMinutes: 0,
      };
      setAlarmState({ isRinging: true, currentAlarm: testAlarm });
    },
    []
  );

  // Check alarms every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setAlarms((currentAlarms) => {
        const triggered = currentAlarms.find(
          (alarm) => alarm.triggerTime.getTime() <= now
        );

        if (triggered) {
          // Trigger the alarm
          setAlarmState({ isRinging: true, currentAlarm: triggered });

          // Remove triggered alarm
          return currentAlarms.filter((a) => a.id !== triggered.id);
        }

        return currentAlarms;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    alarms,
    alarmState,
    scheduleAlarm,
    cancelAlarm,
    dismissAlarm,
    snoozeAlarm,
    triggerAlarm,
  };
};
