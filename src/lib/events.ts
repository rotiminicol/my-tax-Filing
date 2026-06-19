export type AppNotification = {
  level: "success" | "info" | "warning" | "error";
  title: string;
  description?: string;
};

const emitter = new EventTarget();

export function emitAppNotification(payload: AppNotification) {
  emitter.dispatchEvent(new CustomEvent("app:notification", { detail: payload }));
}

export function onAppNotification(cb: (payload: AppNotification) => void) {
  const handler = (e: Event) => cb((e as CustomEvent).detail as AppNotification);
  emitter.addEventListener("app:notification", handler as EventListener);
  return () => emitter.removeEventListener("app:notification", handler as EventListener);
}

export default emitter;
