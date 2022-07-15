import { GetRandomPokemon } from "../use-cases/get-random-pokemon";
import { makePokemonClient } from "./makePokemonClient";

export const makeGetRandomPokemon = (): GetRandomPokemon => {
  return new GetRandomPokemon(makePokemonClient());
};
