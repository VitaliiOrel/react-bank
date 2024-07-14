import { useState, useEffect, useContext } from 'react'
import styles from './NotificationsPage.module.css'
import { useNavigate } from 'react-router-dom'
import Notification from '../../elements/notification/Notification'
import AuthContext from '../../context/AuthContext'

const NotificationsPage = () => {
  const { state, dispatch } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([{ id: 1 }])
  const navigate = useNavigate()
  const handleClickArrowBack = () => {
    navigate(-1)
  }

  //=====================
  const [isRendering, setIsRendering] = useState(true)

  useEffect(() => {
    setIsRendering(false)
  }, [])
  //=====================

  const notificationList = async () => {
    const email = state.user.email
    try {
      const response = await fetch('http://localhost:4000/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()
        return data
        //===========================
      } else {
        console.error('Fetch failed:', response.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await notificationList()
      if (data) {
        setNotifications(data.notificationList)
      }
    }
    fetchTransactions()
  }, [state.user.email])

  return (
    <div
      className={`${styles.container} ${
        isRendering ? styles.rendering : styles.rendered
      }`}
    >
      {/* <div className={styles.container}> */}
      <div className={styles.headerMenu}>
        <div className={styles.arrowback} onClick={handleClickArrowBack} />
        <h2>Notifications</h2>
        <div
          className={styles.empty}
          // onClick={handleClickNotifications}
        />
      </div>
      <div className={styles.infoBlock}>
        {notifications
          .slice()
          .reverse()
          .map((notification) => (
            <Notification {...notification} />
          ))}
        {/* <Notification date="01.01.2001" type="Warning" info="New login" />
        <Notification date="01.01.2001" type="Warning" info="New login" />
        <Notification date="01.01.2001" type="Warning" info="New login" />
        <Notification date="01.01.2001" type="Warning" info="New login" /> */}
      </div>
    </div>
  )
}

export default NotificationsPage
