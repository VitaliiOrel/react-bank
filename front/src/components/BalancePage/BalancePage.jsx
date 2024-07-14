import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './BalancePage.module.css'
import Button from '../../elements/button/Button'
import Transaction from '../../elements/transaction/Transaction'
import AuthContext from '../../context/AuthContext'

const BalancePage = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(AuthContext)
  const [transactions, setTransactions] = useState([{ id: 1 }])
  const [balance, setBalance] = useState(0.0)

  //=====================
  const [isRendering, setIsRendering] = useState(true)

  useEffect(() => {
    setIsRendering(false)
  }, [])
  //=====================

  const handleClickNotifications = () => {
    navigate('/notifications')
  }

  const handleClickSettings = () => {
    navigate('/settings')
  }

  const handleClickReceive = () => {
    navigate('/receive')
  }

  const handleClickSend = () => {
    navigate('/send')
  }

  const transactionList = async () => {
    const email = state.user.email
    try {
      const response = await fetch('http://localhost:4000/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        // const transactionList = await response.json()
        const data = await response.json()
        console.log('Transaction list:', data.transactionList)
        console.log('Balance:', data.balance)
        // return transactionList.transactionList
        return data
        //===========================
      } else {
        console.error('Fetch failed:', response.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await transactionList()
      if (data) {
        setTransactions(data.transactionList)
        setBalance(data.balance)
      }
    }
    fetchTransactions()
  }, [state.user.email])

  const formatAmount = (amount) => {
    // if (!amount) return <></>
    const [integerPart, decimalPart] = Number(amount).toFixed(2).split('.')
    // const type = currentData.currentType
    // console.log('from func formatAmmount, type:', type)
    return (
      <>
        <span className={styles.integerPart}>${integerPart}</span>.
        <span className={styles.decimalPart}>{decimalPart}</span>
      </>
    )
  }

  return (
    <div
      className={`${styles.main} ${
        isRendering ? styles.rendering : styles.rendered
      }`}
    >
      {/* <div className={styles.main}> */}
      <div className={styles.backgroundImg}>
        <div className={styles.headerMenu}>
          <div className={styles.settings} onClick={handleClickSettings} />
          <span>Main wallet</span>
          <div
            className={styles.notifications}
            onClick={handleClickNotifications}
          />
        </div>
        <div className={styles.balance}>
          <h1>{formatAmount(balance)}</h1>
        </div>
        <div className={styles.operationsBlock}>
          <div className={styles.actionBlock} onClick={handleClickReceive}>
            <div className={styles.btnActionBlock}>
              <img
                src="/images/receive.svg"
                className={styles.btnAction}
                alt="receive"
              />
            </div>
            <span>Receive</span>
          </div>
          <div className={styles.actionBlock} onClick={handleClickSend}>
            <div className={styles.btnActionBlock}>
              <img
                src="/images/send.svg"
                className={styles.btnAction}
                alt="send"
              />
            </div>
            <span>Send</span>
          </div>
        </div>
      </div>
      <div className={styles.transactionsContainer}>
        {transactions
          .slice()
          .reverse()
          .map((transaction) => (
            // <Transaction key={transaction.id} {...transaction} />
            <Link
              to={`/transaction/${transaction.id}`}
              key={transaction.id}
              className={styles.customLink}
            >
              <Transaction {...transaction} />
            </Link>
          ))}
      </div>
    </div>
  )
}

export default BalancePage
