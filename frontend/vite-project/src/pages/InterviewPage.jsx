import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Step1Setup from '../components/Step1Setup';
import Step2Interview from '../components/Step2Interview';
import Step3Report from '../components/Step3Report';

const InterviewPage = () => {
    const [step, setStep] = useState(1);
    const [interviewData, setInterviewData] = useState(null);
    const { userData, loading } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Redirect to auth only after loading is complete and user is null
    useEffect(() => {
        if (!loading && userData === null) {
            navigate('/auth');
        }
    }, [userData, loading, navigate]);

    // Show spinner while auth state is being resolved
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin'></div>
                    <p className='text-gray-500 text-sm'>Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!userData) return null;

    return (
        <div className='min-h-screen bg-gray-50'>
            {step === 1 && (
                <Step1Setup onStart={(data) => {
                    setInterviewData(data);
                    setStep(2)
                }} />
            )}
            {step === 2 && (
                <Step2Interview interviewData={interviewData}
                    onFinish={(report) => {
                        setInterviewData(report);
                        setStep(3)
                    }} />
            )}
            {step === 3 && (
                <Step3Report report={interviewData} />
            )}
        </div>
    );
};

export default InterviewPage;
