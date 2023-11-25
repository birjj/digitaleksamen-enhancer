import { action, atom } from "nanostores";

export enum LogType {
  info,
  warn,
  error,
  success,
}
export type LogLine = {
  type: LogType;
  message: string;
};
export const logStore = atom<LogLine[]>([]);

export const resetLog = action(logStore, "reset", (store) => {
  store.set([]);
});
export const logInfo = action(logStore, "info", (store, msg: string) => {
  store.set([...store.get(), { type: LogType.info, message: msg }]);
});
export const logWarn = action(logStore, "warn", (store, msg: string) => {
  store.set([...store.get(), { type: LogType.warn, message: msg }]);
});
export const logError = action(logStore, "error", (store, msg: string) => {
  store.set([...store.get(), { type: LogType.error, message: msg }]);
});
export const logSuccess = action(logStore, "success", (store, msg: string) => {
  store.set([...store.get(), { type: LogType.success, message: msg }]);
});
