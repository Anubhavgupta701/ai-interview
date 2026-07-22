import React from "react";
import { BsRobot } from "react-icons/bs";

function Footer(){
    return (
        <div className='bg-[#f3f3f3] flex justify-center px-4 pb-10 py-4 '>
            <div className='w-full max-w-6xl bg-gray-100 rounded-[24px] shadow-sm border border-gray-200 py-8 px-3 text-center'>
                <div className='flex items-center justify-center gap-3 mb-3'>
                    <div className='bg-black text-white p-2 rounded-lg'><BsRobot size={18}/></div>
                    <h2 className='font-semibold'>Interviewer.RK</h2>
                </div>
                <p className='text-black txt-sm max-w-xl mx-auto'>
                    Built with  bugs, and a slightly judgmental AI. Interviewer. RK won't hire you—but it'll make sure you're ready when someone else does.
                </p>
            </div>
        </div>
    )
}

export default Footer