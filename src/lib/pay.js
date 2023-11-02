import axios from "axios";
import config from "./config";

async function openRazorpay({ amount, razorpayOrderId, orderId }) {
    return new Promise((resolve) => {
        const instance = new Razorpay({
            "key": config.getRazorpayKeyId(),
            "amount": amount,
            "currency": "INR",
            "name": config.getStoreName(),
            "order_id": razorpayOrderId,
            "handler": async (response) => {
                await axios.post("/payments/callback", {
                    ...response,
                    order_id: orderId
                });
                resolve();
            },
            "prefill": {
                "name": config.getAccountName(),
                "email": config.getAccountEmail(),
                "contact": config.getAccountMobile()
            }
        });
        instance.open();
    });
}

export { openRazorpay };
