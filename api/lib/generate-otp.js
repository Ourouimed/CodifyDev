export const generateOtp = (digits = 6)=>{
    let otp = ''
    for (let i=0 ; i < digits;i++){
        otp += Math.ceil(Math.random() * 9)
    }
    return otp
}

console.log(generateOtp())