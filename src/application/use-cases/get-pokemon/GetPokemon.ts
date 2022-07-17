import type { Pokemon } from "@prisma/client";
import type { PokemonClient } from "pokenode-ts";
import type { PokemonRepositoryModel } from "../../domain/repositories/pokemonRepository";

export class GetPokemon {
  constructor(
    private readonly pokemonClient: PokemonClient,
    private readonly pokemonRepository: PokemonRepositoryModel,
  ) {}
  async getPokemonById({ pokemonId }: { pokemonId: number }): Promise<Pokemon> {
    let pokemon = await this.pokemonRepository.getPokemonById(pokemonId);
    if (!pokemon) {
      pokemon = await this.pokemonClient.getPokemonById(pokemonId);
      this.pokemonRepository.addPokemonToDatabase({
        id: pokemon.id,
        name: pokemon.name,
      });
    }
    const { name, id } = pokemon;
    return { name, id };
  }

  async getMultiplePokemonById({
    pokemonIds,
  }: {
    pokemonIds: number[];
  }): Promise<Pokemon[]> {
    let pokemons = await this.pokemonRepository.getMultiplePokemonById(
      pokemonIds,
    );

    if (!pokemons || pokemons.length != pokemonIds.length) {
      pokemons = await Promise.all(
        pokemonIds.map(async pokemonId => {
          return await this.getPokemonById({ pokemonId });
        }),
      );
    }
    return pokemons.map(pokemon => {
      const { name, id } = pokemon;
      return { name, id };
    });
  }
}
