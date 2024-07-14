import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './WelcomePage.module.css'
import Button from '../../elements/button/Button'

const WellcomePage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.backgroundImg}>
        <div className={styles.hello}>
          <h1>Hello!</h1>
          <p>Welcome to bank app</p>
        </div>
        <img src="/images/coins.png" className={styles.coins} alt="coins" />
      </div>
      <div className={styles.btnBlock}>
        <NavLink to="/signup" className={styles.navLink}>
          <Button text="Sign Up" className="btn btn--fill" />
        </NavLink>
        <NavLink to="/signin" className={styles.navLink}>
          <Button text="Sign In" className="btn btn--light" />
        </NavLink>
      </div>
    </div>
  )
}

export default WellcomePage
