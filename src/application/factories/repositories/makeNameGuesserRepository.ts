import { NameGuesserGamesRepositoryModel } from "../../domain/repositories/nameGuesserGamesRepository";
import { PrismaNameGuesserGamesRepository } from "../../infra/repositories/PrismaNameGuesserGamesRepository";
import { makePokemonRepository } from "./makePokemonRepository";

export const makeNameGuesserRepository =
  (): NameGuesserGamesRepositoryModel => {
    return new PrismaNameGuesserGamesRepository(makePokemonRepository());
  };
