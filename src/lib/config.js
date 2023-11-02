class AppState {
  constructor() {
    this.data = window.__appState;
  }

  getAccountId() {
    return this.data.account?.id;
  }

  getStoreId() {
    return this.data.store.id
  }

  getStoreName() {
    return this.data.store.name
  }

  isAuthenticated() {
    return !!this.data.account;
  }

  getCart() {
    return this.data.cart;
  }

  getProduct() {
    return this.data.product;
  }

  getRazorpayKeyId() {
    // return this.data.settings.razorpayKeyId;
    return "rzp_test_HIy1jjWU0UrHNj";
  }

  getAccountName() {
    return this.data.account?.name;
  }

  getAccountEmail() {
    return this.data.account?.email;
  }

  getAccountMobile() {
    return this.data.account?.mobile;
  }
}


export default new AppState();
