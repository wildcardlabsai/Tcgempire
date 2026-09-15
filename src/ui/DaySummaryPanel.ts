import { UIOverlay } from './UIOverlay';
import { DaySummary } from '../systems/DayManager';

export class DaySummaryPanel {
  private overlay: UIOverlay;

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  show(summary: DaySummary, onNextDay: () => void): void {
    const profit = summary.endingCash - summary.startingCash;
    const profitColor = profit >= 0 ? '#2ecc71' : '#e74c3c';
    const profitSign = profit >= 0 ? '+' : '';

    const html = `
      <h2>Day ${summary.day} — Summary</h2>
      <div class="tcg-stat">
        <span class="tcg-stat-label">Customers Served</span>
        <span class="tcg-stat-value">${summary.customersServed}</span>
      </div>
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
