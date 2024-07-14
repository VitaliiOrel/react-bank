import styles from './SignupPage.module.css'
import Button from '../../elements/button/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import AuthContext from '../../context/AuthContext'

const SignupPage = () => {
  const navigate = useNavigate()
  const handleClickArrowBack = () => {
    navigate(-1)
  }

  const [data, setData] = useState({ email: '', password: '' })
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
    const isValid = data.email.includes('@') && data.password.length >= 3
    setIsFormValid(isValid)
  }

  const { dispatch } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Signup successful:', data)
        // alert(data.session.token)
        // логика login, Authcontext:
        const token = data.session.token
        const user = data.session.user
        const code = data.confirm.code
        alert(`Confirm code: , ${code}`)
        dispatch({
          type: 'login',
          payload: { token, user },
        })
        //===========================
        navigate('/signup-confirm')
      } else {
        console.error('Signup failed:', response.statusText)
        setWarningOff(false)
        setIsFormValid(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }

    setData({ email: '', password: '' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.arrowback} onClick={handleClickArrowBack} />

      <div className={styles.content}>
        <div className={styles.content__header}>
          <h2>Sign up</h2>
          <p>Choose a registration method</p>
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
            <label htmlFor="password">Password</label>
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
            <span>
              Already have an account?
              <NavLink to="/signin" className={styles.navLink}>
                Sign in
              </NavLink>
            </span>
            <Button
              type="submit"
              text="Continue"
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
        <span>A user with the same name already exists</span>
      </div>
    </div>
  )
}

export default SignupPage
