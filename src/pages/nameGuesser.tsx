/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image";
import React, { useState } from "react";
import { useTRCP } from "../application/common/hooks/useTRCP";
import { NameGuesserGameState } from "../application/domain/game-states";

/* import { Container } from "./styles"; */
import NameGuesser from "../application/modules/NameGuesser";
import NameGuessedGallery from "../application/modules/NameGuesser/guessedGallery";
import SaveGameNameGuesser from "../application/modules/NameGuesser/saveGame";

const NameGuesserPage: React.FC = (): JSX.Element => {
  // const ctx = useContext(AppContext);

  const [state, setGameState] = useState<
    "playing" | "win" | "lost" | "waiting"
  >("waiting");
  const [gameData, setGameData] = useState<NameGuesserGameState>({
    gameTime: 0,
    guessed: [],
    points: 0,
    startTime: 0,
    state: "playing",
    lostOn: 0,
  });
  const { gameTime, points, lostOn, guessed } = gameData;
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
  const trpc = useTRCP();
  const lostPokemonQuery = trpc.useQuery([
    "pokemon.getPokemonById",
    { pokemonId: lostOn as number },
  ]);
  return (
    <div className="flex items-center flex-col gap-8">
      <h1 className="text-5xl text-slate-200 text-center">Guess the Pokemon</h1>
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
            <h2 className="text-red-300 text-3xl">
              You lost!{" "}
              <button className="text-blue-300" onClick={retry}>
                Try Again!
              </button>
            </h2>
            <h3 className="text-3xl text-white">Statistics: </h3>
            <div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between gap-10">
                  <h3 className="text-white text-2xl  border-b-2 border-b-slate-50">
                    Pokemon&apos;s Guessed: {points}
                  </h3>
                  <h3 className="text-green-200 text-2xl  ">
                    {Math.floor(gameTime / 1000)}.
                    {Math.floor((gameTime % 1000) / 100)}s
                  </h3>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-white text-xl">Lost On:</h3>
                  <div className="flex gap-5">
                    <div className="m-[-25px]">
                      <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${gameData.lostOn}.png`}
                        height={128}
                        width={128}
                      />
                    </div>
                    <h1 className="text-white text-lg">
                      {lostPokemonQuery.data?.name}
                    </h1>
                  </div>
                </div>
                <SaveGameNameGuesser gameData={gameData} state="lost" />
                <NameGuessedGallery guessed={guessed} />
              </div>
            </div>
          </div>
        ) : state === "win" ? (
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-green-300 text-3xl">
              You Won!{" "}
              <button className="text-blue-300" onClick={retry}>
                Try Again!
              </button>
            </h2>
            <h3 className="text-3xl text-white">Statistics: </h3>
            <div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between gap-10">
                  <h3 className="text-white  border-b-2 border-b-slate-50 md:text-2xl lg:text-3xl">
                    Pokemon&apos;s Guessed: {points}
                  </h3>
                  <h3 className="text-green-200 text-2xl  ">
                    {Math.floor(gameTime / 1000)}.
                    {Math.floor((gameTime % 1000) / 100)}s
                  </h3>
                </div>
                <SaveGameNameGuesser gameData={gameData} state="win" />
                <NameGuessedGallery guessed={guessed} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={() => setGameState("playing")}
              className="text-white border-white border-2 px-2 rounded disabled:border-slate-500"
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
