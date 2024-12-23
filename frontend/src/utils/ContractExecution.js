import { web3, UserManagerContract, ChatManagerContract } from '../contracts/_index'
import { storeDataToIPFS, retrieveDataFromIPFS } from './fileManager'
import { generateRSAKeys, encryptWithRSA, decryptWithRSA } from './cryptoUtils'

class ContractExecution {
  constructor(privateKey = null) {
    if (privateKey !== null) {
      this.privateKey = privateKey
      this.account = web3.eth.accounts.privateKeyToAccount(privateKey)
    }
    this.UserManagerContract = UserManagerContract
    this.ChatManagerContract = ChatManagerContract
    this.event = false
  }

  setMessageKey(messagePublicKey, messagePrivateKey) {
    if (typeof this.messagePrivateKey === 'undefined') {
      this.messagePublicKey = messagePublicKey
      this.messagePrivateKey = messagePrivateKey
    } else {
      throw new Error('Key already set.')
    }
  }

  setNewMessageKey() {
    if (typeof this.messagePrivateKey === 'undefined') {
      const { messagePublicKey, messagePrivateKey } = generateRSAKeys()
      this.messagePublicKey = messagePublicKey
      this.messagePrivateKey = messagePrivateKey
    } else {
      throw new Error('Key already set.')
    }
  }

  async signAndSendTransaction(tx) {
    try {
      tx.gas = 1200000n
      tx.gasLimit = tx.gas + tx.gas / 5n
      tx.chainId = 1337

      const signedTx = await web3.eth.accounts.signTransaction(tx, this.privateKey)

      const transactionHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('error', (error) => {
        console.error('Error sending transaction:', error)
        if (error && error.reason) {
          console.error('Revert reason:', error.reason)
        } else {
          console.error('Unknown error:', error.message || error)
        }
        throw new Error('Gửi giao dịch không thành công.')
      })
      return {
        transactionHash,
        tx: signedTx
      }
    } catch (error) {
      console.error('Error in signAndSendTransaction:', error)
      throw new Error('Có lỗi xảy ra khi gửi giao dịch.')
    }
  }

  async upload(data, to) {
    try {
      const receiver = await this.UserManagerContract.methods
        .getUserFromAddress(to)
        .call({ from: this.account.address })

      const senderKey = this.messagePublicKey
      const receiverKey = receiver.publicKey
      const cid = await storeDataToIPFS(data, senderKey, receiverKey)

      const hashForSender = await encryptWithRSA(senderKey, cid)
      const hashForReceiver = await encryptWithRSA(receiverKey, cid)
      return {
        hashForSender,
        hashForReceiver
      }
    } catch (error) {
      console.error('Error in uploadAndEnctyptCID:', error)
      throw new Error('Có lỗi xảy ra khi upload và mã hóa CID.')
    }
  }

  async download(hashForSender, hashForReceiver, from) {
    try {
      const isSender = from === this.account.address
      let decryptedCID
      if (isSender) {
        decryptedCID = await decryptWithRSA(this.messagePrivateKey, hashForSender)
      } else {
        decryptedCID = await decryptWithRSA(this.messagePrivateKey, hashForReceiver)
      }

      const data = await retrieveDataFromIPFS(decryptedCID, this.messagePrivateKey, isSender)
      return data
    } catch (error) {
      console.error('Error in getAndDecryptCID:', error)
      throw new Error('Có lỗi xảy ra khi nhận và giải mã CID.')
    }
  }
}

export default ContractExecution
