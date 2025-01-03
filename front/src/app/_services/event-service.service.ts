import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class EventServiceService {
  public launchEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }
}
