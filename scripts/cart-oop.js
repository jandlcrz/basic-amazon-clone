import { saveToStorage } from './utils.js';

class Cart {
  localStorageKey;
  localStorageQuantityKey;
  cartItems;
  cartQuantity;
  constructor(localStorageKey, localStorageQuantityKey) {
    this.localStorageKey = localStorageKey;
    this.localStorageQuantityKey = this.localStorageQuantityKey;
    this.loadCartFromStorage();
    this.loadQuantityFromStorage();
  }
  loadCartFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || []
  }
  loadQuantityFromStorage() {
    this.cartQuantity = JSON.parse(localStorage.getItem(this.localStorageQuantityKey)) || 0;
  }
  updateCheckoutHeader() {
    document.querySelector('.js-checkout-cart-quantity').innerHTML = `${this.cartQuantity} items`;
  }
  addToCart(productId, productQuantity) {
    const itemAlreadyInCart = this.cartItems.find((cartItem) => productId === cartItem.productId);
    if (itemAlreadyInCart) {
      itemAlreadyInCart.quantity += productQuantity;
    } else {
      this.cartItems.push({
        productId, 
        quantity: productQuantity,
        deliveryOptionId: '1'
      });
    };
    saveToStorage(this.localStorageKey, this.cartItems);
    this.updateTotal();
  }
  updateItem(productId, newItemQuantity) {
    const cartItem = this.cartItems.find((item) => productId === item.productId);
    if (!newItemQuantity || !cartItem) {
      return;
    }
    cartItem.quantity = newItemQuantity;
    saveToStorage(this.localStorageKey, this.cartItems);
    this.updateTotal();
  }
  updateTotal() {
    const newCartQuantity = this.cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
    this.cartQuantity = newCartQuantity;
    saveToStorage(this.localStorageKey, this.cartItems);
  }
  updateDeliveryOption(productId, deliveryOptionId) {
    const matchedProduct = this.cartItems.find((cartItem) => productId === cartItem.productId);
    if (matchedProduct) {
      matchedProduct.deliveryOptionId = deliveryOptionId;
      saveToStorage(this.localStorageKey, this.cartItems);
    };
  }
  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter((cartItem) => productId !== cartItem.productId);
    saveToStorage(this.localStorageKey, this.cartItems);
    this.updateTotal();
  }
}

const plainCart = new Cart('plainitems', 'plainquantity');
const businessCart = new Cart('businessitems', 'businessquantity');

businessCart.addToCart('bc2847e9-5323-403f-b7cf-57fde044a955', 12);
console.log(businessCart.cartQuantity);
businessCart.updateItem('bc2847e9-5323-403f-b7cf-57fde044a955', 7);
console.log(businessCart.cartQuantity);
console.log(businessCart.cartItems[0].deliveryOptionId);
businessCart.updateDeliveryOption('bc2847e9-5323-403f-b7cf-57fde044a955', '3');
console.log(businessCart.cartItems[0].deliveryOptionId);
businessCart.removeFromCart('bc2847e9-5323-403f-b7cf-57fde044a955');
console.log(businessCart.cartQuantity);

plainCart.addToCart('bc2847e9-5323-403f-b7cf-57fde044a955', 2);
console.log(plainCart.cartQuantity);
plainCart.updateItem('bc2847e9-5323-403f-b7cf-57fde044a955', 1);
console.log(plainCart.cartQuantity);

console.log(plainCart);
console.log(businessCart);






