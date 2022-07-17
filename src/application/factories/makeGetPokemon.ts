import { GetPokemon } from "../use-cases/get-pokemon";
import { makePokemonClient } from "./makePokemonClient";
import { makePokemonRepository } from "./repositories";

export const makeGetPokemon = (): GetPokemon => {
  const pokemonClient = makePokemonClient();
  const pokemonRepository = makePokemonRepository();
  return new GetPokemon(pokemonClient, pokemonRepository);
};
