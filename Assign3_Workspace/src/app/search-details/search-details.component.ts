import { ChangeDetectorRef, Component, inject, TemplateRef, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InputformComponent } from '../inputform/inputform.component';
import { NostockdataComponent } from '../nostockdata/nostockdata.component';
import { alertInfo } from '../alertinfo.interface';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
// import { BlobOptions } from 'buffer';
import { DataService } from '../data.service';
// import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
// import HighchartsMore from 'highcharts/highcharts-more';
import IndicatorsAll from "highcharts/indicators/indicators-all";
import { HighchartsChartModule } from 'highcharts-angular';
// import Highstock from 'highcharts/highstock';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TickerService } from '../ticker.service';
import { error } from 'console';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// import { error } from 'console';

IndicatorsAll(Highcharts);

export interface Earning {
  actual: number;
  estimate: number;
  period: string;
  quarter: number;
  surprise: number;
  surprisePercent: number;
  symbol: string;
  year: number;
}

interface NewsItem {
  imageUrl: string;
  title: string;
  date: string;
  url: string;
  source: string;
  summary: string;
}

interface InsiderSentiment {
  symbol: string;
  year: number;
  month: number;
  change: number;
  mspr: number;
}

@Component({
  selector: 'app-search-details',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, MatProgressSpinnerModule, InputformComponent, NostockdataComponent, MatTabsModule, CommonModule, FormsModule, HighchartsChartModule],
  templateUrl: './search-details.component.html',
  styleUrl: './search-details.component.css',
  providers: [DataService]
})
export class SearchDetailsComponent {
  private modalService = inject(NgbModal);

  private cancelRequests = new Subject<void>();

  private destroy$ = new Subject<void>();

  private latestPriceSubscription: Subscription = new Subscription();

  title: String[] = [];

  displayStatus: boolean = true;

  currentQuantity: number = 0;

  public alerts: Array<{
    alertInfo: {
      errorMessage: string,
      bgColor: string,
      buttonStatus: boolean,
      divStatus: boolean
    }, isTimer: boolean
  }> = []

  totalMSPR: number = 0;
  totalChange: number = 0;
  totalMSPRPositive: number = 0;
  totalMSPRNegative: number = 0;
  totalChangePositive: number = 0;
  totalChangeNegative: number = 0;

  isSummaryDataLoaded: boolean = false;
  isHighTabDataLoaded: boolean = false;
  isInsightsChart1DataLoaded: boolean = false;
  isInsightsChart2DataLoaded: boolean = false;
  isCompanyDescriptionDataLoaded: boolean = false;
  isInsiderSentimentDataLoaded: boolean = false;
  isCompanyNewsDataLoaded: boolean = false;
  isGetLatestPriceDataLoaded: boolean = false;
  isCompanyPeersDataLoaded: boolean = false;
  isWatchlistDataLoaded: boolean = false;

