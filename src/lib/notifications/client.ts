import { onAppNotification } from "@/lib/events";
import { notify } from "@/components/Toaster";

let _cleanup: (() => void) | null = null;

export function initNotifications() {
  if (_cleanup) return _cleanup;
  const cleanup = onAppNotification((payload) => {
    const { level, title, description } = payload;
    if (level === "success") notify.success(title, description);
    else if (level === "info") notify.info(title, description);
    else if (level === "warning") notify.warning(title, description);
    else notify.error(title, description);
  });
  _cleanup = cleanup;
  return cleanup;
}

export function teardownNotifications() {
  if (_cleanup) {
    _cleanup();
    _cleanup = null;
  }
}

export default initNotifications;
