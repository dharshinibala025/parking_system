const QRCode = require('qrcode')

/**
 * Generates a Data URL for a given string content (e.g., booking ID or QR payload)
 * @param {string} text - The text payload to encode into QR code
 * @returns {Promise<string>} - Returns base64 Data URL string
 */
async function generateQRCode(text) {
  try {
    if (!text) return ''
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 2,
      color: {
        dark: '#1E2A30',
        light: '#FFFFFF',
      },
    })
    return dataUrl
  } catch (err) {
    console.error('Error generating QR code:', err)
    return text // fallback to raw string
  }
}

module.exports = generateQRCode
