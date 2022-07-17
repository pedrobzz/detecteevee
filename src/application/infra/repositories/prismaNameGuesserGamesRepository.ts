import type { NameGuesserGame, Pokemon, PrismaClient } from "@prisma/client";
import type { NameGuesserGameState } from "../../domain/game-states";
import type { NameGuesserGamesRepositoryModel } from "../../domain/repositories/nameGuesserGamesRepository";
import { PokemonRepositoryModel } from "../../domain/repositories/pokemonRepository";
import { getPrismaClient } from "../../factories";

export class PrismaNameGuesserGamesRepository
  implements NameGuesserGamesRepositoryModel
{
  client: PrismaClient;
  constructor(private readonly pokemonRepository: PokemonRepositoryModel) {
    this.client = getPrismaClient();
  }
  async getAllGames(): Promise<NameGuesserGame[]> {
    const allGames = await this.client.nameGuesserGame.findMany({
      orderBy: [{ points: "desc" }, { gameTime: "asc" }],
    });
    return allGames;
  }
  async addGame(
    gameState: NameGuesserGameState & { playerName: string },
  ): Promise<NameGuesserGame> {
    const newGame = await this.client.nameGuesserGame.create({
      data: {
        state: gameState.state,
        generation: "1",
        guessed: gameState.guessed.join(","),
        gameTime: gameState.gameTime,
        playerName: gameState.playerName,
        points: gameState.points,
        lostOn: gameState.lostOn,
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
  async getPokemonsByDifficulty(): Promise<
    { pokemon: Pokemon; losts: number }[]
  > {
    const select = await this.client.nameGuesserGame.groupBy({
      by: ["lostOn"],
      where: { state: "lost" },
      _count: {
        lostOn: true,
      },
    });
    const ids = select.map(s => s.lostOn as number);
    const pokemons = (await this.pokemonRepository.getMultiplePokemonById(
      ids,
    )) as Pokemon[];
    return select.map(item => ({
      pokemon: pokemons.find(p => p.id === item.lostOn) as Pokemon,
      losts: item._count.lostOn,
    }));
  }
}
