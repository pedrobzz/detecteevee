/* eslint-disable @typescript-eslint/no-namespace */
import { NameGuesserGame, Pokemon } from "@prisma/client";
import { NameGuesserGameState } from "../../domain/game-states";
import { NameGuesserGamesRepositoryModel } from "../../domain/repositories/nameGuesserGamesRepository";

export class NameGuesserManager {
  constructor(
    private readonly nameGuesserRepository: NameGuesserGamesRepositoryModel,
  ) {}

  async getAllGames(): Promise<NameGuesserManager.GameResponse[]> {
    const games = await this.nameGuesserRepository.getAllGames();
    return this.normalize(games);
  }

  async addGame(
    gameState: NameGuesserGameState & { playerName: string },
  ): Promise<NameGuesserManager.GameResponse> {
    const newGame = await this.nameGuesserRepository.addGame(gameState);
    return this.normalize(newGame);
  }

  async getGameById(
    gameId: number,
  ): Promise<NameGuesserManager.GameResponse | null> {
    const game = await this.nameGuesserRepository.getGameById(gameId);
    return game ? this.normalize(game) : null;
  }

  async getGameByState(
    gameState: NameGuesserGameState["state"],
  ): Promise<NameGuesserManager.GameResponse[]> {
    const games = await this.nameGuesserRepository.getGameByState(gameState);
    return this.normalize(games);
  }

  async getPokemonByDifficulty(): Promise<
    { pokemon: Pokemon; losts: number }[]
  > {
    const select = await this.nameGuesserRepository.getPokemonsByDifficulty();
    const sortedSelected = select.sort((a, b) => b.losts - a.losts);
    return sortedSelected;
  }

  private normalize(base: NameGuesserGame[]): NameGuesserManager.GameResponse[];
  private normalize(base: NameGuesserGame): NameGuesserManager.GameResponse;
  private normalize(
    base: NameGuesserGame | NameGuesserGame[],
  ): NameGuesserManager.GameResponse[] | NameGuesserManager.GameResponse {
    if (Array.isArray(base)) {
      return base.map(g => ({
        ...g,
        guessed: g.guessed.split(",").map(p => parseInt(p, 10)),
      }));
    }
    return {
      ...base,
      guessed: base.guessed.split(",").map(p => parseInt(p, 10)),
    };
  }
}

namespace NameGuesserManager {
  export type GameResponse = Omit<NameGuesserGame, "guessed"> & {
    guessed: number[];
  };
}
