import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;

  constructor(private viewportScroller: ViewportScroller) {}

  scrollTo(sectionId: string) {
    this.viewportScroller.scrollToAnchor(sectionId);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigate(sectionId: string) {
    this.scrollTo(sectionId);
    this.menuOpen = false; // close menu after click
  }
}
