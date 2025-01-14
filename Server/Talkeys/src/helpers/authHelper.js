const crypto = require('crypto');
exports.decrypt=function decrypt(encryptedData, key) {

    if (key.length !== 96) {
        throw new Error('Key must be exactly 96 characters long');
      }
    

      const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
    

      const encryptedText = encryptedData.slice(32);
    

      const encryptionKey = key.slice(0, 32);
    

      const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);

      let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
      decryptedData += decipher.final('utf8');
      return JSON.parse(decryptedData);
}