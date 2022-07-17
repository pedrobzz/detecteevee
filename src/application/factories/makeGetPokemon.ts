import { GetPokemon } from "../use-cases/get-pokemon";
import { makePokemonClient } from "./makePokemonClient";

export const makeGetPokemon = (): GetPokemon => {
  const pokemonClient = makePokemonClient();
  return new GetPokemon(pokemonClient);
};
