import * as trpc from "@trpc/server";
import { z } from "zod";
import { makeGetPokemon } from "../../factories";

export const pokemonController = trpc
  .router()
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
