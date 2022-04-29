import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

interface Alarm {
  hour: number;
  minute: number;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}

async function getScheduledAlarm() {
  const [notification] =
    await Notifications.getAllScheduledNotificationsAsync();

  if (notification && notification.trigger.type === "daily") {
    return {
      hour: notification.trigger.hour,
      minute: notification.trigger.minute,
    };
  }

  return undefined;
}

async function scheduleAlarm({
  hour,
  minute,
}: {
  hour: number;
  minute: number;
}) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: { title: "title", body: "body" },
    trigger: { hour, minute, repeats: true },
  });
}

export default function useAlarm() {
  const [ready, setReady] = useState(false);
  const [alarm, setInteralAlarm] = useState<Alarm>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(() => getScheduledAlarm())
      .then((alarm) => {
        setInteralAlarm(alarm);
        setReady(true);
      });
  }, []);

  function setAlarm(alarm: Alarm) {
    setInteralAlarm(alarm);
    scheduleAlarm(alarm);
  }

  return [ready, alarm, setAlarm] as const;
}

export function formatTime({ hour, minute }: Alarm) {
  const _hour = `0${hour}`.slice(-2);
  const _minute = `0${minute}`.slice(-2);
  return `${_hour}:${_minute}`;
}
