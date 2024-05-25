import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { products } from '../data/products.js';
import { deliveryOptions } from '../data/deliveryoptions.js';



export function twoDecimalFormat (priceCents) {
  const rounded = (Math.round(priceCents) / 100).toFixed(2);
  return rounded;
};


export function saveToStorage (name, item) {
  localStorage.setItem(name, JSON.stringify(item));
};


export function findProduct (cartItem) {
  return products.find(product => cartItem.productId === product.id);
};


export function findDeliveryOption (cartItem) {
  return deliveryOptions.find(option => cartItem.deliveryOptionId === option.id);
};


export function getData (element) {
  return element.dataset.productId;
};


export function calculateDeliveryDate (option) {
  let numberOfDays = option.deliveryDays;
  let daysFromToday = 0;
  while (numberOfDays > 0) { // excludes weekends
    daysFromToday += 1;
    let day = dayjs().add(daysFromToday, 'days').format('dddd');
    if(day === 'Saturday' || day === 'Sunday') {
      continue;
    } else {
      numberOfDays -= 1;
    };
  };
  return dayjs().add(daysFromToday, 'days').format('dddd, MMMM, D');
};
