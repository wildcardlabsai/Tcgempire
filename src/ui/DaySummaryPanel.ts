import { UIOverlay } from './UIOverlay';
import { DaySummary } from '../systems/DayManager';
import { GameState } from '../data/GameState';
import { getNextUpgrade } from '../data/ShopUpgrades';

export class DaySummaryPanel {
  private overlay: UIOverlay;

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  show(summary: DaySummary, onNextDay: () => void): void {
    const profit = summary.endingCash - summary.startingCash;
    const profitColor = profit >= 0 ? '#2ecc71' : '#e74c3c';
    const profitSign = profit >= 0 ? '+' : '';

    let tipHtml = '';
    if (summary.customersLost > 0) {
      tipHtml = `<p style="color:#f39c12;font-size:12px;text-align:center;margin-top:8px">
        ${summary.customersLost} customer${summary.customersLost > 1 ? 's' : ''} left without buying — serve faster or upgrade your shop!
      </p>`;
    }

    const next = getNextUpgrade(GameState.shopLevel);
    if (next && summary.endingCash >= next.upgradeCost) {
      tipHtml += `<p style="color:#ffd700;font-size:12px;text-align:center;margin-top:4px">
        You can afford to upgrade to "${next.name}" (£${next.upgradeCost.toLocaleString('en-GB')}) at the computer!
      </p>`;
    }

    const html = `
      <h2>Day ${summary.day} — Summary</h2>
      <div class="tcg-stat">
        <span class="tcg-stat-label">Customers Served</span>
        <span class="tcg-stat-value">${summary.customersServed}</span>
      </div>
      ${summary.customersLost > 0 ? `
      <div class="tcg-stat">
        <span class="tcg-stat-label">Customers Lost</span>
        <span class="tcg-stat-value" style="color:#e74c3c">${summary.customersLost}</span>
      </div>
      ` : ''}
      <div class="tcg-stat">
        <span class="tcg-stat-label">Revenue</span>
        <span class="tcg-stat-value" style="color:#2ecc71">£${summary.revenue.toLocaleString('en-GB')}</span>
      </div>
      <hr class="tcg-divider">
      <div class="tcg-stat">
        <span class="tcg-stat-label">Starting Cash</span>
        <span class="tcg-stat-value">£${summary.startingCash.toLocaleString('en-GB')}</span>
      </div>
      <div class="tcg-stat">
        <span class="tcg-stat-label">Ending Cash</span>
        <span class="tcg-stat-value">£${summary.endingCash.toLocaleString('en-GB')}</span>
      </div>
      <div class="tcg-stat">
        <span class="tcg-stat-label">Profit</span>
        <span class="tcg-stat-value" style="color:${profitColor}">${profitSign}£${Math.abs(profit).toLocaleString('en-GB')}</span>
      </div>
      ${tipHtml}
      <div class="tcg-center">
        <button class="tcg-btn tcg-btn-primary" id="tcg-next-day">
          Start Day ${summary.day + 1}
        </button>
      </div>
    `;

    this.overlay.show(html);

    this.overlay.onClick('#tcg-next-day', () => {
      this.overlay.hide();
      onNextDay();
    });
  }
}
