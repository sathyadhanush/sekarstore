import AddressForm from "./address-form";
import axios, { HttpStatusCode } from "axios";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import ProductPage from "./product-page";
import Address from "./address";
import CartPage from "./cart-page";
import CheckoutPage from "./checkout-page";
import ForgotPasswordPage from "./forgot-password-page";
import CheckoutForm from "./checkout-form";
import { redirect } from "./url-utils";

window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

const global = {
  handlers: {}
};

window.__lib = global;

window.registerHandler = (event, handler) => {
  global.handlers[event] = handler;
};

window.trigger = (event, payload) => {
  global.handlers[event]?.(payload);
};

axios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};


const $search = document.querySelector('[data-field="search"]');
if ($search) {
  $search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      const { value } = event.target;
      redirect(`/products?keyword=${value}`);
    }
  });
}

const { pathname } = window.location;

if (pathname === '/account/login') {
  new LoginForm($("#login-form"));
} else if (pathname === '/account/register') {
  new RegisterForm($("#register-form"));
} else if (pathname === '/account') {
  $$(".address-form").forEach(($form) => {
    new AddressForm($form);
  });
  $$('[data-id]').forEach(($el) => {
    new Address($el);
  });
} else if (pathname === "/products") {
  document.querySelector('[data-field="product-search"]').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      const { value } = event.target;
      redirect(`/products?keyword=${value}`);
    }
  });
} else if (pathname.startsWith("/products/")) {
  new ProductPage(document.getElementById('product-item'));
} else if (pathname === "/cart") {
  const $table = document.getElementById("cart-items");
  new CartPage($table);
} else if (pathname === "/checkout") {
  new CheckoutForm(document.querySelector("form"));
} else if (pathname === "/account/forgot-password") {
  new ForgotPasswordPage();
}


