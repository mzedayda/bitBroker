const ccxt = require("ccxt")

const exchange = "ETH/BTC"
const HITBTC_API_KEY = process.env.HITBTC_API_KEY
const SECRET_API_KEY = process.env.SECRET_HITBTC_API_KEY

const hitbtc = new ccxt.hitbtc({
  apiKey: HITBTC_API_KEY,
  secret: SECRET_API_KEY
})

async function rates(ws) {
  const rates = await hitbtc.fetchTicker(exchange)
  let trend24h = (rates.close > rates.open) ? "up" : "down"

  return new Promise(resolve => {
    const result = { price: rates.last, trend24h }

    resolve(result)
  })
}

async function activeOrders() {
  const allOrders = await hitbtc.fetchOpenOrders()

  relevantOrders = allOrders.filter((order) => {
    return order.symbol === exchange
  })

  return new Promise(resolve => {
    resolve(relevantOrders)
  })
}

async function placeOrder(order) {
  console.log("Placing order", order)
  if (order.amount > 0) {
    await hitbtc.createLimitBuyOrder(
      exchange, order.amount, order.price
    )
  }
  else {
    await hitbtc.createLimitSellOrder(
      exchange, Math.abs(order.amount), order.price
    )
  }

  console.log("Order placed")

  return new Promise(resolve => {
    resolve("Order submitted")
  })
}


module.exports = { rates, placeOrder, activeOrders }
