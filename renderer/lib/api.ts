import electron from "electron";
import { ISentence, IStats } from "./types";

// Prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

export const isFirstOpen = async (): Promise<boolean> => {
  return ipcRenderer.invoke("is-first-open");
};

export const createSettings = async ({ includeId }: { includeId: boolean }) => {
  return ipcRenderer.invoke("create-settings", { includeId });
};

export const getInstalledApps = async (): Promise<string[]> => {
  return ipcRenderer.invoke("get-installed-apps");
};

export const importFromInstalledApps = async () => {
  return ipcRenderer.invoke("import-from-installed-apps");
};

export const getSentenceBatch = async (): Promise<ISentence[]> => {
  return ipcRenderer.invoke("get-sentence-batch");
};

export const submitSentencesByUUIDs = async (uuids: string[]) => {
  return ipcRenderer.invoke("submit-sentences-by-uuids", { uuids });
};

export const markSentencesAsViewedByUUIDs = async (uuids: string[]) => {
  return ipcRenderer.invoke("mark-sentences-as-viewed-by-uuids", { uuids });
};

export const getStats = async (): Promise<IStats> => {
  return ipcRenderer.invoke("get-stats");
};

export type { ISentence, IStats };
