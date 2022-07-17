import { NameGuesserManager } from "../../use-cases/name-guesser-game-manager/nameGuesserManager";
import { makeNameGuesserRepository } from "../repositories";

export const makeNameGuesserManager = (): NameGuesserManager => {
  return new NameGuesserManager(makeNameGuesserRepository());
};
