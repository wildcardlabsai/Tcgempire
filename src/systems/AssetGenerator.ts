import Phaser from 'phaser';

function ctx(scene: Phaser.Scene, key: string, w: number, h: number): [CanvasRenderingContext2D, () => void] {
  const ct = scene.textures.createCanvas(key, w, h);
  if (!ct) throw new Error(`Failed to create canvas texture: ${key}`);
  const c = ct.getContext();
  return [c, () => ct.refresh()];
}

function woodGrain(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, baseColor: string, darkColor: string, lightColor: string): void {
  c.fillStyle = baseColor;
  c.fillRect(x, y, w, h);
  c.strokeStyle = darkColor;
  c.lineWidth = 0.5;
  for (let i = 0; i < h; i += 3) {
    const waveAmp = Math.sin(i * 0.1) * 2;
    c.beginPath();
    c.moveTo(x, y + i);
    for (let j = 0; j < w; j += 4) {
      c.lineTo(x + j, y + i + Math.sin((j + waveAmp) * 0.05) * 1.5);
    }
    c.globalAlpha = 0.08 + Math.random() * 0.04;
    c.stroke();
  }
  c.globalAlpha = 1;
  c.fillStyle = lightColor;
  c.globalAlpha = 0.05;
  c.fillRect(x, y, w, h / 3);
  c.globalAlpha = 1;
}

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

export function generateAllTextures(scene: Phaser.Scene): void {
  generateFloor(scene);
  generateWalls(scene);
  generateShelf(scene);
  generateCounter(scene);
  generateComputerDesk(scene);
  generateStorageRack(scene);
  generateDoor(scene);
  generateProducts(scene);
  generatePlayerSprites(scene);
  generateCustomerBase(scene);
  generatePlant(scene);
  generateDisplayCase(scene);
  generateWelcomeMat(scene);
  generateHUDBar(scene);
}

function generateFloor(scene: Phaser.Scene): void {
  const w = 800, h = 600;
  const [c, done] = ctx(scene, 'floor', w, h);

  const plankH = 24;
  const plankColors = ['#c4a87c', '#bfa075', '#c9ad82', '#b89b6e', '#c0a478', '#d0b48c'];

  for (let py = 0; py < h; py += plankH) {
    const row = Math.floor(py / plankH);
    const offset = (row % 2) * 60;
    const baseIdx = row % plankColors.length;
    const plankW = 80 + (row * 17 % 30);

    for (let px = -offset; px < w; px += plankW) {
      const colorIdx = (baseIdx + Math.floor(px / plankW)) % plankColors.length;
      woodGrain(c, Math.max(0, px), py, plankW, plankH - 1, plankColors[colorIdx], '#8a7050', '#e0c8a0');

      c.strokeStyle = '#9a7a58';
      c.lineWidth = 0.5;
      c.globalAlpha = 0.25;
      c.beginPath();
      c.moveTo(Math.max(0, px), py + plankH - 1);
      c.lineTo(Math.min(w, px + plankW), py + plankH - 1);
      c.stroke();

      if (px >= 0 && px < w) {
        c.beginPath();
        c.moveTo(px, py);
        c.lineTo(px, py + plankH - 1);
        c.stroke();
      }
      c.globalAlpha = 1;
    }

    if (row % 5 === 2) {
      const knotX = 40 + (row * 47) % (w - 80);
      const grad = c.createRadialGradient(knotX, py + plankH / 2, 0, knotX, py + plankH / 2, 4);
      grad.addColorStop(0, 'rgba(120, 85, 50, 0.3)');
      grad.addColorStop(0.5, 'rgba(110, 80, 45, 0.15)');
      grad.addColorStop(1, 'rgba(100, 75, 40, 0)');
      c.fillStyle = grad;
      c.beginPath();
      c.ellipse(knotX, py + plankH / 2, 4, 3, 0, 0, Math.PI * 2);
      c.fill();
    }
  }

  const aoGrad = c.createLinearGradient(0, 0, 0, 30);
  aoGrad.addColorStop(0, 'rgba(30, 20, 10, 0.12)');
  aoGrad.addColorStop(1, 'rgba(30, 20, 10, 0)');
  c.fillStyle = aoGrad;
  c.fillRect(0, 0, w, 30);

  const aoL = c.createLinearGradient(0, 0, 30, 0);
  aoL.addColorStop(0, 'rgba(30, 20, 10, 0.08)');
  aoL.addColorStop(1, 'rgba(30, 20, 10, 0)');
  c.fillStyle = aoL;
  c.fillRect(0, 0, 30, h);

  const aoR = c.createLinearGradient(w, 0, w - 30, 0);
  aoR.addColorStop(0, 'rgba(30, 20, 10, 0.08)');
  aoR.addColorStop(1, 'rgba(30, 20, 10, 0)');
  c.fillStyle = aoR;
  c.fillRect(w - 30, 0, 30, h);

  done();
}

