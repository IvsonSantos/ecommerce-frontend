import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../commom/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItem: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();  // subject is a subclass of Observable
  totalQuantity: Subject<number> = new Subject<number>();  // subject is a subclass of Observable

  constructor() { }

  addToCart(item: CartItem) {

    // check if we already have the item on the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItem.length > 0) {
      // find the item on the cart based on the item id
      for (let tempItem of this.cartItem) {
        if (tempItem.id === item.id) {
          existingCartItem = tempItem;
          break;
        }
      }

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);

    }

    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    } else {
      // just add the item
      this.cartItem.push(item);
    }

    // compute cart total
    this.computeCartTotals();
    
  }

  computeCartTotals() {

    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let item of this.cartItem) {
      totalPriceValue += item.quantity * item.unitPrice;
      totalQuantityValue += item.quantity;
    }

    // publish the new values... ll subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data
    this.logCartdata(totalPriceValue, totalQuantityValue);
  }

  logCartdata(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for (let item of this.cartItem) {
      const subTotalPrice = item.quantity * item.unitPrice;
      console.log(`name: ${item.name}, quantity=${item.quantity}, unitPrice=${item.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('-----');
  }

}
