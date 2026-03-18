import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  private reportService = inject(ReportService);

  activeTab = signal<'sales' | 'leads' | 'properties' | 'agents'>('sales');
  loading = signal(true);
  salesData = signal<any>(null);
  leadsData = signal<any>(null);
  propertiesData = signal<any>(null);
  agentsData = signal<any>(null);

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.loading.set(true);
    Promise.all([
      this.reportService.getSalesReport().toPromise(),
      this.reportService.getLeadsReport().toPromise(),
      this.reportService.getPropertiesReport().toPromise(),
      this.reportService.getAgentsReport().toPromise(),
    ]).then(([sales, leads, properties, agents]) => {
      this.salesData.set(sales);
      this.leadsData.set(leads);
      this.propertiesData.set(properties);
      this.agentsData.set(agents);
      this.loading.set(false);
    }).catch(() => this.loading.set(false));
  }

  setTab(tab: 'sales' | 'leads' | 'properties' | 'agents'): void {
    this.activeTab.set(tab);
  }
}
