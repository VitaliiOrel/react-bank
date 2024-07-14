import styles from './Send.module.css'
import Button from '../../elements/button/Button'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import AuthContext from '../../context/AuthContext'

const Send = () => {
  const navigate = useNavigate()
  const handleClickArrowBack = () => {
    navigate(-1)
  }
  const [data, setData] = useState({ amount: '', email: '' })
  const [isFormValid, setIsFormValid] = useState(false)
  const [warningOff, setWarningOff] = useState(true)
  const { state, dispatch } = useContext(AuthContext)

  function handleInputChange(e, name) {
    setData({ ...data, [name]: e.target.value })
  }

  const validateForm = (formData) => {
    const regex = /^(\d{1,9}([.,]\d{0,2})?)?$/
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // for email

    if (
      formData?.amount?.length > 0 &&
      regex.test(formData.amount) &&
      re.test(String(formData.email).toLowerCase()) &&
      formData.email !== state.user.email
    ) {
      setIsFormValid(true)
      setWarningOff(true)
    } else {
      setIsFormValid(false)
      setWarningOff(true)
    }
  }

  useEffect(() => {
    validateForm(data)
  }, [data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const transactionData = { ...data, userEmail: state.user.email }
    try {
      const response = await fetch('http://localhost:4000/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Send transaction: ', data)
        // alert(data.session.token)
        // логика login, Authcontext:

        //===========================
        navigate('/balance')
      } else {
        console.error('Signup confirm failed:', response.statusText)
        setWarningOff(false)
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
          <h2>Send</h2>
        </div>

        <div className={styles.content__form}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              autoFocus
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={data.email}
              onChange={(e) => handleInputChange(e, 'email')}
            />
            <label htmlFor="amount">Amount, $</label>
            <input
              autoComplete="off"
              type="text"
              id="amount"
              name="amount"
              placeholder="Enter amount"
              value={data.amount}
              onChange={(e) => handleInputChange(e, 'amount')}
            />

            <Button
              type="submit"
              text="Confirm"
              className="btn btn--fill"
              isDisabled={!isFormValid}
            />
          </form>
        </div>
      </div>
      <div
        className={`${styles.warning} ${warningOff ? styles.warningOff : ''}`}
      >
        <img src="/images/warning.svg" alt="warning" />
        <span>Invalid data</span>
      </div>
    </div>
  )
}

export default Send
