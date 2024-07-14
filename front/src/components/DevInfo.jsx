import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { NavLink } from 'react-router-dom'

const DevInfo = () => {
  const { state, dispatch } = useContext(AuthContext)
  const handleLogin = () => {
    // Здесь логика для получения токена и пользователя
    const token = 'sa15-21mple-88t-oken'
    const user = { name: 'John Mo', email: 'john.Mo@example.com' }

    // Выполняем dispatch с действием login
    dispatch({
      type: 'login',
      payload: {
        token,
        user,
      },
    })
  }
  const handleLogout = () => {
    dispatch({
      type: 'logout',
    })
  }
  return (
    <div className="devInfo">
      <p>State: {state.token ? 'LoggedIn' : 'LoggedOut'}</p>
      {/* <button onClick={handleLogin} disabled>
        Log in
      </button> */}
      <button onClick={handleLogout}>Log out</button>
      <nav className="devNav">
        <NavLink to="/">/index</NavLink>
        <NavLink to="/signin">/signin</NavLink>
        <NavLink to="/signup">/signup</NavLink>
        <NavLink to="/signup-confirm">/signup-confirm</NavLink>
        <NavLink to="/recovery">/recovery</NavLink>
        <NavLink to="/recovery-confirm">/recovery-confirm</NavLink>
        <NavLink to="/balance">/balance</NavLink>
        <NavLink to="/receive">/receive</NavLink>
        <NavLink to="/transaction/info">/transaction/info</NavLink>
        <NavLink to="/notifications">/notifications</NavLink>
      </nav>
    </div>
  )
}

export default DevInfo
