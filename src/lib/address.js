import axios from "axios";

class Address {
  constructor($container) {
    this.container = $container;
    this.addEventListners();
  }

  addEventListners() {
    const { id } = this.container.dataset;
    const button = this.container.querySelector('[data-action="delete"]');
    button.addEventListener('click', async () => {
      await axios.delete(`/account/addresses/${id}`);
      window.location.reload();
    });
  }
}

export default Address;
