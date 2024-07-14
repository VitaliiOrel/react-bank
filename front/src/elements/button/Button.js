import styles from './Button.css'
import { Link, useLocation } from 'react-router-dom'

const Button = ({ onClick, className, text, isDisabled }) => {
  return (
    <button className={className} onClick={onClick} disabled={isDisabled}>
      {text}
    </button>
  )
}

export default Button
