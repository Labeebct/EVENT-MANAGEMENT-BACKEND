const randomNumbers = ['1', '2', '4', '6', '8', '9', 'A', 'B', 'C', 'D','4','2','7'];

const otpGen = () => {
    const otpChars = [];
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * randomNumbers.length);
        otpChars.push(randomNumbers[randomIndex]);
    }
    const otp = otpChars.join('');
    return otp;
};

module.exports = otpGen;
