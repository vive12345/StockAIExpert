import { Component, TemplateRef, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NostockdataComponent } from '../nostockdata/nostockdata.component';
import { alertInfo } from '../alertinfo.interface';
import { DataService } from '../data.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TickerService } from '../ticker.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NostockdataComponent, CommonModule, FormsModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
  options: string[] = [];
  private modalService = inject(NgbModal);
  // router: any;
  constructor(private dataservice: DataService, private tickerService: TickerService, private router: Router) { }

  public alertInfo: alertInfo = {
    errorMessage: "Currently you dont have any stock",
    bgColor: "#fff0c9",
    buttonStatus: false,
    divStatus: false
  }

  public alerts: Array<{
    alertInfo: {
      errorMessage: string,
      bgColor: string,
      buttonStatus: boolean,
      divStatus: boolean
    }, isTimer: boolean
  }> = []

  dataloaded: boolean = false;

  moneyInWallet: number = 25000;

  currentQuantity: number = 0;

  quantity: number = 0;
  avgCost: number = 0;
  totalCost: number = 0;
  change: number = 0;
  currentPrice: number = 0;
  marketValue: number = 0;

  portfolioData: any[] = [];

  currentAction: 'buy' | 'sell' | null = null;

  total: number = 0;

  quantityEntered: number = 0;

  currentTicker: string = '';

  currentCompanyName: string = '';

  totalMoneySpent: number = 0;

  finalMoneyInWallet: number = 0;

  buyStock() {

  }

  sellStock() {

  }

  roundof(num: number): number {
    return Number(num.toFixed(2));
  }

  // ngOnInit() {
  //   this.dataservice.getportfolioComponent().subscribe(data => {
  //     console.log("The portfolio data is ", data);
  //     if (data.length == 0) {
  //       this.alertInfo.divStatus = true;
  //     }
  //     for (let i = 0; i < data.length; i++) {
  //       this.portfolioData.push({
  //         currentPrice: this.roundof(data[i].currentPrice),
  //         ticker: data[i].ticker,
  //         companyName: data[i].companyName,
  //         change: this.roundof(data[i].change),
  //         totalCost: data[i].totalCost,
  //         quantity: data[i].quantity
  //       });
  //     }
  //     console.log(data);
  //     this.dataloaded = true;
  //   });
  // }


  ngOnInit(): void {
    this.dataloaded = false;
    this.fetchPortfolioData();
  }

  redirectToTicker(ticker: string) {
    this.router.navigate(['/search', ticker]);
  }

  fetchPortfolioData() {
    this.portfolioData = [];
    this.dataservice.getportfolioComponent().subscribe(data => {
      this.tickerService.setSessionData('PortfolioData', data);
      this.setPortfolioComponent(data);
    });
  }

  setPortfolioComponent(data: any) {
    console.log("The portfolio data is ", data);
    if (data.length == 0) {
      this.alerts.push({
        alertInfo: {
          errorMessage: 'Currently you dont have any stocks',
          bgColor: '#fff0c9', buttonStatus: false, divStatus: true
        }, isTimer: false
      });
      // this.alertInfo.divStatus = true;
      this.finalMoneyInWallet = 25000;
      this.dataloaded = true;
    }

    for (let i = 0; i < data.length; i++) {
      this.finalMoneyInWallet = data[0].wallet;
      if (data[i].quantity != 0) {
        this.portfolioData.push({
          currentPrice: this.roundof(data[i].currentPrice),
          ticker: data[i].ticker,
          companyName: data[i].companyName,
          totalCost: data[i].totalCost,
          quantity: data[i].quantity
        });
        this.totalMoneySpent = this.totalMoneySpent + data[i].totalCost;
      }
    }
    console.log(data);
    this.dataloaded = true;
  }

  // openBuyModal(BuyContent: any): void {
  //   this.currentAction = 'buy';
  //   this.openWindowCustomClass(BuyContent);
  // }

  // openSellModal(SellContent: any): void {
  //   this.currentAction = 'sell';
  //   this.openWindowCustomClass(SellContent);
  // }

  // openWindowCustomClass(content: TemplateRef<any>) {
  //   this.modalService.open(content, { windowClass: 'dark-modal' });
  // }

  openBuyModal(content: any, item: any): void {
    this.currentQuantity = 0;
    this.total = 0;
    this.currentAction = 'buy';
    this.currentPrice = this.roundof(item.currentPrice);
    this.currentTicker = item.ticker;
    this.quantityEntered = item.quantity;
    this.currentCompanyName = item.companyName;
    this.openWindowCustomClass(content);
  }

  openSellModal(content: any, item: any): void {
    this.total = 0;
    this.currentQuantity = 0;
    this.currentPrice = this.roundof(item.currentPrice);
    this.quantityEntered = item.quantity;
    this.currentAction = 'sell';
    this.currentTicker = item.ticker;
    this.currentCompanyName = item.companyName;
    this.openWindowCustomClass(content);
  }

  openWindowCustomClass(content: TemplateRef<any>) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  calculateTotal(): void {
    this.total = this.roundof(this.currentQuantity * this.currentPrice);
  }

  stockBoughtorSold(transactionType: string, ticker: string, companyName: string, currentQuantity: number, currentPrice: number) {
    this.dataservice.buyOrSellStock(ticker, companyName, currentQuantity, currentPrice, transactionType).subscribe(data => {

      if (transactionType == 'buy') {
        // this.alertInfo.errorMessage = `${ticker} bought Successfully`;
        // this.alertInfo.bgColor = "#d1e6dd";
        // this.alertInfo.divStatus = true;
        // this.alertInfo.buttonStatus = true;
        this.alerts.push({
          alertInfo: {
            errorMessage:  `${ticker} stock bought successfully`,
            bgColor: '#d1e6dd', buttonStatus: true, divStatus: true
          }, isTimer: true
        });
    } else {
      // this.alertInfo.errorMessage = `${ticker} Sold Successfully`;
      // this.alertInfo.bgColor = "#f6d1d5";
      // this.alertInfo.divStatus = true;
      // this.alertInfo.buttonStatus = true;
      this.alerts.push({
        alertInfo: {
          errorMessage:  `${ticker} stock sold successfully`,
          bgColor: '#f6d1d5', buttonStatus: true, divStatus: true
        }, isTimer: true
      });
    }
    // this.alertInfo.errorMessage = `${this.tickerSymbol} Sold Successfully`;
    this.fetchPortfolioData();
    this.modalService.dismissAll();
    console.log(data);
  });
}
}