import * as trpc from "@trpc/server";
import { z } from "zod";
import { makeGetPokemon, makeGetRandomPokemon } from "../../factories";

export const pokemonController = trpc
  .router()
  .query("getRandomPokemon", {
    input: z.object({
      MAX_INDEX: z.number().default(10),
      totalPokemons: z.number().default(1),
    }),
    async resolve({ input }) {
      const getRandomPokemon = makeGetRandomPokemon();
      return await getRandomPokemon.execute(input);
    },
  })
  .query("getPokemonById", {
    input: z.object({
      pokemonId: z.number(),
    }),
    async resolve({ input }) {
      const getPokemon = makeGetPokemon();
      return await getPokemon.getPokemonById(input);
    },
  })
  .query("getMultiplePokemonById", {
    input: z.object({
      pokemonIds: z.array(z.number()),
    }),
    async resolve({ input }) {
      const getPokemon = makeGetPokemon();
      return await getPokemon.getMultiplePokemonById(input);
    },
  });
