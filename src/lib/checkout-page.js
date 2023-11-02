import AppState from "./config";
import { openRazorpay } from "./pay";
import { loadScript, redirect } from "./url-utils";

class CheckoutPage {
  constructor($container) {
    this.$container = $container;
    this.$form = $container.querySelector('form');
    this.addEventListeners();
  }

  addEventListeners() {
    this.$form.onsubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(this.$form);

      const { items } = AppState.getCart();
      const parsedItems = items.map((item) => ({
        id: item.id,
        quantity: item.quantity
      }));
      const response = await axios.post('/checkout', {
        items: parsedItems,
        address_id: data.get("address"),
      });
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      const order = response.data.data;
      openRazorpay({
        amount: order.amount,
        orderId: order.payments[0].payment_identifier
      });
      redirect(`/orders/${orderId}`);
    };
  }
}

export default CheckoutPage;
