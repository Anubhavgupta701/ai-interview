import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Home from './pages/home.jsx'
import Auth from './pages/Auth.jsx'
import { setUserData } from './redux/userSlice.js'
import { serverUrl } from './config.js'
import InterviewPage from './pages/InterviewPage.jsx'
import InterviewHistory from './pages/InterviewHistory.jsx'
import Pricing from './pages/pricing.jsx'
import InterviewReport from './pages/InterviewReport.jsx'

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/currentUser`, { withCredentials: true });
        dispatch(setUserData(result.data.user));
      } catch (error) {
        console.error("Error fetching current user:", error)
        dispatch(setUserData(null));
      }
    }
    getUser()
  }, [dispatch])

  return (
    <Routes>

      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/interview' element={<InterviewPage />} />
      <Route path='/history' element={<InterviewHistory />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/report/:id' element={<InterviewReport />} />


    </Routes>
  )
}

export default App