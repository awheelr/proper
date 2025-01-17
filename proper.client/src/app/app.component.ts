import { Component, OnInit } from '@angular/core';
import { TextComponent } from './core/text/text.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  imports: [
    TextComponent
  ]
})
export class AppComponent {
  title = "Proper";
}
