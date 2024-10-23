import ChatManager from './ChatManager'
import UserManager from './UserManager'
import { web3 } from '../contracts/_index'

const createAccount = async () => {
  const SENDER_ADDRESS = import.meta.env.VITE_PROVIDER_PUBLIC_KEY
  const SENDER_PRIVATEKEY = import.meta.env.VITE_PROVIDER_PRIVATE_KEY

  const account = web3.eth.accounts.create()
  const nonce = await web3.eth.getTransactionCount(SENDER_ADDRESS, 'latest')

  const tx = {
    nonce: nonce,
    from: SENDER_ADDRESS,
    to: account.address,
    value: web3.utils.toWei('1', 'ether'),
    chainId: 1337
  }

  const gasEstimate = await web3.eth.estimateGas(tx)
  tx.gas = gasEstimate + 200n
  tx.gasPrice = web3.utils.toWei('10', 'gwei')

  const signedTx = await web3.eth.accounts.signTransaction(tx, SENDER_PRIVATEKEY)

  await web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .on('receipt', (receipt) => {
      console.log('Transaction receipt:', receipt)
    })
    .on('error', (error) => {
      console.error('Error sending transaction:', error)
    })

  return account
}

export { createAccount, ChatManager, UserManager }
