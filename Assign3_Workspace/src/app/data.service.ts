import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { alertInfo } from './alertinfo.interface';

export interface ResultItem {
  v: number;
  vw: number;
  o: number;
  c: number;
  h: number;
  l: number;
  t: number; 
  n: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getCompanyDescription(ticker: string): Observable<any> {
    console.log(" company no data che")
    //console.log(`/companyDescription?symbol=${ticker}`);
    return this.http.get(`/companyDescription?symbol=${ticker}`);
  }

  gethistoricalData(ticker: string): Observable<any> {
    //console.log(`/historicalData?symbol=${ticker}`);
    return this.http.get(`/historicalData?symbol=${ticker}`);
  }

  getlatestPrice(ticker: string): Observable<any> {
    console.log("kamnu -----------------------")
    console.log(`/latestPrice?symbol=${ticker}`);
    return this.http.get(`/latestPrice?symbol=${ticker}`);
  }

  getrecommendationTrends(ticker: string): Observable<any> {
    //console.log(`/recommendationTrends?symbol=${ticker}`);
    return this.http.get(`/recommendationTrends?symbol=${ticker}`);
  }

  getcompanyNews(ticker: string): Observable<any> {
    return this.http.get(`/companyNews?symbol=${ticker}`).pipe(
      map((data: any) => {
        return data.filter((item: any) => item.headline && item.image);
      })
    );
  }

  getinsiderSentiment(ticker: string): Observable<any> {
    //console.log(`/insiderSentiment?symbol=${ticker}`);
    return this.http.get(`/insiderSentiment?symbol=${ticker}`);
  }

  // getcompanyPeers(ticker: string): Observable<any> {
  //   //console.log(`/companyPeers?symbol=${ticker}`);
  //   return this.http.get(`/companyPeers?symbol=${ticker}`);
  // }

  getcompanyPeers(ticker: string): Observable<any> {
    return this.http.get<any[]>(`/companyPeers?symbol=${ticker}`).pipe(
      map(peers => {
        const filteredPeers = peers.filter(peer => !peer.includes('.'));
        return Array.from(new Set(filteredPeers));
      })
    );
  }

  getcompanyEarnings(ticker: string): Observable<any> {
    //console.log(`/companyEarnings?symbol=${ticker}`);
    return this.http.get(`/companyEarnings?symbol=${ticker}`);
  }

  getAutoCompleteData(searchTerm: string): Observable<string[]> {
    const params = new HttpParams().set('query', searchTerm);
    return this.http.get<{ count: number; result: any[] }>('/autoComplete', { params })
      .pipe(
        map(response => {
          // console.log(response);
          return response.result
            .filter(item => !item.symbol.includes('.') && item.type === 'Common Stock')
            .map(item => `${item.displaySymbol} | ${item.description}`);
        })
      );
  }
  // getSummaryData(ticker: string, startDate: Date, endDate: Date): Observable<any> {
  //   console.log(startDate);
  //   console.log(endDate);
  //   const formattedStartDate = startDate.toISOString().substring(0, 10);
  //   const formattedEndDate = endDate.toISOString().substring(0, 10);
  //   console.log(`/summaryData?symbol=${ticker}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
  //   return this.http.get(`/summaryData?symbol=${ticker}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
  // }

  formatDate(dateToFormat: string | Date): string{
    const newDate = new Date(dateToFormat);
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const day = newDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getSummaryData(ticker: string, startDate: Date, endDate: Date): Observable<any[]> {
      // console.log(startDate);
      // console.log(endDate);
      const formattedStartDate = this.formatDate(startDate);
      const formattedEndDate = this.formatDate(endDate);
      // console.log(formattedEndDate);
      // console.log(formattedStartDate);
      const url = `/summaryData?symbol=${ticker}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      // console.log(url);
      // console.log(startDate);
      // console.log(endDate);
      return this.http.get<{ results: ResultItem[] }>(url).pipe(
        map(response => {
          if (response.results && response.results.length > 0) {
            return response.results.map(result => [result.t, result.c]);
          } else {
            return [];
          }
        })
      );
    }
  

  // getSummaryData(ticker: string, startDate: Date, endDate: Date): Observable<any[]> {
  //   console.log(startDate);
  //   console.log(endDate);
  //   const formattedStartDate = startDate.toISOString().substring(0, 10);
  //   const formattedEndDate = endDate.toISOString().substring(0, 10);
  //   console.log(formattedEndDate);
  //   console.log(formattedStartDate);
  //   const url = `/summaryData?symbol=${ticker}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
  //   console.log(url);
  //   console.log(startDate);
  //   console.log(endDate);
  //   return this.http.get<{ results: ResultItem[] }>(url).pipe(
  //     map(response => {
  //       if (response.results && response.results.length > 0) {
  //         return response.results.map(result => [result.t, result.c]);
  //       } else {
  //         return [];
  //       }
  //     })
  //   );
  // }

  getWatchlistComponent(): Observable<any> {
    return this.http.get("/getWatchlistData");
  }

  insertIntoWishlist(tickerSymbol: string, companyName: string): Observable<any> {
    console.log("inside insertintowishlist");
    console.log("ticker", tickerSymbol, "companyName", companyName);
    const encodedCompanyName = encodeURIComponent(companyName);
    console.log(`/insertIntoWatchlistData?tickerSymbol=${tickerSymbol}&companyName=${encodedCompanyName}`)
    return this.http.get(`/insertIntoWatchlistData?tickerSymbol=${tickerSymbol}&companyName=${encodedCompanyName}`);
  }

  deleteFromWishlist(tickerSymbol: string): Observable<any>{
    console.log("inside delete from wishlist");
    return this.http.get(`/deleteFromWatchlist?tickerSymbol=${tickerSymbol}`);
  }

  getportfolioComponent(): Observable<any> {
    console.log("the starts starts getting");
    return this.http.get("/portfolioComponent");
  }

  
  buyOrSellStock(tickerSymbol: string, companyName: string, quantity: number, currentPrice: number, transactionType: string): Observable<any>{
    const encodedCompanyName = encodeURIComponent(companyName);
    console.log(`/insertOrUpdatePortfolioComponent?tickerSymbol=${tickerSymbol}&companyName=${encodedCompanyName}&quanity=${quantity}&currentPrice=${currentPrice}&transactionType=${transactionType}`);
    return this.http.get(`/insertOrUpdatePortfolioComponent?tickerSymbol=${tickerSymbol}&companyName=${encodedCompanyName}&quantity=${quantity}&currentPrice=${currentPrice}&transactionType=${transactionType}`);
  }
}
