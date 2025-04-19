import { Component, AfterViewInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected property: styleUrls
})
export class AppComponent implements AfterViewInit {
  title = 'afp';
  // Initialize prevScrollPos to 0; will update after view init in browser.
  prevScrollPos: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Safe to use window
      this.prevScrollPos = window.pageYOffset;
      
      // Dynamically import AOS only in the browser
      import('aos').then(aosModule => {
        const AOS = aosModule.default || aosModule;
        AOS.init({
          duration: 800,       // animation duration in ms
          easing: 'ease-in-out',
          once: false,         // animate every time you scroll
          mirror: true,        // animate elements out while scrolling past them
          offset: 200          // adjust offset if needed
        });
      }).catch(err => {
        console.error('Error loading AOS', err);
      });
    }
  }

  @HostListener('window:scroll', [])
onWindowScroll(): void {
  // Ensure we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }

  const currentScrollPos = window.pageYOffset;
  const navbar = document.querySelector('.navbar') as HTMLElement;
  const homeSection = document.getElementById('home');

  if (!navbar || !homeSection) {
    return;
  }

  const homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight;

  if (currentScrollPos < homeSectionBottom) {
    // Within the first section: always show the navbar
    navbar.style.top = '0';
  } else {
    // Outside the first section: use scroll direction to determine visibility
    if (this.prevScrollPos > currentScrollPos) {
      // Scrolling up – show the navbar
      navbar.style.top = '0';
    } else {
      // Scrolling down – hide the navbar
      navbar.style.top = '-80px'; // Adjust based on your navbar's height
    }
  }

  this.prevScrollPos = currentScrollPos;
}


}
