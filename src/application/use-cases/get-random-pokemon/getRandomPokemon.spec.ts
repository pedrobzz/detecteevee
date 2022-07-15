/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from "@jest/globals";
import { GetRandomPokemon } from "./getRandomPokemon";
import { makePokemonClient } from "../../factories/makePokemonClient";

const makeSUT = (): GetRandomPokemon => {
  return new GetRandomPokemon(makePokemonClient());
};

describe("UseCase - GetRandomPokemon", () => {
  it("Should be able to return 1 random Pokemons without repeating", async () => {
    const sut = makeSUT();
    const totalPokemons = 10;
    const MAX_INDEX = 10;
    const result = await sut.execute({
      MAX_INDEX,
      totalPokemons,
    });
    const ids = new Set(result.map(pokemon => pokemon.id));
    expect(result.length).toBe(totalPokemons);
    expect(ids.size).toBe(totalPokemons);
  });
  it("Should be able to return N random Pokemons without repeating", async () => {
    const sut = makeSUT();
    const totalPokemons = 10;
    const MAX_INDEX = 10;
    const result = await sut.execute({
      MAX_INDEX,
      totalPokemons,
    });
    const ids = new Set(result.map(pokemon => pokemon.id));
    expect(result.length).toBe(totalPokemons);
    expect(ids.size).toBe(totalPokemons);
  });
});
