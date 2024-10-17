import { web3, UserManagerContract } from '../contracts/_index';
import {uploadFile, uploadString, read } from '../ipfs/fileManager'
import forge from 'node-forge';

function generateRSAKeys() {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
  return {
    publicKeyMsg: publicKeyPem,
    privateKeyMsg: privateKeyPem,
  };
}

function encryptData(publicKey, data) {
  const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
  const encryptedData = publicKeyObj.encrypt(data, 'RSA-OAEP');
  return forge.util.encode64(encryptedData);
}

function decryptData(privateKey, encryptedData) {
  const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
  const decryptedData = privateKeyObj.decrypt(forge.util.decode64(encryptedData), 'RSA-OAEP');
  return decryptedData;
}

class ContractExecution {

  constructor(privateKey) {
    this.privateKey = privateKey; 
    this.account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const { publicKeyMsg, privateKeyMsg } = generateRSAKeys();
    this.publicKeyMsg = publicKeyMsg;
    this.privateKeyMsg = privateKeyMsg;
  }

  async signAndSendTransaction(tx) {
    try {

      tx.gas =await web3.eth.estimateGas(tx);
      tx.gasLimit = tx.gas + tx.gas/5n;
      tx.chainId = 1337;

      const signedTx = await web3.eth.accounts.signTransaction(tx, this.privateKey);

      const transactionHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .on('receipt', (receipt) => {
        console.log('Transaction receipt:', receipt);
      })
      .on('error', (error) => {
        console.error('Error sending transaction:', error);
        if (error && error.reason) {
          console.error('Revert reason:', error.reason);
        } else {
          console.error('Unknown error:', error.message || error);
        }
        throw new Error('Gửi giao dịch không thành công.');
      });
      return {
        transactionHash,
        tx: signedTx
      };
    } catch (error) {
      console.error('Error in signAndSendTransaction:', error);
      throw new Error('Có lỗi xảy ra khi gửi giao dịch.');
    }  
  }

  async uploadAndEnctyptCID(data, to, type) {
    try {
      let cid
      if (type === 0) {
        cid = await uploadString(data)
      } else {
        cid = await uploadFile(data)
      }
      const receiver = await UserManagerContract.methods.getUserFromAddress(to).call({ from: this.account.address });
      const receiverKey = receiver.publicKey
      const senderKey = this.publicKeyMsg

      const hashForSender = encryptData(senderKey, cid)
      const hashForReceiver = encryptData(receiverKey, cid)
      return {
        hashForSender,
        hashForReceiver
      }
    } catch (error) {
      console.error('Error in uploadAndEnctyptCID:', error);
      throw new Error('Có lỗi xảy ra khi upload và mã hóa CID.');
    }
  }

  async getAndDecryptCID(hashForSender, hashForReceiver, from, type) {
    try {
      let decryptedCID
      if (from === this.account.address) {
        decryptedCID = decryptData(this.privateKeyMsg, hashForSender)
      } else {
        decryptedCID = decryptData(this.privateKeyMsg, hashForReceiver)
      }

      const data = await read(decryptedCID, type)
      // const httpGateway = process.env.HTTP_GATEWAY
      // const url = `${httpGateway}/${decryptedCID}`;
      return data;
    } catch (error) {
      console.error('Error in getAndDecryptCID:', error);
      throw new Error('Có lỗi xảy ra khi nhận và giải mã CID.');
    }
  }

}

export default ContractExecution;
