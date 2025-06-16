import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import {
  ClientDto,
  GetClientsDto,
} from '../../../core/interfaces/clients-dtos.interface';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-client-table',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './client-table.component.html',
})
export class ClientTableComponent {
  private readonly clientService = inject(ClientService);
  columns: { key: keyof ClientDto; header: string }[] = [
    { key: 'nome', header: 'Nome' },
    { key: 'renda_familiar', header: 'Renda Familiar' },
  ];

  data: ClientDto[] = [];
  currentPage = 1;
  pageSize = 9999;
  totalItems = 0;
  loading = false;
  id = signal<string | undefined>(undefined);
  searchTerm = signal<string>('');

  ngOnInit() {
    this.fetchClients();
  }
  @ViewChild('modal') modal!: ElementRef;

  fetchClients() {
    this.loading = true;
    var params: GetClientsDto = {
      search: this.searchTerm(),
      per_page: this.pageSize,
    };
    this.clientService
      .onGetAll(params, this.currentPage)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.data = res.data;
          this.totalItems = res.total;
          this.currentPage = res.current_page;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar usuários', err);
          this.loading = false;
        },
      });
  }
  onSearch() {
    this.currentPage = 1;
    this.fetchClients();
  }
  onOpenModal(id: string) {
    this.modal.nativeElement.showModal();
    this.modal.nativeElement.classList.add('active');
    this.id.set(id);
  }
  onCloseModal() {
    this.modal.nativeElement.classList.remove('active');
    this.modal.nativeElement.close();
    this.id.set(undefined);
  }
  onDelete() {
    const id = this.id();
    if (!id) return;
    this.clientService.onDelete(id).subscribe({
      next: () => {
        this.onCloseModal();
        this.fetchClients();
      },
      error: (err) => {
        console.error('Erro ao deletar cliente', err);
      },
    });
  }

  formatRenda(value: number): string {
    return `R$ ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }

  getBadgeClass(value: number): string {
    if (value <= 980) {
      return 'bg-red-500 text-white';
    } else if (value <= 2500) {
      return 'bg-yellow-400 text-black';
    } else {
      return 'bg-green-500 text-white';
    }
  }
}
