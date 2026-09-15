import { GameState } from '../data/GameState';

export type DayPhase = 'open' | 'closed' | 'summary';

export interface DaySummary {
  day: number;
  customersServed: number;
  customersLost: number;
  revenue: number;
  startingCash: number;
  endingCash: number;
}

export class DayManager {
  phase: DayPhase = 'open';
  private startingCash = 0;
  private onSummary: ((summary: DaySummary) => void) | null = null;

  constructor() {
    this.startingCash = GameState.cash;
  }

  setOnSummary(cb: (summary: DaySummary) => void): void {
    this.onSummary = cb;
  }

  endDay(customersServed: number, revenue: number, customersLost: number = 0): void {
    this.phase = 'summary';
    const summary: DaySummary = {
      day: GameState.day,
      customersServed,
      customersLost,
      revenue,
      startingCash: this.startingCash,
      endingCash: GameState.cash,
    };
    if (this.onSummary) {
      this.onSummary(summary);
    }
  }

  startNextDay(): void {
    GameState.advanceDay();
    this.startingCash = GameState.cash;
    this.phase = 'open';
  }

  isOpen(): boolean {
    return this.phase === 'open';
  }
}
