import { deliveryOptions } from '../data/deliveryoptions.js';
import { cart, cartQuantity, removeFromCart, updateCheckoutHeader, updateItem, updateDeliveryOption } from './cart.js';
import './cart-oop.js';
import { twoDecimalFormat, calculateDeliveryDate, findProduct, findDeliveryOption, getData } from './utils.js';



function checkoutProductsHTML () {
  let productHTML = '';
  cart.forEach((cartItem) => {
    const matchedProduct = findProduct(cartItem);
    const deliveryOption = findDeliveryOption(cartItem);
    const dateString = calculateDeliveryDate(deliveryOption);
    productHTML += `
      <div class="cart-item-container js-cart-container js-cart-item-container-${matchedProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>
        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchedProduct.image}">
          <div class="cart-item-details">
            <div class="product-name">
            ${matchedProduct.name}
            </div>
            <div class="product-price">
              $${twoDecimalFormat(matchedProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchedProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input" data-product-id="${matchedProduct.id}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchedProduct.id}">
              Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchedProduct.id}">
                Delete
              </span>
            </div>
          </div>
          <div class="delivery-options js-delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchedProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });
  document.querySelector('.js-order-summary').innerHTML = productHTML;
};


function deliveryOptionsHTML (matchedProduct, cartItem) {
  return deliveryOptions.map((option) => {
    const dateString = calculateDeliveryDate(option);
    const priceString = option.priceCents === 0
      ? 'FREE'
      : `$${twoDecimalFormat(option.priceCents)} -`;
    const isChecked = option.id === cartItem.deliveryOptionId;
    return `
      <div class="delivery-option js-delivery-option" data-product-id="${matchedProduct.id}" data-delivery-option-id="${option.id}">
        <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchedProduct.id}">
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price ${isChecked ? 'selected-delivery-option-price' : ''}">${priceString} Shipping</div>
        </div>
      </div>
    `;
  }).join('');
}


function deleteButton () {
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = getData(link);
      removeFromCart(productId);
      renderCheckout();
    });
  });
};


function updateButton () {
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.js-cart-container').forEach(container => container.classList.remove('is-editing-quantity')); // only allows for one at a time updating
      document.querySelectorAll('.js-quantity-input').forEach(input => input.value = ''); // removes previously inputted data when clicking update on a different item
      const productId = getData(link);
      const editingContainer = document.querySelector(`.js-cart-item-container-${productId}`);
      editingContainer.classList.add('is-editing-quantity');
      const input = document.querySelector(`.js-quantity-input[data-product-id="${productId}"]`);
      input.focus(); // allows user to type immediately after clicking update button
    });
  });
  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = getData(link);
      const newItemQuantity= getNewQuantity(productId);
      (newItemQuantity > 0 && newItemQuantity < 1000) && (updateItem(productId, newItemQuantity), renderCheckout());
    });
  });
  document.querySelectorAll('.js-quantity-input').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const productId = getData(input);
        const newItemQuantity = getNewQuantity(productId);
        (newItemQuantity > 0 && newItemQuantity < 1000) && (updateItem(productId, newItemQuantity), renderCheckout());
      };
    });
  });
};


function getNewQuantity (productId) {
  const input = document.querySelector(`.js-quantity-input[data-product-id="${productId}"]`);
  const newItemQuantity = parseInt(input.value);
  input.value = ''; // removes inputted data after trying to update
  if (isNaN(newItemQuantity) || newItemQuantity <= 0 || newItemQuantity >= 1000) {
    alert('Quantity must be a valid value greater than 0 and less than 1000.');
    return;
  };
  const editingContainer = document.querySelector(`.js-cart-item-container-${productId}`);
  editingContainer.classList.remove('is-editing-quantity');
  return newItemQuantity;
};


function deliveryOptionButton () {
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const productId = getData(element);
      const { deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderCheckout();
    });
  });
};


function paymentSummary() {
  let totalItemCost = 0;
  let totalShipping = 0;
  cart.forEach((cartItem) => {
    const matchedProduct = findProduct(cartItem);
    totalItemCost += matchedProduct.priceCents * cartItem.quantity;
    const deliveryOption = findDeliveryOption(cartItem);
    totalShipping += deliveryOption.priceCents;
  });
  const totalBeforeTax = totalItemCost + totalShipping;
  const estimatedTax = totalBeforeTax * 0.1;
  const totalOrder = totalBeforeTax + estimatedTax;
  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>
    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">$${twoDecimalFormat(totalItemCost)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${twoDecimalFormat(totalShipping)}</div>
    </div>
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${twoDecimalFormat(totalBeforeTax)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${twoDecimalFormat(estimatedTax)}</div>
    </div>
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${twoDecimalFormat(totalOrder)}</div>
    </div>
    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
};


function renderCheckout() {
  updateCheckoutHeader();
  checkoutProductsHTML();
  deleteButton();
  updateButton();
  deliveryOptionButton();
  paymentSummary();
};


renderCheckout();