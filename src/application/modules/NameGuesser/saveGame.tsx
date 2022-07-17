/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useTRCP } from "../../common/hooks/useTRCP";
import { NameGuesserGameState } from "../../domain/game-states";

/* import { Container } from "./styles"; */

const SaveGameNameGuesser = ({
  gameData,
  state,
}: {
  gameData: NameGuesserGameState;
  state: "win" | "lost";
}): JSX.Element => {
  const { gameTime, points, guessed, lostOn, startTime } = gameData;
  const [name, setName] = useState("");
  let nameTimeout: NodeJS.Timeout;
  const trpc = useTRCP();
  const { mutate: gameMutation } = trpc.useMutation(["nameGuesser.addGame"]);
  const [saved, setSaved] = useState(false);
  return (
    <div>
      {saved === false ? (
        <>
          <h3 className="text-white text-2xl mb-5">
            Do you want to save your score?
          </h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              gameMutation({ ...gameData, playerName: name });
              setSaved(true);
            }}
            className="flex flex-col gap-5"
          >
            <input
              type="text"
              placeholder="your name"
              className="bg-transparent border-transparent border-b-violet-200 border-2 text-white"
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
              required
            />
            <button
              type="submit"
              className="bg-violet-200 border-violet-200 border-2"
            >
              Save
            </button>
          </form>
        </>
      ) : (
        <h3 className="text-green-300 text-2xl">Game Saved!</h3>
      )}
    </div>
  );
};

export default SaveGameNameGuesser;
