import AppState from "./config";
import axios from 'axios';
import { redirect } from "./url-utils";

class CartPage {
  constructor($table) {
    this.$table = $table;
    this.addEventListeners();
  }

  getCartItem(id) {
    const cart = AppState.getCart();
    return cart.items.find((item) => item.id === id);
  }

  addEventListeners() {
    this.$table.addEventListener('click', (event) => {
      const { action } = event.target.dataset;
      if (action === "increment" || action === "decrement") {
        const { id } = event.target.closest('[data-id]').dataset;
        const existingQuantity = this.getCartItem(id).quantity;
        const nextQuantity = action === "increment"
          ? existingQuantity + 1 : existingQuantity - 1;
        this.update({ id, quantity: nextQuantity });
      }
    });
    const $checkout = this.$table.querySelector('[data-action="checkout"]');
    $checkout.onclick = () => {
      if (AppState.getAccountId()) {
        redirect('/checkout');
      } else {
        redirect('/account/login?redirect=/cart');
      }
    }
  }

  async update({ id, quantity }) {
    await axios.put("/cart", null, {
      params: { id, quantity }
    });
    window.location.reload();
  }
}

export default CartPage;

