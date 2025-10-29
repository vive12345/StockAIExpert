// import { ActivatedRoute, RouterModule } from '@angular/router';
// import { HomeComponent } from '../home/home.component';
// import { PortfolioComponent } from '../portfolio/portfolio.component';
// import { WatchlistComponent } from '../watchlist/watchlist.component';
// import { NostockdataComponent } from '../nostockdata/nostockdata.component';

// import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
// import { Subject, of } from 'rxjs';
// import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { map, startWith, takeUntil, tap } from 'rxjs/operators';
// import { AsyncPipe, CommonModule } from '@angular/common';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { DataService } from '../data.service';
// import { debounceTime, switchMap, catchError } from 'rxjs/operators';
// import { alertInfo } from '../alertinfo.interface';
// import { Router, NavigationExtras } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
// import { TickerService } from '../ticker.service';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { NgIf } from '@angular/common';
// import { ChangeDetectorRef } from '@angular/core';


// @Component({
//   selector: 'app-inputform',
//   standalone: true,
//   imports: [HomeComponent, PortfolioComponent, WatchlistComponent, RouterModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, NostockdataComponent, MatProgressSpinnerModule, CommonModule],
//   templateUrl: './inputform.component.html',
//   styleUrls: ['./inputform.component.css'],
//   providers: [DataService, TickerService]
// })
// export class InputformComponent implements OnInit {

//   cancelSearch = new Subject<void>();

//   @Input() tickerSymbol: string = '';
//   // this.tickerInput = this.tickerSymbol;

//   formSubmitted: boolean = false;

//   dataLoaded: boolean = true;

//   alertInfo: alertInfo;
//   tickerInput: string = '';

//   // dataLoaded: boolean = false;
//   ticker:string=''
//   optionSelected = false;

//   constructor(private dataservice: DataService, private router: Router, private cdRef: ChangeDetectorRef, private route: ActivatedRoute, private tickerService: TickerService) {
//     this.alertInfo = {
//       errorMessage: '',
//       bgColor: '',
//       buttonStatus: false,
//       divStatus: false
//     };
//   }

//   myControl = new FormControl('');
//   options: string[] = ['One', 'Two', 'Three'];
//   filteredOptions: Observable<string[]> = of([]);

//   handleEnterPress() {
//     this.formSubmitted = true;
//   }

//   @Output() resetClicked: EventEmitter<void> = new EventEmitter();

//   resetButtonClicked() {
//     // this.resetClicked.emit();
//     this.alertInfo.divStatus = false;
//     this.tickerService.removeFromSession('tickerSymbol');
//     this.router.navigate(['/search/home'])
//   }


//   search() {
//     // const tickerInput = this.tickerInput;
//     // const tickerData = this.tickerInput.trim();
//     // const ticker = tickerInput.split(' | ')[0]
//     // console.log(ticker);
//     // this.dataLoaded = true;
//     this.cancelSearch.next(); 
//     // this.cancelSearch = new Subject<void>();
//     this.formSubmitted = true;
//     this.dataLoaded = true;
//     // const ticker = this.tickerInput;
//     console.log(this.ticker);
//     this.alertInfo.divStatus = false;
//     if (this.ticker) {
//       console.log(this.ticker);
//       this.formSubmitted = true;
//       console.log("Inside search ", this.formSubmitted);
//       this.dataservice.getCompanyDescription(this.ticker).subscribe(data => {
//         console.log("the lenfrt of the data is ",data.length);
//         console.log("The data isssssssss",data);
//         if (Object.keys(data).length === 0) {
//           this.alertInfo.errorMessage = "No data found. Please enter a valid Ticker";
//           this.alertInfo.bgColor = "#f6d1d5";
//           this.alertInfo.divStatus = true;
//           this.alertInfo.buttonStatus = false;
//         }
//         else{
//           this.formSubmitted = true;
//           // this.tickerService.setCurrentTicker(this.ticker);
//           this.router.navigate(['/search', this.ticker]);
//         }
//       })
//       // this.router.navigate(['/search', ticker]);
//     } else {
//       console.log("no Input");
//       this.alertInfo.errorMessage = "Please enter a valid Ticker Symbol";
//       this.alertInfo.bgColor = "#f6d1d5";
//       this.alertInfo.divStatus = true;
//       this.alertInfo.buttonStatus = true;
//     }
//   }



//   onOptionSelected(event: MatAutocompleteSelectedEvent) {

//     const ticker = event.option.value.split(' | ')[0];
//     this.optionSelected = true;
//     console.log(ticker);
//     console.log("2nd");
//     this.alertInfo.divStatus = false;
//     console.log("aaaaaaaaaaaaaa");
//     const navigationExtras: NavigationExtras = {
//       replaceUrl: true, // Prevent creating a new entry in the browser history
//       queryParamsHandling: 'preserve', // Preserve existing query parameters
//     };
//     // this.tickerService.setCurrentTicker(this.ticker);
//     this.router.navigate(['/search', ticker], navigationExtras);
//     // this.myControl.setValue(ticker);
//   }

//   lastTicker: string | null = 'dummy';
//   companyDescription: string | null = null;

//   ngOnInit() {
//     // this.myControl.setValue('wertyu')

//     // this.tickerService.getSessionData().subscribe(ticker => {
//     //   this.lastTicker = ticker;
//     //   console.log("The last ticker is: ", this.lastTicker);
//     // });

//     // console.log("The tickererrrrr is ",this.tickerService.getCurrentTicker());
//       // this.lastTicker = state.lastTicker;
//       // this.companyDescription = state.companyDescription;

//     console.log("The stateee", this.lastTicker);
//     console.log("The company descriotuonnnnnnnnn", this.companyDescription);

//     this.route.paramMap.subscribe(params => {

//       if(params.get('ticker')){

//         console.log("Everffdffsfdsfsdfsdfsfsdfsdfds", params.get('ticker'));
//         this.myControl.setValue(params.get('ticker')); 

//       }
//     })
//     this.alertInfo.divStatus = false;
//     // this.dataLoaded = true;
//     console.log(this.formSubmitted);
//     this.filteredOptions = this.myControl.valueChanges.pipe(tap(()=>{
//       this.dataLoaded=false
//     }),
//       startWith(''),
//       switchMap(value => {
//         this.ticker=value || '';
//         this.formSubmitted = false;
//         if(value === null || value == ''){
//           console.log("data is nullllll", value);
//           this.dataLoaded = true;
//           return of([]);
//         }
//         // if(value){
//         //   this.dataLoaded = false;
//         // }else{
//         //   this.dataLoaded = true;
//         // }

//         console.log("1st");
//         console.log(value);
//         if (this.optionSelected) {
//           this.optionSelected = false;
//           console.log("option Selected");
//           return of([]);
//         }
//         if (value && !this.formSubmitted) {
//           this.dataLoaded = false;
//           console.log(this.formSubmitted);
//           console.log("value is not null");
//           console.log(value);
//           console.log("option not Selected");
//           return this.dataservice.getAutoCompleteData(value.toLowerCase()).pipe(takeUntil(this.cancelSearch),
//             map(data => {

//               this.dataLoaded = true;
//               console.log(data);
//               if (data.length === 0) {

//                 console.log("Empty String");
//                 this.alertInfo.errorMessage = "No TickerData found. Please enter a valid Ticker Symbol";
//                 this.alertInfo.bgColor = "#f6d1d5";
//                 this.alertInfo.divStatus = true;
//                 this.alertInfo.buttonStatus = false;
//                 return [];
//               } else {
//                 this.alertInfo.divStatus = false;
//                 return data;
//               }
//             })
//           );
//         }
//         else {

//           return of([]);
//         }
//       }),
//       catchError(() => of([]))
//     );
//   }
// }


import { ActivatedRoute, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { WatchlistComponent } from '../watchlist/watchlist.component';
import { NostockdataComponent } from '../nostockdata/nostockdata.component';

import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject, of } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataService } from '../data.service';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { alertInfo } from '../alertinfo.interface';
import { Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TickerService } from '../ticker.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-inputform',
  standalone: true,
  imports: [HomeComponent, PortfolioComponent, WatchlistComponent, RouterModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, NostockdataComponent, MatProgressSpinnerModule, CommonModule],
  templateUrl: './inputform.component.html',
  styleUrls: ['./inputform.component.css'],
  providers: [DataService, TickerService]
})
export class InputformComponent implements OnInit {

  cancelSearch = new Subject<void>();

  @Input() tickerSymbol: string = '';
  // this.tickerInput = this.tickerSymbol;

  public alerts: Array<{
    alertInfo: {
      errorMessage: string,
      bgColor: string,
      buttonStatus: boolean,
      divStatus: boolean
    }, isTimer: boolean
  }> = []

  formSubmitted: boolean = false;

  dataLoaded: boolean = true;

  alertInfo: alertInfo;
  tickerInput: string = '';

  // dataLoaded: boolean = false;
  ticker: string = ''
  optionSelected = false;

