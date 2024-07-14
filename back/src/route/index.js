// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const User = require('../class/user')
const Session = require('../class/session')
const Confirm = require('../class/confirm')
const Transaction = require('../class/transaction')
const Notification = require('../class/notification')

User.devUsersCreate()
// Підключіть файли роутів
// const test = require('./test')
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
// router.use('/', test)
// Використовуйте інші файли роутів, якщо є

router.get('/', (req, res) => {
  res.status(200).json('Hello World')
})
// =====================================
router.post('/signup', function (req, res) {
  const { email, password } = req.body

  console.log(req.body)

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: 'Error: Such user already exists',
      })
    }

    const newUser = User.create({ email, password })
    const session = Session.create(newUser)

    const confirm = Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'User registered',
      session,
      confirm,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})
// =====================================

router.post('/recovery', function (req, res) {
  const { email } = req.body

  console.log(req.body)

  if (!email) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Error: Invalid data',
      })
    }

    const confirm = Confirm.create(user.email)

    return res.status(200).json({
      message: 'Code sent',
      confirm,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})
// =====================================

router.post('/receive', function (req, res) {
  const { amount, paymentSystem, email } = req.body

  console.log(req.body)

  if (!amount || !paymentSystem) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Error: Invalid data',
      })
    }

    const normalizedAmount = amount.replace(',', '.')
    const formattedAmount = parseFloat(
      normalizedAmount,
    ).toFixed(2)

    const transaction = new Transaction(
      formattedAmount,
      'deposit',
      user.id,
      paymentSystem,
    )

    User.addTransaction(transaction, email)

    // - - - add note - -
    const id = user.id
    const newNot = new Notification('DE', id)
    User.addNotification(newNot)
    // - - - - -

    return res.status(200).json({
      message: 'Receive ok',
      transaction,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})

