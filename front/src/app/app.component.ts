import { Component } from '@angular/core';
import { Router , NavigationEnd  } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SharedService } from './_services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: string;
  d: any;
  user: any;
  test
  currentUrl
  constructor(private router :Router, private location: Location,
    private sharedService :SharedService) {
  
  
  }
  public ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentUrl = this.location.path();
        if(this.currentUrl.split('/')[2] != "chantiers"){
    this.sharedService.setUrl(this.currentUrl.split('/')[2]);
        }
        else{
          if(this.currentUrl.split('/')[2] == "chantiers" && this.currentUrl.split('/')[2] == undefined 
          || (this.currentUrl.split('/')[3] != "suppafacs"
           && this.currentUrl.split('/')[3] != "vitres")){
            this.sharedService.setUrl(this.currentUrl.split('/')[2]);
          }
         else{
          this.sharedService.setUrl(this.currentUrl.split('/')[3]);
         }
        }
      });
  }
   
  }
 


