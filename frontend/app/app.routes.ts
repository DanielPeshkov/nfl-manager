import { Routes } from '@angular/router';
import { TeamsComponent } from './teams/teams.component';
import { PlayersComponent } from './players/players.component';
import { PlayerComponent } from './player/player.component';
import { TeamComponent } from './team/team.component';
import { NewTeamComponent } from './new-team/new-team.component';
import { NewPlayerComponent } from './new-player/new-player.component';

export const routes: Routes = [
    {
        path: 'teams',
        component: TeamsComponent,
    },
    {
        path: 'team',
        component: TeamComponent,
    },
    {
        path: 'newteam',
        component: NewTeamComponent,
    },
    {
        path: 'players',
        component: PlayersComponent,
    },
    {
        path: 'player',
        component: PlayerComponent,
    },
    {
        path: 'newplayer',
        component: NewPlayerComponent,
    },
    {
        path: '',
        redirectTo: '/teams',
        pathMatch: 'full',
    },
    {
        path: '**',
        component: TeamsComponent,
    },
];
