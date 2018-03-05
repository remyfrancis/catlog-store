import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetails {

  product: any;
  WooCommerce: any;
  reviews: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
    this.product = this.navParams.get("product");
    console.log(this.product);

    this.WooCommerce = WC({
      url: "http://localhost/wordpress", //Replace with app's url
      consumerKey: "ck_a5f9d6e037f46e3195cd04aa0897511984186dde",
      consumerSecret: "cs_9becbaec07b104a8ae21f8e0866b20c4a4fec4d9"
    });

    this.WooCommerce.getAsync('products/' + this.product.id + '/reviews').then((data)=>{

      this.reviews = JSON.parse(data.body).product_reviews;
      console.log(this.reviews);

    }, (err)=>{
      console.log(err);
    })
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetails');
  }

}
