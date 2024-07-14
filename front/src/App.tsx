import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WelcomePage from './components/WelcomePage/WelcomePage'
import SigninPage from './components/SigninPage/SigninPage'
import SignupPage from './components/SignupPage/SignupPage'
import SignupConfirm from './components/SignupConfirm/SignupConfirm'
import RecoveryPage from './components/RecoveryPage/RecoveryPage'
import RecoveryConfirm from './components/RecoveryConfirm/RecoveryConfirm'
import BalancePage from './components/BalancePage/BalancePage'
import Error from './components/Error/Error'
import AuthContext from './context/AuthContext'
import AuthRoute from './components/AuthRoute'
import PrivateRoute from './components/PrivateRoute'
import DevInfo from './components/DevInfo'
import Receive from './components/Receive/Receive'
import Send from './components/Send/Send'
import TransactionPage from './components/TransactionPage/TransactionPage'
import NotificationsPage from './components/NotificationsPage/NotificationsPage'
import SettingsPage from './components/SettingsPage/SettingsPage'

interface AuthState {
  token: string | null
  user: { email: string; isConfirm: boolean } | null
}

interface AuthAction {
  type: 'login' | 'logout' | 'confirm'
  payload?: {
    token: string
    user: { email: string; isConfirm: boolean }
  }
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'login':
      return { token: action.payload!.token, user: action.payload!.user }
    case 'logout':
      return { token: null, user: null }
    case 'confirm':
      if (state.user) {
        console.log('case -confirm- used')
        return { ...state, user: { ...state.user, isConfirm: true } }
      }
      return state
    default:
      return state
  }
}

function App() {
  const initialState = { token: null, user: null }
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <div className="App">
      <AuthContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Routes>
            <Route
              index
              element={
                <AuthRoute>
                  <WelcomePage />
                </AuthRoute>
              }
            />
            <Route
              path="signin"
              element={
                <AuthRoute>
                  <SigninPage />
                </AuthRoute>
              }
            />

            <Route
              path="signup"
              element={
                <AuthRoute>
                  <SignupPage />
                </AuthRoute>
              }
            />

            <Route
              path="signup-confirm"
              element={
                <PrivateRoute>
                  <SignupConfirm />
                </PrivateRoute>
              }
            />
            <Route
              path="recovery"
              element={
                <AuthRoute>
                  <RecoveryPage />
                </AuthRoute>
              }
            />
            <Route
              path="recovery-confirm"
              element={
                <AuthRoute>
                  <RecoveryConfirm />
                </AuthRoute>
              }
            />
            <Route
              path="/balance"
              element={
                <PrivateRoute>
                  <BalancePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/receive"
              element={
                <PrivateRoute>
                  <Receive />
                </PrivateRoute>
              }
            />
            <Route
              path="/send"
              element={
                <PrivateRoute>
                  <Send />
                </PrivateRoute>
              }
            />
            <Route
              path="/transaction/:transactionId"
              element={
                <PrivateRoute>
                  <TransactionPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Error />} />
          </Routes>
          {/* <DevInfo /> */}
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  )
}

export default App
