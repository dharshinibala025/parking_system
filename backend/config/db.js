const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/parkease'
    const conn = await mongoose.connect(connStr)
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`)
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}. Operating with fallback mode.`)
  }
}

module.exports = connectDB
