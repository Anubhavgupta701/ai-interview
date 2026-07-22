import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import { IoLogoIonitron } from "react-icons/io5";
import { GiOverlordHelm } from "react-icons/gi";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { serverUrl } from "../config.js";
import { useNavigate } from "react-router-dom";


function Auth({ isModel = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      navigate("/");
    }
  }, [userData, navigate]);

 const handleGoogleSignIn = async () => {
  try {
    const response = await signInWithPopup(auth, provider);

    const { displayName: name, email } = response.user;

    const result = await axios.post(
      `${serverUrl}/api/auth/google`,
      { name, email },
      { withCredentials: true }
    );

    dispatch(setUserData(result.data.user));
  } catch (error) {
    console.error("Error signing in with Google:", error);
    dispatch(setUserData(null));
  }
};
  return (
    <div className={isModel ? 'w-full flex justify-center py-6' : 'w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20'}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className='w-full max-w-md bg-white rounded-[36px] shadow-2xl border border-gray-200 p-8'
      >
        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='bg-black text-white p-2 rounded-lg'>
            <IoLogoIonitron size={30} />
          </div>
          <h2 className='text-xl font-semibold'>Interviewer.RK</h2>
        </div>
        <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
          Continue with <span className='bg-green-100 text-green-900 px-3 py-1 rounded-full inline-flex items-center gap-2'>
            <GiOverlordHelm />
            RK Smart Interviewer
          </span>
        </h1>
        <p className='text-center text-sm md:text-base leading-relaxed text-gray-500 mb-8'>
          Sign in to your account to analyze your interview performance and get personalized feedback.
        </p>

        <motion.button
          onClick={handleGoogleSignIn}
          whileHover={{ opacity: 0.9, scale: 1.05 }}
          whileTap={{ opacity: 1, scale: 0.95 }}
          className='w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-full shadow-md'
        >
          <FcGoogle size={25} />
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Auth