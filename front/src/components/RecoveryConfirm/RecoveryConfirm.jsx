import styles from './RecoveryConfirm.module.css'
import Button from '../../elements/button/Button'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const RecoveryConfirm = () => {
  const navigate = useNavigate()
  const handleClickArrowBack = () => {
    navigate(-1)
  }

  const [data, setData] = useState({ code: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
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

  function togglePasswordVisibility() {
    setShowPassword(!showPassword)
  }

  const validateForm = (data) => {
    const isValid = data.code.length >= 1 && data.password.length >= 2
    setIsFormValid(isValid)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/recovery-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Signup successful:', data)

        alert(`${data.message}`)

        //===========================
        navigate('/signin')
      } else {
        console.error('Signup failed:', response.statusText)
        setWarningOff(false)
        setIsFormValid(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }

    setData({ code: '', password: '' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.arrowback} onClick={handleClickArrowBack} />

      <div className={styles.content}>
        <div className={styles.content__header}>
          <h2>Recover password</h2>
          <p>Write the code you received</p>
        </div>

        <div className={styles.content__form}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="code">Code</label>
            <input
              type="text"
              id="code"
              name="code"
              placeholder="Enter your confirm code"
              autoComplete="off"
              value={data.code}
              onChange={(e) => handleInputChange(e, 'code')}
            />
            <label htmlFor="password">New password</label>
            <div className={styles.inputPassword}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={data.password}
                onChange={(e) => handleInputChange(e, 'password')}
              />
              <button type="button" onClick={togglePasswordVisibility}>
                <img
                  src={
                    showPassword ? '/images/eyeslash.svg' : '/images/eye.svg'
                  }
                  alt="Toggle password visibility"
                />
              </button>
            </div>
            <Button
              type="submit"
              text="Restore password"
              className="btn btn--fill"
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

export default RecoveryConfirm
