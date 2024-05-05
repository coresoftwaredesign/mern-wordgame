import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import Keyboard from "./components/Keyboard";
import AppNavbar from "./components/AppNavbar";
import About from "./components/About";
import Guess from "./container/Guess";
import WordGame from "./container/WordGame";
import GameBoard from "./container/GameBoard";
import "./App.scss";

const API_URL = process.env.REACT_APP_WORDGAME_API_URI;

function getLocalDate() {
  // new Date() is UTC so we have to adjust it to local time
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date;
}

export default function App() {
  const [gamedate, setGamedate] = useState(getLocalDate());
  const [guesses, setGuesses] = useState([
    new Guess(""),
    new Guess(""),
    new Guess(""),
    new Guess(""),
    new Guess(""),
    new Guess(""),
  ]);
  const [currentGuess, setCurrentGuess] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const gameOver =
    currentGuess >= WordGame.NUM_GUESSES ||
    guesses.some((guess) => guess.isDone);

  // ref to outer div so we can set keyboard focus there
  const keyPressDiv = useRef(null);

  function getDateString(date) {
    return date.toISOString().split("T")[0];
  }

  function showToast(message) {
    toast(message, { className: "toast-msg" });
  }

  function resetGame() {
    setGuesses([
      new Guess(""),
      new Guess(""),
      new Guess(""),
      new Guess(""),
      new Guess(""),
      new Guess(""),
    ]);
    setCurrentGuess(0);
    // setGameOver(false);
    showToast("Game Reset");
    keyPressDiv.current.focus();
  }

  function randomGame() {
    // start date Jan 1, 2024, ~2315 target words
    const randomDate = new Date(2024, 0, 1);
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 2310));
    setGamedate(randomDate);
  }

  // async function pingApi() {
  //   try {
  //     const response = await fetch(
  //       `${API_URL}`
  //     );
  //     const answer = await response.json();
  //     console.log("pingApi: " + answer);
  //   } catch (err) {
  //     showToast("Error: " + err);
  //   }
  //   keyPressDiv.current.focus();
  // }

  async function getAnswer() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/word/${getDateString(gamedate)}`
      );
      const answer = await response.json();
      setIsLoading(false);
      showToast("Answer: " + answer.word);
    } catch (err) {
      showToast("Error: " + err);
    }
    keyPressDiv.current.focus();
  }

  function mergeGuess(guessResponse) {
    // merge new answer into state array
    const newGuesses = guesses.map((guess, i) => {
      if (i === currentGuess) {
        return guessResponse;
      } else {
        return guess;
      }
    });
    setGuesses(newGuesses);
  }

  function processValidationResponse(guessResponse) {
    // merge new answer into state array
    mergeGuess(guessResponse);

    if (guessResponse.isValid) {
      if (guessResponse.isDone) {
        // correct guess
        showToast(WordGame.gameOverResponse[currentGuess]);
      } else if (currentGuess >= WordGame.NUM_GUESSES - 1) {
        // game over
        showToast("Sorry, game over.");
      }
      setCurrentGuess(currentGuess + 1);
    } else {
      // invalid guess
      showToast(guessResponse.message);
    }
  }

  // map API response to Guess
  function mapValidationResponse(guessResponse) {
    // carry over guessText as it is not returned back by API
    const newGuess = new Guess(guesses[currentGuess].guessText);
    newGuess.isDone = guessResponse.isDone;
    newGuess.matchStatus = guessResponse.match;
    newGuess.isValid = guessResponse.isValid;
    if (guessResponse.message === undefined) {
      newGuess.message = "";
    } else {
      newGuess.message = guessResponse.message;
    }

    return newGuess;
  }

  async function submitGuess() {
    const guessText = guesses[currentGuess].guessText;
    if (guessText === null || guessText.length === 0) {
      showToast("Not enough letters");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/validate/${getDateString(gamedate)}/${guessText}`
      );
      const validationResponse = await response.json();
      setIsLoading(false);
      processValidationResponse(mapValidationResponse(validationResponse));
    } catch (err) {
      showToast("Opps: " + err.message);
    }
  }

  // About support

  function onAboutClick() {
    setShowAbout(true);
    keyPressDiv.current.focus();
  }

  function handleAboutClose() {
    setShowAbout(false);
  }

  // navbar support
  function onNavbarClick(event) {
    switch (event.target.id) {
      case "about":
        onAboutClick();
        break;
      case "random":
        randomGame();
        break;
      case "answer":
        getAnswer();
        break;
      case "reset":
        resetGame();
        break;
      default:
        console.log("unknown navbar action");
    }
  }

  function onNavbarDateChange(date) {
    setGamedate(date);
  }

  // keyboard support

  function mergeNewKey(guessText) {
    const newGuesses = guesses.map((guess, i) => {
      if (i === currentGuess) {
        return new Guess(guessText);
      } else {
        return guess;
      }
    });
    setGuesses(newGuesses);
  }

  function deleteKey() {
    const guessText = guesses[currentGuess].guessText;
    if (guessText.length > 0) {
      mergeNewKey(guessText.substring(0, guessText.length - 1));
    }
  }

  function appendKey(ch) {
    const guessText = guesses[currentGuess].guessText;
    if (guessText.length < WordGame.WORD_LENGTH && ch.match(/^[a-z]$/)) {
      mergeNewKey(guessText.concat(ch));
    }
  }

  function processNewKey(ch) {
    if (gameOver || isLoading) return;
    ch = ch.toLowerCase();
    if (ch === "enter") {
      submitGuess();
    } else if (ch === "delete" || ch === "backspace") {
      deleteKey();
    } else {
      appendKey(ch);
    }
  }

  // physical keyboard
  function handleKeyDown(event) {
    processNewKey(event.key);
  }

  // virtual keyboard
  function onKeyboardClick(ch) {
    processNewKey(ch);
  }

  // component load
  useEffect(() => {

    // wake up server container to reduce initial cold-start latency
    function pingServer() {
      fetch(`${API_URL}`)
        .then((response) => response.text()
          .then((txt) => console.log("ping server: " + txt)))
        .catch((err) => showToast("Error: " + err));
    }

    //focus input to div
    keyPressDiv.current.focus();
    pingServer();

  }, []);

  // keypress hack: implement onKeyDown event on outer "game-page" <div> by adding tabIndex={0}
  return (
    <>
      <AppNavbar
        onClick={onNavbarClick}
        gamedate={gamedate}
        onChange={onNavbarDateChange}
      />
      <About handleClose={handleAboutClose} show={showAbout} />
      <div
        className="game-page"
        ref={keyPressDiv}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-testid="game-page"
      >
        <Toaster />
        <GameBoard guesses={guesses} currentGuess={currentGuess} />
        <div>
          <Keyboard
            guesses={guesses}
            onClick={onKeyboardClick}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
