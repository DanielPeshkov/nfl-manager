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
    this.socket = io('http://localhost:8080')//, {autoConnect:false});
    // inject(ApplicationRef).isStable.pipe(
    //   first((isStable) => isStable))
    // .subscribe(() => { this.socket.connect() });
  }

  sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }

  onEvent(event: string): Observable<any> {
    console.log('onEvent');
    // const subject = new Subject<any>();
    // this.socket.on(event, (data: any) => {
    //   subject.next(data);
    // });

    // return subject.asObservable();
    return new Observable(observer => {
      this.socket.on('getTeams', (data:any) => {
        observer.next(data);
      });
    });
  }

  ngOnInit(): void {
      // this.socket.connect();
  }
}

