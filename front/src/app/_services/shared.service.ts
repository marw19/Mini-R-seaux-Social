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

  setIdSiteSendTOBenefit(value: string): void {
    this.idSite = value;
  }
  getIdSiteSended() :string{
    return this.idSite;
  }

  setIdSiteSendTOBenefitGlass(value: string): void {
    this.idSite_benefitGlass = value;
  }
  getIdSiteSendedTobenfitGlass() :string{
    return this.idSite_benefitGlass;
  }

  setIdBenfitSendToOccurence(value: string): void {
    this.idBenefit = value;
  }
  getBenfitSended() :string{
    return this.idBenefit;
  }


  // hover in menu left (navigate in others pages)
  private urlSource = new BehaviorSubject<string>('');
  currentUrl = this.urlSource.asObservable();

  setUrl(value: string) {
    this.urlSource.next(value);
  }


  //////
  emitSubmitEvent() {
    this.submitEvent.next();
  }
}

