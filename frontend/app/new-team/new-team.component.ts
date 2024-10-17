import { Component, Input } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Team } from '../models/team';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-new-team',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule],
  templateUrl: './new-team.component.html',
  styleUrl: './new-team.component.css'
})
export class NewTeamComponent {
  teams: Team[] = [];
  teamMap!: Map<string, string>;
  @Input() team: Team = new Team(0, '', '', '', '', '', '', '', '');
  codeField = new FormControl('codeField');
  teamField = new FormControl('teamField');
  coachField = new FormControl('coachField');
  offField = new FormControl('offField');
  defField = new FormControl('defField');
  stadField = new FormControl('stadField');
  ownField = new FormControl('ownField');
  gmField = new FormControl('gmField');


  constructor(private router: Router, private socketService: SocketService) {
    this.checkForTeam();
    this.team = JSON.parse(localStorage.getItem('team')!);
    localStorage.setItem('teamText', this.team.name);
    this.codeField.setValue("");
    this.teamField.setValue("");
    this.coachField.setValue("");
    this.offField.setValue("");
    this.defField.setValue('');
    this.stadField.setValue('');
    this.ownField.setValue('');
    this.gmField.setValue('');
  }

  checkForTeam() {
    if (!localStorage.getItem('team')){
      this.router.navigate([`/teams`]);
    }
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

  changeCode() {
    const teamText = this.teamField.value!;
    const code = this.teamMap.get(teamText)!
    this.codeField.setValue(code);
  }

  submitTeam() {
    if (this.codeField.getRawValue()?.length != 3) {
      return;
    }
    if (Array.from(this.teamMap.values()).includes(this.codeField.getRawValue()!)){
      return;
    }
    let data = {
      "code":this.codeField.getRawValue(),
      "name":this.teamField.getRawValue(),
      "coach":this.coachField.getRawValue(),
      "off_coord":this.offField.getRawValue(),
      "def_coord":this.defField.getRawValue(),
      "stadium":this.stadField.getRawValue(),
      "owner":this.ownField.getRawValue(),
      "gm":this.gmField.getRawValue(),
    }
    this.socketService.sendMessage('postTeam', JSON.stringify(data));
    this.router.navigate(['/teams']);
  }

  cancel() {
    this.router.navigate(['/teams']);
  }
}
