import { Routes } from '@angular/router';
// import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
// import { Component } from '@angular/core';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SearchComponent } from './search/search.component';
import { SearchDetailsComponent } from './search-details/search-details.component';

const routes: Routes = [{
    path:'',
    redirectTo:'search/home',
    pathMatch:'full'
},{
    path: 'search/home',
    component: HomeComponent,
    title: 'Home'
},{
    path: 'watchlist',
    component: WatchlistComponent,
    title: 'Watchlist'
},{
    path: 'portfolio',
    component: PortfolioComponent,
    title: 'Portfolio'
},{
    path: 'search/:ticker',
    component: SearchDetailsComponent,
    title: 'Search'
}];

export default routes;