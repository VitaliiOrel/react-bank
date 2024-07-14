import React, { useContext, useEffect, useState } from 'react'
import styles from './TransactionPage.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import { format, isToday, parseISO } from 'date-fns'

const TransactionPage = () => {
  const { state, dispatch } = useContext(AuthContext)
  const [transaction, setTransaction] = useState([{ id: 1 }])
  const navigate = useNavigate()
  const handleClickArrowBack = () => {
    navigate(-1)
  }
  const { transactionId } = useParams()

  const formatAmount = (amount) => {
    // if (!amount) return <></>
    const [integerPart, decimalPart] = Number(amount).toFixed(2).split('.')
    // const type = currentData.currentType
    // console.log('from func formatAmmount, type:', type)
    return (
      <>
        <span className={styles.amountSymbol}>
          {transaction.type === 'deposit' ? '+$' : '-$'}
        </span>
        <span className={styles.integerPart}>{integerPart}</span>.
        <span className={styles.decimalPart}>{decimalPart}</span>
      </>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid date'
    const parsedDate = parseISO(dateString)
    if (isNaN(parsedDate)) return 'Invalid date'
    if (isToday(parsedDate)) {
      return `today, ${format(parsedDate, 'HH:mm')}`
    } else {
      return format(parsedDate, 'HH:mm, dd:MM:yy')
    }
  }

  const transactionItem = async () => {
    const email = state.user.email
    try {
      const response = await fetch('http://localhost:4000/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, transactionId }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Transaction:', data)
        return data
      } else {
        console.error('Fetch failed:', response.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await transactionItem()
      if (data) {
        setTransaction(data.transaction)
      }
    }
    fetchTransactions()
  }, [state.user.email])

  return (
    <div className={styles.container}>
      <div className={styles.arrowback} onClick={handleClickArrowBack} />
      <div className={styles.content}>
        <div className={styles.content__header}>
          <h2>Transaction</h2>
        </div>
        <div
          className={`${
            transaction.type === 'deposit' ? styles.plus : styles.minus
          }`}
        >
          {/* <span>{formatAmount(transaction.amount)}</span> */}
          {formatAmount(transaction.amount)}
        </div>
        <div className={styles.transactionInfo}>
          <div className={styles.itemInfo}>
            <span>Date</span>
            <span>{formatDate(transaction.date)}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.itemInfo}>
            <span>Address</span>
            <span>{transaction.counterparty}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.itemInfo}>
            <span>Type</span>
            <span>{transaction.type}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionPage
