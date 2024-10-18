import { web3, UserManagerContract, ChatManagerContract } from '../contracts/_index';
import ContractExecution from './ContractExecution';

class UserManager extends ContractExecution {

  constructor(privateKey) {
    super(privateKey);
  }

  async registerDApp(username) {
    try {
      const nonce = await web3.eth.getTransactionCount(this.account.address, 'latest');
      const tx = {
        nonce: nonce,
        from: this.account.address,
        to: UserManagerContract._address,
        data: UserManagerContract.methods.addUser(username, this.publicKeyMsg).encodeABI(),
        gasPrice: web3.utils.toWei('10', 'gwei')
      };
  
      await this.signAndSendTransaction(tx);
      this.setNewMessageKey();
    } catch (error) {
      console.error('Error during signIn:', error);
      throw new Error('Gia nhập không thành công.');
    }
  }

  async loginDApp(messagePublicKey, messagePrivateKey) {
    this.setMessageKey(messagePublicKey, messagePrivateKey);
  }

  async isUser() {
    try {
      const result = await UserManagerContract.methods.isAnUser().call({ from: this.account.address });
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async getUserInformation() {
    try {
      const result = await UserManagerContract.methods.getUserFromAddress(this.account.address).call({ from: this.account.address });
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async findUser(userAddress) {
    try {
      const result = await UserManagerContract.methods.getUserFromAddress(userAddress).call({ from: this.account.address });
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async isFriend(userAddress) {
    try {
      const result = await UserManagerContract.methods.isFriendRelationship(userAddress).call({ from: this.account.address });
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async getUserList() {
    try {
      const result = await UserManagerContract.methods.getUserList().call({ from: this.account.address });
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async getFriendList() {
    try {
      const result = await UserManagerContract.methods.getFriendList().call({ from: this.account.address });
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async addFriend(userAddress) {
    const nonce = await web3.eth.getTransactionCount(this.account.address, 'latest');
    const tx = {
      nonce: nonce,
      from: this.account.address,
      to: UserManagerContract._address,
      data: UserManagerContract.methods.addFriend(userAddress).encodeABI(),
      gas: 22000n,
      gasLimit: 2400000n,
      gasPrice: web3.utils.toWei('10', 'gwei'),
      chainId: 1337
    };

    return await this.signAndSendTransaction(tx); 
  }

  async handleUserAddedEvent(func) {
    try {
      const userAddedEvent = UserManagerContract.events.UserAdded();
      userAddedEvent.on('data', (event) => {
        func(event);
      });
      userAddedEvent.on('error', (error) => {
        console.error('Error:', error);
      });
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to listen UserAdded event');
    }
  }
  async handleFriendAddedEvent(func) {
    await UserManagerContract.events.FriendAdded()
    .on('data', (event) => {
      func(event);
    })
    .on('error', (error) => {
      console.error('Error:', error);
    });
  }

  async sendMessage(friend, content, type) {

    const { hashForSender, hashForReceiver } = await this.uploadAndEnctyptCID(content, friend, type);

    const nonce = await web3.eth.getTransactionCount(this.account.address, 'latest');
    const tx = {
      nonce: nonce,
      from: this.account.address,
      to: ChatManagerContract.address,
      data: ChatManagerContract.methods.sendMessage(friend, hashForSender, hashForReceiver, type).encodeABI(),
    };

    return await this.signAndSendTransaction(tx);
  }

  async getMessage(friend) {
    try {
      const messages = await ChatManagerContract.methods.getMessage(friend).call({ from: this.account.address });
  
      const encryptMessages = await Promise.all(messages.map(async (message) => {
        const hashForSender = message.hashForSender;
        const hashForReceiver = message.hashForReceiver;
        const from = message.sender;
        const to = message.receiver;
        const type = message.msgType;
        const timestamp = message.timestamp;
  
        const content = await this.getAndDecryptCID(hashForSender, hashForReceiver, from, type);
        return {
          from,
          to,
          content,
          timestamp
        };
      }));
  
      return encryptMessages;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Có lỗi xảy ra khi lấy tin nhắn.');
    }
  }
  
  async getLastMessage() {

  }

  async handleMessageSentEvent(func) {
    await ChatManagerContract.events.MessageSent()
    .on('data', (event) => {
      func(event);
    })
    .on('error', (error) => {
      console.error('Error:', error);
    });
  }
}

export default UserManager;