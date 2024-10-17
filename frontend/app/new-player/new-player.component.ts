import { Component, Input } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Player } from '../models/player';
import { Team } from '../models/team';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-new-player',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule],
  templateUrl: './new-player.component.html',
  styleUrl: './new-player.component.css'
})
export class NewPlayerComponent {
  teams: Team[] = [];
  teamMap!: Map<string, string>;
  @Input() player = new Player(0, '', '', '', 0, '', 0, 0, 0, 0, '', 0, 0, '', '', '', 0, 0, 0)
  codeField = new FormControl('codeField');
  teamField = new FormControl('teamField');
  nameField = new FormControl('coachField');
  numField = new FormControl('offField');
  posField = new FormControl('defField');
  ageField = new FormControl('stadField');
  yearField = new FormControl('yearField');
  gpField = new FormControl('gpField');
  gsField = new FormControl('gsField');
  statField = new FormControl('statField');
  hField = new FormControl('hField');
  wField = new FormControl('wField');
  birthField = new FormControl('birthField');
  colField = new FormControl('colField');
  dtField = new FormControl('dtField');
  dyField = new FormControl('dyField');
  rField = new FormControl('rField');
  pField = new FormControl('pField');

  constructor(private router: Router, private socketService: SocketService) {
    localStorage.setItem('teamText', this.player.team);
    this.codeField.setValue('');
    this.codeField.disable();
    this.teamField.setValue('');
    this.nameField.setValue('');
    this.numField.setValue('');
    this.posField.setValue('');
    this.ageField.setValue('');
    this.yearField.setValue('');
    this.gpField.setValue('');
    this.gsField.setValue('');
    this.statField.setValue('');
    this.hField.setValue('');
    this.wField.setValue('');
    this.birthField.setValue('');
    this.colField.setValue('');
    this.dtField.setValue('');
    this.dyField.setValue('');
    this.rField.setValue('');
    this.pField.setValue('');
  }

  changeCode() {
    const teamText = this.teamField.value!;
    const code = this.teamMap.get(teamText)!
    this.codeField.setValue(code);
  }

  submitPlayer() {
    let data = {
      "code":this.codeField.getRawValue(),
      "team":this.teamField.getRawValue(),
      "player":this.nameField.getRawValue(),
      "num":this.numField.getRawValue(),
      "pos":this.posField.getRawValue(),
      "age":this.ageField.getRawValue(),
      "years":this.yearField.getRawValue(),
      "games_played":this.gpField.getRawValue(),
      "games_started":this.gsField.getRawValue(),
      "status":this.statField.getRawValue(),
      "height":this.hField.getRawValue(),
      "weight":this.wField.getRawValue(),
      "birth":this.birthField.getRawValue(),
      "college":this.colField.getRawValue(),
      "draft_team":this.dtField.getRawValue(),
      "draft_year":this.dyField.getRawValue(),
      "round":this.rField.getRawValue(),
      "pick":this.pField.getRawValue(),
    }
    this.socketService.sendMessage('postPlayer', JSON.stringify(data));
    this.router.navigate(['/players']);
  }

  cancel() {
    this.router.navigate(['/players']);
  }

  sendMessage() {
    this.socketService.sendMessage('getTeams', '');
  }

  ngOnInit() {
    this.sendMessage();

    this.socketService.getTeams('getTeams').subscribe((data) => {
      let tempTeams: Team[] = [];
      let tempMap: Map<string, string> = new Map<string, string>();
      if (data)
        for (let team of data) {
          tempTeams.push(new Team(team.id, team.code, team.name, team.coach, 
            team.off_coord, team.def_coord, team.stadium, 
            team.owner, team.gm));
          tempMap.set(team.name, team.code);
      }
      this.teams = tempTeams;
      this.teamMap = tempMap;
    });

    this.socketService.postTeam('postTeam').subscribe((data) => {
      let team = new Team(data.id, data.code, data.name, data.coach, data.off_coord, 
                          data.def_coord, data.stadium, data.owner, data.gm);
      this.teams.push(team);
      this.teamMap.set(team.name, team.code);
    });

    this.socketService.putTeam('putTeam').subscribe((data) => {
      let team = new Team(data.id, data.code, data.name, data.coach, data.off_coord, 
                          data.def_coord, data.stadium, data.owner, data.gm);
      const id = team.id;
      for (let i = 0; i < this.teams.length; i++) {
        if (id == this.teams[i].id) {
          this.teams[i] = team;
          this.teamMap.set(team.name, team.code);
          return;
        }
      }
    });

    this.socketService.deleteTeam('deleteTeam').subscribe((data) => {
      data = data.toString();
      for (let i = 0; i < this.teams.length; i++) {
        const id = this.teams[i].id;
        const name = this.teams[i].name;
        if (id == data) {
          this.teams.splice(i, 1);
          this.teamMap.delete(name);
          return;
        }
      }
    });
  }
}
