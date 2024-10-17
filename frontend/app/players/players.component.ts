import { Component, ElementRef, ViewChild } from '@angular/core';
import { Player } from '../models/player';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css'
})
export class PlayersComponent {
  players: Player[] = [];
  tablePlayers: Player[] = [];
  idFilter = new FormControl('idFilter');
  codeFilter = new FormControl('codeFilter');
  teamFilter = new FormControl('teamFilter');
  nameFilter = new FormControl('nameFilter');
  numFilter = new FormControl('numFilter');
  posFilter = new FormControl('posFilter');
  ageFilter = new FormControl('ageFilter');
  router: Router;

  constructor(private socketService: SocketService, router: Router) {
    this.router = router;
    let idText = localStorage.getItem('idText') ? localStorage.getItem('idText') : '';
    let codeText = localStorage.getItem('codeText') ? localStorage.getItem('codeText') : '';
    let teamText = localStorage.getItem('teamText') ? localStorage.getItem('teamText') : '';
    let nameText = localStorage.getItem('nameText') ? localStorage.getItem('nameText') : '';
    let numText = localStorage.getItem('numText') ? localStorage.getItem('numText') : '';
    let posText = localStorage.getItem('posText') ? localStorage.getItem('posText') : '';
    let ageText = localStorage.getItem('ageText') ? localStorage.getItem('ageText') : '';
    this.idFilter.setValue(idText);
    this.codeFilter.setValue(codeText);
    this.teamFilter.setValue(teamText);
    this.nameFilter.setValue(nameText);
    this.numFilter.setValue(numText);
    this.posFilter.setValue(posText);
    this.ageFilter.setValue(ageText);

  }; 

  sendMessage() {
    console.log('sendMessage')
    this.socketService.sendMessage('getPlayers', '');
  }

  ngOnInit() {
    this.sendMessage();

    this.socketService.getPlayers('getPlayers').subscribe((data) => {
      let tempPlayers: Player[] = [];
      if (data)
        for (let player of data) {
          tempPlayers.push(new Player(player.id, player.code, player.team, player.player,
            player.num, player.pos, player.age, player.years, player.games_played, 
            player.games_started, player.status, player.height, player.weight, player.birth,
            player.college, player.draft_team, player.draft_year, player.round, player.pick
          ));
          
      }
      this.players = tempPlayers;
      this.filterPlayer();
      console.log('Initialized Players: ', this.players.length);
    });

    this.socketService.postPlayer('postPlayer').subscribe((data) => {
      let player = new Player(data.id, data.code, data.team, data.player,
        data.num, data.pos, data.age, data.years, data.games_played, 
        data.games_started, data.status, data.height, data.weight, data.birth,
        data.college, data.draft_team, data.draft_year, data.round, data.pick
      );
      this.players.push(player);
      this.filterPlayer();
    });

    this.socketService.putPlayer('putPlayer').subscribe((data) => {
      let player = new Player(data.id, data.code, data.team, data.player,
        data.num, data.pos, data.age, data.years, data.games_played, 
        data.games_started, data.status, data.height, data.weight, data.birth,
        data.college, data.draft_team, data.draft_year, data.round, data.pick
      );
      const id = player.id;
      for (let i = 0; i < this.players.length; i++) {
        if (id == this.players[i].id) {
          this.players[i] = player;
          this.filterPlayer();
          return;
        }
      }
    });

    this.socketService.deletePlayer('deletePlayer').subscribe((data) => {
      data = data.toString();
      for (let i = 0; i < this.players.length; i++) {
        const id = this.players[i].id;
        if (id == data) {
          this.players.splice(i, 1);
          this.filterPlayer();
          return;
        }
      }
    });
  }

  rowClick(player: Player) {
    const idText = this.idFilter.getRawValue()!.toLowerCase();
    const codeText = this.codeFilter.getRawValue()!.toLowerCase();
    const teamText = this.teamFilter.getRawValue()!.toLowerCase();
    const nameText = this.nameFilter.getRawValue()!.toLowerCase();
    const numText = this.numFilter.getRawValue()!.toLowerCase();
    const posText = this.posFilter.getRawValue()!.toLowerCase();
    const ageText = this.ageFilter.getRawValue()!.toLowerCase();    

    localStorage.setItem('player', JSON.stringify(player));
    this.router.navigate([`./player`]);
  }

  filterPlayer() {
    const idText = this.idFilter.getRawValue()!.toLowerCase();
    const codeText = this.codeFilter.getRawValue()!.toLowerCase();
    const teamText = this.teamFilter.getRawValue()!.toLowerCase();
    const nameText = this.nameFilter.getRawValue()!.toLowerCase();
    const numText = this.numFilter.getRawValue()!.toLowerCase();
    const posText = this.posFilter.getRawValue()!.toLowerCase();
    const ageText = this.ageFilter.getRawValue()!.toLowerCase(); 
    localStorage.setItem('idText', idText);
    localStorage.setItem('codeText', codeText);
    localStorage.setItem('teamText', teamText);
    localStorage.setItem('nameText', nameText);
    localStorage.setItem('numText', numText);
    localStorage.setItem('posText', posText);
    localStorage.setItem('ageText', ageText);
    let tempPlayers: Player[] = [];

    if (!(idText || codeText || teamText || nameText || numText || posText || ageText)) {
      this.tablePlayers = this.players;
        return;
    }

    for (let i = 0; i < this.players.length; i++) {
        const id = this.players[i].id.toString();
        const code = this.players[i].code.toLowerCase();
        const team = this.players[i].team.toLowerCase();
        const name = this.players[i].player.toLowerCase();
        const num = this.players[i].num ? this.players[i].num.toString() : '';
        const position = this.players[i].pos.toLowerCase();
        const age = this.players[i].age ? this.players[i].age.toString() : '';
        if ((id.includes(idText)) && (code.includes(codeText)) && (team.includes(teamText)) && (name.includes(nameText)) && (num.includes(numText)) && (position.includes(posText)) && (age.includes(ageText))) {
            tempPlayers.push(this.players[i]);
        }
    }
    this.tablePlayers = tempPlayers;
}  
}
