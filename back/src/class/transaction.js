class Transaction {
  constructor(amount, type, userId, counterparty) {
    this.id = Transaction.generateId()
    this.userId = userId
    this.amount = amount
    this.counterparty = counterparty
    this.type = type // 'deposit' or 'transfer'
    this.date = new Date()
  }

  static generateId() {
    return '_' + Math.random().toString(36).substr(2, 9)
  }
}

module.exports = Transaction
