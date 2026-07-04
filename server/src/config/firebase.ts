import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { config } from './env';

let firebaseApp: App | null = null;

export function getFirebaseAdmin(): App | null {
  if (firebaseApp) return firebaseApp;
  if (!config.firebase.projectId) {
    console.warn('⚠️  Firebase not configured — using JWT-only auth');
    return null;
  }
  if (getApps().length === 0) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
    });
    console.log('✅ Firebase Admin initialized');
  } else {
    firebaseApp = getApps()[0]!;
  }
  return firebaseApp;
}

export async function verifyFirebaseToken(token: string): Promise<DecodedIdToken | null> {
  try {
    const app = getFirebaseAdmin();
    if (!app) return null;
    return await getAuth(app).verifyIdToken(token);
  } catch {
    return null;
  }
}
