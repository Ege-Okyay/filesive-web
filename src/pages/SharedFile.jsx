import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from '../css/SharedFile.module.css'

function SharedFile() {
  // useParams is a React hook that retrieves URL parameters
  const { id } = useParams()

  // useState is a React hook that manages component state
  const [uploader, setUploader] = useState({})
  const [file, setFile] = useState({})

  // useNavigate is a React hook that allows programmatic navigation
  const navigate = useNavigate()

  const convertBytes = function(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  
    if (bytes === 0) {
      return "n/a"
    }
  
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  
    if (i === 0) {
      return bytes + " " + sizes[i]
    }
  
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
  }

  useEffect(() => {
    // Make a GET request to the backend API to retrieve file details
    axios.get(`${process.env.REACT_APP_API_ROUTE}/get-details/${id}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
    .then((res) => {
      // If the file is not shared, redirect to the home page
      if (!res.data.file.shared) {
        navigate('/')
      }

      if (res.data === 'File not found!') {
        navigate('/')
      }

      // Update the component state with the file uploader and details
      setUploader(res.data.uploader)
      setFile(res.data.file)
    })
  }, [navigate, id])

  // If the user is not authenticated, render a message to prompt them to login or register
  if (localStorage.getItem('jwtToken') === null) {
    return (
      <div className="container">
        <div className={styles.card}>
          <div className={styles.heading}>
            <h3 style={{ textAlign: 'center' }}>Please Login or Register To Access This Shared File 📩</h3>
            <div className={styles.content}>
              <div className={styles.fileDetails}>
                <button onClick={() => (navigate('/auth/login'))} className="success-btn" style={{ marginBottom: '0.3rem' }}>Login</button>
                <button onClick={() => (navigate('/auth/register'))} className="success-btn">Register</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const downloadFile = () => {
    axios.get(`${process.env.REACT_APP_API_ROUTE}/download-file/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
      },
      responseType: 'blob'
    })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/octet-stream' }))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', file.name)
      
      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
    })
    .catch((err) => {
      console.error(err)
    })
  }

  return (
    <div className="container">
      <div className={styles.card}>
        <div className={styles.heading}>
          <h3>Shared File 📩</h3>
          <p>Uploaded By  <b style={{ color: '#449183' }}>{uploader.email}</b></p>
        </div>
        <div className={styles.content}>
          <div className={styles.fileDetails}>
            <h3 style={{ margin: 0 }}><span className={styles.important}>File Name:</span> { file.name }</h3>
            <h3 style={{ marginTop: '1rem' }} ><span className={styles.important}>Size:</span> { convertBytes(file.size) }</h3>
            <button onClick={() => (downloadFile())} className="success-btn" style={{ marginBottom: '0.3rem' }}>Download File</button>
            <button onClick={() => (navigate('/'))} className="danger-btn">Go Back</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharedFile