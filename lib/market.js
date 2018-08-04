const ccxt = require("ccxt")

const exchange = "ETH/BTC"
const HITBTC_API_KEY = process.env.HITBTC_API_KEY
const SECRET_API_KEY = process.env.SECRET_HITBTC_API_KEY

const hitbtc = new ccxt.hitbtc({
  apiKey: HITBTC_API_KEY,
  secret: SECRET_API_KEY
})
const bitfinex = new ccxt.bitfinex2()

async function rates() {
  day = 24 * 60 * 60 * 1000
  sinceYesterday = new Date().getTime() - day

  const OHLCV = await bitfinex.fetchOHLCV(exchange, "3h", sinceYesterday)

  const [time, open, high, low, close, volume] = OHLCV[OHLCV.length - 1]
  console.log(open, "--->", close)
  const trend3h = (close > open) ? "up" : "down"
  const trend3hGain = Math.max(open, close) / Math.min(open, close)

  const rates = await hitbtc.fetchTicker(exchange)
  const trend24h = (rates.close > rates.open) ? "up" : "down"

  return new Promise(resolve => {
    const result = { price: rates.last, trend24h, trend3h, trend3hGain }

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
