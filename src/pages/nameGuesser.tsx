/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";

/* import { Container } from "./styles"; */
import NameGuesser from "../application/modules/NameGuesser";

const NameGuesserPage: React.FC = (): JSX.Element => {
  // const [name, setName] = useState("");
  // const ctx = useContext(AppContext);
  const [gameState, setGameState] = useState<
    "playing" | "lost" | "win" | "start"
  >("start");
  const [points, setPoints] = useState(0);
  const retry = () => {
    setGameState("playing");
    setPoints(0);
  };
  return (
    <div className="flex items-center flex-col gap-8">
      <h1 className="text-5xl text-slate-200">Guess the Pokemon</h1>
      <div>
        {gameState === "playing" ? (
          <NameGuesser
            onLose={points => {
              setGameState("lost");
              setPoints(points);
            }}
            onWin={points => {
              setGameState("win");
              setPoints(points);
            }}
          />
        ) : gameState === "lost" ? (
          <div>
            <h2 className="text-white">You lost!</h2>
            <h3 className="text-white">Points: {points}</h3>
            <button
              className="text-white border-white border-2 px-2 rounded"
              onClick={retry}
            >
              Retry
            </button>
          </div>
        ) : gameState === "win" ? (
          <div>
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
          <div>
            <button
              onClick={() => setGameState("playing")}
              className="text-white border-white border-2 px-2 rounded"
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
