import { makePokemonClient } from "../../factories";
import { describe, it, expect } from "@jest/globals";
import { GetPokemon } from "./getPokemon";

const makeSUT = () => {
  const sut = new GetPokemon(makePokemonClient());
  return { sut };
};

describe("UseCase - GetPokemon", () => {
  it("Should be able to return a Pikachu", async () => {
    const { sut } = makeSUT();
    const result = await sut.getPokemonById({ pokemonId: 25 });
    expect(result.name).toBe("pikachu");
    expect(result.sprites).toBeDefined();
  });

  it("Should be able to return a Pikachu, a Rayquaza and a Snorlax", async () => {
    const { sut } = makeSUT();
    const result = await sut.getMultiplePokemonById({
      pokemonIds: [25, 384, 143],
    });
    expect(result.length).toBe(3);
    expect(result[0].name).toBe("pikachu");
    expect(result[1].name).toBe("rayquaza");
    expect(result[2].name).toBe("snorlax");
  });
});
