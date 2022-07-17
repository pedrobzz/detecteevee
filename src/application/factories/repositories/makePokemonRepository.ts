import { PokemonRepositoryModel } from "../../domain/repositories/pokemonRepository";
import { PrismaPokemonRepository } from "../../infra/repositories/PrismaPokemonRepository";

export const makePokemonRepository = (): PokemonRepositoryModel => {
  return new PrismaPokemonRepository();
};
