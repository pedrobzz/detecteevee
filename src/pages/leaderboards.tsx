/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image";
import React from "react";
import { useTRCP } from "../application/common/hooks/useTRCP";

/* import { Container } from "./styles"; */

const Leaderboards: React.FC = (): JSX.Element => {
  const trpc = useTRCP();
  const leaderboardsQuery = trpc.useQuery(["nameGuesser.getAllGames"]);
  const unknownPokemons = trpc.useQuery([
    "nameGuesser.getPokemonsByDifficulty",
  ]);
  return (
    <div className="text-white">
      <h1 className="text-4xl">NameGuesser</h1>
      <h3 className="text-2xl ">Top Games</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Points</th>
            <th className="px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardsQuery.data?.map(game => (
            <tr key={game.id}>
              <td className="border px-4 py-2">{game.playerName}</td>
              <td className="border px-4 py-2">{game.points}</td>
              <td className="border px-4 py-2">
                {Math.floor(game.gameTime / 1000)}.
                {Math.floor((game.gameTime % 1000) / 10)}s
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-2xl">Most Unknown Pokemons</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Ammount of Errors</th>
          </tr>
        </thead>
        <tbody>
          {unknownPokemons.data?.map(pokemon => (
            <tr key={pokemon.pokemon.id}>
              <td className="border px-4 py-2 w-[128px] h-[128px]">
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon.id}.png`}
                  height={128}
                  width={128}
                />
              </td>
              <td className="border px-4 py-2">{pokemon.pokemon.name}</td>
              <td className="border px-4 py-2">{pokemon.losts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboards;
