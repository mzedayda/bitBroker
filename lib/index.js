Market = require("./market")
Order = require("./order")

profit = require("./helpers").profit

config = require("../config.json")

function generateOrdersPair(rates, amount, gain) {
  if (rates.trend24h === "up") {
    // Buy now, Sell later
    let buy = new Order(amount, rates.price)
    let sell = new Order(-amount, rates.price * gain)

    return [buy, sell]
  }
  else if (rates.trend24h === "down") {
    // Sell now, Buy later
    let sell = new Order(-amount, rates.price)
    let buy = new Order(amount, rates.price / gain)

    return [sell, buy]
  }

  throw new Error("Could not identify trend")
}

async function main() {
  console.log("==============", new Date(), "=========================")

  var rates = await Market.rates()
  console.log(rates)

  var orders = generateOrdersPair(rates, config.amount, config.gain)

  const activeOrders = await Market.activeOrders()
  console.log("New orders", orders)
  console.log("Expected profit", profit(orders), "BTC")
  console.log("Active orders", activeOrders.length)
  console.log("Active orders rates",
    activeOrders.map((order) => { return order.info.orderPrice }))

  if (activeOrders.length === 0) {
    for (order of orders) {
      await Market.placeOrder(order)
    }
  }

  // Wait a minute and run again
  setTimeout(main, 60 * 1000)
}

main()