/* eslint-disable no-undef */
const UserManager = artifacts.require('UserManager')
const ChatManager = artifacts.require('ChatManager')

module.exports = function (deployer) {
  return deployer.deploy(UserManager).then(() => {
    console.log('User: ' + UserManager.address)
    return Promise.all([deployer.deploy(ChatManager, UserManager.address)])
  })
}
