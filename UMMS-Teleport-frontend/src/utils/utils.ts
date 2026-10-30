import { Capacitor } from "@capacitor/core";

export const languages = [
  { name: "Spanish (Preferred)", value: "spanish_preferred" },
  { name: "German", value: "german" },
  { name: "Polish", value: "polish" },
  { name: "Portugal", value: "portugal" },
  { name: "Russian", value: "russian" },
  { name: "Japanese", value: "japanese" },
  { name: "Kyrgyz", value: "kyrgyz" },
  { name: "Latin", value: "latin" },
  { name: "Cantonese", value: "cantonese" },
  { name: "Thai", value: "thai" },
  { name: "Swedish", value: "swedish" },
  { name: "Danish", value: "danish" },
  { name: "Luo", value: "luo" },
];
export const formatDOB = (date: string | number | Date | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatUsername(username: string) {
  if (username.length > 12) {
    return username.slice(0, 12) + "...";
  } else {
    return username;
  }
}

export const getAvatarSize = (count: number) => {
  if (count === 1) return "400px";
  if (count === 2) return "300px";
  if (count > 2) return "200px";
  return "120px";
};

// export function getDeviceType(): 'mobile' | 'ipad' | 'laptop' {
//   const ua = navigator.userAgent || '';

//   // Check for iPad (including iOS 13+ iPad Safari which reports as Macintosh)
//   const isIPad =
//     /iPad|PlayBook/i.test(ua) ||
//     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

//   if (isIPad) {
//     return 'ipad';
//   }

//   // Check for other mobiles
//   const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua);

//   if (isMobile) {
//     return 'mobile';
//   }

//   // Default is laptop/desktop
//   return 'laptop';
// }

export type DeviceType = "ipad-app" | "ipad-browser" | "mobile" | "laptop";

export function getDeviceType(): DeviceType {
  if (typeof window !== "undefined" && window.innerWidth > 1024) {
    return "laptop";
  }

  const isNative = Capacitor.isNativePlatform();
  const ua = navigator.userAgent || "";
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Check for iPad (including iOS 13+ iPad Safari which reports as Macintosh)
  const isIPad =
    /iPad/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIPad) {
    return isNative ? "ipad-app" : "ipad-browser";
  }

  const isMobileUA =
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua,
    );

  if (typeof window !== "undefined" && window.innerWidth <= 768) {
    return "mobile";
  }

  if (typeof window !== "undefined" && window.innerWidth <= 1024 && (hasTouch || isMobileUA)) {
    return isNative ? "ipad-app" : "ipad-browser";
  }

  return "laptop";
}

declare global {
  interface Window {
    deviceType?: DeviceType;
  }
}

// Assign to global window object
window.deviceType = getDeviceType();
