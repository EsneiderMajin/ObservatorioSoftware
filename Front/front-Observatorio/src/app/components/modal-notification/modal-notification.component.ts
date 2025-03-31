import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationData } from 'src/app/core/models/generics.model';

@Component({
  selector: 'app-modal-notification',
  templateUrl: './modal-notification.component.html',
  styleUrls: ['./modal-notification.component.css']
})
export class ModalNotificationComponent {

  @Input() nofiticationData!: NotificationData;
  @Output() ResponseOptionText = new EventEmitter<string>();

  onButtonClick(response: string): void {
    this.ResponseOptionText.emit(response);
  }
}