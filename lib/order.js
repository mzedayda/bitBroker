trim = require("./helpers").trim

class Order {
  constructor(amount, price) {
    this.amount = trim(amount, 3);
    this.price = trim(price, 6);
  }
}

module.exports = Order