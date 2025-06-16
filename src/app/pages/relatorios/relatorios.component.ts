import { FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';

import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardDataDto } from '../../core/interfaces/clients-dtos.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorios',
  imports: [FormsModule, CommonModule],
  templateUrl: './relatorios.component.html',
})
export class RelatoriosComponent implements OnInit {
  private clientService = inject(ClientService);
  dashboardData = signal<DashboardDataDto | null>(null);
  selectedPeriod: 'today' | 'week' | 'month' = 'month';

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.clientService.onGetDashboard(this.selectedPeriod).subscribe({
      next: (data: DashboardDataDto) => {
        this.dashboardData.set(data);
      },
      error: (error: any) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        this.dashboardData.set(null);
      },
    });
  }
}
