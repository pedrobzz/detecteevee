import type { Pokemon, PokemonClient } from "pokenode-ts";

export class GetPokemon {
  constructor(private readonly pokemonRepository: PokemonClient) {}
  async getPokemonById({
    pokemonId,
  }: {
    pokemonId: number;
  }): Promise<Pick<Pokemon, "name" | "id" | "sprites">> {
    const pokemon = await this.pokemonRepository.getPokemonById(pokemonId);
    const { name, id, sprites } = pokemon;
    return { name, id, sprites };
  }

  async getMultiplePokemonById({
    pokemonIds,
  }: {
    pokemonIds: number[];
  }): Promise<Pick<Pokemon, "name" | "id" | "sprites">[]> {
    const pokemons = await Promise.all(
      pokemonIds.map(async pokemonId => {
        return await this.pokemonRepository.getPokemonById(pokemonId);
      }),
    );
    return pokemons.map(pokemon => {
      const { name, id, sprites } = pokemon;
      return { name, id, sprites };
    });
  }
}
