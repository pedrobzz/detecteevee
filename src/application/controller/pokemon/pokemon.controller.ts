import * as trpc from "@trpc/server";
import { z } from "zod";
import { makeGetRandomPokemon } from "../../factories";

export const pokemonController = trpc.router().query("getRandomPokemon", {
  input: z.object({
    MAX_INDEX: z.number().default(10),
    totalPokemons: z.number().default(1),
  }),
  async resolve({ input }) {
    const getRandomPokemon = makeGetRandomPokemon();
    return await getRandomPokemon.execute(input);
  },
});
