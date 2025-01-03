import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private myVariable: string;
  private idSite: string;
  private idSite_benefitGlass :string
  private idBenefit :string;



  private submitEvent = new Subject<void>();
  submitEvent$ = this.submitEvent.asObservable();


  setVariable(value: string): void {
    this.myVariable = value;
  }

  getVariable(): string {
    return this.myVariable;
  }

  private urlSource = new BehaviorSubject<string>('');
  currentUrl = this.urlSource.asObservable();

  setUrl(value: string) {
    this.urlSource.next(value);
  }

  emitSubmitEvent() {
    this.submitEvent.next();
  }
}

