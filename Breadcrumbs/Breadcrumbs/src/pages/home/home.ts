import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { addeventPage } from '../addevent/addevent';
import { addcontactPage } from '../addcontact/addcontact';
import { vieweventsPage } from '../viewevents/viewevents';
import { httprequest } from '../../httprequest';
import { Storage } from '@ionic/storage';
import { Response, Request } from '@angular/http';
import { editeventPage } from '../editevent/editevent';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [httprequest]
})

export class HomePage {

  userid: any;
  newEventSubmit: boolean;
  CurrentEventExists: boolean = false;
  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, public navCtrl: NavController, public request: httprequest, public storage: Storage) {
    var userid = 1;
    this.storage.set('userID', userid);
  }

  getActiveEvent() {
    let loading = this.loadingCtrl.create({
      content: 'Loading Event...'
    });

    loading.present()
      .then(() => {
        this.request.RequestActiveEvent()
          .then(data => {
            this.storage.set('activeEvent', data['recordset'][0])
          }).then(() => {
            this.storage.set('newEventSubmit', false)
              .then(() => {
                this.storage.get('activeEvent')
                  .then((data) => {
                    //Nothing is true, everything is permitted.
                    //var alert = this.alertCtrl.create({ title: 'activeEventName', subTitle: data.EventName, buttons: ['ok'] });
                    //alert.present();
                    document.getElementById("activeEventContent").innerText = data.EventName;
                    this.CurrentEventExists = true;
                    loading.dismiss();
                  }).catch(() => { document.getElementById("activeEventContent").innerText = "No Active Events"; loading.dismiss(); this.CurrentEventExists = false; } );
              });
          });
      });
  }

  ionViewWillEnter() {
    var newEvent;
    this.storage.get('lastState').then((data) => {
      if (data === 'addeventsubmit')
      {
        this.storage.set('lastState', 'homepageenter').then(() => {
          location.reload();
        });
      }

    }).then(() => {
      this.storage.get('newEventSubmit').then((data) => {
        newEvent = data;
        if (newEvent === true || document.getElementById("activeEventContent").innerText === "") {
          this.getActiveEvent();
        }
      });
    });
  }

  onLink(url: string) {
      window.open(url);
  }

  addEvent() {
    this.navCtrl.push(addeventPage);
  }

  viewEvents() {
    this.navCtrl.push(vieweventsPage);
  }

  addContact() {
    this.navCtrl.push(addcontactPage);
  }

  editEvent() {
    this.navCtrl.push(editeventPage);
  }
  
  checkIn() {
    this.storage.get('activeEvent').then((data) => {
      this.request.DisableEvent(data.EventID);
      this.CurrentEventExists = false;
    }).then(() => {
      this.storage.set('newEventSubmit', true)
        .then(() => {
          location.reload();
        });
    });
    console.log("disableEvent");
  }
}
