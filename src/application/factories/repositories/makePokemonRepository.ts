import { PokemonRepositoryModel } from "../../domain/repositories/pokemonRepository";
import { PrismaPokemonRepository } from "../../infra/repositories/prismaPokemonRepository";

export const makePokemonRepository = (): PokemonRepositoryModel => {
  return new PrismaPokemonRepository();
};
