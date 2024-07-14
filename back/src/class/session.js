class Session {
  static #list = []

  constructor(user) {
    this.token = Session.generateCode()
    this.date = new Date()
    this.user = {
      id: user.id,
      email: user.email,
      isConfirm: user.isConfirm,
      role: user.role,
    }
  }

  static generateCode = () => {
    const length = 6
    const characters =
      'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890'
    let result = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(
        Math.random() * characters.length,
      )
      result += characters[randomIndex]
    }

    return result
  }

  static create = (user) => {
    const session = new Session(user)
    this.#list.push(session)
    console.log('#list: ', this.#list)
    return session
  }

  static get = (token) => {
    return (
      this.#list.find((item) => item.token === token) ||
      null
    )
  }
}

module.exports = Session
