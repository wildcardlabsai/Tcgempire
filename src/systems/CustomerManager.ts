import Phaser from 'phaser';
import { Customer } from '../entities/Customer';
import { Inventory } from '../data/Inventory';
import { GameState } from '../data/GameState';
import { getShopLevel } from '../data/ShopUpgrades';

export class CustomerManager {
  private scene: Phaser.Scene;
  private customers: Customer[] = [];
  private spawnTimer: Phaser.Time.TimerEvent | null = null;
  private paused = false;

  customersServedToday = 0;
  revenueToday = 0;
  customersLostToday = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.scheduleNextSpawn();
  }

  private getLevel() {
    return getShopLevel(GameState.shopLevel);
  }

  private scheduleNextSpawn(): void {
    const level = this.getLevel();
    const delay = Phaser.Math.Between(level.spawnMin, level.spawnMax);
    this.spawnTimer = this.scene.time.delayedCall(delay, () => {
      this.trySpawn();
      this.scheduleNextSpawn();
    });
  }

  private trySpawn(): void {
    if (this.paused) return;
    const level = this.getLevel();
    if (this.customers.length >= level.maxCustomers) return;
    if (!Inventory.hasAnyShelfStock()) return;

    const patience = level.customerPatience;
    const customer = new Customer(this.scene, patience);
    this.customers.push(customer);
  }

  update(delta: number): void {
    for (const c of this.customers) {
      c.update(delta);
    }

    this.customers = this.customers.filter((c) => {
      if (c.lostPatience && !c.counted) {
        c.counted = true;
        this.customersLostToday++;
      }
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
    this.customersLostToday = 0;
  }

  destroy(): void {
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
    }
    this.clearAll();
  }
}
