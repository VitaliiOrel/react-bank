class User {
  static USER_ROLE = {
    USER: 1,
    ADMIN: 2,
    DEVELOPER: 3,
  }

  static #list = []

  static #count = 1

  constructor({ email, password, role }) {
    this.id = User.#count++
    this.email = email
    this.password = password
    this.role = User.#convertRole(role)
    this.isConfirm = false
    this.transactionList = []
    this.notificationList = []
    this.balance = Number(0)
  }

  static addTransaction(
    { id, type, counterparty, amount, date, userId },
    email,
  ) {
    const user = this.getByEmail(email)
    user.transactionList.push({
      id,
      userId,
      amount,
      type,
      counterparty,
      date,
    })
    if (type === 'deposit') {
      user.balance = user.balance + Number(amount)
    } else {
      user.balance = user.balance - Number(amount)
    }
  }

  static addNotification({ id, userId, type, info, date }) {
    const user = this.getById(userId)
    user.notificationList.push({
      id,
      userId,
      type,
      info,
      date,
    })
  }

  static #convertRole = (role) => {
    role = Number(role)

    role = Object.values(this.USER_ROLE).includes(role)
      ? role
      : this.USER_ROLE.USER

    return role
  }

  static create(data) {
    const user = new User(data)
    this.#list.push(user)
    console.log(this.#list)
    return user
  }

  static getByEmail(email) {
    return (
      this.#list.find((user) => user.email === email) ||
      null
    )
  }

  static chgpswd(email, password) {
    const user = this.getByEmail(email)
    if (user) {
      user.password = password
    }
  }

  static confirm(email) {
    const user = this.getByEmail(email)
    if (user) {
      user.isConfirm = true
    }
    console.log(this.#list)
  }

  static getById(id) {
    return (
      this.#list.find((user) => user.id === Number(id)) ||
      null
    )
  }

  static devUsersCreate() {
    this.create({ email: 'aa@aa.aa', password: 'asd' })
    this.create({ email: 'bb@bb.bb', password: 'asd' })
    this.confirm('aa@aa.aa')
    this.confirm('bb@bb.bb')
  }

  static getList = () => this.#list
}

module.exports = User
