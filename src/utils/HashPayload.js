import CryptoJS from 'crypto-js';
import ApiEndPoints from '../network/ApiEndPoints.js';

// let getOtpHash;

const HashPayload = (payload, endPoint) => {
  // console.log("Entered HashPayload with Endpoint", endPoint)
  if(payload === ''){
    return payload
  }else{
    
  // Preparing string
  const sorted_object = sortObjectKeysAlphabetically(payload)
  const processed_keys = Object.values(sorted_object).join("")
  const raw_data = processed_keys + process.env.REACT_APP_HASH_KEY;
  
  // Generating Hash
  const hashPwd = CryptoJS.SHA256(raw_data).toString(CryptoJS.enc.Hex);
  // if (endPoint === ApiEndPoints.AEPS_INITIATE){
  //   console.log("Initiate Signup endpoint", endPoint)
  //   getOtpHash = hashPwd;
  //   console.log("getOTPHash", getOtpHash)
  // }
  if (!endPoint === ApiEndPoints.AEPS_VALIDATE){
  //   console.log("Validate Signup endpoint", endPoint)
  //   payload.hash = getOtpHash;
  //   console.log("payload hash in Validate Signup", payload.hash);
  // }else{
    payload.hash = hashPwd;
  //   console.log("This is your other requests hash", payload.hash);
  }
  return payload;
  }
}

const sortObjectKeysAlphabetically = (obj) => {
    return Object.keys(obj)
      .sort()
      .reduce((sortedObj, key) => {
        sortedObj[key] = obj[key]; 
        return sortedObj;
      }, {});
  }

export default HashPayload;
