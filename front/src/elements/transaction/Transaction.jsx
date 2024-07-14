import React, { useContext, useState, useEffect } from 'react'
import styles from './Transaction.module.css'
import { format, isToday, parseISO } from 'date-fns'
import AuthContext from '../../context/AuthContext'

const Transaction = ({ date, amount, counterparty, type }) => {
  const { state, dispatch } = useContext(AuthContext)
  // const [currentData, setCurrentData] = useState({
  //   currentCounterparty: '',
  //   currentType: 'asasasa',
  // })

  console.log('transaction state:', state)

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid date'
    const parsedDate = parseISO(dateString)
    if (isNaN(parsedDate)) return 'Invalid date'
    if (isToday(parsedDate)) {
      return format(parsedDate, 'HH:mm')
    } else {
      return format(parsedDate, 'HH:mm, dd:MM:yy')
    }
  }

  const getLogo = (name) => {
    if (!name) {
      return 'user.png'
    }
    switch (name.toLowerCase()) {
      case 'coinbase':
        return 'coinbase.png'
      case 'stripe':
        return 'stripe.png'
      default:
        return 'user.png'
    }
  }

  const formatAmount = (amount) => {
    if (!amount) return <></>
    const [integerPart, decimalPart] = Number(amount).toFixed(2).split('.')
    // const type = currentData.currentType
    // console.log('from func formatAmmount, type:', type)
    return (
      <>
        <span className={styles.amountSymbol}>
          {type === 'deposit' ? '+$' : '-$'}
        </span>
        <span className={styles.integerPart}>{integerPart}</span>.
        <span className={styles.decimalPart}>{decimalPart}</span>
      </>
    )
  }

  return (
    <div className={styles.transactionItem}>
      <div className={styles.transactionLogo}>
        <img src={getLogo(counterparty)} alt={counterparty} />
      </div>
      {/* <div className={styles.transactionDetails}> */}
      <div className={styles.transactionOwnerName}>
        <span>{counterparty}</span>
      </div>
      <div className={styles.transactionType}>
        <span>
          {formatDate(date)} - {type}
        </span>
      </div>
      <div
        className={`${styles.transactionAmount} ${
          type === 'deposit' ? styles.plus : styles.minus
        }`}
      >
        {/* <span>{formatAmount(amount)}</span> */}
        {formatAmount(amount)}
      </div>
      {/* </div> */}
    </div>
  )
}

export default Transaction
