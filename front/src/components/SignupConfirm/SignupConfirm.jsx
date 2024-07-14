import styles from './SignupConfirm.module.css'
import Button from '../../elements/button/Button'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import AuthContext from '../../context/AuthContext'

const SignupConfirm = () => {
  const navigate = useNavigate()
  const handleClickArrowBack = () => {
    navigate(-1)
  }

  const [data, setData] = useState({ code: '' })
  const [isFormValid, setIsFormValid] = useState(false)

  function handleInputChange(e, name) {
    setData({ ...data, [name]: e.target.value })
  }

  const validateForm = (formData) => {
    if (formData?.code?.length > 0) {
      setIsFormValid(true)
    } else {
      setIsFormValid(false)
    }
  }

  useEffect(() => {
    validateForm(data)
  }, [data])

  const { state, dispatch } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/signup-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Confirm successful:', data)
        console.log('State до изменения:', state)
        // alert(data.session.token)
        // логика login, Authcontext:

        //===========================
        dispatch({ type: 'confirm' })
        navigate('/balance')
      } else {
        console.error('Signup confirm failed:', response.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    if (state.user?.isConfirm) {
      navigate('/balance')
    }
  }, [state.user?.isConfirm])

  return (
    <div className={styles.container}>
      <div className={styles.arrowback} onClick={handleClickArrowBack} />

      <div className={styles.content}>
        <div className={styles.content__header}>
          <h2>Confirm account</h2>
          <p>Write the code you received</p>
        </div>

        <div className={styles.content__form}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="code">Code</label>
            <input
              autoComplete="off"
              type="text"
              id="code"
              name="code"
              placeholder="Enter your confirm code"
              value={data.code}
              onChange={(e) => handleInputChange(e, 'code')}
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
    </div>
  )
}

export default SignupConfirm
