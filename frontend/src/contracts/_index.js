import Web3 from 'web3'
import UserArtifact from './artifacts/UserManager.json'
import ChatArtifact from './artifacts/ChatManager.json'

const web3 = new Web3('ws://127.0.0.1:7545')
const networkId = await web3.eth.net.getId()

const getUserManagerContract = async () => {
  const deployedNetwork = UserArtifact.networks[networkId]
  if (!deployedNetwork) {
    throw new Error(`Contract not deployed USER-MANAGER on network ID ${networkId}`)
  }
  return new web3.eth.Contract(UserArtifact.abi, deployedNetwork.address)
}

const getChatManagerConstract = async () => {
  const deployedNetwork = ChatArtifact.networks[networkId]
  if (!deployedNetwork) {
    throw new Error(`Contract not deployed CHAT-MANAGER on network ID ${networkId}`)
  }
  return new web3.eth.Contract(ChatArtifact.abi, deployedNetwork.address)
}

const UserManagerContract = await getUserManagerContract()
const ChatManagerContract = await getChatManagerConstract()

export { web3, UserManagerContract, ChatManagerContract }
