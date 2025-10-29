import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { HomeComponent } from '../home/home.component';
// import { WatchlistComponent } from '../watchlist/watchlist.component';
// import { PortfolioComponent } from '../portfolio/portfolio.component';
import { CommonModule } from '@angular/common';
import { alertInfo } from '../alertinfo.interface';
import { timer } from 'rxjs';

@Component({
  selector: 'app-nostockdata',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nostockdata.component.html',
  styleUrl: './nostockdata.component.css'
})
export class NostockdataComponent implements OnChanges{
  @Input() pageName: string = "default"; 
  @Input() errorMessage: String = "default";
  @Input() alertInfo: alertInfo = { errorMessage: "", bgColor: "", buttonStatus: true, divStatus: true};
  @Input() isTimer:boolean=false
  showErrorMessage: boolean = true;
  buttonStatus: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isTimer'] && changes['isTimer'].currentValue == true)
    {
      timer(5000).subscribe(n=>{ this.alertInfo.divStatus=false})
    }
  }

  resetInput() {
    this.alertInfo.divStatus = false; // Hide the error message
  }
}
