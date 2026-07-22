import React, { useState } from "react"; 
import { useSelector, useDispatch } from "react-redux";
import {BsRobot,BsCoin} from "react-icons/bs";
import {HiOutlineLogout} from "react-icons/hi";
import {FaUserAstronaut} from "react-icons/fa";
import {motion} from  "motion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../config.js";
import AuthModel from "./AuthModel.jsx";
import { setUserData } from "../redux/userSlice.js";




function Navbar(){
    const {userData}=useSelector((state)=>state.user)
    const [showCreditPopup,setShowCreditPopup]=React.useState(false)
    const [showUserPopup,setShowUserPopup]=React.useState(false)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const [showAuth,setShowAuth]=useState(false)

    const handleLogout=async()=>{
        try{
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setShowUserPopup(false)
            setShowCreditPopup(false)
            navigate("/auth")
        } catch (error) {
            console.error("Error logging out:", error)
        }
    }
  return (
    <div className='bg-blue flex justify-center px-4 pt-6'>
        <motion.div 
        initial={{opacity:0,y:-40}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.3}}
        className='w-full max-w-4xl bg-black h-15 rounded-[29px] shadow-sm border-gray-200 px-8 py-4 flex justify-between items-center relative'>
            <div className='flex items-center gap-3 cursor-pointer'>
                <div className='bg-black text-white p-2 rounded-lg'>
                    <BsRobot size={25}/>

                </div>
                <h1 className='font-bold text-white hidden md:block text-xl'>Interviewer.Rk</h1>
                
            </div>

            
            <div className='flex items-center gap-6 relative'>
                <div className='relative'>
                    <button onClick={()=>{
                        if(!userData){
                            setShowAuth(true)
                            return
                        }
                        
                        setShowCreditPopup(!showCreditPopup); setShowUserPopup(false)}} className='bg-white text-black px-4 py-2 rounded-full flex items-center gap-2 bg-gray-100 text-md hover:bg-gray-200 transition'>
                        <BsCoin size={20} />
                       {userData?.credits || 0}
                    </button>

                    {showCreditPopup && (
                        <div className='absolute right-[-50px] mt-3 w-64 bg-white shadow-lg rounded-lg border border-gray-200  p-5  z-50'>
                            <p className='text-sm text-gray-600 mb-4'>Need more credits to continue interview?</p>
                            <button onClick={()=>navigate("/pricing")} className='w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition'>Buy Credits</button>

                        </div>)}
                </div>
             <div>
                     <div className='relative'>
                    <button
                    onClick={()=>{
                        if(!userData){
                            setShowAuth(true)
                            return
                        }
                        setShowUserPopup(!showUserPopup); setShowCreditPopup(false)}}
                    className='w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-semibold'>
                        {userData ? ((userData?.name || userData?.username || "U").slice(0, 1).toUpperCase()) : <FaUserAstronaut size={20}/>}
                    </button>
                    {showUserPopup && (
                        <div className='absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-xl border border-gray-200  p-5  z-50'>
                            <p className='text-md text-blue-500 font-medium mb-1'>{userData?.name || userData?.username || "User"}</p>
                            <button onClick={()=>navigate("/history")} className='w-full text-left text-sm bg-black text-white py-2 rounded-full hover:bg-gray-800 transition'>Interview History</button>
                            <button onClick={handleLogout} className='w-full text-left text-sm py-2 flex items-center gap-2 text-red-500 hover:bg-gray-200 transition'>
                                <HiOutlineLogout size={20}/>
                                Logout</button>
                        </div>
                    )}
                </div>
            </div>
            </div>
           



        </motion.div>
         {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}

    </div>
  )
}

export default Navbar