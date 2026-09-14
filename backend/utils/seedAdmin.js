const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const Admin = require('../models/Admin')

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@parkeasy.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/parkease'

async function seedAdmin() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI)
      console.log('🍃 Connected to MongoDB for Admin Seed Check...')
    }

    const adminCount = await Admin.countDocuments()

    if (adminCount > 0) {
      console.log(`ℹ️ Admin account already exists (${adminCount} found). Skipping seed.`)
      return
    }

    console.log(`👤 No Admin found. Creating initial Admin account for ${ADMIN_EMAIL}...`)
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt)

    const newAdmin = new Admin({
      name: 'ParkEase Administrator',
      email: ADMIN_EMAIL,
      passwordHash,
    })

    await newAdmin.save()

    console.log('✨ SINGLE DEFAULT ADMIN ACCOUNT CREATED SUCCESSFULLY!')
    console.log('--------------------------------------------------')
    console.log(`Email:    ${ADMIN_EMAIL}`)
    console.log(`Password: ${ADMIN_PASSWORD}`)
    console.log('--------------------------------------------------')
    console.log('Zero dummy records seeded. System ready for live operations.')
  } catch (err) {
    console.error('❌ Admin seed process error:', err.message)
  }
}

if (require.main === module) {
  seedAdmin().then(() => mongoose.connection.close())
}

module.exports = seedAdmin
