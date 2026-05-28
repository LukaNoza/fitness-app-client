import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() trainerId!: number;
  @Input() clientId!: number;
  @Input() otherUserName!: string;
  
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage = '';
  isOpen = false;
  currentUserId!: string;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getUser()?.id.toString();
    this.chatService.startConnection();
    
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  openChat() {
    this.isOpen = true;
    this.chatService.joinChatRoom(this.trainerId, this.clientId);
  }

  closeChat() {
    this.isOpen = false;
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    
    this.chatService.sendMessage(this.trainerId, this.clientId, this.newMessage);
    this.newMessage = '';
  }

  private scrollToBottom() {
    if (this.chatMessagesContainer) {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    }
  }
}