import { useState, useEffect, useContext } from 'react'
import styles from './SettingsPage.module.css'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import Button from '../../elements/button/Button'

const SettingsPage = () => {
  const { state, dispatch } = useContext(AuthContext)
  const navigate = useNavigate()
  const handleClickArrowBack = () => {
    navigate(-1)
  }

  const handleClickLogOut = () => {
    dispatch({
      type: 'logout',
    })
    navigate('/signin')
  }
  //=====================
  const [isRendering, setIsRendering] = useState(true)

  useEffect(() => {
    setIsRendering(false)
  }, [])
  //=====================

  const [data, setData] = useState({ email: '', password: '' })
  const [dataPas, setDataPas] = useState({ password: '', newPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [isFormValid2, setIsFormValid2] = useState(false)
  const [warningOff, setWarningOff] = useState(true)

  useEffect(() => {
    validateForm(data)
  }, [data])

  useEffect(() => {
    validateForm2(dataPas)
  }, [dataPas])

  function handleInputChange(e, name) {
    setData({ ...data, [name]: e.target.value })
    validateForm(data)
    setWarningOff(true)
  }

  function handleInputChange2(e, name) {
    setDataPas({ ...dataPas, [name]: e.target.value })
    validateForm2(dataPas)
    setWarningOff(true)
  }

  function togglePasswordVisibility() {
    setShowPassword(!showPassword)
  }
  function togglePasswordVisibility1() {
    setShowPassword1(!showPassword1)
  }
  function togglePasswordVisibility2() {
    setShowPassword2(!showPassword2)
  }

  const validateForm = (data) => {
    const isValid = data.email.includes('@') && data.password.length >= 3
    setIsFormValid(isValid)
  }

  const validateForm2 = (data) => {
    const isValid =
      dataPas.password.length >= 3 && dataPas.newPassword.length >= 3
    setIsFormValid2(isValid)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userEmail = state.user.email

    try {
      const response = await fetch('http://localhost:4000/changeemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, userEmail }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Login with your new email: ${data.email}`)
        // логика login, Authcontext:
        dispatch({
          type: 'logout',
        })
        //===========================
        navigate('/signin')
      } else {
        const data = await response.json()
        console.error('Update failed:', data.message)
        // alert(`${data.message}`)
        setIsFormValid(false)
        setWarningOff(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }

    setData({ email: '', password: '' })
  }

  const handleSubmit2 = async (e) => {
    e.preventDefault()

    const userEmail = state.user.email

    try {
      const response = await fetch('http://localhost:4000/changepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...dataPas, userEmail }),
      })

      console.log('Response -- ', response)

      const data = await response.json()

      if (response.ok) {
        alert(`${data.message}. Login with your new password: ********`)
        // логика login, Authcontext:
        dispatch({
          type: 'logout',
        })
        //===========================
        navigate('/signin')
      } else {
        console.error('Password change failed:', data.message)
        alert(`${data.message}`)
        setIsFormValid(false)
        setWarningOff(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }

    setDataPas({ newPassword: '', password: '' })
  }

  return (
    <div
      className={`${styles.container} ${
        isRendering ? styles.rendering : styles.rendered
      }`}
    >
      <div className={styles.headerWrapper}>
        <div className={styles.headerMenu}>
          <div className={styles.arrowback} onClick={handleClickArrowBack} />
          <h2>Settings</h2>
          <div className={styles.empty} />
        </div>
      </div>

      <div className={styles.content__form}>
        <p>Change email</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter NEW email"
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
                src={showPassword ? '/images/eyeslash.svg' : '/images/eye.svg'}
                alt="Toggle password visibility"
              />
            </button>
          </div>

          <Button
            type="submit"
            text="Save Email"
            className="btn btn--lightSet"
            isDisabled={!isFormValid}
          />
        </form>
      </div>

      <div className={styles.divider} />

      {/* =====Change password================== */}

      <div className={styles.content__form}>
        <p>Change password</p>
        <form onSubmit={handleSubmit2}>
          <label htmlFor="password1">Password</label>
          <div className={styles.inputPassword}>
            <input
              type={showPassword1 ? 'text' : 'password'}
              id="password1"
              name="password1"
              placeholder="Enter your password"
              value={dataPas.password}
              onChange={(e) => handleInputChange2(e, 'password')}
            />
            <button type="button" onClick={togglePasswordVisibility1}>
              <img
                src={showPassword1 ? '/images/eyeslash.svg' : '/images/eye.svg'}
                alt="Toggle password visibility"
              />
            </button>
          </div>

          <label htmlFor="newPassword">New password</label>
          <div className={styles.inputPassword}>
            <input
              type={showPassword2 ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              placeholder="Enter NEW password"
              value={dataPas.newPassword}
              onChange={(e) => handleInputChange2(e, 'newPassword')}
            />
            <button type="button" onClick={togglePasswordVisibility2}>
              <img
                src={showPassword2 ? '/images/eyeslash.svg' : '/images/eye.svg'}
                alt="Toggle password visibility"
              />
            </button>
          </div>

          <Button
            type="submit"
            text="Save Password"
            className="btn btn--lightSet"
            isDisabled={!isFormValid2}
          />
        </form>
      </div>

      <div className={styles.divider} />

      <Button
        text="Log out"
        className="btn btn--out"
        onClick={handleClickLogOut}
      />

      <div
        className={`${styles.warning} ${warningOff ? styles.warningOff : ''}`}
      >
        <img src="/images/warning.svg" alt="warning" />
        <span>Invalid data</span>
      </div>
    </div>
  )
}

export default SettingsPage
