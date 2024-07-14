import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const AuthRoute = ({ children }) => {
  const { state } = useContext(AuthContext)

  return state.token ? <Navigate to="/balance" /> : children
}

export default AuthRoute
