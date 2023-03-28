import { useEffect, useState } from 'react'
import styles from '../css/Home.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Home() {
  // State variables for picked file and list of files
  const [pickedFile, setPickedFile] = useState(null)
  const [files, setFiles] = useState([])
  const navigate = useNavigate()
  
  // Function to delete a file
  const deleteFile = (fileId) => {
    axios.delete(`${process.env.REACT_APP_API_ROUTE}/delete-file/${fileId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })

    // Filter the deleted file from the list of files
    setFiles(files.filter(file => file.id !== fileId))
  }

  // Function to download a file
  const downloadFile = (fileId, fileName) => {
    axios.get(`${process.env.REACT_APP_API_ROUTE}/download-file/${fileId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
      },
      responseType: 'blob'
    })
    .then((res) => {
      // Create a URL for the file and a link to download it
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/octet-stream' }))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', fileName)
      
      document.body.appendChild(link)

      // Click the link to initiate the download
      link.click()

      document.body.removeChild(link)
    })
  }

  // Function to log out the user
  const logout = () => {
    // Remove the JWT token from local storage
    localStorage.removeItem('jwtToken')

    // Navigate to the login page
    navigate('/auth/login')
  }

  // Function to share a file
  const shareFile = (fileId) => {
    // Send a POST request to the server to share the file
    axios.post(`${process.env.REACT_APP_API_ROUTE}/share-file`, {
      id: fileId
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
    .then((res) => {
      // Navigate to the shared file page
      navigate(`/shared-file/${fileId}`)
    })
  }

  // Function to show the file input dialog
  const onPickFile = () => {
    document.getElementById('fileInput').click()
  }
  
  // Function to handle a picked file
  const handleFile = (e) => {
    setPickedFile(e.target.files[0])
  }

  // This useEffect hook runs whenever `pickedFile` changes
  // It sends a POST request to the server to upload the file
  // and then sends a GET request to retrieve all files from the server
  useEffect(() => {
    if (pickedFile) {      
      var formData = new FormData()
      formData.append('file', pickedFile)
      
      axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_ROUTE}/upload-file`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
      })
      .then((res) => {  
        axios.get(`${process.env.REACT_APP_API_ROUTE}/all-files`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        })
        .then((res) => {
          setFiles(res.data)
        })
  
        setPickedFile(null)
      })
      .catch((err) => {
        console.log(err.response)
      })
    }
  }, [pickedFile])
  
  // This useEffect hook runs once when the component mounts
  // It checks if there is a JWT token in local storage
  // If there isn't, it navigates to the login page
  // If there is, it sends a GET request to retrieve all files from the server
  useEffect(() => {
    if (localStorage.getItem('jwtToken') === null) {
      navigate('/auth/login')
    }
    else {
      axios.get(`${process.env.REACT_APP_API_ROUTE}/all-files`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then((res) => {
        setFiles(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
    }
  }, [])

  return (
    <div className="container">
      <div className={styles.card}>
        <div className={styles.heading}>
          <h3>Filesive - File Store & Sharing App 📂</h3>
          <p>Quick ⚡ and fast 🚀file storing and sharing app made by <a>Ege Okyay</a> with 💖</p>
          <button className="success-btn" onClick={() => onPickFile()}>Upload File</button>
          <input id="fileInput" style={{display: 'none'}} type="file" onChange={(e) => handleFile(e)} />
          <button onClick={() => (logout())} style={{marginLeft: "0.5rem"}} className="danger-btn">Logout</button>
        </div>
        {
          files.map((file) => (
            <div key={file.id} className={styles.content}>
              <div className={styles.file}>
                <p>{ file.name }</p>
                <div className={styles.buttons}>
                  <button onClick={() => (downloadFile(file.id, file.name))} className="success-btn">Download File</button>
                  {
                    (file.shared)
                    ?
                    <button onClick={() => (navigate(`/shared-file/${file.id}`))} className="other-btn">View Shared File</button>
                    :
                    <button onClick={() => (shareFile(file.id))} className="other-btn">Share File</button>
                  }
                  <button onClick={() => (deleteFile(file.id))} className="danger-btn">Delete File</button>
                </div>
              </div>
            </div>  
          ))
        }
      </div>
    </div>
  )
}

export default Home