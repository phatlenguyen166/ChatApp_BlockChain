import forge from 'node-forge'

const generateRSAKeys = () => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 })
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey)
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey)
  return {
    messagePublicKey: publicKeyPem,
    messagePrivateKey: privateKeyPem
  }
}

const encryptWithRSA = async (publicKeyPem, message) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem)
  const messageBytes = forge.util.encodeUtf8(message)
  const encrypted = publicKey.encrypt(messageBytes, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha1.create()
    }
  })
  return forge.util.encode64(encrypted)
}

const decryptWithRSA = async (privateKeyPem, encryptedMessage) => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem)
  const encryptedBytes = forge.util.decode64(encryptedMessage)
  const decryptedBytes = privateKey.decrypt(encryptedBytes, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha1.create()
    }
  })
  return forge.util.decodeUtf8(decryptedBytes)
}

const generateHash = (username, password) => {
  const data = `${username}:${password}`
  const md = forge.md.sha256.create()
  md.update(data)
  return md.digest().toHex()
}

const encryptWithAES = (hashKey, object) => {
  const key = forge.util.createBuffer(hashKey, 'utf8').getBytes(16)

  const jsonString = typeof object === 'string' ? object : JSON.stringify(object)
  const cipher = forge.cipher.createCipher('AES-CBC', key)
  const iv = forge.random.getBytesSync(16)

  cipher.start({ iv: iv })
  cipher.update(forge.util.createBuffer(jsonString, 'utf8'))
  cipher.finish()

  const encryptedData = cipher.output.getBytes()

  const combinedData = forge.util.encode64(iv + encryptedData)
  return combinedData
}

const decryptWithAES = (hashKey, combinedData) => {
  const key = forge.util.createBuffer(hashKey, 'utf8').getBytes(16)

  // Decode dữ liệu đã được mã hóa từ base64
  const decodedData = forge.util.decode64(combinedData)
  // Tách IV (16 bytes đầu) và dữ liệu mã hóa còn lại
  const iv = decodedData.slice(0, 16) // Sử dụng slice để lấy 16 bytes đầu làm IV
  const encryptedData = decodedData.slice(16) // Phần còn lại là dữ liệu mã hóa

  const decipher = forge.cipher.createDecipher('AES-CBC', key)
  decipher.start({ iv: iv })
  decipher.update(forge.util.createBuffer(encryptedData))
  const success = decipher.finish()

  if (success) {
    const decryptedOutput = decipher.output.toString('utf8')
    // Kiểm tra xem đầu ra có phải là JSON không
    try {
      return JSON.parse(decryptedOutput)
    } catch {
      return decryptedOutput // Nếu không thể parse, trả về chuỗi nguyên
    }
  } else {
    throw new Error('Decryption failed')
  }
}

const storeDataWithAuth = (username, password, object) => {
  const hashKey = generateHash(username, password)
  const encryptedObject = encryptWithAES(hashKey, object)
  localStorage.setItem(username, encryptedObject)
}

const getDataWithAuth = (username, password) => {
  const hashKey = generateHash(username, password)
  const combinedData = localStorage.getItem(username)
  if (!combinedData) {
    throw new Error('No data found in localStorage with the given key')
  }
  try {
    const decryptedObject = decryptWithAES(hashKey, combinedData)
    return decryptedObject
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Unable to decrypt the data')
  }
}

// Chuyển đổi File thành base64
// const fileToBase64 = async (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.onloadend = () => resolve(reader.result)
//     reader.onerror = reject
//     reader.readAsDataURL(file)
//   })
// }

// const base64ToUrl = (base64Data) => {
//   const mimeMatch = base64Data.match(/^data:([a-zA-Z0-9+/.-]+);base64,/)
//   const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream'

//   // Tách phần dữ liệu base64 ra
//   const byteCharacters = atob(base64Data.split(',')[1])
//   const byteNumbers = new Array(byteCharacters.length)

//   // Chuyển đổi thành mảng byte
//   for (let i = 0; i < byteCharacters.length; i++) {
//     byteNumbers[i] = byteCharacters.charCodeAt(i)
//   }

//   const byteArray = new Uint8Array(byteNumbers)
//   const blob = new Blob([byteArray], { type: mimeType })

//   return URL.createObjectURL(blob)
// }

export {
  generateRSAKeys,
  encryptWithRSA,
  decryptWithRSA,
  encryptWithAES,
  decryptWithAES,
  storeDataWithAuth,
  getDataWithAuth
  // fileToBase64,
  // base64ToUrl
}
