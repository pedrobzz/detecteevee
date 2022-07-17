/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image";

import React, { useCallback, useState } from "react";
import { useTRCP } from "../../common/hooks/useTRCP";

/* import { Container } from "./styles"; */

const MAX_POKEMONS = 151;
const NameGuesser = ({
  onLose,
  onWin,
}: {
  onLose: (points: number) => void;
  onWin: (points: number) => void;
}): JSX.Element => {
  const [guessed, setGuessed] = useState<number[]>([]);
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
    setGuessed(curr => [...curr, selected.current]);
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
  const [points, setPoints] = useState(0);
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
                      return onWin(points + 1);
                    }
                    resetPokemons();
                    setPoints(points + 1);
                  } else {
                    onLose(points);
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
