import { web3 } from '../contracts/_index'
import ContractExecution from './ContractExecution'
import { getDataWithAuth, storeDataWithAuth, fileToBase64, base64ToUrl } from './cryptoUtils'

class UserManager extends ContractExecution {
  constructor(param1 = null, param2 = null) {
    if (param1 === null) {
      super()
    } else if (param2 === null) {
      // Khởi tạo với privateKey
      super(param1)
    } else {
      // Khởi tạo với username và password
      const username = param1
      const password = param2
      try {
        const keys = getDataWithAuth(username, password)
        const { walletPrivateKey, messagePublicKey, messagePrivateKey } = keys
        super(walletPrivateKey)
        this.setMessageKey(messagePublicKey, messagePrivateKey)
      } catch (error) {
        console.error('Error during login:', error)
        throw new Error('Sai thông tin đăng nhập.')
      }
    }
  }

  async registerDApp(username, password) {
    try {
      this.setNewMessageKey()

      const nonce = await web3.eth.getTransactionCount(this.account.address, 'latest')
      const tx = {
        nonce: nonce,
        from: this.account.address,
        to: this.UserManagerContract._address,
        data: this.UserManagerContract.methods.addUser(username, this.messagePublicKey).encodeABI(),
        gasPrice: web3.utils.toWei('10', 'gwei')
      }
      await this.signAndSendTransaction(tx)

      const keys = {
        walletPrivateKey: this.privateKey,
        messagePublicKey: this.messagePublicKey,
        messagePrivateKey: this.messagePrivateKey
      }
      storeDataWithAuth(username, password, keys)
    } catch (error) {
      console.error('Error during signIn:', error)
      throw new Error('Gia nhập không thành công.')
    }
  }

  async isUser() {
    try {
      const result = await this.UserManagerContract.methods.isAnUser().call({ from: this.account.address })
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async isUniqueUsername(username) {
    try {
      const result = await this.UserManagerContract.methods
        .isUniqueUsername(username)
        .call({ from: import.meta.env.VITE_PROVIDER_PUBLIC_KEY })
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async getUserInformation() {
    try {
      const result = await this.UserManagerContract.methods
        .getUserFromAddress(this.account.address)
        .call({ from: this.account.address })
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async findUser(userAddress) {
    try {
      const result = await this.UserManagerContract.methods
        .getUserFromAddress(userAddress)
        .call({ from: this.account.address })
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async isFriend(userAddress) {
    try {
      const result = await this.UserManagerContract.methods
        .isFriendRelationship(userAddress)
        .call({ from: this.account.address })
      return result
    } catch (error) {
      return false
    }
  }

  async getUserList() {
    try {
      const result = await this.UserManagerContract.methods.getUserList().call({ from: this.account.address })
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async getFriendList() {
    try {
      const result = await this.UserManagerContract.methods.getFriendList().call({ from: this.account.address })
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async addFriend(userAddress) {
    const nonce = await web3.eth.getTransactionCount(this.account.address, 'latest')
    const tx = {
      nonce: nonce,
      from: this.account.address,
      to: this.UserManagerContract._address,
      data: this.UserManagerContract.methods.addFriend(userAddress).encodeABI(),
      gasPrice: web3.utils.toWei('10', 'gwei')
    }

    return await this.signAndSendTransaction(tx)
  }

  async sendMessage(friend, content, type) {
    // const data = type === 0 ? content : fileToBase64(content)
    const { hashForSender, hashForReceiver } = await this.upload(content, friend)
    
    const nonce = await web3.eth.getTransactionCount(this.account.address, 'latest')
    const tx = {
      nonce: nonce,
      from: this.account.address,
      to: this.ChatManagerContract._address,
      data: this.ChatManagerContract.methods.sendMessage(friend, hashForSender, hashForReceiver, type).encodeABI(),
      gasPrice: web3.utils.toWei('10', 'gwei')
    }

    return await this.signAndSendTransaction(tx)
  }

  async getMessage(friend) {
    try {
      const messages = await this.ChatManagerContract.methods.getMessage(friend).call({ from: this.account.address })

      const encryptMessages = await Promise.all(
        messages.map(async (message) => {
          const hashForSender = message.hashForSender
          const hashForReceiver = message.hashForReceiver
          const from = message.sender
          const type = Number(message.msgType)
          const timestamp = new Date(Number(message.timestamp * 1000n)).toISOString()

          const content = await this.download(hashForSender, hashForReceiver, from, type)
          // const data = type === 0 ? content : base64ToUrl(content)

          return {
            isSender: message.sender === this.account.address,
            type,
            content,
            timestamp
          }
        })
      )

      return encryptMessages
    } catch (error) {
      console.error('Error fetching data:', error)
      throw new Error('Có lỗi xảy ra khi lấy tin nhắn.')
    }
  }

  async readMessage(message) {
    try {
      const hashForSender = message.hashForSender
      const hashForReceiver = message.hashForReceiver
      const from = message.sender
      const type = message.msgType
      const timestamp = message.timestamp

      const content = await this.download(hashForSender, hashForReceiver, from, type)
      const decryptMessage = {
        isSender: message.sender === this.account.address,
        type,
        content,
        timestamp
      }
      return decryptMessage
    } catch (error) {
      console.error('Error fetching data:', error)
      throw new Error('Có lỗi xảy ra khi lấy tin nhắn.')
    }
  }

  offEvent(eventName) {
    try {
      switch (eventName) {
        case 'MessageSent':
          this.ChatManagerContract.events.MessageSent().unsubscribe()
          break
        case 'UserAdded':
          this.UserManagerContract.events.UserAdded().unsubscribe()
          break
        case 'FriendAdded':
          this.UserManagerContract.events.FriendAdded().unsubscribe()
          break
        default:
          console.error('Invalid event name')
          break
      }
    } catch (error) {
      console.error(`Error removing event listener for ${eventName}:`, error)
    }
  }

  // Các hàm xử lý sự kiện riêng lẻ
  async handleMessageSentEvent(callback) {
    try {
      const event = this.ChatManagerContract.events.MessageSent({
        filter: { receiver: this.account.address },
        fromBlock: 'latest'
      })

      // Sử dụng một callback như một hàm để xử lý dữ liệu
      event.on('data', (data) => {
        callback(data)
      }) // Gọi callback với dữ liệu sự kiện
    } catch (error) {
      console.error(`Failed to listen to MessageSent event:`, error)
      throw new Error(`Failed to listen MessageSent event`)
    }
  }

  async handleUserAddedEvent(callback) {
    try {
      const event = this.UserManagerContract.events.UserAdded()

      event.on('data', (data) => {
        callback(data)
      })
    } catch (error) {
      console.error(`Failed to listen to UserAdded event:`, error)
      throw new Error(`Failed to listen UserAdded event`)
    }
  }

  async handleFriendAddedEvent(callback) {
    try {
      const event = this.UserManagerContract.events.FriendAdded({
        filter: { friendAddress: this.account.address },
        fromBlock: 'latest'
      })

      event.on('data', (data) => {
        callback(data)
      })
    } catch (error) {
      console.error(`Failed to listen to FriendAdded event:`, error)
      throw new Error(`Failed to listen FriendAdded event`)
    }
  }
}

let userInstance = new UserManager()

const getUser = () => userInstance
const setUser = (username, password) => {
  userInstance = new UserManager(username, password)
  return userInstance
}

export { getUser, setUser }

export default UserManager
