import type { NameGuesserGame } from "@prisma/client";
import type { NameGuesserGameState } from "../game-states";

export interface NameGuesserGamesRepository {
  getAllGames(): Promise<NameGuesserGame[]>;
  addGame(
    gameState: NameGuesserGameState & {
      playerName: string;
    },
  ): Promise<NameGuesserGame>;
  getGameById(gameId: string): Promise<NameGuesserGame | null>;
  getGameByState(
    gameState: NameGuesserGameState["state"],
  ): Promise<NameGuesserGame | null>;
}
