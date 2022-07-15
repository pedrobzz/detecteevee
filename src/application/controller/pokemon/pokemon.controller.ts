import * as trpc from "@trpc/server";
import { z } from "zod";

export const pokemonController = trpc.router().query("getRandomPokemon", {
  input: z.number().default(10),
  resolve({ input }) {
    const MAX_INDEX = input;
    const randomIndex = Math.floor(Math.random() * MAX_INDEX);
    return {
      randomIndex,
    };
  },
});
