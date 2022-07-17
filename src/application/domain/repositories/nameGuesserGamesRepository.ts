import type { NameGuesserGame } from "@prisma/client";
import type { NameGuesserGameState } from "../game-states";

export interface NameGuesserGamesRepositoryModel {
  getAllGames(): Promise<NameGuesserGame[]>;
  addGame(
    gameState: NameGuesserGameState & {
      playerName: string;
    },
  ): Promise<NameGuesserGame>;
  getGameById(gameId: number): Promise<NameGuesserGame | null>;
  getGameByState(
    gameState: NameGuesserGameState["state"],
  ): Promise<NameGuesserGame[]>;
  getPokemonsByDifficulty(): Promise<{ id: number; losts: number }[]>;
}