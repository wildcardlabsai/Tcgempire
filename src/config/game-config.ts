import Phaser from 'phaser';
import { StartScene } from '../scenes/StartScene';
import { ShopScene } from '../scenes/ShopScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  pixelArt: false,
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    width: 800,
    height: 600,
  },
  scene: [StartScene, ShopScene],
};
