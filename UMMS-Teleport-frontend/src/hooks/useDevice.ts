import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";

export type DeviceType = "ipad-app" | "ipad-browser" | "mobile" | "laptop";

export function useDevice() {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    // Initial determination
    return getDeviceTypeFallback();
  });

  useEffect(() => {
    // Media queries for reactive detection
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1024px)");

    const handleDeviceChange = () => {
      const platform = Capacitor.getPlatform();
      const isNative = Capacitor.isNativePlatform();
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // 1. Screens wider than 1024px are desktop/laptop regardless of touchscreen
      if (window.innerWidth > 1024) {
        return setDeviceType("laptop");
      }

      // 2. Native iOS / Android Capacitor App
      if (isNative) {
        if (platform === "ios" || platform === "android") {
          const isTabletDevice = tabletQuery.matches || (hasTouch && window.innerWidth <= 1024);
          return setDeviceType(isTabletDevice ? "ipad-app" : "mobile");
        }
      }

      // 3. Web browser flows
      const ua = navigator.userAgent || "";
      const isIPadUA =
        /iPad/i.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

      if (isIPadUA) {
        return setDeviceType("ipad-browser");
      }

      const isMobileUA = /Mobile|Android|iP(hone|od)/i.test(ua);
      if (window.innerWidth <= 768 || (isMobileUA && window.innerWidth <= 768)) {
        return setDeviceType("mobile");
      }

      // 4. Tablet screens (769px - 1024px)
      if (window.innerWidth <= 1024 && (hasTouch || isMobileUA)) {
        return setDeviceType("ipad-browser");
      }

      setDeviceType("laptop");
    };

    // Attach listeners
    mobileQuery.addEventListener("change", handleDeviceChange);
    tabletQuery.addEventListener("change", handleDeviceChange);

    // Call once to ensure state matches current screen layout
    handleDeviceChange();

    return () => {
      mobileQuery.removeEventListener("change", handleDeviceChange);
      tabletQuery.removeEventListener("change", handleDeviceChange);
    };
  }, []);

  return {
    deviceType,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "ipad-app" || deviceType === "ipad-browser",
    isLaptop: deviceType === "laptop",
    isNativeApp: Capacitor.isNativePlatform(),
  };
}

// Fallback helper for initial hook state setup (synchronous)
function getDeviceTypeFallback(): DeviceType {
  if (typeof window !== "undefined" && window.innerWidth > 1024) {
    return "laptop";
  }

  const isNative = Capacitor.isNativePlatform();
  const ua = navigator.userAgent || "";
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const isIPad =
    /iPad/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIPad) {
    return isNative ? "ipad-app" : "ipad-browser";
  }

  const isMobileUA = /Mobile|Android|iP(hone|od)/i.test(ua);
  if (typeof window !== "undefined" && window.innerWidth <= 768) {
    return "mobile";
  }

  if (typeof window !== "undefined" && window.innerWidth <= 1024 && (hasTouch || isMobileUA)) {
    return isNative ? "ipad-app" : "ipad-browser";
  }

  return "laptop";
}
