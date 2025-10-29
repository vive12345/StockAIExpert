import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
// import { NostockdataComponent } from './nostockdata/nostockdata.component';
import { DataService } from './data.service';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, RouterOutlet, HeaderComponent, SearchComponent, RouterModule, HeaderComponent, HighchartsChartModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DataService]
})
export class AppComponent{
  title = 'Assign3_Workspace';

  constructor(private dataservice: DataService){}

  // ngOnInit(){
  //   this.dataservice.getCompanyDescription().subscribe(
  //     (data) => {
  //       console.log(data);
  //     }, (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
}
