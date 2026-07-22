import keytar from 'keytar';

const SERVICE_NAME = 'GeoAtlasWindowsDesktop';
const ACCOUNT_NAME = 'GeoAtlasUserAuthToken';

export async function getDesktopToken(): Promise<string | null> {
  try {
    return await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
  } catch (_) {
    return null;
  }
}

export async function setDesktopToken(token: string): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, token);
}

export async function removeDesktopToken(): Promise<void> {
  await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
}
