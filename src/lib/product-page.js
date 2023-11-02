import AppState from "./config";
import axios from 'axios';
import { redirect } from "./url-utils";

class ProductPage {
  constructor($container) {
    this.$container = $container;
    this.$image = document.querySelector('[data-product-image]');
    this.$thumnails = document.querySelectorAll('[data-product-thumbnail]');
    this.addEventListeners();
  }

  addEventListeners() {
    this.$container.addEventListener('click', (event) => {
      const { action } = event.target.dataset;
      if (!action) {
        return;
      }
      if (action === "add-to-cart") {
        this.handleAddToCart();
      }
      if (action === "buy-now") {
        this.handleBuyNow();
      }
    });

    this.$thumnails.forEach(($thumnail) => {
      $thumnail.addEventListener('click', (event) => {
        this.$image.src = $thumnail.dataset.productThumbnail;
        this.$thumnails.forEach(($t) => $t.classList.remove($t.dataset.selectedClass));
        $thumnail.classList.add($thumnail.dataset.selectedClass);
      })
    });
  }

  async handleBuyNow() {
    this.handleAddToCart();
    redirect('/checkout');
  }

  async handleAddToCart() {
    const { variant_count, variants } = AppState.getProduct();
    const { items } = AppState.getCart();

    const options = Array.from(document.querySelectorAll('[data-option]'))
      .map(($option) => {
        const $variant = $option.querySelector('[data-selected-variant]');
        return {
          name: $option.dataset.option,
          value: $variant.dataset.variant,
        };
      });

    const attrs = options.map((option) => option.value);
    const variant = variants.find((v) => v.attributes.toString() === attrs.toString());

    const existingQuantity = items.find((item) => item.id === variant.id)?.quantity || 0;
    const nextQuantity = existingQuantity + 1;
    await axios.put("/cart", null, {
      params: { id: variant.id, quantity: nextQuantity }
    });
    window.trigger('success', 'Item added to the bag');
    setInterval(function() {
      window.location.reload();
    }, 1000);
  }
}

export default ProductPage;
