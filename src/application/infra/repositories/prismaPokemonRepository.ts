import type { Pokemon, PrismaClient } from "@prisma/client";

import { PokemonRepositoryModel } from "../../domain/repositories/pokemonRepository";
import { getPrismaClient } from "../../factories";

export class PrismaPokemonRepository implements PokemonRepositoryModel {
  client: PrismaClient;
  constructor() {
    this.client = getPrismaClient();
  }
  async getPokemonById(pokemonId: number): Promise<Pokemon | null> {
    const pokemon = await this.client.pokemon.findFirst({
      where: {
        id: pokemonId,
      },
    });
    return pokemon;
  }
  async getMultiplePokemonById(
    pokemonIds: number[],
  ): Promise<Pokemon[] | null> {
    const pokemon = await this.client.pokemon.findMany({
      where: {
        id: {
          in: pokemonIds,
        },
      },
    });
    return pokemon;
  }

  async addPokemonToDatabase(pokemon: Pokemon): Promise<Pokemon> {
    const newPokemon = await this.client.pokemon.create({
      data: pokemon,
    });
    return newPokemon;
  }

  async addMultiplePokemonToDatabase(pokemons: Pokemon[]): Promise<Pokemon[]> {
    await this.client.pokemon.createMany({
      data: pokemons,
    });
    return pokemons;
  }

  async getAllPokemons(): Promise<Pokemon[]> {
    const pokemons = await this.client.pokemon.findMany();
    return pokemons;
  }

  async resetPokemons(): Promise<void> {
    await this.client.pokemon.deleteMany({});
  }
}
