/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image";

import React, { useCallback, useReducer, useState } from "react";
import { useTRCP } from "../../common/hooks/useTRCP";
import { NameGuesserGameState } from "../../domain/game-states";

/* import { Container } from "./styles"; */

const gameDataReducer = (
  state: NameGuesserGameState,
  action:
    | {
        type: "rightGuess";
        payload: {
          guess: number;
        };
      }
    | {
        type: "win";
        payload: {
          onWin: (data: NameGuesserGameState) => void;
        };
      }
    | {
        type: "lost";
        payload: {
          onLost: (data: NameGuesserGameState) => void;
          lostOn: number;
        };
      },
) => {
  let newState: NameGuesserGameState;
  switch (action.type) {
    case "rightGuess":
      const { guess } = action.payload;
      console.log("right guess");
      return {
        ...state,
        points: state.points + 1,
        guessed: [...state.guessed, guess],
      };
    case "win":
      const { onWin } = action.payload;
      newState = {
        ...state,
        state: "win",
        points: state.points + 1,
        gameTime: Date.now() - state.startTime,
      };
      onWin(newState);
      return newState;
    case "lost":
      const { onLost, lostOn } = action.payload;
      newState = {
        ...state,
        state: "lost",
        lostOn,
        gameTime: Date.now() - state.startTime,
      };
      onLost(newState);
      return newState;
    default:
      return state;
  }
};

const MAX_POKEMONS = 151;
const NameGuesser = ({
  onLost,
  onWin,
}: {
  onLost: (state: NameGuesserGameState) => void;
  onWin: (state: NameGuesserGameState) => void;
}): JSX.Element => {
  const [{ points, guessed }, dispatch] = useReducer(gameDataReducer, {
    startTime: Date.now(),
    gameTime: 0,
    points: 0,
    state: "playing",
    guessed: [],
  });
  const getIdsWithoutRepeat = useCallback(
    (n = 4, ignore?: number): { current: number; ids: number[] } => {
      const current = (() => {
        let id = Math.floor(Math.random() * MAX_POKEMONS) + 1;
        while (guessed.includes(id) || id === ignore) {
          id = Math.floor(Math.random() * MAX_POKEMONS) + 1;
        }
        return id;
      })();
      const ids = Array.from(Array(n).keys()).reduce((acc, curr) => {
        let id = Math.floor(Math.random() * MAX_POKEMONS) + 1;
        while (acc.includes(id) || id === current) {
          id = Math.floor(Math.random() * MAX_POKEMONS) + 1;
        }
        acc.push(id);
        return acc;
      }, [] as number[]);
      const shuffledIds = [...ids, current].sort(() => Math.random() - 0.5);
      return { current, ids: shuffledIds };
    },
    [guessed],
  );
  const [selected, setSelected] = useState<{ current: number; ids: number[] }>(
    getIdsWithoutRepeat(),
  );

  const trpc = useTRCP();
  const resetPokemons = useCallback(() => {
    const newSelected = getIdsWithoutRepeat(4, selected.current);
    setSelected(newSelected);
  }, [selected]);

  const {
    data: pokemons,
    isLoading,
    isError,
    error,
  } = trpc.useQuery(
    ["pokemon.getMultiplePokemonById", { pokemonIds: selected.ids }],
    {
      refetchOnWindowFocus: false,
      onError: resetPokemons,
    },
  );
  if (isError) {
    return <div>Unexpected Error Happened. {error.message}</div>;
  }
  return (
    <div className="flex flex-col items-center gap-10">
      <h3 className="text-white">Points: {points}</h3>
      {isLoading && <>Loading</>}
      {!isLoading && pokemons && (
        <>
          <div className="flex flex-col items-center border-purple-900 border-2 rounded-xl p-4 w-fit">
            <div className="m-[-50px]">
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected.current}.png`}
                height={256}
                width={256}
                className=""
              />
            </div>
          </div>
          <div className="flex gap-10">
            {pokemons.map((pokemon, index) => (
              <button
                key={pokemon.id}
                className={`flex items-center justify-center border-purple-900 border-2 rounded-xl p-4 cursor-pointer text-white`}
                onClick={() => {
                  if (pokemons[index].id === selected.current) {
                    if (points + 1 === MAX_POKEMONS) {
                      return dispatch({
                        type: "win",
                        payload: { onWin: onWin },
                      });
                    }
                    resetPokemons();
                    return dispatch({
                      type: "rightGuess",
                      payload: { guess: pokemons[index].id },
                    });
                  } else {
                    return dispatch({
                      type: "lost",
                      payload: {
                        onLost: onLost,
                        lostOn: pokemons[index].id,
                      },
                    });
                  }
                }}
              >
                {pokemon.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              console.log(pokemons);
            }}
            className="text-white"
          >
            Log Pokemons
          </button>
        </>
      )}
    </div>
  );
};

export default NameGuesser;
