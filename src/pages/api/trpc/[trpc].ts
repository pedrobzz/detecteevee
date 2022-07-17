import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import {
  nameGuesserController,
  pokemonController,
} from "../../../application/controller/";

export const appRouter = trpc
  .router()
  .merge("pokemon.", pokemonController)
  .merge("nameGuesser.", nameGuesserController);

export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
