import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Team } from '../models/team';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [Router],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
  @Input() team: Team = new Team(0, '', '', '', '', '', '', '', '');
  
  @Output() deleteTeamEvent = new EventEmitter<string>();


  favoriteTeam: string = '';

  constructor(private router: Router) {}

  setFavoriteTeam() {}

  deleteTeam() {
    this.deleteTeamEvent.emit('Test Message');
  }

  showDetails() {
    this.router.navigate([ `team/${this.team.id}` ]);
  }
}
