import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('geoatlasDesktop', {
  getAuthToken: () => ipcRenderer.invoke('auth:get-token'),
  setAuthToken: (token: string) => ipcRenderer.invoke('auth:set-token', token),
  removeAuthToken: () => ipcRenderer.invoke('auth:remove-token'),
});