  constructor(private dataservice: DataService, private router: Router, private cdRef: ChangeDetectorRef, private route: ActivatedRoute, private tickerService: TickerService) {
    this.alertInfo = {
      errorMessage: '',
      bgColor: '',
      buttonStatus: false,
      divStatus: false
    };
  }

  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]> = of([]);

  handleEnterPress() {
    this.formSubmitted = true;
  }

  @Output() resetClicked: EventEmitter<void> = new EventEmitter();



  resetButtonClicked() {
    // this.resetClicked.emit();
    this.alertInfo.divStatus = false;
    this.tickerService.removeFromSession('tickerSymbol');
    this.router.navigate(['/search/home'])
  }


  search() {
    // const tickerInput = this.tickerInput;
    // const tickerData = this.tickerInput.trim();
    // const ticker = tickerInput.split(' | ')[0]
    // console.log(ticker);
    // this.dataLoaded = true;
    this.cancelSearch.next();
    // this.cancelSearch = new Subject<void>();
    this.formSubmitted = true;
    this.dataLoaded = true;
    // const ticker = this.tickerInput;
    console.log(this.ticker);
    this.alertInfo.divStatus = false;
    if (this.ticker) {
      console.log(this.ticker);
      this.formSubmitted = true;
      console.log("Inside search ", this.formSubmitted);
      this.dataservice.getCompanyDescription(this.ticker).subscribe(data => {
        console.log("the lenfrt of the data is ", data.length);
        console.log("The data isssssssss", data);
        if (Object.keys(data).length === 0) {
          this.alerts.push({
            alertInfo: {
              errorMessage: 'No data found. Please enter a valid Ticker',
              bgColor: '#f6d1d5', buttonStatus: false, divStatus: true
            }, isTimer: false
          });
          // this.alertInfo.errorMessage = "No data found. Please enter a valid Ticker";
          // this.alertInfo.bgColor = "#f6d1d5";
          // this.alertInfo.divStatus = true;
          // this.alertInfo.buttonStatus = false;
        }
        else {
          this.formSubmitted = true;
          // this.tickerService.setCurrentTicker(this.ticker);
          this.router.navigate(['/search', this.ticker]);
        }
      })
      // this.router.navigate(['/search', ticker]);
    } else {
      console.log("no Input");
      // this.alertInfo.errorMessage = "Please enter a valid Ticker Symbol";
      // this.alertInfo.bgColor = "#f6d1d5";
      // this.alertInfo.divStatus = true;
      // this.alertInfo.buttonStatus = true;
      this.alerts.push({
        alertInfo: {
          errorMessage: 'Please enter a valid Ticker Symbol',
          bgColor: '#f6d1d5', buttonStatus: true, divStatus: true
        }, isTimer: true
      });
    }
  }



  onOptionSelected(event: MatAutocompleteSelectedEvent) {

    const ticker = event.option.value.split(' | ')[0];
    this.optionSelected = true;
    console.log(ticker);
    console.log("2nd");
    this.alertInfo.divStatus = false;
    console.log("aaaaaaaaaaaaaa");
    const navigationExtras: NavigationExtras = {
      replaceUrl: true, // Prevent creating a new entry in the browser history
      queryParamsHandling: 'preserve', // Preserve existing query parameters
    };
    // this.tickerService.setCurrentTicker(this.ticker);
    this.router.navigate(['/search', ticker]);
    // this.myControl.setValue(ticker);
  }

  lastTicker: string | null = 'dummy';
  companyDescription: string | null = null;

  ngOnInit() {
    // this.myControl.setValue('wertyu')

    // this.tickerService.getSessionData().subscribe(ticker => {
    //   this.lastTicker = ticker;
    //   console.log("The last ticker is: ", this.lastTicker);
    // });

    // console.log("The tickererrrrr is ",this.tickerService.getCurrentTicker());
    // this.lastTicker = state.lastTicker;
    // this.companyDescription = state.companyDescription;

    console.log("The stateee", this.lastTicker);
    console.log("The company descriotuonnnnnnnnn", this.companyDescription);

    this.route.paramMap.subscribe(params => {

      if (params.get('ticker')) {

        console.log("Everffdffsfdsfsdfsdfsfsdfsdfds", params.get('ticker'));
        this.myControl.setValue(params.get('ticker'));

      }
    })
    this.alertInfo.divStatus = false;
    // this.dataLoaded = true;
    console.log(this.formSubmitted);
    this.filteredOptions = this.myControl.valueChanges.pipe(tap(() => {
      this.dataLoaded = false
    }),
      startWith(''),
      switchMap(value => {
        this.ticker = value || '';
        this.formSubmitted = false;
        if (value === null || value == '') {
          console.log("data is nullllll", value);
          this.dataLoaded = true;
          return of([]);
        }
        // if(value){
        //   this.dataLoaded = false;
        // }else{
        //   this.dataLoaded = true;
        // }

        console.log("1st");
        console.log(value);
        if (this.optionSelected) {
          this.optionSelected = false;
          console.log("option Selected");
          return of([]);
        }
        if (value && !this.formSubmitted) {
          this.dataLoaded = false;
          console.log(this.formSubmitted);
          console.log("value is not null");
          console.log(value);
          console.log("option not Selected");
          return this.dataservice.getAutoCompleteData(value.toLowerCase()).pipe(takeUntil(this.cancelSearch),
            map(data => {

              this.dataLoaded = true;
              console.log(data);
              if (data.length === 0) {

                console.log("Empty String");
                this.alerts.push({
                  alertInfo: {
                    errorMessage: 'No TickerData found. Please enter a valid Ticker Symbol',
                    bgColor: '#f6d1d5', buttonStatus: false, divStatus: true
                  }, isTimer: false
                });
                // this.alertInfo.errorMessage = "No TickerData found. Please enter a valid Ticker Symbol";
                // this.alertInfo.bgColor = "#f6d1d5";
                // this.alertInfo.divStatus = true;
                // this.alertInfo.buttonStatus = false;
                return [];
              } else {
                this.alertInfo.divStatus = false;
                return data;
              }
            })
          );
        }
        else {

          return of([]);
        }
      }),
      catchError(() => of([]))
    );
  }
}