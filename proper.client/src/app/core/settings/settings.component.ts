import { CommonModule } from '@angular/common';
import {
  Component,
} from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [
    CommonModule,
  ]
})
export class SettingsComponent {
  selectedTone: Tone | null = null;

  constructor() { }
  
}

export enum Tone {
  Friendly,
  Professional,
  Compassionate
}
