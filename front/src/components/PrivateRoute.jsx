import { useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { NavLink, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const checkPermission = async (token) => {
  try {
    const response = await fetch('http://localhost:4000/check-permission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    if (response.ok) {
      const checkedUser = await response.json()
      console.log('User is:', checkedUser)
      return checkedUser
    } else {
      console.error('Cheking failed:', response.statusText)
      return null
    }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

const PrivateRoute = ({ children }) => {
  const { state } = useContext(AuthContext)
  const [checkedUser, setCheckedUser] = useState({ user: { email: '' } })

  useEffect(() => {
    const verifyUser = async () => {
      const user = await checkPermission(state.token)
      setCheckedUser(user)
    }
    verifyUser()
  }, [state.token, state.user])

  console.log('Checked user: ', checkedUser)

  // return state.token ? children : <Navigate to="/signin" />
  if (!state.token) {
    return <Navigate to="/signup" />
  } else if (!state.user.isConfirm && children.type.name === 'SignupConfirm') {
    return children
  } else if (
    checkedUser.user.email === state.user.email &&
    checkedUser.user.isConfirm
  ) {
    return children
  } else if (
    checkedUser.user.email === state.user.email &&
    !checkedUser.user.isConfirm
  ) {
    console.log(
      `Условие !checkedUser.isConfirm:, ${checkedUser.user.isConfirm}`
    )
    return <Navigate to="/signup-confirm" />
  }
  console.log(
    'После проверки всех условий. checkedUser:',
    checkedUser.user,
    'state.user: ',
    state.user
  )
  return <div style={{ padding: 10 }}>Verifying data . . . </div>
}

export default PrivateRoute
