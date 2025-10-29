import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppState } from './appState.interface'


@Injectable({
  providedIn: 'root'
})
export class TickerService {

  constructor() { }

  private currentTicker = new BehaviorSubject<string | null>(null);

  // setCurrentTicker(ticker: string | null) {
  //   console.log("thee tickerrr is settttt",ticker);
  //   this.currentTicker.next(ticker);
  //   if (ticker) {
  //     sessionStorage.setItem('lastTicker', ticker);
  //   } else {
  //     console.log("tickerrr deleyeeedddd");
  //     sessionStorage.removeItem('lastTicker');
  //   }
  // }

  // getCurrentTicker() {
  //   console.log("tickerrrr issss abouttt to getttt", this.currentTicker.asObservable());
  //   return this.currentTicker.asObservable();
  // }

  setSessionData(key: string, value: any) {
    if (typeof value === "object" && value !== null) {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      sessionStorage.setItem(key, value);
    }
  }
  hasSessionData(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
  }
  getSessionData(key: string): any {
    const value = sessionStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return null;
  }
  removeFromSession(key:string) {
    sessionStorage.removeItem(key);
  }

  // private state$: BehaviorSubject<AppState> = new BehaviorSubject<AppState>(this.initialState);
  

  // getState(): Observable<AppState> {
  //   return this.state$.asObservable();
  // }

  // setLastTicker(ticker: string): void {
  //   const currentState = this.state$.getValue();
  //   this.state$.next({ ...currentState, lastTicker: ticker });
  // }

  // setCompanyDescription(data: any): void {
  //   const currentState = this.state$.getValue();
  //   this.state$.next({ ...currentState, companyDescription: data });
  // }

  // getLastTicker(): string | null {
  //   return this._state.lastTicker;
  // }

  // private currentTicker = new BehaviorSubject<string | null>(null);

  // // Setter for the last ticker
  // setLastTicker(ticker: string | null): void {
  //   console.log("theeeee tickkeerrr isss settttttt", ticker);
  //   // this._state.lastTicker = ticker;
  //   this.currentTicker.next(ticker);
  //   // Optionally synchronize with localStorage
  //   if (ticker) {
  //     localStorage.setItem('lastTicker', ticker);
  //   } else {
  //     localStorage.removeItem('lastTicker');
  //   }
  // }

  // getCurrentTicker() {
  //     console.log("tickerrrr issss abouttt to getttt", this.currentTicker.asObservable());
  //     return this.currentTicker.asObservable();
  //   }

  // Getter for the company description
  // getCompanyDescription(): any {
  //   return this._state.companyDescription;
  // }

  // // Setter for the company description
  // setCompanyDescription(description: any): void {
  //   this._state.companyDescription = description;
  // }

   // _state: AppState = {
  //   lastTicker: null,
  //   companyDescription: null,
  // };
}