function generateWalls(scene: Phaser.Scene): void {
  const [c, done] = ctx(scene, 'walls', 800, 600);

  c.fillStyle = '#2c2c4a';
  c.fillRect(0, 0, 800, 70);
  c.fillRect(0, 0, 46, 600);
  c.fillRect(754, 0, 46, 600);

  const wainscotH = 30;
  const wainscotY = 40;
  const wallPanelColor = '#4a3528';
  const wallPanelLight = '#5c4033';

  for (const xRange of [[16, 46], [754, 784]] as [number, number][]) {
    for (let py = 16; py < 584; py += 40) {
      const panelGrad = c.createLinearGradient(xRange[0], py, xRange[1], py);
      panelGrad.addColorStop(0, wallPanelColor);
      panelGrad.addColorStop(0.5, wallPanelLight);
      panelGrad.addColorStop(1, wallPanelColor);
      c.fillStyle = panelGrad;
      c.fillRect(xRange[0], py, 30, 38);
      c.strokeStyle = '#3a2518';
      c.lineWidth = 0.5;
      c.strokeRect(xRange[0] + 1, py + 1, 28, 36);
    }
  }

  const topGrad = c.createLinearGradient(0, wainscotY, 0, wainscotY + wainscotH);
  topGrad.addColorStop(0, '#5c4033');
  topGrad.addColorStop(0.5, '#6b4e3a');
  topGrad.addColorStop(1, '#4a3528');
  c.fillStyle = topGrad;
  c.fillRect(46, wainscotY, 708, wainscotH);

  for (let px = 46; px < 754; px += 50) {
    c.strokeStyle = 'rgba(90, 65, 40, 0.3)';
    c.lineWidth = 0.5;
    c.strokeRect(px + 1, wainscotY + 2, 48, wainscotH - 4);
  }

  c.strokeStyle = '#d4a854';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(46, wainscotY);
  c.lineTo(754, wainscotY);
  c.stroke();
  c.beginPath();
  c.moveTo(46, wainscotY + wainscotH);
  c.lineTo(754, wainscotY + wainscotH);
  c.stroke();

  c.lineWidth = 1.5;
  c.globalAlpha = 0.5;
  c.beginPath();
  c.moveTo(16, 4);
  c.lineTo(784, 4);
  c.stroke();
  c.globalAlpha = 0.3;
  c.beginPath();
  c.moveTo(16, 8);
  c.lineTo(784, 8);
  c.stroke();
  c.globalAlpha = 1;

  const bottomWallLeft = 350 - 50;
  c.fillStyle = '#2c2c4a';
  c.fillRect(0, 584, bottomWallLeft, 16);
  c.fillRect(450, 584, 350, 16);

  const lampPositions = [180, 400, 620];
  for (const lx of lampPositions) {
    c.fillStyle = '#3a3a5c';
    c.fillRect(lx - 6, 12, 12, 10);
    c.fillStyle = '#d4a854';
    c.fillRect(lx - 8, 20, 16, 4);
    c.fillStyle = '#e8c06a';
    c.fillRect(lx - 6, 20, 12, 2);

    const lampGrad = c.createRadialGradient(lx, 50, 5, lx, 70, 80);
    lampGrad.addColorStop(0, 'rgba(255, 215, 100, 0.06)');
    lampGrad.addColorStop(0.5, 'rgba(255, 210, 80, 0.03)');
    lampGrad.addColorStop(1, 'rgba(255, 200, 60, 0)');
    c.fillStyle = lampGrad;
    c.fillRect(lx - 80, 24, 160, 120);
  }

  c.fillStyle = 'rgba(20, 20, 50, 0.4)';
  c.fillRect(46, wainscotY + wainscotH, 708, 8);

  done();
}

function generateShelf(scene: Phaser.Scene): void {
  const w = 240, h = 65;
  const [c, done] = ctx(scene, 'shelf-unit', w, h);

  c.shadowColor = 'rgba(0,0,0,0.3)';
  c.shadowBlur = 4;
  c.shadowOffsetX = 3;
  c.shadowOffsetY = 3;

  const baseGrad = c.createLinearGradient(0, 0, 0, h);
  baseGrad.addColorStop(0, '#6b4e3a');
  baseGrad.addColorStop(0.3, '#5c4033');
  baseGrad.addColorStop(1, '#4a3528');
  roundRect(c, 0, 0, w, h, 2);
  c.fillStyle = baseGrad;
  c.fill();
  c.shadowColor = 'transparent';

  const tiers = 3;
  const tierH = h / tiers;
  for (let i = 0; i <= tiers; i++) {
    const sy = tierH * i;
    const shelfGrad = c.createLinearGradient(0, sy, 0, sy + 5);
    shelfGrad.addColorStop(0, '#7a5e48');
    shelfGrad.addColorStop(0.3, '#6b5040');
    shelfGrad.addColorStop(1, '#5a4030');
    c.fillStyle = shelfGrad;
    c.fillRect(0, sy, w, 5);

    c.fillStyle = 'rgba(140, 110, 80, 0.3)';
    c.fillRect(1, sy, w - 2, 2);
    c.fillStyle = 'rgba(40, 25, 15, 0.3)';
    c.fillRect(1, sy + 4, w - 2, 1);
  }

  const divCount = 4;
  for (let i = 1; i < divCount; i++) {
    const dx = (w / divCount) * i;
    c.fillStyle = 'rgba(70, 50, 35, 0.4)';
    c.fillRect(dx - 1, 0, 2, h);
  }

  c.strokeStyle = '#3a2518';
  c.lineWidth = 1;
  roundRect(c, 0, 0, w, h, 2);
  c.stroke();

  done();
}

