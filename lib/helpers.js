trim = (num, prec) => {
  exp = Math.pow(10, prec)
  return Math.round(num * exp) / exp
}

profit = (orders) => {
  let sum = orders.reduce((sum, order) => {
    return sum - order.amount * order.price
  }, 0)

  return sum
}

module.exports = { trim, profit }