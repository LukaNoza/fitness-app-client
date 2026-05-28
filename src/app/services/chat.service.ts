import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ChatMessage {
  userId: string;
  message: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private hubConnection!: HubConnection;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private authService: AuthService) {}

  startConnection() {
    const token = this.authService.getToken();
    
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7053/chatHub', {
        accessTokenFactory: () => token || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('✅ Chat connected'))
      .catch(err => console.error('❌ Chat error:', err));

    this.hubConnection.on('ReceiveMessage', (userId: string, message: string, timestamp: Date) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, { userId, message, timestamp }]);
    });
  }

  joinChatRoom(trainerId: number, clientId: number) {
    this.hubConnection.invoke('JoinChatRoom', trainerId, clientId);
    this.messagesSubject.next([]); // გასუფთავება ახალ ოთახში შესვლისას
  }

  sendMessage(trainerId: number, clientId: number, message: string) {
    this.hubConnection.invoke('SendToRoom', trainerId, clientId, message);
  }

  disconnect() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}