import React from "react";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {FaTimes} from "react-icons/fa";
import Auth from "../pages/Auth";

function AuthModel({onClose}) {
  const {userData}=useSelector((state)=>state.user);
  useEffect(()=>{
    if(userData){
        onClose();
    }
    },[userData,onClose])
    return(
        <div className='fixed inset-0 min-h-screen bg-black/30 backdrop-blur-sm px-4 py-8 flex items-center justify-center z-[999]'>
            <div className='relative w-full max-w-md mx-auto'>  
                <button onClick={onClose} className='absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-md text-gray-800 hover:text-gray-700 text-xl' >
                    <FaTimes  size={20}/>
                </button>
                <Auth isModel={true}/>

            </div>
        </div>

    )}

export default AuthModel