function generateCounter(scene: Phaser.Scene): void {
  const w = 200, h = 50;
  const [c, done] = ctx(scene, 'counter-unit', w, h);

  c.shadowColor = 'rgba(0,0,0,0.3)';
  c.shadowBlur = 5;
  c.shadowOffsetX = 3;
  c.shadowOffsetY = 3;

  const bodyGrad = c.createLinearGradient(0, 0, 0, h);
  bodyGrad.addColorStop(0, '#6b4e3a');
  bodyGrad.addColorStop(0.15, '#5c3a1e');
  bodyGrad.addColorStop(1, '#4a2e14');
  roundRect(c, 0, 0, w, h, 4);
  c.fillStyle = bodyGrad;
  c.fill();
  c.shadowColor = 'transparent';

  const topGrad = c.createLinearGradient(0, 0, 0, 8);
  topGrad.addColorStop(0, 'rgba(180, 210, 230, 0.25)');
  topGrad.addColorStop(1, 'rgba(140, 180, 210, 0.1)');
  roundRect(c, 2, 2, w - 4, 8, 2);
  c.fillStyle = topGrad;
  c.fill();

  c.fillStyle = 'rgba(255, 255, 255, 0.08)';
  c.fillRect(4, 4, w / 3, 4);

  const cardColors = ['#e74c3c', '#3498db', '#f39c12', '#2ecc71', '#9b59b6'];
  for (let i = 0; i < 5; i++) {
    const cx = 12 + i * 18;
    const cy = 16;
    roundRect(c, cx, cy, 12, 16, 1);
    c.fillStyle = cardColors[i];
    c.globalAlpha = 0.5;
    c.fill();
    c.globalAlpha = 0.2;
    c.fillStyle = '#ffd700';
    c.fillRect(cx + 2, cy + 2, 8, 4);
    c.globalAlpha = 1;
  }

  c.strokeStyle = 'rgba(60, 35, 15, 0.3)';
  c.lineWidth = 0.5;
  c.beginPath();
  c.moveTo(4, h / 3);
  c.lineTo(w - 4, h / 3);
  c.stroke();
  c.beginPath();
  c.moveTo(4, h * 2 / 3);
  c.lineTo(w - 4, h * 2 / 3);
  c.stroke();

  const regX = w - 52, regY = 4;
  const regGrad = c.createLinearGradient(regX, regY, regX, regY + 22);
  regGrad.addColorStop(0, '#3a3a4c');
  regGrad.addColorStop(1, '#2c2c3c');
  roundRect(c, regX, regY, 32, 22, 2);
  c.fillStyle = regGrad;
  c.fill();

  c.fillStyle = '#4a8a4a';
  c.fillRect(regX + 4, regY + 4, 14, 6);
  c.fillStyle = '#5aba5a';
  c.globalAlpha = 0.5;
  c.fillRect(regX + 5, regY + 5, 8, 3);
  c.globalAlpha = 1;

  const termX = w - 16, termY = 6;
  roundRect(c, termX, termY, 12, 18, 2);
  c.fillStyle = '#1a1a2a';
  c.fill();
  c.fillStyle = '#4a8aca';
  c.fillRect(termX + 2, termY + 2, 8, 7);
  c.fillStyle = 'rgba(100, 160, 220, 0.3)';
  c.fillRect(termX + 3, termY + 3, 4, 3);

  c.strokeStyle = '#3a2210';
  c.lineWidth = 1;
  roundRect(c, 0, 0, w, h, 4);
  c.stroke();

  done();
}

