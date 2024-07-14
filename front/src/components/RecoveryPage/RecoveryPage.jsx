import styles from './RecoveryPage.module.css'
import Button from '../../elements/button/Button'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const RecoveryPage = () => {
  const navigate = useNavigate()
  const handleClickArrowBack = () => {
    navigate(-1)
  }

  const [data, setData] = useState({ email: '', password: '' })
  const [warningOff, setWarningOff] = useState(true)
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    validateForm(data)
  }, [data])

  function handleInputChange(e, name) {
    setData({ ...data, [name]: e.target.value })
    setWarningOff(true)
    validateForm(data)
  }

  const validateForm = (data) => {
    const isValid = data.email.includes('@')
    setIsFormValid(isValid)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Recovery code:', data)
        // alert(data.session.token)
        // логика login, Authcontext:

        const code = data.confirm.code
        alert(`Confirm code: , ${code}`)

        //===========================
        navigate('/recovery-confirm')
      } else {
        console.error('Signup failed:', response.statusText)
        setWarningOff(false)
        setIsFormValid(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }

    setData({ email: '' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.arrowback} onClick={handleClickArrowBack} />

      <div className={styles.content}>
        <div className={styles.content__header}>
          <h2>Recover password</h2>
          <p>Choose a recovery method</p>
        </div>

        <div className={styles.content__form}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => handleInputChange(e, 'email')}
            />

            <Button
              type="submit"
              text="Send code"
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
        <span>Invalid recovery data</span>
      </div>
    </div>
  )
}

export default RecoveryPage
