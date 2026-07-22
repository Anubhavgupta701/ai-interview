import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar.jsx'
import { motion } from "motion/react"
import { BsRobot, BsPeople, BsMic, BsClock, BsBarChart, BsCloudUpload, BsCodeSlash, BsFileEarmarkText, BsFileEarmarkPerson } from "react-icons/bs"
import { HiSparkles } from "react-icons/hi"
import { useNavigate } from 'react-router-dom'
import AuthModel from '../components/AuthModel.jsx'
import Footer from '../components/Footer.jsx'
import aians from '../assets/ai-ans.jpg'
import hr from '../assets/hr.jpg'
import pdf from '../assets/pdf.png'
import resume from '../assets/resume.jpg'
import tech from '../assets/tech.jpg'
import hrinterview from '../assets/hr-interview.jpg'
import confidence from '../assets/confidence.jpg'
import techint from '../assets/tech-interview.png'

function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()

  const steps = [
    {
      step: "STEP-01",
      icon: <BsRobot size={24} />,
      title: "Role and Experience Analysis",
      desc: "Upload your resume and MR.Rk will set your difficulty based on your selected job role.",
    },
    {
      step: "STEP-02",
      icon: <BsMic size={24} />,
      title: "Smart Voice Interview",
      desc: "Dynamic follow-up questions based on your answers.",
    },
    {
      step: "STEP-03",
      icon: <BsClock size={24} />,
      title: "Time Bound Interview",
      desc: "Practice with real interview scenarios under time constraints.",
    },
  ]
  return (
    <div className='min-h-screen bg-[#f3f3f3] flex flex-col'>
      <Navbar />

      <div className='flex-1 px-6 py-20 flex flex-col items-center justify-center gap-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex justify-center'>
            <div className='bg-gray-100 text-gray-800 text-sm py-2 px-4 rounded-full flex items-center gap-2 shadow-md'>
              <HiSparkles size={16} className='bg-gray-50 text-green-600' />Interview Platform by RK.Interviewer AI
            </div>
          </div>
          <div className='text-center mb-28'>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}

              className='text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto'>
              From Resume
              <span className='relative block mt-4'>
                <span className='bg-black text-white px-4 py-1 rounded-full inline-flex items-center justify-center'>To Interview Ready</span>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='text-lg text-bold text-gray-600 max-w-2xl mx-auto mt-6'
            >
              No awkward interview panels . No judging faces.Just an AI that grills you , helps you improve , and never gets tired of saying ,"Lets try  that answer again"
            </motion.p>
            <div className='flex flex-wrap justify-center gap-4 mt-10'>
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return
                  }
                  navigate("/interview")
                }}

                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className='bg-black text-white px-10 py-3 rounded-full hover:opacity-90 transition shadow-md'>Start Interview</motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return
                  }
                  navigate("/history")
                }}

                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className='border border-gray-300 px-10 py-3 rounded-full hover:bg-gray-100 transition'>View Interview History</motion.button>
            </div>
          </div>
          <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28'>
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-gray-200 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 p-10 w-80 max-w-[90%] ${index === 1 ? 'rotate-[3deg] md:-mt-6 shadow-xl' : ''} ${index === 0 ? 'rotate-[4deg]' : ''} ${index === 2 ? 'rotate-[-3deg]' : ''}`}
              >
                <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-black border-2 border-gray-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg'>
                  {item.icon}
                </div>
                <div className='mt-12 text-center'>
                  <p className='text-xs text-gray-500 uppercase mb-4'>{item.step}</p>
                  <h3 className='text-xl font-semibold mb-3'>{item.title}</h3>
                  <p className='text-sm text-gray-600'>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>


          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-4xl font-semibold text-center mb-16'>
              Smart AI{" "}
              <span className='text-gray-500'> Capabilities</span>
            </motion.h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
              {
                [
                  {
                    image: resume,
                    icon: <BsFileEarmarkPerson size={20} />,
                    title: "Resume Analysis",
                    desc: "Extracts skills, experience, and projects to build a personalized interview roadmap."
                  },

                  {
                    image: tech,
                    icon: <BsCodeSlash size={20} />,
                    title: "Technical Interview",
                    desc: "Practice role-specific coding and technical questions tailored to your resume."
                  },

                  {
                    image: aians,
                    icon: <BsBarChart size={20} />,
                    title: "AI Answer Evaluation",
                    desc: "Measures communication, technical accuracy, confidence, and provides actionable feedback."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className='bg-gray-200 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 p-6 gap-4'>
                    <div className='flex flex-col md:flex-row items-start gap-6'>
                      <div className='w-full md:w-1/2 flex justify-center'>
                        <img src={item.image} alt={item.title} className='w-full max-w-[260px] h-auto object-contain' />
                      </div>

                      <div className='w-full md:w-1/2 flex flex-col justify-center gap-4'>
                        <div className='bg-gray-100 text-black w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm'>
                          {item.icon}
                        </div>
                        <h3 className='font-semibold mb-2 text-xl'>{item.title}</h3>
                        <p className='text-gray-500 text-sm leading-relaxed'>{item.desc}</p>
                      </div>
                    </div>

                  </motion.div>))
              }
            </div>
          </div>

          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-4xl font-semibold text-center mb-16'>
              Multiple{" "}
              <span className='text-gray-500'> Interviews Mode</span>
            </motion.h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
              {
                [
                  {
                    image: hrinterview,
                    icon: <BsPeople size={20} />,
                    title: "HR Interview Simulation",
                    desc: "Practice behavioral, situational, and communication-based questions in a realistic HR interview environment."
                  },
                  {
                    image: confidence,
                    icon: <BsMic size={20} />,
                    title: "Confidence Analysis",
                    desc: "Evaluate speaking confidence, fluency, clarity, and response delivery with AI-powered feedback."
                  },
                  {
                    image: techint,
                    icon: <BsCodeSlash size={20} />,
                    title: "Technical Interview Practice",
                    desc: "Experience role-specific technical interviews with adaptive coding and problem-solving questions."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y:1.6 }}
                    className='bg-gray-200 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 p-6 gap-4'>
                    <div className='flex flex-col md:flex-row items-start gap-6'>
                      <div className='w-full md:w-1/2 flex justify-center'>
                        <img src={item.image} alt={item.title} className='w-full max-w-[260px] h-auto object-contain' />
                      </div>

                      <div className='w-full md:w-1/2 flex flex-col justify-center gap-4'>
                        <div className='bg-gray-100 text-black w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm'>
                          {item.icon}
                        </div>
                        <h3 className='font-semibold mb-2 text-xl'>{item.title}</h3>
                        <p className='text-gray-500 text-sm leading-relaxed'>{item.desc}</p>
                      </div>
                    </div>

                  </motion.div>))
              }
            </div>
          </div>

        </div>
      </div>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer />
    </div>
  )
}

export default Home

