import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {

  newUser: any = {};
  billing_shipping_same: boolean;
  WooCommerce: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
  
  this.newUser.billing_address = {};
  this.newUser.shipping_address = {}
  this.billing_shipping_same = false;

  this.WooCommerce = WC({
    url: "http://localhost/wordpress", //Replace with app's url
    consumerKey: "ck_a5f9d6e037f46e3195cd04aa0897511984186dde",
    consumerSecret: "cs_9becbaec07b104a8ae21f8e0866b20c4a4fec4d9"
  });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  checkEmail(){
    let validEmail = false;
    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(reg.test(this.newUser.email)){
      //Email is valid
      this.WooCommerce.getAsync("customers/email/" + this.newUser.email).then((data)=>{
        let res = (JSON.parse(data.body));

        if(res.errors){
          validEmail = true;

          this.toastCtrl.create({
            message: "Congratulations. Email is good to go.",
            duration: 3000
          }).present();

        } else {
          validEmail = false;

          this.toastCtrl.create({
            message: "Email already registered. Please check.",
            showCloseButton: true
          }).present();
        }

        console.log(validEmail);
      })
    } else {
      validEmail = false;
      this.toastCtrl.create({
        message: "Invalid email. Please check.",
        showCloseButton: true
      }).present();
      
      console.log(validEmail);
    }
  }

}
