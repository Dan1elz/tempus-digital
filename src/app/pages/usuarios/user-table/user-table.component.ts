import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import {
  GetUsersDto,
  UserDto,
} from '../../../core/interfaces/users-dtos.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-table',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-table.component.html',
})
export class UserTableComponent {
  private readonly userService = inject(UserService);
  columns: { key: keyof UserDto; header: string }[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
  ];

  data: UserDto[] = [];
  currentPage = 1;
  pageSize = 9999;
  totalItems = 0;
  loading = false;
  id = signal<string | undefined>(undefined);
  searchTerm = signal<string>('');
  ngOnInit() {
    this.fetchUsers();
  }
  @ViewChild('modal') modal!: ElementRef;

  fetchUsers() {
    this.loading = true;
    var params: GetUsersDto = {
      search: this.searchTerm(),
      per_page: this.pageSize,
    };
    this.userService
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

  setCurrentPage(page: number) {
    this.currentPage = page;
    this.fetchUsers();
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.fetchUsers();
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
    this.userService.onDelete(id).subscribe({
      next: () => {
        this.onCloseModal();
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Erro ao deletar usuário', err);
      },
    });
  }
  onSearch() {
    this.currentPage = 1;
    this.fetchUsers();
  }
}
