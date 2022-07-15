/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pokemon, PokemonClient } from "pokenode-ts";

export class GetRandomPokemon {
  constructor(private readonly pokemonRepository: PokemonClient) {}

  async execute({
    MAX_INDEX,
    totalPokemons,
  }: {
    [key: string]: number;
  }): Promise<Pick<Pokemon, "name" | "id" | "sprites">[]> {
    if (MAX_INDEX < totalPokemons) {
      throw new Error("Max index is less than total pokemons");
    }
    const randomIndexes = this.getRandomNumber(1, MAX_INDEX, totalPokemons);
    const pokemons: Pokemon[] = await Promise.all(
      randomIndexes.map(async (r: number) => {
        return await this.pokemonRepository.getPokemonById(r);
      }),
    );
    return pokemons.map(pokemon => {
      const { name, id, sprites } = pokemon;
      return { name, id, sprites };
    });
  }

  getRandomNumber(min: number, max: number): number;
  getRandomNumber(min: number, max: number, n: number): number[];
  getRandomNumber(min: number, max: number, n?: number): number | number[] {
    if (n) {
      const randomIndexes: number[] = new Array(n)
        .fill(0)
        .reduce((acc, curr) => {
          let randomIndex = this.getRandomNumber(min, max);
          while (acc.includes(randomIndex)) {
            randomIndex = this.getRandomNumber(min, max);
          }
          acc.push(randomIndex);
          return acc;
        }, []);
      return randomIndexes;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
