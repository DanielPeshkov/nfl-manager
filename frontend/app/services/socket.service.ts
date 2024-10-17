import { ApplicationRef, inject, Injectable, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { first, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit{
  private socket: any;

  constructor() {
    console.log('socket constructor')
    this.socket = io('http://localhost:8080')
  }

  sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }

  sendMessageWithID(event: string, id: string, data: any) {
    this.socket.emit(event, id, data);
  }

  getTeams(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on('getTeams', (data:any) => {
        observer.next(data);
      });
    });
  }

  postTeam(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on('postTeam', (data:any) => {
        observer.next(data);
      });
    });
  }

  putTeam(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on('putTeam', (data:any) => {
        observer.next(data);
      });
    });
  }

  deleteTeam(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on('deleteTeam', (data:any) => {
        observer.next(data);
      });
    });
  }

  getPlayers(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on('getPlayers', (data:any) => {
        observer.next(data);
      });
    });
  }

  postPlayer(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on('postPlayer', (data:any) => {
        observer.next(data);
      });
    });
  }

  putPlayer(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on('putPlayer', (data:any) => {
        observer.next(data);
      });
    });
  }

  deletePlayer(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on('deletePlayer', (data:any) => {
        observer.next(data);
      });
    });
  }

  ngOnInit(): void {
      // this.socket.connect();
  }
}

