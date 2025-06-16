import { Component, OnInit, inject } from '@angular/core';
import { RegisterUserDto } from '../../../core/interfaces/users-dtos.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-forms',
  standalone: true,
  imports: [FormsModule, RouterLink, NgClass],
  templateUrl: './user-forms.component.html',
})
export class UserFormsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  user: RegisterUserDto = {
    id: '',
    name: '',
    email: '',
  };
  isEditMode: boolean = false;
  loading: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');
      if (userId) {
        this.isEditMode = true;
        this.user.id = userId;
        this.loadUserData(userId);
      }
    });
  }

  loadUserData(id: string): void {
    this.loading = true;
    this.userService.onGetById(id).subscribe({
      next: (data: any) => {
        this.user = data.data as RegisterUserDto;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user data:', err);
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser(): void {
    this.loading = true;
    const { id, ...userToCreate } = this.user;
    this.userService.onCreate(userToCreate).subscribe({
      next: (res) => {
        console.log('User created:', res);
        this.loading = false;
        this.router.navigate(['/auth/usuarios']);
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.loading = false;
      },
    });
  }

  updateUser(): void {
    if (!this.user.id) {
      console.error('Cannot update user without an ID.');
      return;
    }
    this.loading = true;
    this.userService.onUpdate(this.user).subscribe({
      next: (res) => {
        console.log('User updated:', res);
        this.loading = false;
        this.router.navigate(['/auth/usuarios']);
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.loading = false;
      },
    });
  }
}
