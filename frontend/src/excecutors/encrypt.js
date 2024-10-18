import forge from 'node-forge';

function generateRSAKeys() {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 1024 });
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
  return {
    messagePublicKey: publicKeyPem,
    messagePrivateKey: privateKeyPem,
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

function generateUniqueHash(username, password) {
  const data = `${username}:${password}`;
  const md = forge.md.sha256.create();
  md.update(data);
  return md.digest().toHex();
}

function encryptObject(object, hashKey) {
  const key = forge.util.createBuffer(hashKey).getBytes(16);
  const jsonString = JSON.stringify(object);
  const cipher = forge.cipher.createCipher('AES-CBC', key);
  const iv = forge.random.getBytesSync(16);

  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(jsonString));
  cipher.finish();

  const encryptedData = forge.util.encode64(cipher.output.getBytes());
  const encodedIV = forge.util.encode64(iv);

  return { encryptedData, iv: encodedIV };
}

function decryptObject(encryptedData, encodedIV, hashKey) {
  const key = forge.util.createBuffer(hashKey).getBytes(16);
  const iv = forge.util.decode64(encodedIV);
  const decipher = forge.cipher.createDecipher('AES-CBC', key);

  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedData)));
  const success = decipher.finish();

  if (success) {
      const decryptedObject = JSON.parse(decipher.output.toString());
      return decryptedObject;
  } else {
      throw new Error('Decryption failed');
  }
}

// function 

export default {
  generateRSAKeys,
  encryptData,
  decryptData,
}