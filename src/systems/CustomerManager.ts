import Phaser from 'phaser';
import { Customer } from '../entities/Customer';
import { Inventory } from '../data/Inventory';

const MAX_CUSTOMERS = 4;
const SPAWN_INTERVAL_MIN = 4000;
const SPAWN_INTERVAL_MAX = 10000;

export class CustomerManager {
  private scene: Phaser.Scene;
  private customers: Customer[] = [];
  private spawnTimer: Phaser.Time.TimerEvent | null = null;
  private paused = false;

  customersServedToday = 0;
  revenueToday = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.scheduleNextSpawn();
  }

  private scheduleNextSpawn(): void {
    const delay = Phaser.Math.Between(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_MAX);
    this.spawnTimer = this.scene.time.delayedCall(delay, () => {
      this.trySpawn();
      this.scheduleNextSpawn();
    });
  }

  private trySpawn(): void {
    if (this.paused) return;
    if (this.customers.length >= MAX_CUSTOMERS) return;
    if (!Inventory.hasAnyShelfStock()) return;

    const customer = new Customer(this.scene);
    this.customers.push(customer);
  }

  update(delta: number): void {
    for (const c of this.customers) {
      c.update(delta);
    }

    this.customers = this.customers.filter((c) => {
      if (c.isAtDoor()) {
        c.destroy();
        return false;
      }
      return true;
    });
  }

  getWaitingCustomer(): Customer | null {
    return this.customers.find((c) => c.isWaitingAtCounter()) ?? null;
  }

  getCustomerCount(): number {
    return this.customers.length;
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  clearAll(): void {
    for (const c of this.customers) {
      c.destroy();
    }
    this.customers = [];
  }

  resetDailyStats(): void {
    this.customersServedToday = 0;
    this.revenueToday = 0;
  }

  destroy(): void {
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
    }
    this.clearAll();
  }
}
