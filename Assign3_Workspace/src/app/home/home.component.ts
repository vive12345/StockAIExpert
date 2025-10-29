import { Component, inject, TemplateRef, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { InputformComponent } from '../inputform/inputform.component';
import { NostockdataComponent } from '../nostockdata/nostockdata.component';
import { alertInfo } from '../alertinfo.interface';
import {MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'; 
import { TickerService } from '../ticker.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, InputformComponent, NostockdataComponent, MatTabsModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  private modalService = inject(NgbModal);

  constructor(private router: Router, private tickerService: TickerService){ }
  // constructor(private modalService: NgbModal){}

  dataArray: any[] = new Array(5).fill(null);

  currentAction: 'buy' | 'sell' | null = null;

  clicked: boolean = false;

  btnStatusBuy: Boolean = true;
  btnStatusSell: Boolean = true;
  buyButtonClicked: boolean = false;
  sellButtonClicked: boolean = false;

  marketStatus: boolean = false;
  stockPrice: String = "red";
  currentPrice: number = 123;
  wallet: number = 123456;

  quantity: number = 0;
  total: number = 0;

  openBuyModal(content: any): void {
    this.currentAction = 'buy';
    this.openWindowCustomClass(content);
  }
  
  openSellModal(content: any): void {
    this.currentAction = 'sell';
    this.openWindowCustomClass(content);
  }

  openWindowCustomClass(content: TemplateRef<any>) {
		this.modalService.open(content, { windowClass: 'dark-modal' });
	}

  public alertInfo: alertInfo = {
    errorMessage: "Please Enter a valid Ticker",
    bgColor: "#f6d1d5",
    buttonStatus: false,
    divStatus: false
  }

  addedToWishlist(){
    this.clicked = !this.clicked;
    this.alertInfo.errorMessage = "AAPL added to Watchlist";
    this.alertInfo.divStatus = true;
    this.alertInfo.bgColor = "#d1e6dd";
    this.alertInfo.buttonStatus = true;
  }
  // pageName = 'home';

  calculateTotal(): void {
    this.total = this.quantity * this.currentPrice;
  }

  boughtsuccessfully(){
    this.alertInfo.errorMessage = "AAPL Stock Bought Successfully";
    this.alertInfo.divStatus = true;
    this.alertInfo.bgColor = "#d1e6dd";
    this.alertInfo.buttonStatus = true;
    this.modalService.dismissAll();
  }

  soldsuccessfully(){
    this.alertInfo.errorMessage = "AAPL sold Successfully";
    this.alertInfo.divStatus = true;
    this.alertInfo.bgColor = "#f6d1d5";
    this.alertInfo.buttonStatus = true;
    this.modalService.dismissAll();
  }

  // ngOnInit() {
  //   this.tickerService.getCurrentTicker().subscribe(ticker => {
  //     console.log("TICKKERRRRRRRRR",ticker);
  //     if (ticker) {
  //       console.log("Tickerrrrrrrrrrrrr fetcheeeeddddd");
  //       this.router.navigate(['/search', ticker]);
  //     }
  //   });
  // }


  ngOnInit() {
    const savedTicker = this.tickerService.getSessionData('tickerSymbol');
    if (savedTicker) {
      this.router.navigate(['/search', savedTicker]);
    } else {
      this.router.navigate(['/search/home']);
      // Handle the case where there is no last ticker (e.g., first visit)
    }
  }
}
