import { web3, UserManagerContract, ChatManagerContract } from '../contracts/_index';
import ContractExecution from './ContractExecution';

class UserManager extends ContractExecution {

  constructor(privateKey) {
    super(privateKey);
  }

  async signIn(username) {
    try {
      const nonce = await web3.eth.getTransactionCount(this.account.address, 'latest');
      const tx = {
        nonce: nonce,
        from: this.account.address,
        to: UserManagerContract._address,
        data: UserManagerContract.methods.addUser(username, this.publicKeyMsg).encodeABI(),
        gasPrice: web3.utils.toWei('10', 'gwei')
      };
  
      return await this.signAndSendTransaction(tx);
    } catch (error) {
      console.error('Error during signIn:', error);
      throw new Error('Gia nhập không thành công.');
    }
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
  async handFriendAddedEvent(func) {
    await UserManagerContract.events.FriendAdded()
    .on('data', (event) => {
      func(event);
    })
    .on('error', (error) => {
      console.error('Error:', error);
    });
  }
}

export default UserManager;