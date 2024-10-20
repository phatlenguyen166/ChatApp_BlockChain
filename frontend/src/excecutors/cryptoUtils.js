import forge from 'node-forge'

const generateRSAKeys = () => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 1024 })
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey)
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey)
  return {
    messagePublicKey: publicKeyPem,
    messagePrivateKey: privateKeyPem
  }
}

const encryptWithRSA = (publicKey, data) => {
  const publicKeyObj = forge.pki.publicKeyFromPem(publicKey)
  const encryptedData = publicKeyObj.encrypt(data, 'RSA-OAEP')
  return forge.util.encode64(encryptedData)
}

const decryptWithRSA = (privateKey, encryptedData) => {
  const privateKeyObj = forge.pki.privateKeyFromPem(privateKey)
  const decryptedData = privateKeyObj.decrypt(forge.util.decode64(encryptedData), 'RSA-OAEP')
  return decryptedData
}

const generateHash = (username, password) => {
  const data = `${username}:${password}`
  const md = forge.md.sha256.create()
  md.update(data)
  return md.digest().toHex()
}

const encryptWithAES = (hashKey, object) => {
  const key = forge.util.createBuffer(hashKey).getBytes(16)
  // Nếu object là một chuỗi, không cần chuyển đổi
  const jsonString = typeof object === 'string' ? object : JSON.stringify(object)
  const cipher = forge.cipher.createCipher('AES-CBC', key)
  const iv = forge.random.getBytesSync(16)

  cipher.start({ iv: iv })
  cipher.update(forge.util.createBuffer(jsonString))
  cipher.finish()

  const encryptedData = forge.util.encode64(cipher.output.getBytes())
  const combinedData = forge.util.encode64(iv + encryptedData)

  return combinedData
}

const decryptWithAES = (hashKey, combinedData) => {
  const key = forge.util.createBuffer(hashKey).getBytes(16)
  const decodedData = forge.util.decode64(combinedData)

  const iv = decodedData.slice(0, 16)
  const encryptedData = decodedData.slice(16)

  const decipher = forge.cipher.createDecipher('AES-CBC', key)
  decipher.start({ iv: iv })
  decipher.update(forge.util.createBuffer(encryptedData))
  const success = decipher.finish()

  if (success) {
    const decryptedOutput = decipher.output.toString()
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
const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const base64ToUrl = (base64Data) => {
  const mimeMatch = base64Data.match(/^data:([a-zA-Z0-9+/.-]+);base64,/)
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream'

  // Tách phần dữ liệu base64 ra
  const byteCharacters = atob(base64Data.split(',')[1])
  const byteNumbers = new Array(byteCharacters.length)

  // Chuyển đổi thành mảng byte
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: mimeType })

  return URL.createObjectURL(blob)
}

export {
  generateRSAKeys,
  encryptWithRSA,
  decryptWithRSA,
  encryptWithAES,
  decryptWithAES,
  storeDataWithAuth,
  getDataWithAuth,
  fileToBase64,
  base64ToUrl
}