// =====================================
router.post('/send', function (req, res) {
  const { amount, email, userEmail } = req.body

  console.log('SEND: ', req.body)

  if (!amount || !email) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const payer = User.getByEmail(userEmail)
    const payee = User.getByEmail(email)

    if (!payer || !payee) {
      return res.status(400).json({
        message: 'Error: Invalid data',
      })
    }

    const normalizedAmount = amount.replace(',', '.')
    const formattedAmount = parseFloat(
      normalizedAmount,
    ).toFixed(2)

    console.log('formattedAmount: ', formattedAmount)

    if (payer.balance < formattedAmount) {
      return res.status(400).json({
        message: 'Error: Invalid data',
      })
    }

    const payerTransaction = new Transaction(
      formattedAmount,
      'transfer',
      payer.id,
      email,
    )

    const payeeTransaction = new Transaction(
      formattedAmount,
      'deposit',
      payer.id,
      userEmail,
    )

    User.addTransaction(payerTransaction, userEmail)
    User.addTransaction(payeeTransaction, email)

    // - - - add note - -
    const id1 = payer.id
    const newNot1 = new Notification('TR', id1)
    User.addNotification(newNot1)
    // - - - - -
    // - - - add note - -
    const id2 = payee.id
    const newNot2 = new Notification('DE', id2)
    User.addNotification(newNot2)
    // - - - - -

    return res.status(200).json({
      message: 'Receive ok',
      // transaction,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})

// =====================================
router.post('/balance', function (req, res) {
  const { email } = req.body

  console.log('/balance: ', req.body)

  if (!email) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(email)
    const transactionList = user.transactionList
    const balance = user.balance

    if (!transactionList) {
      return res.status(400).json({
        message: 'Error: Invalid data',
      })
    }

    return res.status(200).json({
      message: 'Balance req ok',
      transactionList,
      balance,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})
// =====================================
router.post('/notifications', function (req, res) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(email)
    const notificationList = user.notificationList

    if (!notificationList) {
      return res.status(400).json({
        message: 'Error: Invalid data',
      })
    }

    return res.status(200).json({
      message: 'notificationList req ok',
      notificationList,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})

// =====================================
router.post('/transaction', function (req, res) {
  const { email, transactionId } = req.body

  console.log('/transaction: ', req.body)

  if (!email || !transactionId) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(email)
    const transactionList = user.transactionList
    const transaction = transactionList.find(
      (transaction) => transaction.id === transactionId,
    )

    if (!transactionList || !user || !transaction) {
      return res.status(400).json({
        message: 'Error: Invalid data',
      })
    }

    return res.status(200).json({
      message: 'Transaction req ok',
      transaction,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})

// =====================================
router.post('/signin', function (req, res) {
  const { email, password } = req.body

  console.log(req.body)

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(email)

    console.log('Sign in User: ', user)

    if (password !== user.password) {
      return res.status(400).json({
        message: 'Error: Invalid password or email',
      })
    }

    const session = Session.create(user)
    // - - - add note - -
    const id = session.user.id
    const newNot = new Notification('LO', id)
    User.addNotification(newNot)
    // - - - - -

    return res.status(200).json({
      message: 'Logged in successfully',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})

//============================================
router.post('/changeemail', function (req, res) {
  const { email, password, userEmail } = req.body

  console.log(req.body)

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(userEmail)
    const testUser = User.getByEmail(email)

    if (testUser) {
      return res.status(400).json({
        message: 'Such user already exists',
      })
    }

    if (password !== user.password) {
      return res.status(400).json({
        message: 'Error: Invalid password or email',
      })
    }

    if (password === user.password) {
      user.email = email
    }

    // - - - add note - -
    const id = user.id
    const newNot = new Notification('CE', id)
    User.addNotification(newNot)
    // - - - - -

    return res.status(200).json({
      message: 'Email was changed',
      email,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})

//============================================
router.post('/changepassword', function (req, res) {
  const { newPassword, password, userEmail } = req.body

  console.log(req.body)

  if (!newPassword || !password || !userEmail) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(userEmail)

    if (password !== user.password) {
      return res.status(400).json({
        message: 'Error: Invalid password or email',
      })
    }

    if (password === user.password) {
      user.password = newPassword
    }

    // - - - add note - -
    const id = user.id
    const newNot = new Notification('CP', id)
    User.addNotification(newNot)
    // - - - - -

    return res.status(200).json({
      message: 'Password was changed',
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})

//============================================

router.post('/check-permission', function (req, res) {
  const { token } = req.body

  console.log('check-permission: ', req.body)
  try {
    const checkedToken = Session.get(token)
    const user = User.getByEmail(checkedToken.user.email)

    if (checkedToken) {
      return res.status(200).json({
        user,
      })
    } else {
      return res.status(400).json({
        message: 'Error: invalid session',
      })
    }
  } catch {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})

//===============================================

router.post('/signup-confirm', function (req, res) {
  const { code } = req.body

  console.log('signup-confirm: ', req.body)
  try {
    const confirmedData = Confirm.getData(Number(code))
    console.log('confirmedData: ', confirmedData)

    if (confirmedData) {
      User.confirm(confirmedData)
      return res.status(200).json({
        confirmedData,
      })
    } else {
      return res.status(400).json({
        hasPermission: false,
        message: 'Error: invalid session',
      })
    }
  } catch {
    return res.status(400).json({
      hasPermission: false,
      message: 'Error: missing required data',
    })
  }
})

// ==========================================
router.post('/recovery-confirm', function (req, res) {
  const { code, password } = req.body

  if (!code || !password) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  console.log('recovery-confirm: ', req.body)
  try {
    const confirmedData = Confirm.getData(Number(code))
    console.log('confirmedData: ', confirmedData)

    if (confirmedData) {
      User.chgpswd(confirmedData, password)
      // - - - add note - -
      const user = User.getByEmail(confirmedData)
      const id = user.id
      const newNot = new Notification('RA', id)
      User.addNotification(newNot)
      // - - - - -

      return res.status(200).json({
        message: 'Password changed',
      })
    } else {
      return res.status(400).json({
        hasPermission: false,
        message: 'Error: invalid session',
      })
    }
  } catch {
    return res.status(400).json({
      hasPermission: false,
      message: 'Error: missing required data',
    })
  }
})

// ==========================================

// Експортуємо глобальний роутер
module.exports = router
