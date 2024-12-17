// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserManager {
  struct User {
    string username;
    address userAddress;
    string publicKey;
    uint256 timestamp;
  }

  User[] users;
  mapping (address => bool) public isUser;
  mapping (address => User) public user;
  mapping (address => mapping(address => bool)) public isFriend;
  mapping (address => User[]) public friendList;

  event UserAdded(address indexed userAddress, string username);
  event FriendAdded(address indexed userAddress, address indexed friendAddress, string username);

  function addUser(string memory _username, string memory _publicKey) public {
    require(isUser[msg.sender] == false, "User already exists");
    require(isUniqueUsername(_username), "Username used already");
    user[msg.sender] = User({
      username: _username,
      publicKey: _publicKey,
      userAddress: msg.sender,
      timestamp: block.timestamp 
    });
    users.push(user[msg.sender]);
    isUser[msg.sender] = true;
    emit UserAdded(msg.sender, _username);
  }

  function getUserFromAddress(address _user) public view returns (User memory) {
    require(isUser[_user], "User not exist");
    return user[_user];
  }

  function getUserList() public view returns (User[] memory) {
    return users;
  }

  function isAnUser() public view returns (bool) {
    return isUser[msg.sender];
  }

  function isUniqueUsername(string memory _username) public view returns (bool) {
    for (uint256 index = 0; index < users.length; index++) {
      if (keccak256(bytes(users[index].username)) == keccak256(bytes(_username))) {
        return false;
      }
    }
    return true;
  }

  function isFriendRelationship(address _user) public view returns (bool) {
    require(isUser[msg.sender], "Create an account first!!!");
    require(isUser[_user], "Your friend not exist");
    require(msg.sender != _user, "User can not be friend with themself");
    return isFriend[msg.sender][_user];
  }

  function getFriendList() public view returns (User[] memory) {
    require(isUser[msg.sender], "User not exist");
    return friendList[msg.sender];
  }

  function addFriend(address _user) public {
    require(isUser[msg.sender], "Create an account first");
    require(isUser[_user], "User not exist");
    require(msg.sender != _user, "User cannot make friend with themself");
    require(!isFriend[msg.sender][_user], "This user already friend");
    
    friendList[msg.sender].push(getUserFromAddress(_user));
    friendList[_user].push(getUserFromAddress(msg.sender));
    isFriend[msg.sender][_user] = true;
    isFriend[_user][msg.sender] = true;

    emit FriendAdded(msg.sender, _user, user[msg.sender].username);
  }
  
}