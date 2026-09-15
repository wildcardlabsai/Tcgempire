export interface GameStateData {
  cash: number;
  shopLevel: number;
  day: number;
}

const defaultState: GameStateData = {
  cash: 1000,
  shopLevel: 1,
  day: 1,
};

class GameStateManager {
  private state: GameStateData;

  constructor() {
    this.state = { ...defaultState };
  }

  get cash(): number {
    return this.state.cash;
  }

  set cash(value: number) {
    this.state.cash = Math.max(0, value);
  }

  get shopLevel(): number {
    return this.state.shopLevel;
  }

  set shopLevel(value: number) {
    this.state.shopLevel = value;
  }

  get day(): number {
    return this.state.day;
  }

  set day(value: number) {
    this.state.day = value;
  }

  advanceDay(): void {
    this.state.day += 1;
  }

  reset(): void {
    this.state = { ...defaultState };
  }
}

export const GameState = new GameStateManager();
