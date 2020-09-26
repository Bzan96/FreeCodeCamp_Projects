import React, { useEffect, useRef, useState } from "react";
import { drumElements } from "./drumElements";

const DrumMachine = () => {
  const drumsRef = useRef([]);
  const [lastClickedDrum, setLastClickedDrum] = useState("");

  useEffect(() => {
    drumsRef.current = drumsRef.current.slice(0, drumElements.length);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown");
  }, []);

  const handleClick = (index, id) => {
    drumsRef.current[index]
      .play()
      .then(() => console.log("played"))
      .catch((error) => console.log(error));
    drumsRef.current[index].currentTime = 0;
    setLastClickedDrum(id);
  };

  const handleKeyDown = (event) => {
    const drums = drumElements.map((drum) => drum.key.toLowerCase());
    if (drums.includes(event.key)) {
      const index = drums.indexOf(event.key);
      drumsRef.current[index]
        .play()
        .then(() => console.log("played"))
        .catch((error) => console.log(error));
      drumsRef.current[index].currentTime = 0;
      setLastClickedDrum(drumElements[index].id);
    }
  };

  return (
    <div id="drum-machine">
      <h2 id="display">{lastClickedDrum}</h2>
      {drumElements &&
        drumElements.map((element, index) => (
          <div
            key={element.id}
            className="drum-pad"
            id={`${element.key}-drum`}
            onClick={() => handleClick(index, element.id)}
          >
            {element.key}
            <audio
              src={element.url}
              className="clip"
              id={element.key}
              ref={(ref) => (drumsRef.current[index] = ref)}
            />
          </div>
        ))}
    </div>
  );
};

export default DrumMachine;
