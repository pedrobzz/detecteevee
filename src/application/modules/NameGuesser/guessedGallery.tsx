/* eslint-disable @typescript-eslint/no-unused-vars */

import { Pokemon } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { useTRCP } from "../../common/hooks/useTRCP";

/* import { Container } from "./styles"; */

const PokemonGalleryObject = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <div>
      <div>
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
          height={128}
          width={128}
        />
      </div>
    </div>
  );
};

const NameGuessedGallery = ({
  guessed,
}: {
  guessed: number[];
}): JSX.Element => {
  const trpc = useTRCP();
  const pokemonQuery = trpc.useQuery([
    "pokemon.getMultiplePokemonById",
    { pokemonIds: guessed },
  ]);
  return (
    <div className="grid grid-flow-row grid-cols-12 max-h-96 overflow-y-auto ">
      {pokemonQuery.data
        ?.sort((a, b) => a.id - b.id)
        .map(pokemon => (
          <PokemonGalleryObject pokemon={pokemon} key={pokemon.id} />
        ))}
    </div>
  );
};

export default NameGuessedGallery;
