// Android Haptic Vibration Feedback Utilities

export function vibrateTap(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(10);
    } catch {
      // Ignore browsers where vibration is blocked
    }
  }
}

export function vibrateTick(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(6);
    } catch {
      // Ignore
    }
  }
}

export function vibrateSuccess(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([15, 40, 25]);
    } catch {
      // Ignore
    }
  }
}

export function vibrateWarning(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([25, 30, 25]);
    } catch {
      // Ignore
    }
  }
}
