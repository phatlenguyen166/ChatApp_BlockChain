import { web3, UserManagerContract, ChatManagerContract } from '../contracts/_index'
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
        to: UserManagerContract._address,
        data: UserManagerContract.methods.addUser(username, this.messagePublicKey).encodeABI(),
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
      const result = await UserManagerContract.methods.isAnUser().call({ from: this.account.address })
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async getUserInformation() {
    try {
      const result = await UserManagerContract.methods
        .getUserFromAddress(this.account.address)
        .call({ from: this.account.address })
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async findUser(userAddress) {
    try {
      const result = await UserManagerContract.methods
        .getUserFromAddress(userAddress)
        .call({ from: this.account.address })
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async isFriend(userAddress) {
    try {
      const result = await UserManagerContract.methods
        .isFriendRelationship(userAddress)
        .call({ from: this.account.address })
      return result
    } catch (error) {
      return false
    }
  }

  async getUserList() {
    try {
      const result = await UserManagerContract.methods.getUserList().call({ from: this.account.address })
      return result
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async getFriendList() {
    try {
      const result = await UserManagerContract.methods.getFriendList().call({ from: this.account.address })
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
      to: UserManagerContract._address,
      data: UserManagerContract.methods.addFriend(userAddress).encodeABI(),
      gas: 22000n,
      gasLimit: 2400000n,
      gasPrice: web3.utils.toWei('10', 'gwei'),
      chainId: 1337
    }

    return await this.signAndSendTransaction(tx)
  }

  async handleUserAddedEvent(func) {
    try {
      const userAddedEvent = UserManagerContract.events.UserAdded()
      userAddedEvent.on('data', (event) => {
        func(event)
      })
      userAddedEvent.on('error', (error) => {
        console.error('Error:', error)
      })
    } catch (error) {
      console.error('Error:', error)
      throw new Error('Failed to listen UserAdded event')
    }
  }
  async handleFriendAddedEvent(func) {
    await UserManagerContract.events
      .FriendAdded()
      .on('data', (event) => {
        func(event)
      })
      .on('error', (error) => {
        console.error('Error:', error)
      })
  }

  async sendMessage(friend, content, type) {
    // const data = type === 0 ? content : fileToBase64(content)
    const { hashForSender, hashForReceiver } = await this.upload(content, friend)
    console.log(type)

    const nonce = await web3.eth.getTransactionCount(this.account.address, 'latest')
    const tx = {
      nonce: nonce,
      from: this.account.address,
      to: ChatManagerContract.address,
      data: ChatManagerContract.methods.sendMessage(friend, hashForSender, hashForReceiver, type).encodeABI()
    }

    return await this.signAndSendTransaction(tx)
  }

  async getMessage(friend) {
    try {
      const messages = await ChatManagerContract.methods.getMessage(friend).call({ from: this.account.address })

      const encryptMessages = await Promise.all(
        messages.map(async (message) => {
          const hashForSender = message.hashForSender
          const hashForReceiver = message.hashForReceiver
          const from = message.sender
          const type = message.msgType
          const timeStamp = message.timestamp

          const content = await this.download(hashForSender, hashForReceiver, from, type)
          // const data = type === 0 ? content : base64ToUrl(content)

          return {
            isSender: message.sender === this.account.address,
            type,
            content,
            timeStamp
          }
        })
      )

      return encryptMessages
    } catch (error) {
      console.error('Error fetching data:', error)
      throw new Error('Có lỗi xảy ra khi lấy tin nhắn.')
    }
  }

  async handleMessageSentEvent(func) {
    await ChatManagerContract.events
      .MessageSent()
      .on('data', (event) => {
        func(event)
      })
      .on('error', (error) => {
        console.error('Error:', error)
      })
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
