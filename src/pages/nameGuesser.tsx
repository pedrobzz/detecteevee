/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";

/* import { Container } from "./styles"; */
import NameGuesser, { GameDataState } from "../application/modules/NameGuesser";

const NameGuesserPage: React.FC = (): JSX.Element => {
  // const ctx = useContext(AppContext);
  const [name, setName] = useState("");
  let nameTimeout: NodeJS.Timeout;
  const [state, setGameState] = useState<
    "playing" | "win" | "lost" | "waiting"
  >("waiting");
  const [{ gameTime, points, lostOn, guessed }, setGameData] =
    useState<GameDataState>({
      gameTime: 0,
      guessed: [],
      points: 0,
      startTime: 0,
      state: "playing",
      lostOn: undefined,
    });
  const retry = () => {
    setGameData({
      gameTime: 0,
      guessed: [],
      points: 0,
      startTime: 0,
      state: "playing",
      lostOn: undefined,
    });
    setGameState("playing");
  };
  return (
    <div className="flex items-center flex-col gap-8">
      <h1 className="text-5xl text-slate-200">Guess the Pokemon</h1>
      <div>
        {state === "playing" ? (
          <NameGuesser
            onLost={gameData => {
              setGameData(gameData);
              setGameState("lost");
            }}
            onWin={gameData => {
              setGameData(gameData);
              setGameState("win");
            }}
          />
        ) : state === "lost" ? (
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-white text-3xl">You lost!</h2>
            <div>
              <h3 className="text-white text-2xl">
                Pokemon&apos;s Guessed: {points}
              </h3>
              <h3 className="text-white text-2xl">
                Game Time: {Math.floor(gameTime / 1000)}.
                {Math.floor((gameTime % 1000) / 10)}s
              </h3>
            </div>

            <button
              className="text-white border-white border-2 px-2 rounded"
              onClick={retry}
            >
              Retry
            </button>
          </div>
        ) : state === "win" ? (
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-white">You win!</h2>
            <h3 className="text-white">Points: {points}</h3>
            <button
              className="text-white border-white border-2 px-2 rounded"
              onClick={retry}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-white text-xl">
              My name is:{" "}
              <input
                type="text"
                placeholder="your name"
                className="bg-transparent border-transparent border-b-violet-200 border-2"
                onChange={e => {
                  if (!e.target.value) {
                    return setName("");
                  }
                  clearTimeout(nameTimeout);
                  nameTimeout = setTimeout(() => {
                    console.log("change");
                    setName(e.target.value);
                  }, 150);
                }}
              />
              !
            </h2>
            <button
              onClick={() => setGameState("playing")}
              className="text-white border-white border-2 px-2 rounded disabled:border-slate-500"
              disabled={!name}
            >
              Start
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NameGuesserPage;
