import React, { useEffect } from "react";

const TextToSpeech1 = () => {
  const msg = new SpeechSynthesisUtterance();
  msg.text =
    "Testing Dear User You Have Recieved On Your UPI QR Code. Https://Impsguru.Com";

  useEffect(() => {
    window.speechSynthesis.speak(msg);
  }, [msg]);

  return <div></div>;
};

export default TextToSpeech1;
