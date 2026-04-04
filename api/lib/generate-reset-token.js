import CryptoJS from "crypto-js";
export const generateResetToken = () =>{
  const randomString = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const token = CryptoJS.SHA256(randomString).toString(CryptoJS.enc.Hex);

  return token;
}
