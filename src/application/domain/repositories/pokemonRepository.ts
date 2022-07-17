import { Pokemon } from "@prisma/client";

export interface PokemonRepositoryModel {
  getPokemonById(pokemonId: number): Promise<Pokemon>;
  getMultiplePokemonById(pokemonIds: number[]): Promise<Pokemon[]>;
}
