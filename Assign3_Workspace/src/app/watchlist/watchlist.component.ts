import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NostockdataComponent } from '../nostockdata/nostockdata.component';
import { alertInfo } from '../alertinfo.interface';
import { NgIf } from '@angular/common';
import { DataService } from '../data.service';
import { CommonModule, NgFor } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TickerService } from '../ticker.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NostockdataComponent, CommonModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
  providers: [DataService]
})
export class WatchlistComponent {
  public alertInfo: alertInfo = {
    errorMessage: "Currently you don't have any stock in your watchlist",
    bgColor: "#fff0c9",
    buttonStatus: false,
    divStatus: false
  }
  public alerts:Array<{alertInfo:{errorMessage: string,
  bgColor: string,
  buttonStatus: boolean,
  divStatus: boolean},isTimer:boolean}> = []

  constructor(private dataservice: DataService, private tickerService: TickerService, private router: Router) { }

  roundof(num: number): number {
    return Number(num.toFixed(2));
  }

  dataloaded: boolean = false;

  watchlistData: any[] = [];

  stockPrice: String = "green"

  ticker: string = '';

  watchlistChange: Boolean = false;

  ngOnInit() {
    // this.watchlistChange = false;
    this.dataloaded = false;
    this.getWatchListComponent();
    this.watchlistData = [];
  }

  redirectToTicker(ticker: string) {
    this.router.navigate(['/search', ticker]);
  }

  setWatchlistComponent(data: any) {
    this.watchlistData = [];
    console.log("The watchlist data is ", data);
    if (data.length == 0) {
      console.log("data length is 0");
      // this.alertInfo.divStatus = true;
      this.alerts.push( {alertInfo:{errorMessage:'Currently you dont have any stocks in your watchlist',
    bgColor:'#fff0c9',buttonStatus:false,divStatus:true},isTimer:false});
    }
    for (let i = 0; i < data.length; i++) {
      this.watchlistData.push({
        currentPrice: data[i].currentPrice,
        ticker: data[i].ticker,
        companyName: data[i].companyName,
        change: this.roundof(data[i].change),
        changePercent: this.roundof(data[i].changePercent)
      });
    }
    console.log(data);
    this.dataloaded = true;
  }

  getWatchListComponent() {
    this.dataservice.getWatchlistComponent().subscribe(data => {
      if (this.watchlistChange) {
        this.tickerService.setSessionData('WatchlistData', data);
      }
      this.setWatchlistComponent(data);
    });
  }

  removeFromWatchlist(ticker: string) {
    this.dataservice.deleteFromWishlist(ticker).subscribe(data => {
      console.log(data);
      this.watchlistChange = true;
      // this.alertInfo.divStatus = true;
      // this.alertInfo.errorMessage = `${ticker} removed from watchlist`;
      // this.alertInfo.bgColor = "#f6d1d5";
      // this.alertInfo.buttonStatus = true;
      this.alerts.push( {alertInfo:{errorMessage:`${ticker} removed from watchlist`,
    bgColor:'#f6d1d5',buttonStatus:true,divStatus:true},isTimer:true})

      // this.getWatchListComponent();
      this.ngOnInit();
    })
  }
}
