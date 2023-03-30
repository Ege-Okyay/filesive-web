import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import styles from '../css/Auth.module.css'
import axios from 'axios'

function Register() {
  const [email ,setEmail] = useState('') // setting up state to store user's email
  const [password, setPassword] = useState('') // setting up state to store user's password
  const [confirmPassword, setConfirmPassword] = useState('') // setting up state to store user's confirmed password
  const [message, setMessage] = useState('') // setting up state to display error/success messages
  const [messageClass, setMessageClass] = useState('')

  const navigate = useNavigate() // initializing the navigate hook
  
  const handleRegister = async() => { // function to handle user registration
    try {
      const response = await axios({ // sending a POST request to the server to register the user
        method: 'post',
        url: `${process.env.REACT_APP_API_ROUTE}/auth/register`,
        data: {
          email,
          password,
          confirmPassword
        }
      })

      setMessageClass(response.data.class)

      if (response.data.class === 'error') { // if there is an error during registration, display the error message
        return setMessage(response.data.msg)
      }

      setMessage('Please Login to Continue...') // display success message after successful registration

      setTimeout(() => { // navigate to the login page after a delay of 1.5 seconds
        navigate('/auth/login')
      }, 1500)
    }
    catch(err) {
      console.error(err) // log any errors during the registration process
    }
  }

  useEffect(() => { // checking if the user is already logged in and redirecting them to the home page if they are
    if (localStorage.getItem('jwtToken') !== null) {
      navigate('/')
    }
  }, [navigate])

  return (
    <div className="container">
      <div className={styles.card}>
        <div className={styles.heading}>
          <h3>Register Page 🔑</h3>
          <p>Already got an account? <Link className="inline-link" to={'/auth/login'}>Login</Link></p> {/* Link component to navigate to the login page */}
        </div>
        <div className={styles.content}>
          <div style={(message === '') ? { display: 'none' } : { display: 'block' } && (messageClass === 'error') ? { backgroundColor: "rgb(255, 96, 96)" } : { backgroundColor: "rgb(88, 211, 79)" }} className={styles.responseMsg}> {/* displaying error/success message */}
            <span>
              { message }
            </span>
          </div>
          <div className={styles.userForm}>
            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> {/* input field for email */}
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /> {/* input field for password */}
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /> {/* input field to confirm password */}
            <button className="success-btn" onClick={handleRegister}>Register</button> {/* button to submit registration form */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
