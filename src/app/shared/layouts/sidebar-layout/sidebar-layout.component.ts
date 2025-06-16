import { UserService } from './../../../core/services/user.service';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-sidebar-layout',
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="flex h-screen bg-gray-100">
      <aside
        class="bg-purple-900 text-white transition-all duration-300 ease-in-out
           fixed top-0 left-0 h-full z-40
           md:relative"
        [class.w-[220px]]="isSidebarOpen && !isMobile"
        [class.w-[70px]]="!isSidebarOpen && !isMobile"
        [class.w-full]="isSidebarOpen && isMobile"
        [class.hidden]="!isSidebarOpen && isMobile"
      >
        <!-- Button Pc -->
        <button
          *ngIf="!isMobile"
          class="absolute right-0 top-[35px] translate-x-1/2 bg-purple-800 hover:bg-purple-950 text-white font-bold rounded-[8px]
           transition-colors duration-200 ease-in-out
            w-[2rem] h-[2rem]
           "
          (click)="toggleSidebar()"
        >
          <i
            class="bi"
            [ngClass]="isSidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'"
          ></i>
        </button>
        <!-- Top Section -->
        <div class="flex flex-col items-center justify-center mt-8 mb-8">
          <!-- Logo -->
          <div
            class="pacifico-regular"
            [ngStyle]="{
              'font-size': !isSidebarOpen && !isMobile ? '10px' : '25px',
              margin: '8px 0'
            }"
          >
            Tempus Digital
          </div>
          <!-- Menu Options -->
          <div class="flex flex-col gap-1 w-full items-center">
            <button
              style="padding: 0 15px;"
              class="w-[100%] h-8 md:h-8 lg:h-[3rem] max-w-[85%] flex items-center rounded-lg hover:bg-purple-700 transition-colors duration-200 text-white gap-3"
              [routerLink]="['/auth/relatorios']"
              routerLinkActive="router-link-active"
              (click)="toggleSidebarMobile()"
            >
              <i class="bi bi-bar-chart mr-2" style="font-size: 20px;"></i>
              <span *ngIf="isSidebarOpen || isMobile">Relatórios</span>
            </button>
            <button
              style="padding: 0 15px;"
              class=" w-[100%] h-8 md:h-8 lg:h-[3rem] max-w-[85%] flex items-center rounded-lg hover:bg-purple-700 transition-colors duration-200 text-white gap-3"
              [routerLink]="['/auth/clientes']"
              routerLinkActive="router-link-active"
              (click)="toggleSidebarMobile()"
            >
              <i class="bi bi-people mr-2" style="font-size: 20px;"></i>
              <span *ngIf="isSidebarOpen || isMobile">Clientes</span>
            </button>
            <button
              style="padding: 0 15px;"
              class=" w-[100%] h-8 md:h-8 lg:h-[3rem] max-w-[85%] flex items-center rounded-lg hover:bg-purple-700 transition-colors duration-200 text-white gap-3"
              [routerLink]="['/auth/usuarios']"
              routerLinkActive="router-link-active"
              (click)="toggleSidebarMobile()"
            >
              <i class="bi bi-person mr-2" style="font-size: 20px;"></i>
              <span *ngIf="isSidebarOpen || isMobile">Usuários</span>
            </button>
            <button
              style="padding: 0 15px;"
              class=" w-[100%] h-8 md:h-8 lg:h-[3rem] max-w-[85%] flex items-center rounded-lg hover:bg-purple-700 transition-colors duration-200 text-white gap-3"
              [routerLink]="['/auth/configuracoes']"
              routerLinkActive="router-link-active"
              (click)="toggleSidebarMobile()"
            >
              <i class="bi bi-gear mr-2" style="font-size: 20px;"></i>
              <span *ngIf="isSidebarOpen || isMobile">Configurações</span>
            </button>
          </div>
        </div>

        <div class=" absolute bottom-8 left-0 w-full flex justify-center">
          <button
            style="padding: 0 15px;"
            class=" w-[100%] h-8 md:h-8 lg:h-[3rem] max-w-[85%] flex items-center rounded-lg hover:bg-purple-700 transition-colors duration-200 text-red-500 gap-3"
            (click)="logout()"
          >
            <i class="bi bi-box-arrow-left" style="font-size: 20px;"></i>
            <span *ngIf="isSidebarOpen || isMobile">Logout</span>
          </button>
        </div>
      </aside>
      <!-- Button Mobile -->
      <button
        *ngIf="isMobile"
        class="fixed top-[15px] right-[15px] w-[2.5rem] h-[2.5rem] border border-white/15 rounded-[8px] bg-purple-900 text-white z-50 flex items-center justify-center shadow-md"
        (click)="toggleSidebar()"
      >
        <i class="bi" [ngClass]="isSidebarOpen ? 'bi-x-lg' : 'bi-list'"></i>
      </button>

      <div
        *ngIf="isSidebarOpen && isMobile"
        class="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        (click)="toggleSidebar()"
      ></div>

      <main
        class="flex-1 p-8 overflow-y-auto transition-all duration-300 ease-in-out"
      >
        <router-outlet />
      </main>
    </div>
  `,
})
export class SidebarLayoutComponent implements OnInit {
  private userService = inject(UserService);
  isSidebarOpen: boolean = true;
  isMobile: boolean = false;

  ngOnInit(): void {
    this.checkIsMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIsMobile();
  }

  checkIsMobile(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSidebarMobile(): void {
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  logout(): void {
    this.userService.onLogout().pipe(take(1)).subscribe();
  }
}
