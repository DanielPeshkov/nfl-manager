import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Team } from '../models/team';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent implements OnInit{
  teams: Team[] = [];

  constructor(private socketService: SocketService) {};
  

  sendMessage() {
    console.log('sendMessage')
    this.socketService.sendMessage('getTeams', '');
  }

  ngOnInit() {
    this.sendMessage();

    this.socketService.onEvent('getTeams').subscribe((data) => {
      console.log(data);
      
      let tempTeams: Team[] = [];
      if (data)
        for (let team of data) {
          tempTeams.push(new Team(team.id, team.code, team.name, team.coach, 
            team.off_coord, team.def_coord, team.stadium, 
            team.owner, team.gm));
          
      }
      this.teams = tempTeams;
      console.log('Initialized Teams: ', this.teams[0]);
    });
    
    console.log('end of init', this.teams);
  }

}