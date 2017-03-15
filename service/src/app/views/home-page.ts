import { Job, IAppState, Bid } from './../model';
import { Observable } from 'rxjs';
import { id, trace } from './../util';
import { jobs, user } from './../selectors';
import { NgRedux } from '@angular-redux/store';
import { AngularFire } from 'angularfire2';
import { Actions } from './../actions';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page', // <my-app></my-app>
  template: `
    <div class="ui vertical segment" style="height:100%">
        <div class="ui container">
            <div class="ui cards">
                 <div class="ui card" *ngFor="let job of (jobs$ | async)">
                  <div class="content">
                    <div class="header">{{job.desc}}</div>
                  </div>
                  <div class="content">
                    <h4 class="ui sub header">{{job.type}}</h4>
                  </div>
                  <div class="extra content" *ngIf="!job.bid">
                    <div class="ui input">
                        <input #bidInput type="number" placeholder="bid">
                    </div>
                    <button class="ui button" (click)="bid(job,bidInput.value)">Bid</button>
                  </div>
                  <div class="extra content" *ngIf="job.bid">
                    Your bid: {{job.bid.price}}
                    <div *ngIf="job.chosen == job.bid.$key && !(job.bid.payed)">
                        CHOSEN!
                        <br>
                        pay to get customer details:
                        <div class="ui button" (click)="pay(job)">Pay</div>
                    </div>
                    <div *ngIf="job.chosen == job.bid.$key && (job.bid.payed)">
                        You won the job! 
                        <br>
                        here is the client's details: 
                        <div>
                            name: {{job.owner.displayName}}
                            <br>
                            phone: {{job.owner.phone}}
                            <br>
                            address: {{job.owner.address}}
                        </div>
                    </div>
                  </div>
                </div>   
            </div>
        </div>
    </div>
  `,
  styleUrls: [],
})
export class HomePageComponent {
    jobs$: Observable<Job[]>;
    constructor(private af: AngularFire, private ngRedux: NgRedux<IAppState>, private actions: Actions) {
        this.jobs$ = jobs(af);
    }

    bid(job: Job, bid: number) {
        this.actions.bid(job, bid);
    }

    pay(job: Job) {
        this.actions.pay(job);
    }
}