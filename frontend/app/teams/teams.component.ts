import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Team } from '../models/team';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ReactiveFormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent implements OnInit{
  teams: Team[] = [];
  tableTeams: Team[] = [];
  idFilter = new FormControl('idFilter');
  codeFilter = new FormControl('codeFilter');
  teamFilter = new FormControl('teamFilter');
  coachFilter = new FormControl('coachFilter');
  offFilter = new FormControl('offFilter');
  defFilter = new FormControl('defFilter');
  stadFilter = new FormControl('stadFilter');
  ownFilter = new FormControl('ownFilter');
  gmFilter = new FormControl('gmFilter');
  router: Router;

  constructor(private socketService: SocketService, router: Router) {
    this.router = router;
    let idText = localStorage.getItem('tidText') ? localStorage.getItem('tidText') : '';
    let codeText = localStorage.getItem('codeText') ? localStorage.getItem('codeText') : '';
    let teamText = localStorage.getItem('teamText') ? localStorage.getItem('teamText') : '';
    let coachText = localStorage.getItem('coachText') ? localStorage.getItem('coachText') : '';
    let offText = localStorage.getItem('offText') ? localStorage.getItem('offText') : '';
    let defText = localStorage.getItem('defText') ? localStorage.getItem('defText') : '';
    let stadText = localStorage.getItem('stadText') ? localStorage.getItem('stadText') : '';
    let ownText = localStorage.getItem('ownText') ? localStorage.getItem('ownText') : '';
    let gmText = localStorage.getItem('gmText') ? localStorage.getItem('gmText') : '';
    this.idFilter.setValue(idText);
    this.codeFilter.setValue(codeText);
    this.teamFilter.setValue(teamText);
    this.coachFilter.setValue(coachText);
    this.offFilter.setValue(offText);
    this.defFilter.setValue(defText);
    this.stadFilter.setValue(stadText);
    this.ownFilter.setValue(ownText);
    this.gmFilter.setValue(gmText);
  };
  

  sendMessage() {
    console.log('sendMessage')
    this.socketService.sendMessage('getTeams', '');
  }

  ngOnInit() {
    this.sendMessage();

    this.socketService.getTeams('getTeams').subscribe((data) => {
      let tempTeams: Team[] = [];
      if (data)
        for (let team of data) {
          tempTeams.push(new Team(team.id, team.code, team.name, team.coach, 
            team.off_coord, team.def_coord, team.stadium, 
            team.owner, team.gm));
          
      }
      this.teams = tempTeams;
      this.tableTeams = this.teams;
    });

    this.socketService.postTeam('postTeam').subscribe((data) => {
      let team = new Team(data.id, data.code, data.name, data.coach, data.off_coord, 
                          data.def_coord, data.stadium, data.owner, data.gm);
      this.teams.push(team);
      this.filterTeam();
    });

    this.socketService.putTeam('putTeam').subscribe((data) => {
      let team = new Team(data.id, data.code, data.name, data.coach, data.off_coord, 
                          data.def_coord, data.stadium, data.owner, data.gm);
      const id = team.id;
      for (let i = 0; i < this.teams.length; i++) {
        if (id == this.teams[i].id) {
          this.teams[i] = team;
          this.filterTeam();
          return;
        }
      }
    });

    this.socketService.deleteTeam('deleteTeam').subscribe((data) => {
      data = data.toString();
      for (let i = 0; i < this.teams.length; i++) {
        const id = this.teams[i].id;
        if (id == data) {
          this.teams.splice(i, 1);
          this.filterTeam();
          return;
        }
      }
    });
  }

  rowClick(team: Team) {
    localStorage.setItem('team', JSON.stringify(team));
    this.router.navigate([`./team`]);
  }

  filterTeam() {
    const idText = this.idFilter.getRawValue()!.toLowerCase();
    const codeText = this.codeFilter.getRawValue()!.toLowerCase();
    const teamText = this.teamFilter.getRawValue()!.toLowerCase();
    const coachText = this.coachFilter.getRawValue()!.toLowerCase();
    const offText = this.offFilter.getRawValue()!.toLowerCase();
    const defText = this.defFilter.getRawValue()!.toLowerCase();
    const stadText = this.stadFilter.getRawValue()!.toLowerCase(); 
    const ownText = this.ownFilter.getRawValue()!.toLowerCase(); 
    const gmText = this.gmFilter.getRawValue()!.toLowerCase(); 
    localStorage.setItem('tidText', idText);
    localStorage.setItem('codeText', codeText);
    localStorage.setItem('teamText', teamText);
    localStorage.setItem('coachText', coachText);
    localStorage.setItem('offText', offText);
    localStorage.setItem('defText', defText);
    localStorage.setItem('stadText', stadText);
    localStorage.setItem('ownText', ownText);
    localStorage.setItem('gmText', gmText);
    let tempTeams: Team[] = [];

    if (!(idText || codeText || teamText || coachText || offText || defText || stadText || ownText || gmText)) {
      this.tableTeams = this.teams;
        return;
    }

    for (let i = 0; i < this.teams.length; i++) {
        const id = this.teams[i].id.toString();
        const code = this.teams[i].code.toLowerCase();
        const team = this.teams[i].name.toLowerCase();
        const coach = this.teams[i].coach.toLowerCase();
        const off = this.teams[i].off_coord.toString();
        const def = this.teams[i].def_coord.toString();
        const stad = this.teams[i].stadium.toString();
        const own = this.teams[i].owner.toString();
        const gm = this.teams[i].gm.toString();
        if ((id.includes(idText)) && (code.includes(codeText)) && (team.includes(teamText)) 
          && (coach.includes(coachText)) && (off.includes(offText)) 
          && (def.includes(defText)) && (stad.includes(stadText)) 
          && (own.includes(ownText)) && (gm.includes(gmText))) {
            tempTeams.push(this.teams[i]);
        }
    }
    this.tableTeams = tempTeams;
}  
}