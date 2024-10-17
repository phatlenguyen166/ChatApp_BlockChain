import { web3, ChatManagerContract } from '../contracts/_index'; 
import ContractExecution from './ContractExecution';

class ChatManager extends ContractExecution {

  constructor(privateKey) {
    super(privateKey);
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

  async getMessage() {
    try {
      const messages = await ChatManagerContract.methods.getMessage().call();
  
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

export default ChatManager;