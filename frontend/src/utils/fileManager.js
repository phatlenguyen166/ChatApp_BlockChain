import { create } from 'ipfs-http-client'
import forge from 'node-forge'
import { encryptWithRSA, decryptWithRSA, encryptWithAES, decryptWithAES } from './cryptoUtils'

const ipfs = create({ url: 'http://localhost:5001' })

async function storeDataToIPFS(data, senderPublicKey, receiverPublicKey) {
  const aesKey = forge.random.getBytesSync(16)
  const encryptedData = encryptWithAES(aesKey, data)

  const encryptedAESforSender = await encryptWithRSA(senderPublicKey, aesKey)
  const encryptedAESforReceiver = await encryptWithRSA(receiverPublicKey, aesKey)

  const jsonPayload = {
    encryptedData,
    encryptedAESforSender,
    encryptedAESforReceiver
  }

  const cid = await uploadDataToIPFS(jsonPayload)
  return cid
}

async function uploadDataToIPFS(jsonData) {
  try {
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' })
    const added = await ipfs.add(blob)

    return added.path
  } catch (error) {
    console.error('Error uploading string:', error)
    throw error
  }
}

const retrieveDataFromIPFS = async (cid, privateKey, isSender) => {
  try {
    const stream = ipfs.cat(cid)
    let data = ''
    for await (const chunk of stream) {
      data += new TextDecoder().decode(chunk)
    }
    const jsonPayload = JSON.parse(data)

    const aesKey = isSender
      ? await decryptWithRSA(privateKey, jsonPayload.encryptedAESforSender)
      : await decryptWithRSA(privateKey, jsonPayload.encryptedAESforReceiver)

    const decryptedData = decryptWithAES(aesKey, jsonPayload.encryptedData)
    return decryptedData
  } catch (error) {
    console.error('Error retrieving data from IPFS:', error)
    throw error
  }
}

export { storeDataToIPFS, retrieveDataFromIPFS }