function generateComputerDesk(scene: Phaser.Scene): void {
  const w = 80, h = 60;
  const [c, done] = ctx(scene, 'computer-desk', w, h);

  c.shadowColor = 'rgba(0,0,0,0.2)';
  c.shadowBlur = 4;
  c.shadowOffsetX = 2;
  c.shadowOffsetY = 2;

  const deskGrad = c.createLinearGradient(0, 0, 0, h);
  deskGrad.addColorStop(0, '#6b4e3a');
  deskGrad.addColorStop(1, '#5c4033');
  roundRect(c, 0, 0, w, h, 3);
  c.fillStyle = deskGrad;
  c.fill();
  c.shadowColor = 'transparent';

  c.fillStyle = '#7a5e48';
  c.fillRect(0, 0, w, 5);

  const monW = 36, monH = 28;
  const monX = w / 2 - monW / 2 - 4;
  const monY = 8;

  roundRect(c, monX - 3, monY - 3, monW + 6, monH + 6, 3);
  c.fillStyle = '#1a1a2e';
  c.fill();

  const screenGrad = c.createLinearGradient(monX, monY, monX, monY + monH);
  screenGrad.addColorStop(0, '#2a4a7a');
  screenGrad.addColorStop(0.5, '#2a3a6a');
  screenGrad.addColorStop(1, '#1a2a5a');
  c.fillStyle = screenGrad;
  c.fillRect(monX, monY, monW, monH);

  c.fillStyle = 'rgba(60, 100, 160, 0.5)';
  c.fillRect(monX + 3, monY + 3, monW - 6, 5);
  c.fillStyle = 'rgba(80, 120, 180, 0.3)';
  c.fillRect(monX + 3, monY + 10, monW - 6, 2);
  c.fillRect(monX + 3, monY + 14, monW / 2, 2);
  c.fillRect(monX + 3, monY + 18, monW - 8, 2);
  c.fillStyle = 'rgba(60, 180, 100, 0.5)';
  c.beginPath();
  c.arc(monX + monW - 5, monY + monH - 5, 2, 0, Math.PI * 2);
  c.fill();

  c.fillStyle = '#1a1a2e';
  c.fillRect(w / 2 - 9, monY + monH + 3, 6, 5);
  c.fillRect(w / 2 - 13, monY + monH + 7, 14, 3);

  const kbY = h - 14;
  roundRect(c, w / 2 - 18, kbY, 32, 10, 2);
  c.fillStyle = '#2c2c3c';
  c.fill();
  c.fillStyle = '#4c4c5c';
  for (let kx = 0; kx < 6; kx++) {
    for (let ky = 0; ky < 2; ky++) {
      c.globalAlpha = 0.4;
      c.fillRect(w / 2 - 15 + kx * 4.5, kbY + 2 + ky * 4, 3, 2.5);
    }
  }
  c.globalAlpha = 1;

  const mouseX = w / 2 + 16;
  roundRect(c, mouseX, kbY + 2, 6, 8, 2);
  c.fillStyle = '#2c2c3c';
  c.fill();

  c.strokeStyle = '#3a2a1a';
  c.lineWidth = 1;
  roundRect(c, 0, 0, w, h, 3);
  c.stroke();

  done();

  const chairW = 24, chairH = 20;
  const [cc, cDone] = ctx(scene, 'office-chair', chairW, chairH);

  cc.fillStyle = 'rgba(0,0,0,0.1)';
  cc.beginPath();
  cc.ellipse(chairW / 2, chairH - 3, 11, 4, 0, 0, Math.PI * 2);
  cc.fill();

  const chairGrad = cc.createLinearGradient(0, 0, 0, chairH);
  chairGrad.addColorStop(0, '#3a3a5c');
  chairGrad.addColorStop(1, '#2c2c4a');
  roundRect(cc, 2, 2, chairW - 4, chairH - 6, 4);
  cc.fillStyle = chairGrad;
  cc.fill();

  cc.fillStyle = 'rgba(70, 70, 100, 0.3)';
  cc.fillRect(5, 4, chairW - 10, 4);

  cDone();
}

function generateStorageRack(scene: Phaser.Scene): void {
  const w = 90, h = 100;
  const [c, done] = ctx(scene, 'storage-rack', w, h);

  c.shadowColor = 'rgba(0,0,0,0.2)';
  c.shadowBlur = 4;
  c.shadowOffsetX = 3;
  c.shadowOffsetY = 3;

  const rackGrad = c.createLinearGradient(0, 0, 0, h);
  rackGrad.addColorStop(0, '#5c4a3a');
  rackGrad.addColorStop(1, '#4a3a2a');
  c.fillStyle = rackGrad;
  c.fillRect(0, 0, w, h);
  c.shadowColor = 'transparent';

  const tiers = 3;
  const tierH = h / tiers;
  for (let i = 0; i <= tiers; i++) {
    const sy = tierH * i;
    c.fillStyle = '#6a5a4a';
    c.fillRect(0, sy, w, 3);
    c.fillStyle = 'rgba(100, 85, 65, 0.3)';
    c.fillRect(1, sy, w - 2, 1);
  }

  const boxConfigs = [
    { bx: 4, by: 6, bw: 22, bh: 20, color: '#8a7050', label: 'DRG' },
    { bx: 28, by: 8, bw: 24, bh: 18, color: '#7a6a50', label: 'OCN' },
    { bx: 56, by: 6, bw: 22, bh: 20, color: '#9a8060', label: 'FRS' },
    { bx: 4, by: tierH + 6, bw: 26, bh: 18, color: '#8a7050', label: 'DCK' },
    { bx: 32, by: tierH + 8, bw: 22, bh: 16, color: '#6a5a40', label: 'SLV' },
    { bx: 58, by: tierH + 4, bw: 24, bh: 22, color: '#7a6a50', label: 'BOX' },
    { bx: 6, by: tierH * 2 + 6, bw: 28, bh: 20, color: '#9a8060', label: 'DRG' },
    { bx: 38, by: tierH * 2 + 8, bw: 24, bh: 18, color: '#8a7050', label: 'OCN' },
    { bx: 66, by: tierH * 2 + 6, bw: 18, bh: 20, color: '#7a6a50', label: 'FRS' },
  ];

  for (const box of boxConfigs) {
    c.fillStyle = box.color;
    c.fillRect(box.bx, box.by, box.bw, box.bh);

    const flapGrad = c.createLinearGradient(box.bx, box.by, box.bx, box.by + 5);
    flapGrad.addColorStop(0, 'rgba(160, 140, 100, 0.3)');
    flapGrad.addColorStop(1, 'rgba(160, 140, 100, 0)');
    c.fillStyle = flapGrad;
    c.fillRect(box.bx, box.by, box.bw, 5);

    c.strokeStyle = 'rgba(80, 60, 40, 0.5)';
    c.lineWidth = 0.5;
    c.strokeRect(box.bx, box.by, box.bw, box.bh);

    c.fillStyle = 'rgba(60, 45, 30, 0.3)';
    c.beginPath();
    c.moveTo(box.bx + 3, box.by + box.bh / 2);
    c.lineTo(box.bx + box.bw - 3, box.by + box.bh / 2);
    c.lineWidth = 0.8;
    c.stroke();

    c.fillStyle = 'rgba(255, 255, 255, 0.4)';
    c.font = '5px Arial';
    c.textAlign = 'center';
    c.fillText(box.label, box.bx + box.bw / 2, box.by + box.bh / 2 + 2);
  }

  c.strokeStyle = '#3a2a1a';
  c.lineWidth = 1;
  c.strokeRect(0, 0, w, h);

  done();
}

