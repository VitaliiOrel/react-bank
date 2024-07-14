import styles from './Receive.module.css'
import Button from '../../elements/button/Button'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import AuthContext from '../../context/AuthContext'

const Receive = () => {
  const navigate = useNavigate()
  const handleClickArrowBack = () => {
    navigate(-1)
  }

  const [data, setData] = useState({ amount: '' })
  const [isFormValid, setIsFormValid] = useState(false)

  function handleInputChange(e, name) {
    setData({ ...data, [name]: e.target.value })
  }

  const validateForm = (formData) => {
    // const regex = /^(?:\d{1,9}(?:[.,]\d{1,2})?)?$/
    const regex = /^(\d{1,9}([.,]\d{0,2})?)?$/
    if (formData.amount?.length > 0 && regex.test(formData.amount)) {
      setIsFormValid(true)
    } else {
      setIsFormValid(false)
    }
  }

  useEffect(() => {
    validateForm(data)
  }, [data])

  const { state, dispatch } = useContext(AuthContext)

  const handleSubmit = async (e, paymentSystem) => {
    e.preventDefault()
    const updatedData = { ...data, paymentSystem, email: state.user.email }
    try {
      const response = await fetch('http://localhost:4000/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Receive successful:', data)
        //===========================
        navigate('/balance')
      } else {
        console.error('ErrorElse:', response.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.arrowback} onClick={handleClickArrowBack} />

      <div className={styles.content}>
        <div className={styles.content__header}>
          <h2>Receive</h2>
        </div>

        <div className={styles.content__form}>
          <form onSubmit={handleSubmit}>
            <span>Receive amount</span>
            <input
              autoFocus
              className={`${!isFormValid ? styles.invalidInput : ''}`}
              autoComplete="off"
              type="text"
              id="amount"
              name="amount"
              placeholder="Enter amount"
              value={data.amount}
              onChange={(e) => handleInputChange(e, 'amount')}
            />
            <div className={styles.divider} />
            <span>Payment system</span>
            <button
              type="button"
              className={styles.paymentBlock}
              onClick={(e) => handleSubmit(e, 'Stripe')}
              disabled={!isFormValid}
            >
              <div className={styles.paymentBlock__logo}>
                <img src="stripe.png" alt="stripe" />
                <span>Stripe</span>
              </div>
              <div className={styles.payBlock__systems}>
                <img src="payblock1.png" alt="stripe" />
              </div>
            </button>
            <button
              type="button"
              className={styles.paymentBlock}
              onClick={(e) => handleSubmit(e, 'Coinbase')}
              disabled={!isFormValid}
            >
              <div className={styles.paymentBlock__logo}>
                <img src="coinbase.png" alt="coinbase" />
                <span>Coinbase</span>
              </div>
              <div className={styles.payBlock__systems}>
                <img src="payblock2.png" alt="coin" />
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Receive
