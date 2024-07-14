import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { state } = useContext(AuthContext)
  const token = state.token

  const res = fetch('http://localhost:4000/check-permission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log('abbra: ', json)
      return json.message === 'Valid session' ? (
        children
      ) : (
        <Navigate to="/signin" />
      )
    })
    .catch((error) => console.error('Error:', error))

  // const checkedState = checkPermission(state.token)
  console.log('PrivateRoute isLogged: ', res)
  return res.message === 'Valid session' ? children : <Navigate to="/signin" />
}

export default PrivateRoute
