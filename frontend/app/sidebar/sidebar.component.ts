import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/teams', title: 'Teams',  icon: 'pe-7s-menu', class: '' },
  { path: '/newteam', title: 'New Team',  icon:'pe-7s-user', class: '' },
  { path: '/players', title: 'Players',  icon:'pe-7s-note2', class: '' },
  { path: '/newplayer', title: 'New Player',  icon:'pe-7s-news-paper', class: '' },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems: any[];

  constructor() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

}
