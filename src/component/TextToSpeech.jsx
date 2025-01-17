import React, { useState, useEffect } from "react";

const TextToSpeech = ({ text = "" }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    setUtterance(u);
    return () => {
      synth.cancel();
    };
  }, [text]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    // if (isPaused) {
    //   synth.resume();
    // }

    synth.speak(utterance);
    // setUtterance(null);
    // setIsPaused(true);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;

    synth.pause();

    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel();

    setIsPaused(false);
  };

  useEffect(() => {
    if (utterance) {
      document.getElementById("myButton").click();
    }
  }, [utterance]);

  return (
    <div>
      <button id="myButton" onClick={handlePlay}>
        {isPaused ? "Resume" : "Play"}
      </button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};

export default TextToSpeech;