function generateDoor(scene: Phaser.Scene): void {
  const w = 100, h = 16;
  const [c, done] = ctx(scene, 'door', w, h);

  c.fillStyle = '#5c4033';
  c.fillRect(-4, -4, w + 8, h + 4);

  const doorGrad = c.createLinearGradient(0, 0, 0, h);
  doorGrad.addColorStop(0, '#5a9a6a');
  doorGrad.addColorStop(1, '#4a8a5a');

  c.fillStyle = doorGrad;
  c.fillRect(0, 0, w / 2 - 2, h);
  c.fillRect(w / 2 + 2, 0, w / 2 - 2, h);

  c.fillStyle = 'rgba(90, 170, 110, 0.3)';
  c.fillRect(4, 2, w / 2 - 10, h - 4);
  c.fillRect(w / 2 + 6, 2, w / 2 - 10, h - 4);

  c.strokeStyle = '#3a6a4a';
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(w / 2, 0);
  c.lineTo(w / 2, h);
  c.stroke();

  c.fillStyle = '#d4a854';
  c.beginPath();
  c.arc(w / 2 - 6, h / 2, 2, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(w / 2 + 6, h / 2, 2, 0, Math.PI * 2);
  c.fill();

  done();
}

function generateProducts(scene: Phaser.Scene): void {
  const boosterDefs = [
    { key: 'product-dragon-booster', color1: '#e74c3c', color2: '#c0392b', accent: '#ffd700', icon: 'D' },
    { key: 'product-ocean-booster', color1: '#3498db', color2: '#2980b9', accent: '#87ceeb', icon: 'O' },
    { key: 'product-forest-booster', color1: '#2ecc71', color2: '#27ae60', accent: '#90ee90', icon: 'F' },
  ];

  for (const def of boosterDefs) {
    const pw = 16, ph = 22;
    const [c, done] = ctx(scene, def.key, pw, ph);

    const grad = c.createLinearGradient(0, 0, 0, ph);
    grad.addColorStop(0, def.color1);
    grad.addColorStop(0.6, def.color2);
    grad.addColorStop(1, def.color1);
    roundRect(c, 0, 0, pw, ph, 2);
    c.fillStyle = grad;
    c.fill();

    c.fillStyle = 'rgba(255,255,255,0.15)';
    c.fillRect(2, 2, pw - 4, 5);

    c.fillStyle = def.accent;
    c.globalAlpha = 0.4;
    c.fillRect(3, ph / 2 - 3, pw - 6, 6);
    c.globalAlpha = 1;

    c.fillStyle = '#ffffff';
    c.globalAlpha = 0.8;
    c.font = 'bold 5px Arial';
    c.textAlign = 'center';
    c.fillText('GENESIS', pw / 2, 7);
    c.globalAlpha = 0.6;
    c.font = '3px Arial';
    c.fillText('TCG', pw / 2, 11);
    c.globalAlpha = 1;

    c.fillStyle = def.accent;
    c.globalAlpha = 0.6;
    c.font = 'bold 8px Arial';
    c.fillText(def.icon, pw / 2, ph - 4);
    c.globalAlpha = 1;

    c.strokeStyle = 'rgba(0,0,0,0.3)';
    c.lineWidth = 0.5;
    roundRect(c, 0, 0, pw, ph, 2);
    c.stroke();

    c.fillStyle = def.accent;
    c.globalAlpha = 0.3;
    c.fillRect(1, ph - 3, pw - 2, 2);
    c.globalAlpha = 1;

    done();
  }

  const deckW = 18, deckH = 22;
  const [dc, dDone] = ctx(scene, 'product-starter-deck', deckW, deckH);

  const deckGrad = dc.createLinearGradient(0, 0, 0, deckH);
  deckGrad.addColorStop(0, '#f39c12');
  deckGrad.addColorStop(1, '#e67e22');
  roundRect(dc, 0, 0, deckW, deckH, 2);
  dc.fillStyle = deckGrad;
  dc.fill();

  dc.fillStyle = 'rgba(255,255,255,0.2)';
  dc.fillRect(3, 3, deckW - 6, 7);
  dc.strokeStyle = 'rgba(255,215,0,0.4)';
  dc.lineWidth = 0.5;
  dc.strokeRect(3, 3, deckW - 6, 7);

  dc.fillStyle = '#ffffff';
  dc.globalAlpha = 0.8;
  dc.font = 'bold 4px Arial';
  dc.textAlign = 'center';
  dc.fillText('GENESIS', deckW / 2, 7);
  dc.globalAlpha = 0.6;
  dc.font = '3px Arial';
  dc.fillText('STARTER', deckW / 2, 15);
  dc.fillText('DECK', deckW / 2, 19);
  dc.globalAlpha = 1;

  dc.strokeStyle = 'rgba(0,0,0,0.3)';
  dc.lineWidth = 0.5;
  roundRect(dc, 0, 0, deckW, deckH, 2);
  dc.stroke();

  dDone();

  const boxW = 22, boxH = 18;
  const [bc, bDone] = ctx(scene, 'product-elite-box', boxW, boxH);

  const boxGrad = bc.createLinearGradient(0, 0, 0, boxH);
  boxGrad.addColorStop(0, '#9b59b6');
  boxGrad.addColorStop(0.5, '#8e44ad');
  boxGrad.addColorStop(1, '#9b59b6');
  roundRect(bc, 0, 0, boxW, boxH, 2);
  bc.fillStyle = boxGrad;
  bc.fill();

  bc.fillStyle = 'rgba(255,215,0,0.3)';
  bc.fillRect(2, boxH / 2 - 2, boxW - 4, 4);

  bc.fillStyle = '#ffffff';
  bc.globalAlpha = 0.8;
  bc.font = 'bold 4px Arial';
  bc.textAlign = 'center';
  bc.fillText('ELITE', boxW / 2, 6);
  bc.globalAlpha = 0.6;
  bc.font = '3px Arial';
  bc.fillText('TRAINER', boxW / 2, 13);
  bc.globalAlpha = 1;

  bc.strokeStyle = 'rgba(0,0,0,0.3)';
  bc.lineWidth = 0.5;
  roundRect(bc, 0, 0, boxW, boxH, 2);
  bc.stroke();

  bDone();

  const slvW = 14, slvH = 16;
  const [sc, sDone] = ctx(scene, 'product-card-sleeves', slvW, slvH);

  const slvGrad = sc.createLinearGradient(0, 0, 0, slvH);
  slvGrad.addColorStop(0, '#1abc9c');
  slvGrad.addColorStop(1, '#16a085');
  roundRect(sc, 0, 0, slvW, slvH, 3);
  sc.fillStyle = slvGrad;
  sc.fill();

  sc.fillStyle = 'rgba(255,255,255,0.2)';
  sc.fillRect(3, 2, slvW - 6, 5);

  sc.fillStyle = '#ffffff';
  sc.globalAlpha = 0.7;
  sc.font = 'bold 4px Arial';
  sc.textAlign = 'center';
  sc.fillText('50', slvW / 2, 11);
  sc.globalAlpha = 1;

  sc.strokeStyle = 'rgba(0,0,0,0.2)';
  sc.lineWidth = 0.5;
  roundRect(sc, 0, 0, slvW, slvH, 3);
  sc.stroke();

  sDone();
}

function drawPlayerFrame(c: CanvasRenderingContext2D, w: number, h: number, dir: 'down' | 'up' | 'left' | 'right', frame: number): void {
  const cx = w / 2;
  const cy = h / 2 + 4;

  c.clearRect(0, 0, w, h);

  const walkOffset = frame === 1 ? 1 : -1;
  const isWalking = frame > 0;

  c.fillStyle = 'rgba(0,0,0,0.15)';
  c.beginPath();
  c.ellipse(cx, cy + 16, 10, 4, 0, 0, Math.PI * 2);
  c.fill();

  const legOffsetL = isWalking ? walkOffset * 2 : 0;
  const legOffsetR = isWalking ? -walkOffset * 2 : 0;

  c.fillStyle = '#2c3e6b';
  roundRect(c, cx - 7, cy + 5 + legOffsetL, 6, 12, 2);
  c.fill();
  roundRect(c, cx + 1, cy + 5 + legOffsetR, 6, 12, 2);
  c.fill();

  c.fillStyle = '#5c3a1e';
  roundRect(c, cx - 8, cy + 15 + legOffsetL, 8, 4, 2);
  c.fill();
  roundRect(c, cx, cy + 15 + legOffsetR, 8, 4, 2);
  c.fill();

  const bodyGrad = c.createLinearGradient(cx - 10, cy - 8, cx + 10, cy + 7);
  bodyGrad.addColorStop(0, '#8b2252');
  bodyGrad.addColorStop(1, '#7a1e48');
  roundRect(c, cx - 10, cy - 8, 20, 15, 4);
  c.fillStyle = bodyGrad;
  c.fill();

  c.fillStyle = '#9b3262';
  c.beginPath();
  c.moveTo(cx - 3, cy - 8);
  c.lineTo(cx + 3, cy - 8);
  c.lineTo(cx, cy - 3);
  c.closePath();
  c.fill();

  c.fillStyle = '#2c2c4a';
  roundRect(c, cx - 9, cy, 18, 7, 2);
  c.fill();
  c.fillStyle = '#3a3a5c';
  c.fillRect(cx - 4, cy + 1, 8, 4);

  c.fillStyle = '#ffffff';
  c.globalAlpha = 0.85;
  roundRect(c, cx - 6, cy + 1, 12, 4, 1);
  c.fill();
  c.globalAlpha = 1;
  c.fillStyle = '#888888';
  c.fillRect(cx - 4, cy + 2, 8, 1);

  c.fillStyle = '#8b2252';
  const armSwingL = isWalking ? walkOffset * 1.5 : 0;
  const armSwingR = isWalking ? -walkOffset * 1.5 : 0;
  roundRect(c, cx - 14, cy - 6 + armSwingL, 5, 11, 2);
  c.fill();
  roundRect(c, cx + 9, cy - 6 + armSwingR, 5, 11, 2);
  c.fill();

  c.fillStyle = '#f0be8a';
  c.beginPath();
  c.arc(cx - 11, cy + 7 + armSwingL, 3, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(cx + 11, cy + 7 + armSwingR, 3, 0, Math.PI * 2);
  c.fill();

  c.fillStyle = '#f0be8a';
  c.fillRect(cx - 3, cy - 12, 6, 5);

  c.fillStyle = '#f0be8a';
  c.beginPath();
  c.arc(cx, cy - 18, 10, 0, Math.PI * 2);
  c.fill();

  c.fillStyle = '#3a2210';
  c.beginPath();
  c.ellipse(cx, cy - 24, 10, 5.5, 0, 0, Math.PI * 2);
  c.fill();
  roundRect(c, cx - 10, cy - 26, 20, 10, 5);
  c.fill();
  roundRect(c, cx - 11, cy - 22, 4, 6, 2);
  c.fill();
  roundRect(c, cx + 7, cy - 22, 4, 6, 2);
  c.fill();

  if (dir === 'down' || dir === 'left' || dir === 'right') {
    c.fillStyle = '#e8b07a';
    c.beginPath();
    c.arc(cx - 10, cy - 18, 2.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(cx + 10, cy - 18, 2.5, 0, Math.PI * 2);
    c.fill();
  }

  if (dir === 'down') {
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.ellipse(cx - 4, cy - 18, 2.5, 2, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(cx + 4, cy - 18, 2.5, 2, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#2c1810';
    c.beginPath();
    c.arc(cx - 4, cy - 18, 1.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(cx + 4, cy - 18, 1.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,0.8)';
    c.beginPath();
    c.arc(cx - 3.5, cy - 19, 0.7, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(cx + 4.5, cy - 19, 0.7, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#3a2210';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(cx - 6, cy - 21);
    c.lineTo(cx - 2, cy - 21.5);
    c.stroke();
    c.beginPath();
    c.moveTo(cx + 2, cy - 21.5);
    c.lineTo(cx + 6, cy - 21);
    c.stroke();

    c.fillStyle = 'rgba(224, 168, 120, 0.5)';
    c.beginPath();
    c.arc(cx, cy - 16, 1, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#cc8866';
    c.lineWidth = 1;
    c.beginPath();
    c.arc(cx, cy - 13, 3, 0.3, Math.PI - 0.3);
    c.stroke();
  } else if (dir === 'up') {
    c.fillStyle = '#3a2210';
    c.beginPath();
    c.ellipse(cx, cy - 22, 10, 7, 0, 0, Math.PI * 2);
    c.fill();
  } else if (dir === 'left') {
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.ellipse(cx - 3, cy - 18, 2.5, 2, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#2c1810';
    c.beginPath();
    c.arc(cx - 4, cy - 18, 1.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(224, 168, 120, 0.5)';
    c.beginPath();
    c.arc(cx - 1, cy - 16, 1, 0, Math.PI * 2);
    c.fill();
  } else {
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.ellipse(cx + 3, cy - 18, 2.5, 2, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#2c1810';
    c.beginPath();
    c.arc(cx + 4, cy - 18, 1.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(224, 168, 120, 0.5)';
    c.beginPath();
    c.arc(cx + 1, cy - 16, 1, 0, Math.PI * 2);
    c.fill();
  }
}

function generatePlayerSprites(scene: Phaser.Scene): void {
  const fw = 32, fh = 48;
  const dirs: ('down' | 'up' | 'left' | 'right')[] = ['down', 'up', 'left', 'right'];

  for (const dir of dirs) {
    for (let frame = 0; frame < 3; frame++) {
      const key = `player-${dir}-${frame}`;
      const [c, done] = ctx(scene, key, fw, fh);
      drawPlayerFrame(c, fw, fh, dir, frame);
      done();
    }
  }
}

function generateCustomerBase(scene: Phaser.Scene): void {
  // no-op for now: customers are drawn inline with varying appearances
}

function generatePlant(scene: Phaser.Scene): void {
  const sizes = [
    { key: 'plant-large', scale: 1.2 },
    { key: 'plant-small', scale: 0.8 },
  ];

  for (const def of sizes) {
    const s = def.scale;
    const pw = Math.ceil(24 * s);
    const ph = Math.ceil(36 * s);
    const [c, done] = ctx(scene, def.key, pw, ph);

    const cx2 = pw / 2;
    const potY = ph * 0.6;

    c.fillStyle = 'rgba(0,0,0,0.1)';
    c.beginPath();
    c.ellipse(cx2, ph - 2, pw / 2 - 2, 3, 0, 0, Math.PI * 2);
    c.fill();

    const potGrad = c.createLinearGradient(cx2 - 8 * s, potY, cx2 + 8 * s, potY);
    potGrad.addColorStop(0, '#7a4422');
    potGrad.addColorStop(0.5, '#9a5e3c');
    potGrad.addColorStop(1, '#7a4422');
    c.fillStyle = potGrad;
    roundRect(c, cx2 - 8 * s, potY, 16 * s, 14 * s, 2);
    c.fill();

    c.fillStyle = '#a06838';
    c.fillRect(cx2 - 9 * s, potY - 1, 18 * s, 4);

    c.fillStyle = '#5a3a18';
    c.fillRect(cx2 - 5 * s, potY + 2, 10 * s, 3);

    const leafR = 10 * s;
    const leafColors = ['#228b22', '#2ca02c', '#3cb043', '#27ae60'];
    const leafPositions = [
      { x: cx2, y: potY - leafR * 0.8, r: leafR },
      { x: cx2 - 4 * s, y: potY - leafR * 1.2, r: leafR * 0.7 },
      { x: cx2 + 5 * s, y: potY - leafR * 1.0, r: leafR * 0.6 },
      { x: cx2 - 2 * s, y: potY - leafR * 1.5, r: leafR * 0.5 },
    ];

    for (let i = 0; i < leafPositions.length; i++) {
      const lp = leafPositions[i];
      c.fillStyle = leafColors[i];
      c.beginPath();
      c.arc(lp.x, lp.y, lp.r, 0, Math.PI * 2);
      c.fill();
    }

    c.fillStyle = 'rgba(50, 180, 70, 0.4)';
    c.beginPath();
    c.arc(cx2 + 2 * s, potY - leafR * 1.3, leafR * 0.35, 0, Math.PI * 2);
    c.fill();

    done();
  }
}

function generateDisplayCase(scene: Phaser.Scene): void {
  const w = 100, h = 50;
  const [c, done] = ctx(scene, 'display-case', w, h);

  c.shadowColor = 'rgba(0,0,0,0.25)';
  c.shadowBlur = 4;
  c.shadowOffsetX = 3;
  c.shadowOffsetY = 3;

  const caseGrad = c.createLinearGradient(0, 0, 0, h);
  caseGrad.addColorStop(0, '#3c3c3c');
  caseGrad.addColorStop(1, '#2c2c2c');
  roundRect(c, 0, 0, w, h, 2);
  c.fillStyle = caseGrad;
  c.fill();
  c.shadowColor = 'transparent';

  c.fillStyle = '#4c4c4c';
  c.fillRect(0, 0, w, 4);

  const glassGrad = c.createLinearGradient(0, 4, 0, h - 4);
  glassGrad.addColorStop(0, 'rgba(120, 170, 210, 0.2)');
  glassGrad.addColorStop(0.5, 'rgba(100, 150, 190, 0.15)');
  glassGrad.addColorStop(1, 'rgba(120, 170, 210, 0.1)');
  c.fillStyle = glassGrad;
  c.fillRect(3, 4, w - 6, h - 8);

  c.fillStyle = 'rgba(255, 255, 255, 0.08)';
  c.fillRect(5, 6, w / 3, h - 14);

  const cardColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
  for (let i = 0; i < 5; i++) {
    const cardX = 10 + i * 16;
    const cardY = h / 2 - 8;

    roundRect(c, cardX, cardY, 12, 16, 1);
    c.fillStyle = cardColors[i];
    c.globalAlpha = 0.7;
    c.fill();

    c.globalAlpha = 0.3;
    c.fillStyle = '#ffd700';
    c.fillRect(cardX + 2, cardY + 2, 8, 4);
    c.globalAlpha = 0.2;
    c.fillStyle = '#ffffff';
    c.fillRect(cardX + 2, cardY + 8, 8, 3);
    c.globalAlpha = 1;
  }

  c.strokeStyle = '#555555';
  c.lineWidth = 1;
  roundRect(c, 0, 0, w, h, 2);
  c.stroke();

  done();
}

function generateWelcomeMat(scene: Phaser.Scene): void {
  const w = 120, h = 24;
  const [c, done] = ctx(scene, 'welcome-mat', w, h);

  const matGrad = c.createLinearGradient(0, 0, 0, h);
  matGrad.addColorStop(0, '#5a4a3a');
  matGrad.addColorStop(0.5, '#4a3a2a');
  matGrad.addColorStop(1, '#5a4a3a');
  roundRect(c, 0, 0, w, h, 4);
  c.fillStyle = matGrad;
  c.fill();

  c.strokeStyle = '#6a5a4a';
  c.lineWidth = 1;
  roundRect(c, 3, 3, w - 6, h - 6, 2);
  c.stroke();

  c.fillStyle = '#d4a854';
  c.globalAlpha = 0.6;
  c.font = 'bold 8px Georgia, serif';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText('WELCOME', w / 2, h / 2);
  c.globalAlpha = 1;

  done();
}

function generateHUDBar(scene: Phaser.Scene): void {
  const w = 800, h = 38;
  const [c, done] = ctx(scene, 'hud-bar', w, h);

  const barGrad = c.createLinearGradient(0, 0, 0, h);
  barGrad.addColorStop(0, 'rgba(20, 20, 40, 0.92)');
  barGrad.addColorStop(0.7, 'rgba(26, 26, 46, 0.88)');
  barGrad.addColorStop(1, 'rgba(30, 30, 50, 0.85)');
  c.fillStyle = barGrad;
  c.fillRect(0, 0, w, h);

  const goldGrad = c.createLinearGradient(0, h - 2, 0, h);
  goldGrad.addColorStop(0, 'rgba(212, 168, 84, 0.6)');
  goldGrad.addColorStop(1, 'rgba(212, 168, 84, 0.2)');
  c.fillStyle = goldGrad;
  c.fillRect(0, h - 2, w, 2);

  c.strokeStyle = 'rgba(212, 168, 84, 0.3)';
  c.lineWidth = 0.5;
  c.beginPath();
  c.moveTo(0, h - 3);
  c.lineTo(w, h - 3);
  c.stroke();

  done();
}
