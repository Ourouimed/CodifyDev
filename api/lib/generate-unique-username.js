import User from "../models/User.js";

export const generateUniqueUsername = async (baseName)=>{
  let username = baseName;
  let exists = await User.findOne({ username });
  
  let counter = 1;
  while (exists) {
    username = `${baseName}${counter}`;
    exists = await User.findOne({ username });
    counter++;
  }
  
  return username;
}