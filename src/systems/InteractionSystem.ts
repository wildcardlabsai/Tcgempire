import Phaser from 'phaser';
import { FURNITURE, FurnitureItem } from '../config/shop-layout';

const INTERACT_RANGE = 60;
const POPUP_DURATION = 2000;

export type InteractionHandler = (item: FurnitureItem) => void;

export class InteractionSystem {
  private scene: Phaser.Scene;
  private popup: Phaser.GameObjects.Container | null = null;
  private popupTimer: Phaser.Time.TimerEvent | null = null;
  private interactables: { item: FurnitureItem; cx: number; cy: number }[] = [];
  private handlers: Map<string, InteractionHandler> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.interactables = FURNITURE.map((f) => ({
      item: f,
      cx: f.x,
      cy: f.y,
    }));
  }

  onInteract(furnitureId: string, handler: InteractionHandler): void {
    this.handlers.set(furnitureId, handler);
  }

  findNearest(px: number, py: number): FurnitureItem | null {
    let best: FurnitureItem | null = null;
    let bestDist = INTERACT_RANGE;

    for (const entry of this.interactables) {
      const dx = px - entry.cx;
      const dy = py - entry.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < bestDist) {
        bestDist = dist;
        best = entry.item;
      }
    }

    return best;
  }

  interact(px: number, py: number): void {
    const target = this.findNearest(px, py);
    if (!target) return;

    const handler = this.handlers.get(target.id);
    if (handler) {
      handler(target);
    } else {
      this.showPopup(target.interactionMessage, px, py - 40);
    }
  }

  showPopup(message: string, x: number, y: number): void {
    this.hidePopup();

    const padding = 12;
    const text = this.scene.add.text(0, 0, message, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 200 },
    });
    text.setOrigin(0.5);

    const bg = this.scene.add.rectangle(
      0,
      0,
      text.width + padding * 2,
      text.height + padding * 2,
      0x000000,
      0.8
    );
    bg.setStrokeStyle(1, 0xffffff, 0.3);

    this.popup = this.scene.add.container(x, y, [bg, text]);
    this.popup.setDepth(100);

    this.popupTimer = this.scene.time.delayedCall(POPUP_DURATION, () => {
      this.hidePopup();
    });
  }

  hidePopup(): void {
    if (this.popup) {
      this.popup.destroy();
      this.popup = null;
    }
    if (this.popupTimer) {
      this.popupTimer.destroy();
      this.popupTimer = null;
    }
  }

  hasNearbyInteractable(px: number, py: number): boolean {
    return this.findNearest(px, py) !== null;
  }

  getNearbyInteractable(px: number, py: number): FurnitureItem | null {
    return this.findNearest(px, py);
  }
}
