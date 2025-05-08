import { Component, Input } from '@angular/core';
import { IDialog } from './modal.interface';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [Dialog],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() dialogProps!: IDialog;
}