  constructor(private route: ActivatedRoute, private dataservice: DataService, private changeDetectorRef: ChangeDetectorRef, private tickerService: TickerService) { }

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [{
      data: [],
      type: 'line'
    }]
  };

  InsightsHighcharts1: typeof Highcharts = Highcharts;
  InsightschartOptions1: Highcharts.Options = {
    series: [{
      data: [],
      type: 'column'
    }, {
      data: [],
      type: 'column'
    }, {
      data: [],
      type: 'column'
    }, {
      data: [],
      type: 'column'
    }, {
      data: [],
      type: 'column'
    }]
  };

  InsightsHighcharts2: typeof Highcharts = Highcharts;
  InsightschartOptions2: Highcharts.Options = {
    series: [{
      data: [5.2, 5.7, 8.7, 13.9, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6],
      type: 'spline'
    }, {
      type: 'spline',
      data: [1.5, 1.6, 3.3, 5.9, 10.5, 13.5, 14.5, 14.4, 11.5, 8.7, 4.7, 2.6]
    }]
  }

  HighTabcharts: typeof Highcharts = Highcharts;
  chartTabOptions: Highcharts.Options = {
    rangeSelector: {
      selected: 2
    },
    title: {
      text: 'AAPL Historical'
    },
    subtitle: {
      text: 'With SMA and Volume by Price technical indicators'
    },
    yAxis: [{
      startOnTick: false,
      endOnTick: false,
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'OHLC'
      },
      height: '60%',
      lineWidth: 2,
      resize: {
        enabled: true
      }
    }, {
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'Volume'
      },
      top: '65%',
      height: '35%',
      offset: 0,
      lineWidth: 2
    }],
    tooltip: {
      split: true
    },
    series: [{
      type: 'candlestick',
      name: 'AAPL',
      id: 'aapl',
      zIndex: 2,
      data: []
    }, {
      type: 'column',
      name: 'Volume',
      id: 'volume',
      data: [],
      yAxis: 1
    }, {
      type: 'vbp',
      linkedTo: 'aapl',
      params: {
        volumeSeriesID: 'volume'
      },
      dataLabels: {
        enabled: false
      },
      zoneLines: {
        enabled: false
      }
    }, {
      type: 'sma',
      linkedTo: 'aapl',
      zIndex: 1,
      marker: {
        enabled: false
      }
    }]
  }
  selectedNewsItem: any;
  openNewsWindowCustomClass(content: TemplateRef<any>, newsItem: NewsItem) {
    this.selectedNewsItem = newsItem;
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  ticker: string = '';
  p: number = 1;

  startDate: Date = new Date();
  endDate: Date = new Date();

  dataArray: any[] = new Array(10).fill(null);

  currentAction: 'buy' | 'sell' | null = null;

  clicked: boolean = false;

  btnStatusBuy: Boolean = true;
  btnStatusSell: Boolean = false;

  buyButtonClicked: boolean = false;
  sellButtonClicked: boolean = false;

  stockPrice: String = "red";
  currentPrice: number = 123;
  wallet: number = 123456;

  quantity: number = 0;
  total: number = 0;

  tickerSymbol: string = '';
  companyName: string = '';
  exchange: String = '';
  ipo: number = 0;
  finnhubIndustry: String = '';
  weburl: String = '';
  logo: String = '';

  highPrice: number = 0;
  lowPrice: number = 0;
  openPrice: number = 0;
  prevClose: number = 0;
  lastPrice: number = 0;
  change: number = 0;
  changePercent: number = 0;
  currentTimeStamp: String = '';

  companyPeers: string[] = [];

  newsData: NewsItem[] = [];
  matrix: NewsItem[][] = [];

  marketStatus: Boolean = false;
  linechart:string='#ff1200'
  closingMarketDate: string = '';

  resetContent() {
    this.displayStatus = false;
  }

  // getCurrentTimeStamp(): String{
  //   const currentDate_display = new Date();

  //   const pad = (num: number) => num.toString().padStart(2, '0');

  //   const year = currentDate_display.getFullYear();
  //   const month = pad(currentDate_display.getMonth() + 1);
  //   const day = pad(currentDate_display.getDate());
  //   const hours = pad(currentDate_display.getHours());
  //   const minutes = (currentDate_display.getMinutes());
  //   const seconds = pad(currentDate_display.getSeconds());

  //   const formattedMinutes_display = pad(minutes);

  //   return `${year}-${month}-${day} ${hours}:${formattedMinutes_display}:${seconds}`;
  // }

  formatEpochTime(epochTime: number): String {
    const date = new Date(epochTime * 1000);
    const currentDate = new Date();

    const pad = (num: number) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = (date.getMinutes());
    const seconds = pad(date.getSeconds()); 

    const year_display = currentDate.getFullYear();
    const month_display = pad(currentDate.getMonth() + 1);
    const day_display = pad(currentDate.getDate());
    const hours_display = pad(currentDate.getHours());
    const minutes_display = (currentDate.getMinutes());
    const seconds_display = pad(currentDate.getSeconds());

    const timeDifference = (currentDate.getTime() - date.getTime()) / (1000 * 60);
    console.log("The time difference is ", timeDifference);
    if (timeDifference <= 5) {
      this.marketStatus = true;
      
    }else{
      this.marketStatus = false;
      this.latestPriceSubscription.unsubscribe();
    }
    const formattedMinutes = pad(minutes);
    const formattedMinutes_display = pad(minutes_display);

    this.closingMarketDate = `${year}-${month}-${day} ${hours}:${formattedMinutes}:${seconds}`;
    return `${year_display}-${month_display}-${day_display} ${hours_display}:${formattedMinutes_display}:${seconds_display}`;
  }

  roundof(num: number): number {
    return Number(num.toFixed(2));
  }

  transformToMatrix(flatArray: any[], itemsPerRow: number): any[][] {
    const matrix = [];
    for (let i = 0; i < flatArray.length; i += itemsPerRow) {
      matrix.push(flatArray.slice(i, i + itemsPerRow));
    }
    return matrix;
  }

  private priceInterval: any;

  SummaryDataLoaded: boolean = false;

  componentActive: boolean = false;

  ngOnInit() {
    // this.route.params.subscribe(params => {
    this.route.paramMap.subscribe(params => {
      // this.ticker = (params['ticker'] || '').toUpperCase();
      this.ticker = (params.get('ticker') || '').toUpperCase();

      this.isCompanyPeersDataLoaded = false;
      this.isCompanyDescriptionDataLoaded = false;
      this.isCompanyNewsDataLoaded = false;
      this.isInsiderSentimentDataLoaded = false;
      this.isInsightsChart1DataLoaded = false;
      this.isInsightsChart2DataLoaded = false;
      this.isHighTabDataLoaded = false;
      this.isSummaryDataLoaded = false;
      this.isGetLatestPriceDataLoaded = false;
      this.isWatchlistDataLoaded = false;

      this.componentActive = true;

      this.initializeData();

      if(this.latestPriceSubscription){
        this.latestPriceSubscription.unsubscribe();
      }
      this.latestPriceSubscription = interval(15000).pipe(
        switchMap(() => {
          this.updatePrice();
          // console.log("FETCHEDDDDD")
          return [];
        })
      ).subscribe();

      // this.startPricePolling();

      // if (this.tickerService.getSessionData('tickerSymbol') == this.ticker) {
      //   this.fetchCompanyData(this.tickerService.getSessionData('CompanyDescritionData'));
      //   this.fetchCompanyPeers(this.tickerService.getSessionData('CompanyPeersData'));
      //   this.fetchCompanyNews(this.tickerService.getSessionData('CompanyNewsData'));
      //   this.fetchInsiderSentimentData(this.tickerService.getSessionData('InsiderSentimentData'));
      //   this.setInsightsChart1(this.tickerService.getSessionData('InsightsCharts1'));
      //   this.setInsightsChart2(this.tickerService.getSessionData('InsiderCharts2'));
      //   this.setHighChart(this.tickerService.getSessionData('HighCharts'));
      //   this.SummaryDataLoaded = true;
      //   if(this.tickerService.getSessionData('WatchlistData')){
      //     this.setWatchlistData(this.tickerService.getSessionData('WatchlistData'));
      //   }else{
      //     this.getWatchlistComponent();
      //   }
      //   if(this.tickerService.getSessionData('PortfolioData')){
      //     this.setPortfolioComponentData(this.tickerService.getSessionData('PortfolioData'));
      //   }else{
      //     this.loadPortfolioComponent();
      //   }
      // } else {
      //   this.tickerService.setSessionData("tickerSymbol", this.ticker);
      //   this.loadCompanyDescriptionData(this.ticker);
      //   this.loadCompanyPeersData(this.ticker);
      //   this.loadCompanyNewsData(this.ticker);
      //   this.loadInsiderSentimentData(this.ticker);
      //   this.loadInsightsChartData1(this.ticker);
      //   this.loadInsightsChartData2(this.ticker);
      //   this.loadHighTabCharts(this.ticker);
      //   if(this.tickerService.getSessionData('WatchlistData')){
      //     this.setWatchlistData(this.tickerService.getSessionData('WatchlistData'));
      //   }else{
      //     this.getWatchlistComponent();
      //   }
      //   if(this.tickerService.getSessionData('PortfolioData')){
      //     this.setPortfolioComponentData(this.tickerService.getSessionData('PortfolioData'));
      //   }else{
      //     this.loadPortfolioComponent();
      //   }
      // }

      this.alertInfo.divStatus = false;

      this.newsData = [];

      this.displayStatus = true;

      this.clicked = false;

      this.btnStatusBuy = true;
      this.btnStatusSell = false;

      this.totalCompaniesCost = 0;

      this.currentQuantity = 0;



      // this.loadHighTabCharts(this.ticker);
      // this.loadPortfolioComponent();
      // this.getWatchlistComponent();
    });
    // this.initializeChart();
  }

  async initializeData() {
    await this.startPricePolling();

    if (this.tickerService.getSessionData('tickerSymbol') == this.ticker) {
      this.fetchCompanyData(this.tickerService.getSessionData('CompanyDescritionData'));
      this.fetchCompanyPeers(this.tickerService.getSessionData('CompanyPeersData'));
      this.fetchCompanyNews(this.tickerService.getSessionData('CompanyNewsData'));
      this.fetchInsiderSentimentData(this.tickerService.getSessionData('InsiderSentimentData'));
      this.setInsightsChart1(this.tickerService.getSessionData('InsightsCharts1'));
      this.setInsightsChart2(this.tickerService.getSessionData('InsiderCharts2'));
      this.setHighChart(this.tickerService.getSessionData('HighCharts'));
      // this.SummaryDataLoaded = true;
      if (this.tickerService.getSessionData('WatchlistData')) {
        this.setWatchlistData(this.tickerService.getSessionData('WatchlistData'));
      } else {
        this.getWatchlistComponent();
      }
      if (this.tickerService.getSessionData('PortfolioData')) {
        this.setPortfolioComponentData(this.tickerService.getSessionData('PortfolioData'));
      } else {
        this.loadPortfolioComponent();
      }
    } else {

      this.tickerService.setSessionData("tickerSymbol", this.ticker);
      this.loadCompanyDescriptionData(this.ticker);
      this.loadCompanyPeersData(this.ticker);
      this.loadCompanyNewsData(this.ticker);
      this.loadInsiderSentimentData(this.ticker);
      this.loadInsightsChartData1(this.ticker);
      this.loadInsightsChartData2(this.ticker);
      this.loadHighTabCharts(this.ticker);
      this.SummaryDataLoaded = false;
      // if (this.tickerService.getSessionData('WatchlistData')) {
      //   this.setWatchlistData(this.tickerService.getSessionData('WatchlistData'));
      // } else {
      //   this.getWatchlistComponent();
      // }
      this.getWatchlistComponent();
      this.loadPortfolioComponent();
      // if(this.tickerService.getSessionData('PortfolioData')){
      //   this.setPortfolioComponentData(this.tickerService.getSessionData('PortfolioData'));
      // }else{
      //   this.loadPortfolioComponent();
      // }
    }
  }

  async startPricePolling() {

    console.log("before update price this should be printed");
    if (this.tickerService.getSessionData('LatestPriceData') && (this.ticker == this.tickerService.getSessionData('tickerSymbol'))) {
      console.log("TheDATAISSETTTINGGGGGG====================================");
      this.setApiResponseDataStartPrice(this.tickerService.getSessionData('LatestPriceData'));
      this.isGetLatestPriceDataLoaded = true;
    } else {
      await this.updatePrice();
    }
    if (this.tickerService.getSessionData('SummaryChart') && (this.tickerService.getSessionData('tickerSymbol') == this.ticker)) {
      this.setSummaryChartData(this.tickerService.getSessionData('SummaryChart'));
    } else {
      this.loadSummaryChartData(this.ticker);
    }

    // this.clearPriceInterval();

    // console.log("the time difference and then this should be printed");
    // console.log("The market status is ", this.marketStatus);
    // if (this.marketStatus) {
    //   this.priceInterval = setInterval(async () => {
    //     await this.updatePrice();
    //   }, 15000);
    // }
    // this.updatePrice();
  }

  clearPriceInterval() {
    if (this.priceInterval) {
      clearInterval(this.priceInterval);
      this.priceInterval = null;
    }
  }

  async updatePrice() {
    console.log("inside update price -------------------------------------");

    const data = await this.dataservice.getlatestPrice(this.ticker).toPromise();
    this.tickerService.setSessionData('LatestPriceData', data);
    console.log("Theee dataaaa it fetchedddddddd");
    this.setApiResponseDataStartPrice(data);

    // this.apiSubscription = interval(15000).pipe(
    //     switchMap(() => this.dataservice.getlatestPrice(this.ticker)),
    //     takeUntil(this.destroy$)
    //   ).subscribe(
    //     data => {
    //       this.setApiResponseDataStartPrice(data);
    //       this.tickerService.setSessionData('LatestPriceData', data);
    //     },
    //     error => console.error("error fetching latest price:", error)
    //   );
    

    // this.dataservice.getlatestPrice(this.ticker).subscribe(
    //   {
    //     next:(data)=>{
    //       this.setApiResponseDataStartPrice(data);
    //       console.log("response fetched")
    //     },
    //     error:(error)=>{
    //       console.log("error",error)
    //     }
    //   }
  }

  ngOnDestroy() {
    this.latestPriceSubscription.unsubscribe();
  }


  setApiResponseDataStartPrice(data: any) {
    console.log("---------------------------------------------------------------------------")
    console.log(data);
    console.log(this.ticker);
    this.currentTimeStamp = this.formatEpochTime(data.t);
    this.changePercent = this.roundof(data.dp);
    this.highPrice = this.roundof(data.h);
    this.lowPrice = this.roundof(data.l);
    this.openPrice = this.roundof(data.o);
    this.prevClose = this.roundof(data.pc);
    console.log("the latest price is being assigned here so this should be executed first before portfolio");
    this.lastPrice = this.roundof(data.c);
    console.log('Last price set : - ', this.lastPrice);
    this.change = this.roundof(data.d);
    console.log("The Change Percent is hererrrrr =============", data.dp);
    
    if (this.change > 0) {
      this.stockPrice = "green";
      // this.linechart = '#00ff00'

    } else if (this.change < 0) {
      this.stockPrice = "red";
      // this.linechart = '#ff0000'

    } else {
      this.stockPrice = "black";
      // this.linechart = '#000000'
    }

    // const tempno= Math.floor(Math.random()*2 ) +1;
    // console.log("temp numberrrrrrrrrrrrrrr", tempno)
    // if(tempno == 1)
    // {
    //   this.linechart = '#ff0000'
    // }
    // else{

    //   this.linechart = '#00ff00'
    // }
    // this.changePercent = this.roundof(data.dp);
    // Load additional data

    // if (this.SummaryDataLoaded) {
    //   console.log("The summmarrrry dattaa is loaddedd", this.SummaryDataLoaded);
    //   this.setSummaryChartData(this.tickerService.getSessionData('SummaryChart'));
    // } else {
    //   console.log("The summmarrrry dattaa is not loaddedd", this.SummaryDataLoaded);
    //   this.loadSummaryChartData(this.ticker);
    // }
    // this.loadSummaryChartData(this.ticker);

    // if (this.tickerService.getSessionData('SummaryChart') && (this.tickerService.getSessionData('tickerSymbol') == this.ticker)) {
    //   console.log("The ticker symbol is "+this.ticker+"The stored is "+this.tickerService.getSessionData('tickerSymbol'));
    //   this.setSummaryChartData(this.tickerService.getSessionData('SummaryChart'));
    // } else {
    //   console.log("The ticker symbol is "+this.ticker+"The stored is "+this.tickerService.getSessionData('tickerSymbol'));
    //   this.loadSummaryChartData(this.ticker);
    // }

    this.isGetLatestPriceDataLoaded = true;
    console.log(this.currentTimeStamp);
  }
  private loadSummaryChartData(ticker: string) {
    console.log("This should be inside loadd sumarry chart every time");

    this.setMarketDates();
    this.dataservice.getSummaryData(ticker, this.startDate, this.endDate).subscribe(
      data => {
        this.setSummaryChartData(data);
        this.SummaryDataLoaded = true;
        this.tickerService.setSessionData('SummaryChart', data);
      },
      error => {
        console.error("Failed to fetch chart data: ", error);
      }
    );
    this.isSummaryDataLoaded = true;

  }

  setSummaryChartData(data: any) {
    console.log("the data starts printing here");
    console.log(data);
    console.log("The startDate is ", this.startDate, "and the endDate is ", this.endDate);
    console.log(this.marketStatus);

    this.Highcharts = Highcharts;
    this.chartOptions = {
      chart: {
        type: 'line',
        backgroundColor: '#f6f6f6'
      },tooltip: {
        useHTML: true,
        formatter: function() {
          return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + this.y + '</b>';
        }
      },
      title: {
        text: `${this.ticker} Hourly Price Variations`
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Time'
        }
      },
      yAxis: {
        title: {
          text: 'Price'
        },
        opposite: true
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false
          }
        }
      },
      series: [{
        data: data,
        color: `${this.stockPrice}`,
        showInLegend: false,
        name: this.ticker
      }] as Highcharts.SeriesOptionsType[]
    }
    this.SummaryDataLoaded = true;
    this.isSummaryDataLoaded = true;
  }

  private loadHighTabCharts(ticker: string) {
    this.dataservice.gethistoricalData(ticker).subscribe(
      data => {
        this.setHighChart(data);
        this.tickerService.setSessionData('HighCharts', data);
      }
    )
  }

  private loadInsightsChartData1(ticker: string) {
    this.dataservice.getrecommendationTrends(ticker).subscribe(
      data => {
        this.setInsightsChart1(data);
        this.tickerService.setSessionData('InsightsCharts1', data);
      }, error => {
        console.log("Failed to fetch data: ", error);
      }
    )
  }

  private loadInsightsChartData2(ticker: string) {
    this.dataservice.getcompanyEarnings(ticker).subscribe(
      data => {
        this.tickerService.setSessionData('InsiderCharts2', data);
        this.setInsightsChart2(data);
      },
      error => {
        console.log("Failed to fetch data: ", error);
      }
    );
    this.isInsightsChart2DataLoaded = true;
  }

  private setMarketDates() {
    if (this.marketStatus) {
      this.startDate = new Date();
      this.endDate = new Date(this.startDate);
      this.endDate.setDate(this.startDate.getDate() - 1);
    } else {
      this.startDate = new Date();
      this.endDate = new Date(this.startDate);
      this.endDate.setDate(this.startDate.getDate() - 1);
      // this.startDate = new Date();
      // this.startDate.setDate(this.startDate.getDate() - 1);
      // this.endDate = this.startDate;
    }
  }

  getTwitterShareUrl(item: any): string { // Replace 'any' with the type of your 'selectedNewsItem'
    const text = encodeURIComponent(item.title);
    const url = encodeURIComponent(item.url);
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }

  formatDate(timestampInSeconds: number): string {
    const date = new Date(timestampInSeconds * 1000);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  setWatchlistData(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (this.tickerSymbol == data[i].ticker) {
        this.clicked = true;
      }
    }
    this.isWatchlistDataLoaded = true;
  }

  getWatchlistComponent() {
    this.dataservice.getWatchlistComponent().subscribe(data => {
      this.setWatchlistData(data);
      this.tickerService.setSessionData('WatchlistData', data);
    });
  }

  fetchCompanyData(data: any) {
    this.tickerSymbol = data.ticker;
    this.companyName = data.name;
    this.exchange = data.exchange;
    this.ipo = data.ipo;
    this.finnhubIndustry = data.finnhubIndustry;
    this.weburl = data.weburl;
    this.logo = data.logo;

    this.isCompanyDescriptionDataLoaded = true;
  }

  fetchCompanyPeers(data: any) {
    console.log("The data fetched is. Is there a problem setting the data ? ", data);
    this.companyPeers = data;
    this.isCompanyPeersDataLoaded = true;
  }

  fetchCompanyNews(data: any) {
    this.newsData = [];
    for (var i = 0; i < data.length && i < 20; i++) {
      this.newsData.push({
        imageUrl: data[i].image,
        title: data[i].headline,
        url: data[i].url,
        date: this.formatDate(data[i].datetime),
        summary: data[i].summary,
        source: data[i].source
      });
    }
    this.matrix = this.transformToMatrix(this.newsData, 2);
    console.log("the Data is ", this.newsData);

    this.isCompanyNewsDataLoaded = true;
  }

  fetchInsiderSentimentData(data: any) {
    this.totalChange = 0;
    this.totalChangeNegative = 0;
    this.totalChangePositive = 0;
    this.totalMSPR = 0;
    this.totalMSPRNegative = 0;
    this.totalMSPRPositive = 0;

    data.data.forEach((item: InsiderSentiment) => {
      this.totalMSPR += item.mspr;
      this.totalChange += item.change;

      if (item.mspr > 0) {
        this.totalMSPRPositive += item.mspr;
      } else if (item.mspr < 0) {
        this.totalMSPRNegative += item.mspr;
      }

      if (item.change > 0) {
        this.totalChangePositive += item.change;
      } else if (item.change < 0) {
        this.totalChangeNegative += item.change;
      }
    });
    this.totalChange = this.roundof(this.totalChange);
    this.totalMSPR = this.roundof(this.totalMSPR);
    this.totalChangeNegative = this.roundof(this.totalChangeNegative);
    this.totalChangePositive = this.roundof(this.totalChangePositive);
    this.totalMSPRNegative = this.roundof(this.totalMSPRNegative);
    this.totalMSPRPositive = this.roundof(this.totalMSPRPositive);

    this.isInsiderSentimentDataLoaded = true;
  }

  setPortfolioComponentData(data: any) {
    console.log("The data issssss portfoliooo", data);
    if (data.length == 0) {
      console.log("The Latest Price for the stock is why is coming null", this.lastPrice);
      this.modalCurrentPrice = this.lastPrice;
      this.modalTickerSymbol = this.ticker;
      this.modalCompanyName = this.companyName;
      this.finalMoneyInWallet = 25000;
    } else {
      this.finalMoneyInWallet = data[0].wallet;
      for (let i = 0; i < data.length; i++) {
        if (this.tickerSymbol === data[i].ticker) {
          console.log("The ticker is matched");
          this.modalTickerSymbol = data[i].ticker;
          this.modalCompanyName = data[i].companyName;
          this.modalCurrentPrice = data[i].currentPrice;
          this.modalQuantity = data[i].quantity;
          if (this.modalQuantity > 0) {
            this.btnStatusBuy = true;
            this.btnStatusSell = true;
          }
          if (this.modalQuantity == 0) {
            this.btnStatusSell = false;
            this.btnStatusBuy = true;
          }
        } else {
          console.log("The ticker input is not present and default values are being assigned");
          this.modalCurrentPrice = this.lastPrice;
          console.log(this.modalCurrentPrice);
          this.modalTickerSymbol = this.tickerSymbol;
          this.modalCompanyName = this.companyName;
        }

        this.totalCompaniesCost = this.totalCompaniesCost + data[i].totalCost;
        this.totalMoneyInWallet = 25000 - this.totalCompaniesCost;
      }
    }
  }

  setInsightsChart1(data: any) {
    console.log(data);
    let strongBuy: number[] = [];
    let strongSell: number[] = [];
    let hold: number[] = [];
    let buy: number[] = [];
    let sell: number[] = [];
    let categories: string[] = [];
    var p = 0;
    for (var i = 0; i < data.length; i++) {
      strongSell.push(data[i].strongSell);
      strongBuy.push(data[i].strongBuy);
      hold.push(data[i].hold);
      buy.push(data[i].buy);
      sell.push(data[i].sell);
      let period = new Date(data[i].period);
      categories.push(Highcharts.dateFormat('%Y-%m', period.getTime()));
    }
    this.InsightsHighcharts1 = Highcharts;
    this.InsightschartOptions1 = {
      chart: {
        backgroundColor: '#f6f6f6',
        // width: null,
        reflow: true,
        type: 'column'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.y == 0) {
                return '';
              }
              return this.y;
            }
          }
        }
      },
      title: {
        text: "Recommendation Trends"
      }, xAxis: {
        categories: categories,
        crosshair: true,
      },
      yAxis: {
        title: {
          text: '#Analysis'
        }
      },
      series: [{
        name: 'Strong Buy',
        data: strongBuy,
        // type: 'column',
        color: '#1a6334'
      }, {
        name: 'Buy',
        data: buy,
        // type: 'column',
        color: '#24af51'
      }, {
        name: 'Hold',
        data: hold,
        // type: 'column',
        color: '#b07e28'
      },{
        name: 'sell',
        data: sell,
        // type: 'column',
        color: '#f15053'
      }, {
        name: 'Strong Sell',
        data: strongSell,
        // type: 'column',
        color: '#752b2c'
      }, ] as Highcharts.SeriesOptionsType[]
    }
    this.isInsightsChart1DataLoaded = true;
  }

  setInsightsChart2(data: any) {
    const categories = data.map((earning: Earning) => [earning.period]);
    // const categories = data.map((earning: Earning) => `${earning.period} (Surprise: ${earning.surprise.toFixed(4)})`);

    const actualData = data.map((earning: Earning) => [earning.actual]);
    const estimatedData = data.map((earning: Earning) => [earning.estimate]);
    const surpriseData = data.map((earning: Earning) => `Surprise: ${earning.surprise.toFixed(4)}`)

    console.log("Company Earnings Data");
    console.log(data);
    this.InsightsHighcharts2 = Highcharts;
    this.InsightschartOptions2 = {
      chart: {
        backgroundColor: '#f6f6f6',
        reflow: true,
        type: 'spline'
      },
      title: {
        text: "Historical EPS surprises"
      }, xAxis: {
        categories: categories,
        crosshair: true,
        labels: {
          align: 'center',
          reserveSpace: true,
          formatter: function () {
            return `<div class="mt-1 mb-0" style="text-align: center;">${this.value}<br/>${surpriseData[this.pos]}</div>`;
          },
          useHTML: true
        }
      },
      yAxis: {
        title: {
          text: 'Quaterly EPS'
        }
      },
      series: [{
        name: 'Actual',
        data: actualData
        // type: 'spline',
      }, {
        name: 'Estimate',
        // type: 'spline',
        data: estimatedData
      }] as Highcharts.SeriesOptionsType[]
    }
    this.isInsightsChart2DataLoaded = true;
  }

  setHighChart(data: any) {
    const ohlcData = [], volumeData = [];
    console.log(data);
    for (var i = 0; i < data.results.length; i++) {
      ohlcData.push([
        data.results[i].t,
        data.results[i].o,
        data.results[i].h,
        data.results[i].l,
        data.results[i].c
      ]);
      volumeData.push([
        data.results[i].t,
        data.results[i].v
      ]);
    }
    console.log(ohlcData);
    console.log(volumeData);
    const groupingUnits: [string, number[]][] = [
      ['week', [1]],
      ['month', [1, 2, 3, 4, 6]]
    ];
    this.HighTabcharts = Highcharts;
    this.chartTabOptions = {
      chart: {
        backgroundColor: '#f6f6f6'
      },
      rangeSelector: {
        selected: 5,
        enabled: true,
        buttons: [{
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'month',
          count: 3,
          text: '3m'
        }, {
          type: 'month',
          count: 6,
          text: '6m'
        }, {
          type: 'ytd',
          text: 'YTD'
        }, {
          type: 'year',
          count: 1,
          text: '1y'
        }, {
          type: 'all',
          text: 'All'
        }]
      },
      title: {
        text: `${this.ticker} Historical`
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },
      scrollbar: {
        enabled: true
      },
      navigator: {
        enabled: true
      },
      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],
      tooltip: {
        split: true
      }, plotOptions: {
        // series: {
        //   dataGrouping: {
        //     units: groupingUnits
        //   }
        // }
      },
      series: [{
        type: 'candlestick',
        name: `${this.ticker}`,
        id: 'aapl',
        zIndex: 2,
        data: ohlcData
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volumeData,
        yAxis: 1
      }, {
        type: 'vbp',
        linkedTo: 'aapl',
        params: {
          volumeSeriesID: 'volume'
        },
        dataLabels: {
          enabled: false
        },
        zoneLines: {
          enabled: false
        }
      }, {
        type: 'sma',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
          enabled: false
        }
      }]
    }
    this.isHighTabDataLoaded = true;
  }

  loadCompanyDescriptionData(ticker: string) {
    this.dataservice.getCompanyDescription(ticker).subscribe(data => {
      this.tickerService.setSessionData('CompanyDescritionData', data);
      this.fetchCompanyData(data);
    });
  }

  loadCompanyPeersData(ticker: string) {
    this.dataservice.getcompanyPeers(ticker).subscribe(data => {
      this.tickerService.setSessionData('CompanyPeersData', data);
      this.fetchCompanyPeers(data);
      this.isCompanyPeersDataLoaded = true;
    });
  }

  loadCompanyNewsData(ticker: string) {
    this.dataservice.getcompanyNews(this.ticker).subscribe(data => {
      this.tickerService.setSessionData('CompanyNewsData', data);
      this.fetchCompanyNews(data);
    });
  }

  loadInsiderSentimentData(ticker: string) {
    this.dataservice.getinsiderSentiment(this.ticker).subscribe(data => {
      this.tickerService.setSessionData('InsiderSentimentData', data);
      this.fetchInsiderSentimentData(data);
    });
  }

  loadPortfolioComponent() {
    this.modalCurrentPrice = 0;
    this.dataservice.getportfolioComponent().subscribe(data => {
      this.tickerService.setSessionData('PortfolioData', data);
      this.setPortfolioComponentData(data);
    });
  }

  loadData(ticker: string) {
    // this.dataservice.getCompanyDescription(ticker).subscribe(data => {
    //   // this.tickerService.setCompanyDescription(data);
    //   this.tickerService.setSessionData('CompanyDescritionData', data);
    //   // this.tickerSymbol = data.ticker;
    //   // this.companyName = data.name;
    //   // this.exchange = data.exchange;
    //   // this.ipo = data.ipo;
    //   // this.finnhubIndustry = data.finnhubIndustry;
    //   // this.weburl = data.weburl;
    //   // this.logo = data.logo;
    //   // this.isCompanyDescriptionDataLoaded = true;
    //   this.fetchCompanyData(data);
    // });

    // this.dataservice.gethistoricalData(this.ticker).subscribe(data => {

    // });

    // this.dataservice.getrecommendationTrends(this.ticker).subscribe(data => {

    // });

    // this.dataservice.getcompanyNews(this.ticker).subscribe(data => {

    //   this.newsData = [];

    //   for (var i = 0; i < data.length && i < 20; i++) {
    //     this.newsData.push({
    //       imageUrl: data[i].image,
    //       title: data[i].headline,
    //       url: data[i].url,
    //       date: this.formatDate(data[i].datetime),
    //       summary: data[i].summary,
    //       source: data[i].source
    //     });
    //   }
    //   this.matrix = this.transformToMatrix(this.newsData, 2);
    //   console.log("the Data is ", this.newsData);
    //   this.isCompanyNewsDataLoaded = true;
    // });

    // this.dataservice.getinsiderSentiment(this.ticker).subscribe(data => {
    //   console.log(data);

    //   this.totalChange = 0;
    //   this.totalChangeNegative = 0;
    //   this.totalChangePositive = 0;
    //   this.totalMSPR = 0;
    //   this.totalMSPRNegative = 0;
    //   this.totalMSPRPositive = 0;

    //   data.data.forEach((item: InsiderSentiment) => {
    //     this.totalMSPR += item.mspr;
    //     this.totalChange += item.change;

    //     if (item.mspr > 0) {
    //       this.totalMSPRPositive += item.mspr;
    //     } else if (item.mspr < 0) {  
    //       this.totalMSPRNegative += item.mspr;
    //     }

    //     if (item.change > 0) {
    //       this.totalChangePositive += item.change;
    //     } else if (item.change < 0) {
    //       this.totalChangeNegative += item.change;
    //     }
    //   });
    //   this.totalChange = this.roundof(this.totalChange);
    //   this.totalMSPR = this.roundof(this.totalMSPR);
    //   this.totalChangeNegative = this.roundof(this.totalChangeNegative);
    //   this.totalChangePositive = this.roundof(this.totalChangePositive);
    //   this.totalMSPRNegative = this.roundof(this.totalMSPRNegative);
    //   this.totalMSPRPositive = this.roundof(this.totalMSPRPositive);
    // });

    // this.dataservice.getcompanyPeers(this.ticker).subscribe(data => {
    //   this.tickerService.setSessionData('companyPeersData', data);
    //   this.fetchCompanyPeers(data);
    //   // this.companyPeers = data;
    //   this.isCompanyPeersDataLoaded = true;
    // });

    // this.dataservice.getcompanyEarnings(this.ticker).subscribe(data => {
    //   console.log("Company earnings data");
    //   console.log(data);
    // });
  }

  openBuyModal(content: any): void {
    this.total = 0;
    this.quantity = 0;
    this.currentAction = 'buy';
    this.currentQuantity = 0;
    this.openWindowCustomClass(content);
  }

  openSellModal(content: any): void {
    this.total = 0;
    this.quantity = 0;
    this.currentAction = 'sell';
    this.currentQuantity = 0;
    this.openWindowCustomClass(content);
  }

  openWindowCustomClass(content: TemplateRef<any>) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  modalCompanyName: string = "";
  modalCurrentPrice: number = 0;
  modalQuantity: number = 0;
  totalMoneyInWallet: number = 0;
  totalCompaniesCost: number = 0;
  modalTickerSymbol: string = "";

  finalMoneyInWallet: number = 0;



  public alertInfo: alertInfo = {
    errorMessage: "Please Enter a valid Ticker",
    bgColor: "#f6d1d5",
    buttonStatus: false,
    divStatus: false
  }

  addedToWishlist() {
    this.clicked = !this.clicked;
    // this.alertInfo.errorMessage = `${this.tickerSymbol} added to Watchlist`;
    // this.alertInfo.divStatus = true;
    // this.alertInfo.bgColor = "#d1e6dd";
    // this.alertInfo.buttonStatus = true;
    this.alerts.push({
      alertInfo: {
        errorMessage: `${this.ticker} added to watchlist`,
        bgColor: '#d1e6dd', buttonStatus: true, divStatus: true
      }, isTimer: true
    });
    this.dataservice.insertIntoWishlist(this.ticker, this.companyName).subscribe(
      response => {
        this.getWatchlistComponent();
        console.log("The data has been inserted successfully ", response);
      }, error => {
        console.log("Error inserting data ", error);
      }
    );
  }

  deleteFromWishlist() {
    this.clicked = !this.clicked;
    // this.alertInfo.errorMessage = `${this.tickerSymbol} deleted from Watchlist`;
    // this.alertInfo.divStatus = true;
    // this.alertInfo.bgColor = "#f6d1d5";
    // this.alertInfo.buttonStatus = true;
    this.alerts.push({
      alertInfo: {
        errorMessage: `${this.ticker} removed from watchlist`,
        bgColor: '#f6d1d5', buttonStatus: true, divStatus: true
      }, isTimer: true
    });
    this.dataservice.deleteFromWishlist(this.ticker).subscribe(
      response => {
        this.getWatchlistComponent();
        console.log("The data has been deleted successfully ", response);
      }, error => {
        console.log("Error deleting data ", error);
      }
    );
  }

  calculateTotal(): void {
    this.total = this.currentQuantity * this.modalCurrentPrice;
  }

  boughtsuccessfully(modalticker: string, modalCompanyName: string, modalquantity: number, modalcurrentPrice: number, transactionType: string) {
    this.totalCompaniesCost = 0;
    // this.alertInfo.errorMessage = `${this.tickerSymbol} Stock Bought Successfully`;
    // this.alertInfo.divStatus = true;
    // this.alertInfo.bgColor = "#d1e6dd";
    // this.alertInfo.buttonStatus = true;
    this.alerts.push({
      alertInfo: {
        errorMessage: `${this.ticker} stock bought successfully`,
        bgColor: '#d1e6dd', buttonStatus: true, divStatus: true
      }, isTimer: true
    });
    console.log("Thissss neeeddddtoooobeeecheckkkkeddddd");
    console.log(modalticker);
    console.log(modalCompanyName);
    console.log(modalquantity);
    console.log(modalcurrentPrice);
    this.dataservice.buyOrSellStock(modalticker, modalCompanyName, modalquantity, modalcurrentPrice, transactionType).subscribe(data => {
      console.log("Thissss neeeddddtoooobeeecheckkkkeddddd");
      console.log(data);
      this.loadPortfolioComponent();
      this.modalService.dismissAll();
    })
    this.modalService.dismissAll();
    //stock bought api to be called.
  }

  soldsuccessfully(modalticker: string, modalCompanyName: string, modalquantity: number, modalcurrentPrice: number, transactionType: string) {
    this.totalCompaniesCost = 0;
    // this.alertInfo.errorMessage = `${this.tickerSymbol} Sold Successfully`;
    // this.alertInfo.divStatus = true;
    // this.alertInfo.bgColor = "#f6d1d5";
    // this.alertInfo.buttonStatus = true;
    this.alerts.push({
      alertInfo: {
        errorMessage: `${this.ticker} sold successfully`,
        bgColor: '#f6d1d5', buttonStatus: true, divStatus: true
      }, isTimer: true
    });
    // modalquantity = -modalquantity;
    this.dataservice.buyOrSellStock(modalticker, modalCompanyName, modalquantity, modalcurrentPrice, transactionType).subscribe(data => {
      console.log(data);
      this.btnStatusSell = false;
      this.loadPortfolioComponent();
      this.modalService.dismissAll();
    })
    this.modalService.dismissAll();
    //stock sold api to be called.
  }
}
