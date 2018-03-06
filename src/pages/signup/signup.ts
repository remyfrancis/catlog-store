import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {

  newUser: any = {};
  billing_shipping_same: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
  this.newUser.billing_address = {};
  this.newUser.shipping_address = {}
  this.billing_shipping_same = false;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;
  }

}
