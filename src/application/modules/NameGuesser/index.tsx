/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image";

import React, { useCallback, useEffect, useState } from "react";
import { useTRCP } from "../../common/hooks/useTRCP";

/* import { Container } from "./styles"; */

const NameGuesser = (): JSX.Element => {
  const [guessed, setGuessed] = useState<number[]>([]);
  const getIdsWithoutRepeat = useCallback(
    (n: number, MAX: number): number[] => {
      const ids = Array.from(Array(n).keys()).reduce((acc, curr) => {
        let id = Math.floor(Math.random() * MAX);
        while (acc.includes(id) || guessed.includes(id)) {
          id = Math.floor(Math.random() * MAX);
        }
        acc.push(id);
        return acc;
      }, [] as number[]);
      return ids;
    },
    [guessed],
  );
  const [randomIds, setRandomIds] = useState<number[]>(
    getIdsWithoutRepeat(5, 151),
  );
  const [selected, setSelected] = useState<number>(
    Math.floor(Math.random() * 5),
  );
  const resetPokemons = useCallback(() => {
    setRandomIds(getIdsWithoutRepeat(5, 151));
    setSelected(Math.floor(Math.random() * 5));
  }, []);
  const trpc = useTRCP();

  const {
    data: pokemons,
    isLoading,
    isError,
    error,
  } = trpc.useQuery(
    ["pokemon.getMultiplePokemonById", { pokemonIds: randomIds }],
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
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemons[selected].id}.png`}
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
                  if (index === selected) {
                    setPoints(points + 1);
                    setGuessed(curr => [...curr, pokemons[index].id]);
                  } else {
                    setPoints(0);
                  }
                  resetPokemons();
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
