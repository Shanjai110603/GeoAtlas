import { app, BrowserWindow, Menu, Tray, ipcMain } from 'electron';
import path from 'path';
import { getDesktopToken, setDesktopToken, removeDesktopToken } from './auth-desktop';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'GeoAtlas — Global Geographic Knowledge Platform',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#090d16',
  });

  // Load the web application URL (http://localhost:4000) or static export
  const targetUrl = process.env.DESKTOP_RENDERER_URL || 'http://localhost:4000';
  mainWindow.loadURL(targetUrl);

  // Native Windows Menu Bar
  const menuTemplate: any[] = [
    {
      label: 'File',
      submenu: [
        { label: 'Refresh Page', role: 'reload' },
        { type: 'separator' },
        { label: 'Exit GeoAtlas', role: 'quit' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Toggle Full Screen', role: 'togglefullscreen' },
        { label: 'Developer Tools', role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About GeoAtlas Desktop',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`alert("GeoAtlas Desktop v1.0.0\\nWindows Native Client powered by Electron & @geoatlas/core");`);
            }
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Credential Handlers (Windows Credential Manager via keytar)
ipcMain.handle('auth:get-token', async () => {
  return await getDesktopToken();
});

ipcMain.handle('auth:set-token', async (_event: any, token: string) => {
  await setDesktopToken(token);
});

ipcMain.handle('auth:remove-token', async () => {
  await removeDesktopToken();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
