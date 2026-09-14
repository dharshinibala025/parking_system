import * as admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

let firebaseApp: admin.app.App

const serviceAccountEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
const projectId = process.env.FIREBASE_PROJECT_ID || 'parkease-app'

if (serviceAccountEmail && privateKey) {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail: serviceAccountEmail,
      privateKey,
    }),
    storageBucket: `${projectId}.appspot.com`,
  })
  console.log('🔥 Firebase Admin SDK initialized with Service Account Credentials.')
} else {
  // Application default credentials or mock mode for local dev without active service key
  if (admin.apps.length === 0) {
    firebaseApp = admin.initializeApp({
      projectId,
    })
    console.log('⚡ Firebase Admin SDK initialized with Project ID:', projectId)
  } else {
    firebaseApp = admin.apps[0]!
  }
}

export const db = admin.firestore()
export const auth = admin.auth()
export const storage = admin.storage()
export default admin
