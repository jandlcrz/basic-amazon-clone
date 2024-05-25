import { twoDecimalFormat } from "../scripts/utils.js";
import { addToCart, cart, loadCartFromStorage } from "../scripts/cart.js";

describe('Test Suite: twoDecimalFormat', () => {
  it('Converts Cents into Dollars', () => {
    expect(twoDecimalFormat(2095)).toEqual('20.95');
  });
  it('Works with 0', () => {
    expect(twoDecimalFormat(0)).toEqual('0.00');
  });
  it('Rounding up test', () => {
    expect(twoDecimalFormat(2000.5)).toEqual('20.01');
  });
  it('Rounding down test', () => {
    expect(twoDecimalFormat(2000.4)).toEqual('20.00');
  });
});

describe('Test Suite: addToCart', () => {
  it('Adds a new product to an empty cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    spyOn(localStorage, 'setItem');
    loadCartFromStorage();
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 10);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
  });
  it('Adds an existing product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 
        quantity: 5,
        deliveryOptionId: '1'
      }]);
    });
    spyOn(localStorage, 'setItem');
    loadCartFromStorage();
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 5);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(10);
  });
  
});