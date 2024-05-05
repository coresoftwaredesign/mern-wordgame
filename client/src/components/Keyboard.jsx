import React from "react";
import "./Keyboard.css";
import Spinner from "./Spinner";
import Backspace from "./Backspace";

export default function Keyboard({ guesses, onClick, isLoading }) {
  const keyStateMap = new Map([
    [1, "unmatched"],
    [2, "in-word"],
    [3, "matched"],
  ]);

  function Key({ ch }) {
    let { state, position } = getKeyState(ch);
    // data-testid={"key-" + ch}
    return (
      <button
        className={"key " + state}
        data-key={ch}
        onClick={() => onClick(ch.toLowerCase())}
        style={{ animationDelay: position / 5.0 + "s" }}
      >
        {ch}
      </button>
    );
  }

  const getKeyState = (ch) => {
    let maxState = 0;
    let position = 0;
    guesses.forEach((guess) => {
      if (guess) {
        let pos = guess.guessText.indexOf(ch.toLowerCase());
        if (pos !== -1) {
          if (maxState < guess.matchStatus[pos]) {
            maxState = guess.matchStatus[pos];
            position = pos;
          }
        }
      }
    });
    return { state: keyStateMap.get(maxState), position: position };
  };

  return (
    <div className="keyboard">
      <Key ch="Q" />
      <Key ch="W" />
      <Key ch="E" />
      <Key ch="R" />
      <Key ch="T" />
      <Key ch="Y" />
      <Key ch="U" />
      <Key ch="I" />
      <Key ch="O" />
      <Key ch="P" />
      <div className="space"></div>
      <Key ch="A" />
      <Key ch="S" />
      <Key ch="D" />
      <Key ch="F" />
      <Key ch="G" />
      <Key ch="H" />
      <Key ch="J" />
      <Key ch="K" />
      <Key ch="L" />
      <div className="space"></div>
      <button
        data-key="enter"
        data-testid="enter-key"
        className="key large"
        onClick={() => onClick("enter")}
      >
        {isLoading ? <Spinner /> : "Enter"}
      </button>
      <Key ch="Z" />
      <Key ch="X" />
      <Key ch="C" />
      <Key ch="V" />
      <Key ch="B" />
      <Key ch="N" />
      <Key ch="M" />
      <button
        data-key="delete"
        data-testid="delete-key"
        className="key large"
        onClick={() => onClick("delete")}
      >
        <Backspace />
      </button>
    </div>
  );
}
