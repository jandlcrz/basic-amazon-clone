import { saveToStorage } from './utils.js';


export let cart;

export function loadCartFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || []
};

loadCartFromStorage();

export let cartQuantity = JSON.parse(localStorage.getItem('cart-quantity')) || 0;


export function updateCheckoutHeader () {
  document.querySelector('.js-checkout-cart-quantity').innerHTML = `${cartQuantity} items`;
};


export function addToCart (productId, productQuantity) {
  const itemAlreadyInCart = cart.find((cartItem) => productId === cartItem.productId);
  if (itemAlreadyInCart) {
    itemAlreadyInCart.quantity += productQuantity;
  } else {
    cart.push({
      productId, 
      quantity: productQuantity,
      deliveryOptionId: '1'
    });
  };
  saveToStorage('cart', cart);
  updateTotal(cart);
};


export function updateItem (productId, newItemQuantity) {
  const cartItem = cart.find((item) => productId === item.productId);
  if (!newItemQuantity || !cartItem) {
    return;
  }
  cartItem.quantity = newItemQuantity;
  saveToStorage('cart', cart);
  updateTotal(cart);
}


export function updateTotal (cart) {
  const newCartQuantity = cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  cartQuantity = newCartQuantity;
  saveToStorage('cart-quantity', cartQuantity);
};


export function updateDeliveryOption (productId, deliveryOptionId) {
  const matchedProduct = cart.find((cartItem) => productId === cartItem.productId);
  if (matchedProduct) {
    matchedProduct.deliveryOptionId = deliveryOptionId;
    saveToStorage('cart', cart);
  };
};


export function removeFromCart (productId) {
  cart = cart.filter((cartItem) => productId !== cartItem.productId);
  saveToStorage('cart', cart);
  updateTotal(cart);
};