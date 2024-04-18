const otpGenerator = require('otp-generator')

const otpGen = () => {
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: true, lowerCaseAlphabets: false, specialChars: false });
    return otp
}

module.exports = otpGen