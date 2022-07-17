/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { NameGuesserGame, Pokemon } from "@prisma/client";
import { NameGuesserGameState } from "../../domain/game-states";
import { NameGuesserGamesRepositoryModel } from "../../domain/repositories/nameGuesserGamesRepository";
// import { makeNameGuesserRepository } from "../../factories/repositories";
import { describe, it, expect } from "@jest/globals";
import { NameGuesserManager } from "./nameGuesserManager";

class MockRepository implements NameGuesserGamesRepositoryModel {
  games: NameGuesserGame[] = [];
  pokemons: Pokemon[] = [];
  getAllGames(): Promise<NameGuesserGame[]> {
    return Promise.resolve(this.games);
  }
  addGame(
    gameState: NameGuesserGameState & { playerName: string },
  ): Promise<NameGuesserGame> {
    this.games.push({
      createdAt: new Date(),
      gameTime: gameState.gameTime,
      generation: "1",
      guessed: gameState.guessed.join(","),
      id: this.games.length + 1,
      playerName: gameState.playerName,
      state: gameState.state,
      lostOn: gameState.lostOn || null,
      points: gameState.points,
    });
    return Promise.resolve(this.games.slice(-1)[0]);
  }
  getGameById(gameId: number): Promise<NameGuesserGame | null> {
    return Promise.resolve(this.games.find(g => g.id === gameId) || null);
  }
  getGameByState(
    gameState: "playing" | "lost" | "win",
  ): Promise<NameGuesserGame[]> {
    return Promise.resolve(this.games.filter(g => g.state === gameState));
  }
  getPokemonsByDifficulty(): Promise<{ pokemon: Pokemon; losts: number }[]> {
    const allGames = this.games;
    const allPokemons = allGames.reduce((acc, curr) => {
      const pokemonId = curr.lostOn as number;
      if (acc.includes(pokemonId)) {
        return acc;
      }
      return [...acc, pokemonId];
    }, [] as number[]);
    const withAppearance = allPokemons.map(pokemonId => {
      const appearances = allGames.filter(g => g.lostOn === pokemonId);
      return {
        pokemon: this.pokemons.find(p => p.id === pokemonId) as Pokemon,
        losts: appearances.length,
      };
    });
    return Promise.resolve(withAppearance);
  }
}

const pokemons = [
  "bulbasaur",
  "ivysaur",
  "venusaur",
  "charmander",
  "charmeleon",
  "charizard",
  "squirtle",
  "wartortle",
  "blastoise",
  "caterpie",
  "metapod",
  "butterfree",
  "weedle",
  "kakuna",
].map((name, i) => ({ name, id: i + 1 }));

const makeSUT = () => {
  const nameGuesserRepo = new MockRepository();
  nameGuesserRepo.pokemons = pokemons;
  // const nameGuesserRepo = makeNameGuesserRepository();
  const sut = new NameGuesserManager(nameGuesserRepo);
  return { sut, nameGuesserRepo };
};

const makeGameMock = (
  override?: Partial<NameGuesserGameState & { playerName: string }>,
): NameGuesserGameState & { playerName: string } => {
  const lostOn = pokemons[Math.floor(Math.random() * pokemons.length)].id;
  const gameState = {
    gameTime: 10,
    guessed: new Array(
      Math.max(1, Math.floor(Math.random() * pokemons.length) - 1),
    )
      .fill(0)
      .reduce((acc, _) => {
        let id = Math.floor(Math.random() * pokemons.length);
        while (acc.includes(id) || id === lostOn) {
          id = Math.floor(Math.random() * pokemons.length);
        }
        return [...acc, id];
      }, [] as number[]),
    state: "lost" as const,
    lostOn,
    playerName: "test",
    points: 0,
    startTime: Date.now() - 10,
  };
  return { ...gameState, ...override };
};

describe("UseCase - NameGuesserManager", () => {
  it("Should be able to add a game", async () => {
    const { sut } = makeSUT();
    const game = makeGameMock();
    const gameResponse = await sut.addGame(game);
    expect(gameResponse.id).toBeDefined;
    expect(gameResponse.guessed).toEqual(game.guessed);
    // expect(nameGuesserRepo.games[0].guessed).toEqual(game.guessed.join(","));
    expect(gameResponse.state).toEqual(game.state);
    expect(gameResponse.lostOn).toEqual(game.lostOn);
    expect(gameResponse.playerName).toEqual(game.playerName);
  });

  it("should be able to get all games", async () => {
    const { sut } = makeSUT();
    const game = makeGameMock();
    await sut.addGame(game);
    const games = await sut.getAllGames();
    expect(games.length).toBeGreaterThan(0);
  });

  it("Should be able to get a list of the most unforgining pokemons", async () => {
    const { sut } = makeSUT();
    const mockGames = [
      makeGameMock({ lostOn: pokemons[5].id }),
      makeGameMock({ lostOn: pokemons[5].id }),
      makeGameMock({ lostOn: pokemons[0].id }),
      makeGameMock({ lostOn: pokemons[0].id }),
      makeGameMock({ lostOn: pokemons[0].id }),
      makeGameMock({ lostOn: pokemons[8].id }),
    ];
    await Promise.all(mockGames.map(async g => await sut.addGame(g)));
    const games = await sut.getPokemonByDifficulty();
    expect(games.length).toBe(3);
    expect(games[0].pokemon.name).toEqual(pokemons[0].name);
    expect(games[0].losts).toEqual(3);
    expect(games[0].losts > games[1].losts).toBe(true);
  });
});
