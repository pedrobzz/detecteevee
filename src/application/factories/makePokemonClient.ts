import { PokemonClient } from "pokenode-ts";

let pokemonClient: PokemonClient;

export const makePokemonClient = (): PokemonClient => {
  if (!pokemonClient) {
    pokemonClient = new PokemonClient();
  }
  return pokemonClient;
};
