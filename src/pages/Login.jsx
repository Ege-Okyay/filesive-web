import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styles from '../css/Auth.module.css'

function Login() {
  const [email ,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  // Function to handle user login
  const handleLogin = async() => {
    try {
      // Send POST request to server to log user in
      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_ROUTE}/auth/login`,
        data: {
          email,
          password
        }
      })

      // If login fails, display error message
      if (response.data.class === 'error') {
        return setMessage(response.data.msg)
      }

      // If login succeeds, save token to local storage and redirect to home page
      const token = response.data.msg
      localStorage.setItem('jwtToken', token)
      setMessage('Redirecting in a bit...')
      setTimeout(() => {
        navigate('/')
      }, 1500)

    }
    catch(err) {
      console.error(err)
    }
  }

  // Check if user is already logged in, and redirect to home page if true
  useEffect(() => {
    if (localStorage.getItem('jwtToken') !== null) {
      navigate('/')
    }
  }, [])

  return (
    <div className="container">
      <div className={styles.card}>
        <div className={styles.heading}>
          <h3>Login Page 🔑</h3>
          <p>Don't got an account? <Link className="inline-link" to={'/auth/register'}>Register</Link></p>
        </div>
        <div className={styles.content}>
          <div style={(message === '') ? { display: 'none' } : { display: 'block' }} className={styles.responseMsg}>
            { message }
          </div>
          <div className={styles.userForm}>
            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="success-btn" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login