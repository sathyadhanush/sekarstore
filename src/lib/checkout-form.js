import * as Yup from 'yup';
import axios from 'axios';
import Form from './Form';
import appState from './config';
import { openRazorpay } from './pay';
import { redirect } from './url-utils';


class CheckoutForm extends Form {
  getSchema() {
    return Yup.object({
      first_name: Yup.string().max(50, 'First name cannot be more than 50 characters').required('First name is a required field'),
      city: Yup.string().max(50, 'City cannot be more than 50 characters').required(),
      country: Yup.string().required().max(2),
      state: Yup.string().required(),
      address1: Yup.string().max(50, 'Address cannot be more than 50 characters').required('Address is a required field'),
      mobile: Yup.string()
      .matches(/^[0-9]+$/, 'Mobile number should only contain numbers')
      .max(15, 'Mobile number cannot be more than 15 numbers')
      .required('Mobile number is a required field'),
      zip: Yup.string().matches(/^[0-9]+$/, 'Zip code should only contain numbers').required('Zip code is a required field'),
    });
  }

  async handleSave(data) {
    const { items } = appState.getCart();
    const parsedItems = items.map((item) => ({
      id: item.id,
      quantity: item.quantity
    }));

    const response = await axios.post('/checkout', {
      items: parsedItems,
      address: data,
      payment_mode: data.payment_mode,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const order = response.data.data;
    if (order.payments && order.payments.length > 0) {
      const [payment] = order.payments;
      await openRazorpay({
        orderId: order.id,
        amount: payment.amount * 100,
        razorpayOrderId: payment.payment_identifier
      });
    }
    redirect(`/orders/${order.id}`);
  }
}

export default CheckoutForm;
