import * as admin from 'firebase-admin'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@parkease.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456'
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'parkease-app'

console.log('🏁 Initializing ParkEase Admin Account Seed Process...')
console.log(`📧 Target Admin Email: ${ADMIN_EMAIL}`)

if (admin.apps.length === 0) {
  const serviceAccountEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (serviceAccountEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: serviceAccountEmail,
        privateKey,
      }),
    })
  } else {
    admin.initializeApp({
      projectId: FIREBASE_PROJECT_ID,
    })
  }
}

const auth = admin.auth()
const db = admin.firestore()

async function seedAdmin() {
  try {
    let userRecord: admin.auth.UserRecord

    try {
      // 1. Check if Firebase Auth user exists
      userRecord = await auth.getUserByEmail(ADMIN_EMAIL)
      console.log(`✅ Existing Firebase Auth User found for ${ADMIN_EMAIL} (UID: ${userRecord.uid})`)
      
      // Update password if specified
      await auth.updateUser(userRecord.uid, {
        password: ADMIN_PASSWORD,
        displayName: 'ParkEase Administrator',
      })
      console.log('🔑 Admin password verified and updated in Firebase Auth.')
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log(`👤 User ${ADMIN_EMAIL} not found. Creating new Firebase Auth account...`)
        userRecord = await auth.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          displayName: 'ParkEase Administrator',
          emailVerified: true,
        })
        console.log(`🎉 Firebase Auth Admin created (UID: ${userRecord.uid})`)
      } else {
        throw error
      }
    }

    // 2. Set Custom User Claim role = 'ADMIN'
    await auth.setCustomUserClaims(userRecord.uid, { role: 'ADMIN' })
    console.log('🛡️ Custom User Claim { role: "ADMIN" } set.')

    // 3. Create or Update Firestore Document in users/{uid}
    const userDocRef = db.collection('users').doc(userRecord.uid)
    const adminData = {
      uid: userRecord.uid,
      name: 'ParkEase Administrator',
      email: ADMIN_EMAIL,
      phone: '+91 9999999999',
      role: 'ADMIN',
      status: 'active',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await userDocRef.set(adminData, { merge: true })
    console.log('💾 Firestore users collection document updated with role = "ADMIN"')

    console.log('\n✨ ADMIN SEED COMPLETED SUCCESSFULLY!')
    console.log('--------------------------------------------------')
    console.log(`Email: ${ADMIN_EMAIL}`)
    console.log(`Role:  ADMIN`)
    console.log(`UID:   ${userRecord.uid}`)
    console.log('--------------------------------------------------')

    process.exit(0)
  } catch (err: any) {
    console.error('❌ Error during Admin Seed:', err)
    process.exit(1)
  }
}

seedAdmin()
