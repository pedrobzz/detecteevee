import * as trpc from "@trpc/server";
import { z } from "zod";
import { makeNameGuesserManager } from "../factories/use-cases";

export const nameGuesserController = trpc
  .router()
  .query("addGame", {
    input: z.object({
      startTime: z.number(),
      gameTime: z.number(),
      points: z.number(),
      state: z.enum(["playing", "lost", "win"]),
      lostOn: z.number().optional(),
      guessed: z.array(z.number()),
      playerName: z.string(),
    }),
    async resolve({ input }) {
      const manager = makeNameGuesserManager();
      return manager.addGame({
        ...input,
        state: input.state,
      });
    },
  })
  .query("getAllGames", {
    async resolve() {
      const manager = makeNameGuesserManager();
      return manager.getAllGames();
    },
  })
  .query("getGameById", {
    input: z.object({
      gameId: z.number(),
    }),
    async resolve({ input }) {
      const manager = makeNameGuesserManager();
      return manager.getGameById(input.gameId);
    },
  })
  .query("getGameByState", {
    input: z.object({
      state: z.enum(["playing", "lost", "win"]),
    }),
    async resolve({ input }) {
      const manager = makeNameGuesserManager();
      return manager.getGameByState(input.state);
    },
  })
  .query("getPokemonsByDifficulty", {
    async resolve() {
      const manager = makeNameGuesserManager();
      return manager.getPokemonByDifficulty();
    },
  });
