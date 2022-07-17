import { Pokemon } from "@prisma/client";

export interface PokemonRepositoryModel {
  getPokemonById(pokemonId: number): Promise<Pokemon | null>;
  getMultiplePokemonById(pokemonIds: number[]): Promise<Pokemon[] | null>;
  addPokemonToDatabase(pokemon: Pokemon): Promise<Pokemon>;
  addMultiplePokemonToDatabase(pokemons: Pokemon[]): Promise<Pokemon[]>;
  getAllPokemons(): Promise<Pokemon[]>;
  resetPokemons(): Promise<void>;
}
