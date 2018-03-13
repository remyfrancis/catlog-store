import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import * as WC from 'woocommerce-api';

@IonicPage({})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchQuery: string = "";
  WooCommerce: any;
  products: any[] = [];
  page: number = 2;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    console.log(this.navParams.get("searchQuery"));
    this.searchQuery = this.navParams.get("searchQuery");

    this.WooCommerce = WC({
      url: "http://localhost/wordpress", //Replace with app's url
      consumerKey: "ck_a5f9d6e037f46e3195cd04aa0897511984186dde",
      consumerSecret: "cs_9becbaec07b104a8ae21f8e0866b20c4a4fec4d9"
    });

    this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery).then((searchData)=>{
      this.products = JSON.parse(searchData.body).products;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  loadMoreProducts(event){
    

    this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery + "&page=" + this.page).then((searchData)=>{
      this.products = this.products.concat(JSON.parse(searchData.body).products);

      if(JSON.parse(searchData.body).products.length < 10){
        event.enable(false);
        this.toastCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();
      }
      
      event.complete();
      this.page++;
    });
  }

}
