export type NameGuesserGameState = {
  startTime: number;
  gameTime: number;
  points: number;
  state: "playing" | "lost" | "win";
  lostOn?: number;
  guessed: number[];
};
