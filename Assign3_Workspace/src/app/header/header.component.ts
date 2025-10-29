import { Component, Input, SimpleChange } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SimpleChanges, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() pageName: string = "default"; 
  
  constructor(private router: Router){}

  isLinkActive: Boolean = false;

  // ngOnChanges(changes: SimpleChange){
  //   if(this.pageName === 'search/ticker'){
  //     this.isLinkActive = true;
  //   }
  // }

  // ngOnInit(): void {
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       this.checkActiveState();
  //     }
  //   });
  // }

  // checkActiveState(): void {
  //   const currentUrl = this.router.url;
  //   if (currentUrl.startsWith('/search')) {
  //     this.isLinkActive = true;
  //   } else {
  //     this.isLinkActive = false;
  //   }
  // }

  activeLink(){
    const currentRoute = this.router.url;
    return currentRoute !== '/watchlist' && currentRoute !== '/portfolio';
  }
}
