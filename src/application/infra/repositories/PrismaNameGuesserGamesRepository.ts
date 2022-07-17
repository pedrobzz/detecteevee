import type { NameGuesserGame, PrismaClient } from "@prisma/client";
import type { NameGuesserGameState } from "../../domain/game-states";
import type { NameGuesserGamesRepositoryModel } from "../../domain/repositories/nameGuesserGamesRepository";
import { getPrismaClient } from "../../factories";

export class PrismaNameGuesserGamesRepository
  implements NameGuesserGamesRepositoryModel
{
  client: PrismaClient;
  constructor() {
    this.client = getPrismaClient();
  }
  async getAllGames(): Promise<NameGuesserGame[]> {
    const allGames = await this.client.nameGuesserGame.findMany();
    const sortedByPoint = allGames.sort((a, b) => b.points - a.points);
    return sortedByPoint;
  }
  async addGame(
    gameState: NameGuesserGameState & { playerName: string },
  ): Promise<NameGuesserGame> {
    const newGame = await this.client.nameGuesserGame.create({
      data: {
        ...gameState,
        state: "playing",
        generation: 1,
        guessed: gameState.guessed.join(","),
      },
    });
    return newGame;
  }
  async getGameById(gameId: number): Promise<NameGuesserGame | null> {
    return await this.client.nameGuesserGame.findFirst({
      where: { id: gameId },
    });
  }
  async getGameByState(
    gameState: "playing" | "lost" | "win",
  ): Promise<NameGuesserGame[]> {
    return await this.client.nameGuesserGame.findMany({
      where: { state: gameState },
    });
  }
  async getPokemonsByDifficulty(): Promise<{ id: number; losts: number }[]> {
    const select = await this.client.nameGuesserGame.groupBy({
      by: ["lostOn"],
      where: { state: "lost" },
      _count: {
        lostOn: true,
      },
    });
    return select.map(item => ({
      id: item.lostOn as number,
      losts: item._count.lostOn,
    }));
  }
}
