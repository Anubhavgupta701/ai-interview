import React, {useState, useEffect } from "react";
import axios from "axios";
import {serverUrl} from '../config.js'
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


function InterviewHistory(){
    const [interviews, setInterviews] = useState([]);
const navigate= useNavigate();
    useEffect(()=>{
        const getMyInterviews = async()=>{
            try{
                const result = await axios.get(`${serverUrl}/api/interview/get-interview`, { withCredentials: true })
                setInterviews(result.data)
            }catch(error){
                console.error("Error fetching interviews",error)
            }
        }
        getMyInterviews()
    },[])

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-500 py-10">
            <div className="w-[90vw] mx-auto bg-white rounded-2xl shadow-lg p-6">
                <div className="mb-10 w-full flex items-start gap-4 flex-wrap">
                    <button onClick={()=>{navigate("/");}}    
                    className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition"><FaArrowLeft className="text-gray-600"/></button>

                    <div>
                        <h1 className="text-3xl font-bold flex-nowrap text-gray-800">Interview History</h1>
                        <p className="text-gray-600 mt-2">"Every interview survived deserves a place in history." 😂</p>

                    </div>
                </div>

                {interviews.length ===0 ?
                <div className="bg-gray-100 p-10 rounded-2xl shadow text-center">
                    <p className="text-gray-500">
                        Every expert was once a beginner. Start your first interview today
                    </p>
                    </div>
                    :
                    <div className="grid gap-6">
                        {interviews.map((item,index)=>(
                            <div key={index} onClick={()=>navigate(`/report/${item._id}`)} className="bg-green-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100" >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{item.role}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{item.description} {item.mode}</p>
                                        <p className="text-sm text-gray-400 mt-2">{new Date(item.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-gray-400 font-bold text-sm">{item.finalScore || 0}/10</p>


                                            <p className="text-xl font-semibold" >Overall Score</p>
                                        </div>

                                        {/*status badge*/}
                                        <span
                                        className={`px-4 py-1 rounded-full text-xs font-medium ${item.status === "completed" ?"bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{item.status} </span>


                                    </div>

                                </div>
                            </div>
                        ))}
                        
                    </div>
                }
                
            </div>
           
        </div>
    )
}

export default InterviewHistory;