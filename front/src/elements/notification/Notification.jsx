import React, { useContext, useState, useEffect } from 'react'
import styles from './Notification.module.css'
import { format, isToday, parseISO } from 'date-fns'
import AuthContext from '../../context/AuthContext'

const Notification = ({ date, info, type }) => {
  const { state, dispatch } = useContext(AuthContext)

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid date'
    const parsedDate = parseISO(dateString)
    if (isNaN(parsedDate)) return 'Invalid date'
    if (isToday(parsedDate)) {
      return format(parsedDate, 'HH:mm')
    } else {
      return format(parsedDate, 'HH:mm, dd:MM:yy')
    }
  }

  const getLogo = (name) => {
    if (!name) {
      return 'warning.svg'
    }
    switch (name.toLowerCase()) {
      case 'announcement':
        return 'announcement.svg'
      case 'warning':
        return 'warning.svg'
      default:
        return 'warning.svg'
    }
  }

  return (
    <div className={styles.notificationItem}>
      <div className={styles.notificationLogo}>
        <img src={getLogo(type)} alt={type} />
      </div>
      <div className={styles.notificationLogo} />
      <div className={styles.notificationInfo}>{info}</div>
      <div className={styles.notificationType}>
        {formatDate(date)} - {type}
      </div>
    </div>
  )
}

export default Notification
