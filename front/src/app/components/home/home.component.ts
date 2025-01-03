import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  autoResize(textarea: HTMLTextAreaElement): void {
    // Réinitialiser la hauteur pour recalculer
    textarea.style.height = 'auto';
    // Ajuster la hauteur en fonction du contenu
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
