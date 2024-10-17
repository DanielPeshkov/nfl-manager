import { Component, Input, Output } from '@angular/core';
import { Player } from '../models/player';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SocketService } from '../services/socket.service';
import { Team } from '../models/team';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  teams: Team[] = [];
  teamMap!: Map<string, string>;
  @Input() player = new Player(0, '', '', '', 0, '', 0, 0, 0, 0, '', 0, 0, '', '', '', 0, 0, 0)
  idField = new FormControl('idField');
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
    this.checkForPlayer();
    this.player = JSON.parse(localStorage.getItem('player')!);
    localStorage.setItem('teamText', this.player.team);
    this.idField.setValue(this.player.id.toString());
    this.idField.disable();
    this.codeField.setValue(this.player.code);
    this.codeField.disable();
    this.teamField.setValue(this.player.team);
    this.nameField.setValue(this.player.player);
    this.numField.setValue(this.player.num.toString());
    this.posField.setValue(this.player.pos);
    this.ageField.setValue(this.player.age.toString());
    this.yearField.setValue(this.player.years.toString());
    this.gpField.setValue(this.player.games_played.toString());
    this.gsField.setValue(this.player.games_started.toString());
    this.statField.setValue(this.player.status);
    this.hField.setValue(this.player.height.toString());
    this.wField.setValue(this.player.weight.toString());
    this.birthField.setValue(this.player.birth);
    this.colField.setValue(this.player.college);
    this.dtField.setValue(this.player.draft_team);
    this.dyField.setValue(this.player.draft_year.toString());
    this.rField.setValue(this.player.round.toString());
    this.pField.setValue(this.player.pick.toString());
  }

  checkForPlayer() {
    if (!localStorage.getItem('player')){
      this.router.navigate([`/players`]);
    }
  }

  changeCode() {
    const teamText = this.teamField.value!;
    const code = this.teamMap.get(teamText)!
    this.codeField.setValue(code);
  }

  submitTeam() {
    let data = {
      "id":this.idField.getRawValue()!,
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
    this.socketService.sendMessageWithID('putPlayer', data.id, JSON.stringify(data));
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

  delete() {
    const id = this.idField.getRawValue()!;
    this.socketService.sendMessage('deletePlayer', id);
    this.router.navigate(['/players']);
  }
}
