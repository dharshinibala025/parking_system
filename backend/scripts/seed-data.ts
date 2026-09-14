import * as admin from 'firebase-admin'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env') })

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'parkease-app'

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
    admin.initializeApp({ projectId: FIREBASE_PROJECT_ID })
  }
}

const db = admin.firestore()

const SAMPLE_PARKING_LOTS = [
  {
    id: 'lot-central-01',
    name: 'ParkEase Central Parking',
    description: 'Multi-level premium covered parking lot in the heart of downtown commercial hub.',
    address: '100 MG Road, Central Business District',
    city: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
    totalSlots: 32,
    availableSlots: 24,
    pricePerHour: 50,
    parkingType: 'Covered',
    vehicleTypes: ['Car', 'Bike', 'SUV', 'EV'],
    amenities: ['CCTV', 'Security', 'EV Charging', 'Covered Parking', 'Valet', 'Accessible Parking'],
    openingTime: '06:00 AM',
    closingTime: '11:59 PM',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lot-mall-02',
    name: 'City Mall Underground Hub',
    description: 'Spacious basement parking directly connected to retail stores and cinema multiplex.',
    address: '45 Forum Avenue, Koramangala',
    city: 'Bengaluru',
    latitude: 12.9352,
    longitude: 77.6245,
    imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80',
    totalSlots: 24,
    availableSlots: 18,
    pricePerHour: 40,
    parkingType: 'Basement',
    vehicleTypes: ['Car', 'Bike', 'SUV'],
    amenities: ['CCTV', 'Security', 'Covered Parking', 'Accessible Parking'],
    openingTime: '09:00 AM',
    closingTime: '11:00 PM',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lot-airport-03',
    name: 'Airport Smart Parking Hub',
    description: 'Long-term secure parking near airport terminal with 24/7 shuttle connectivity.',
    address: 'Terminal 1 Expressway, Devanahalli',
    city: 'Bengaluru',
    latitude: 13.1986,
    longitude: 77.7066,
    imageUrl: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&q=80',
    totalSlots: 40,
    availableSlots: 30,
    pricePerHour: 80,
    parkingType: 'Open',
    vehicleTypes: ['Car', 'SUV', 'EV'],
    amenities: ['CCTV', 'Security', 'EV Charging', 'Valet'],
    openingTime: '12:00 AM',
    closingTime: '11:59 PM',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

async function seedData() {
  try {
    console.log('🌱 Starting Sample Data Seed for ParkEase...')

    // 1. Seed Parking Lots
    for (const lot of SAMPLE_PARKING_LOTS) {
      await db.collection('parkingLots').doc(lot.id).set(lot, { merge: true })
      console.log(`🅿️ Parking Lot seeded: ${lot.name}`)

      // 2. Generate Slots for Lot
      const sections = ['A', 'B']
      let slotIndex = 1

      for (const section of sections) {
        for (let i = 1; i <= 8; i++) {
          const slotNum = `${section}${i < 10 ? '0' + i : i}`
          const slotId = `slot-${lot.id}-${slotNum}`
          const isEV = i === 1
          const isAccessible = i === 2
          const status = i === 5 ? 'OCCUPIED' : i === 8 ? 'MAINTENANCE' : 'AVAILABLE'

          const slotObj = {
            id: slotId,
            parkingLotId: lot.id,
            slotNumber: slotNum,
            floor: section === 'A' ? 'Ground Floor' : 'First Floor',
            section,
            vehicleType: isEV ? 'EV' : i % 2 === 0 ? 'Car' : 'Bike',
            status,
            isEV,
            isAccessible,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          await db.collection('parkingSlots').doc(slotId).set(slotObj, { merge: true })
        }
      }
    }

    // 3. Seed Pricing Global Config
    await db.collection('pricing').doc('global-config').set(
      {
        baseHourlyRate: 50,
        weekendMultiplier: 1.2,
        peakHourMultiplier: 1.5,
        serviceFee: 10,
        taxRate: 5,
        vehicleRates: {
          Car: 1.0,
          Bike: 0.5,
          SUV: 1.3,
          EV: 1.1,
        },
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )

    console.log('✨ SAMPLE DATA SEED COMPLETED SUCCESSFULLY!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error during data seed:', err)
    process.exit(1)
  }
}

seedData()
