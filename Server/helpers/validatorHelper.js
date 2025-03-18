module.exports.validateEmail=function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
module.exports.validateRollNumber=function validateRollNumber(rollNumber) {
    const rollNumberRegex = /^[0-9]{9}$/;
    return rollNumberRegex.test(rollNumber);
}
module.exports.validatePhoneNumber=function validatePhoneNumber(phoneNumber) {
    const phoneNumberRegex = /^[0-9]{10}$/;
    return phoneNumberRegex.test(phoneNumber);
}
module.exports.validateDriveYoutubeLink=function validateDriveYoutubeLink(link) {
   const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/.*|youtu\.be\/.*)$/;
    const driveRegex = /^https?:\/\/drive\.google\.com\/.*\/d\/.*$/;
    if (youtubeRegex.test(link) || driveRegex.test(link)) {
        return true;
    } else {
        return false;
    }
}