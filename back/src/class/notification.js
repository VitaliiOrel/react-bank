// const User = require('./user')

class Notification {
  constructor(event, userId) {
    this.id = Notification.generateId()
    this.userId = userId
    this.type = Notification.#convertEventToType(event)
    this.info = Notification.#convertEventToInfo(event)
    this.date = new Date()
  }

  static generateId() {
    return '_' + Math.random().toString(36).substr(2, 9)
  }

  // static create(event, userId) {
  //   const notification = new Notification(event, userId)
  //   const user = User.getById(userId)
  //   const length1 = user.notification.length
  //   const length2 = user.notificationList.push(notification)
  //   if (length2 - length1 !== 0) {
  //     return length2
  //   } else {
  //     return null
  //   }
  // }

  static #convertEventToType(event) {
    if (
      event === 'LO' ||
      event === 'RA' ||
      event === 'CP' ||
      event === 'CE' ||
      // event === 'DE' ||
      event === 'TR'
    ) {
      return 'Warning'
    } else {
      return 'Announcement'
    }
  }

  static #convertEventToInfo(event) {
    switch (event) {
      case 'LO':
        return 'New login'
      case 'RA':
        return 'Your account is back!'
      case 'CP':
        return 'Password has been changed.'
      case 'CE':
        return 'Email has been updated.'
      case 'DE':
        return 'New deposit.'
      case 'TR':
        return 'You have sent a transfer.'
      default:
        return 'Hello!'
    }
  }
}

module.exports = Notification
