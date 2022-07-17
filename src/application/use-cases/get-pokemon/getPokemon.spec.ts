import { makePokemonClient } from "../../factories";
import { describe, it, expect } from "@jest/globals";
import { GetPokemon } from "./getPokemon";
import { makePokemonRepository } from "../../factories/repositories";

const makeSUT = () => {
  const sut = new GetPokemon(makePokemonClient(), makePokemonRepository());
  return { sut };
};

describe("UseCase - GetPokemon", () => {
  it("Should be able to return a Pikachu", async () => {
    const { sut } = makeSUT();
    const result = await sut.getPokemonById({ pokemonId: 25 });
    expect(result.name).toBe("pikachu");
  });

  it("Should be able to return a Pikachu, a Gloom and a Machop", async () => {
    const { sut } = makeSUT();
    const result = await sut.getMultiplePokemonById({
      pokemonIds: [25, 44, 66],
    });
    expect(result.length).toBe(3);
    expect(
      result.every(p => ["pikachu", "gloom", "machop"].includes(p.name)),
    ).toBe(true);
  });
});
