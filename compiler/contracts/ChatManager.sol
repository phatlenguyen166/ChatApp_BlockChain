// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserManager.sol";

contract ChatManager {

  UserManager userManager;

  enum MessageType {
    TEXT, IMAGE, VIDEO, AUDIO
  }

  struct Message {
    address sender;
    address receiver;
    string hashForSender;
    string hashForReceiver;
    MessageType msgType;
    uint256 timestamp;
  }

  mapping(bytes32 => Message[]) public messages;

  constructor(address _userManagerAddress) {
    userManager = UserManager(_userManagerAddress);
  }

  event MessageSent(
    address indexed sender,
    address indexed receiver,
    string hashForSender,
    string hashForReceiver,
    MessageType msgType,
    uint256 timestamp
  );

  function _createMessage(address _receiver, string memory _hashForSender, string memory _hashForReceiver, MessageType _msgType) internal view returns (Message memory) {
    return Message({
      sender: msg.sender,
      receiver: _receiver,
      hashForSender: _hashForSender,
      hashForReceiver: _hashForReceiver,
      msgType: _msgType,
      timestamp: block.timestamp
    });
  }

  function _getChatCode(address _user1, address _user2) internal pure returns (bytes32) {
    if (_user1 < _user2) return keccak256(abi.encodePacked(_user1, _user2));
    else return keccak256(abi.encodePacked(_user2, _user1));
  }

  function sendMessage(address _friend, string memory _hashForSender, string memory _hashForReceiver, MessageType _msgType) public {
    require(userManager.isFriend(msg.sender, _friend), "Need to be friend first");
    bytes32 chatCode = _getChatCode(msg.sender, _friend);
    Message memory newMsg = _createMessage(_friend, _hashForSender, _hashForReceiver, _msgType);
    messages[chatCode].push(newMsg);
    emit MessageSent(msg.sender, _friend, _hashForSender, _hashForReceiver, _msgType, block.timestamp);
  }

  function getMessage(address _friend) public view returns (Message[] memory) {
    require(userManager.isFriend(msg.sender, _friend), "Need to be friend first");
    bytes32 chatCode = _getChatCode(msg.sender, _friend);
    return messages[chatCode];
  }

  function getLastMessage(address _friend) public view returns (Message memory) {
    require(userManager.isFriend(msg.sender, _friend), "Need to be friend first");
    bytes32 chatCode = _getChatCode(msg.sender, _friend);
    require(messages[chatCode].length > 0, "No messages found");
    return messages[chatCode][messages[chatCode].length - 1];
  }
}

