import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

//import { HomePage } from '../home/home';

@IonicPage({})
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class Checkout {

  WooCommerce: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController, public payPal: PayPal) {
    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
      {method_id: "bacs", method_title: "Direct Bank Transfer"},
      {method_id: "cheque", method_title: "Cheque Payment"},
      {method_id: "cod", method_title: "Cash on Delivery"},
      {method_id: "paypal", method_title: "Paypal"}
    ];

    this.WooCommerce = WC({
      url: "http://localhost/wordpress", //Replace with app's url
      consumerKey: "ck_a5f9d6e037f46e3195cd04aa0897511984186dde",
      consumerSecret: "cs_9becbaec07b104a8ae21f8e0866b20c4a4fec4d9"
    });

    this.storage.get("userLoginInfo").then ((userLoginInfo)=>{
      this.userInfo = userLoginInfo.user;

      let email = userLoginInfo.user.email;

      this.WooCommerce.getAsync("customers/email/"+email).then((data)=>{
        this.newOrder = JSON.parse(data.body).customer;
      })
    })

  }

  setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;

    if(this.billing_shipping_same){
      this.newOrder.shipping_address = this.newOrder.billing_address;
    }
  }

  placeOrder(){
    let orderItems: any[] = [];
    let data: any = {};
    let paymentData: any = {};

    this.paymentMethod.forEach((element, index)=>{
      if(element.method_id == this.paymentMethod){
        paymentData = element;
      }
    });

    data = {
      payment_details : {
        method_id: paymentData.method_id,
        method_title: paymentData.method_title,
        paid: true
      },
      billing_address: this.newOrder.billing_address,
      shipping_address: this.newOrder.shipping_address,
      customer_id: this.userInfo.id || '',
      line_items: orderItems
    };

    if(paymentData.method_id == "paypal"){
      //TODO

      this.payPal.init({
        PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
        PayPalEnvironmentSandbox: 'Ab3RYOGupKTEt0JG5Z9PbB0ZWK1MF_a9AoSoAdd3b2K6CuuC361sfcthd7gTCb1iGaWylX1R45Q_98th'
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {

          this.storage.get("cart").then((cart)=>{
            let total = 0.00;
            cart.forEach((element, index)=>{
              orderItems.push({product_id: element.product_id, quantity: element.qty});
              total = total + (element.product.price * element.qty);
            });

            let payment = new PayPalPayment(total.toString(), 'USD', 'Description', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then((response) => {
            // Successfully paid

            alert(JSON.stringify(response));

            data.line_items = orderItems;
            //console.log(data);
            let orderData: any = {};

            orderData.order = data;

            this.WooCommerce.postAsync('orders', orderData, (err, data, res)=>{
              alert("Order placed successfully!");

              let response = (JSON.parse(data.body).order);

              this.alertCtrl.create({
                title: "Order Placed Successfully",
                message: "Your order has been place successfully. Your order number is " + response.order_number,
                buttons: [{
                  text: "OK",
                  handler: () => {
                    this.navCtrl.setRoot('HomePage');
                  }
                }]
              }).present();
            })
      
            // Example sandbox response
            //
            // {
            //   "client": {
            //     "environment": "sandbox",
            //     "product_name": "PayPal iOS SDK",
            //     "paypal_sdk_version": "2.16.0",
            //     "platform": "iOS"
            //   },
            //   "response_type": "payment",
            //   "response": {
            //     "id": "PAY-1AB23456CD789012EF34GHIJ",
            //     "state": "approved",
            //     "create_time": "2016-10-03T13:33:33Z",
            //     "intent": "sale"
            //   }
            // }

          })

          
          }, () => {
            // Error or render dialog closed without being successful
          });
        }, () => {
          // Error in configuration
        });
      }, () => {
        // Error in initialization, maybe PayPal isn't supported or something else
      });

    } else {
      this.storage.get("cart").then((cart)=>{
        cart.forEach((element, index)=>{
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });

        data.line_items = orderItems;

        let orderData: any = {};
        orderData.order = data;

        this.WooCommerce.postAsync("orders", orderData).then((data)=>{
          let response = (JSON.parse(data.body).order);

          this.alertCtrl.create({
            title: "Order Placed Successfully",
            message: "Your order has been place successfully. Your order number is " + response.order_number,
            buttons: [{
              text: "OK",
              handler: () => {
                this.navCtrl.setRoot('HomePage');
              }
            }]
          }).present();
        })

      })
    }

  }

}
