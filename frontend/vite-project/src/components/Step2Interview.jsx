import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import maleVideo from "../assets/videos/malevideo.mp4";
import Timer from "./Timer";
import { FaMicrophone , FaMicrophoneSlash } from 'react-icons/fa';
import { serverUrl } from '../config';

function Step2Interview({ interviewData, onFinish }) {
    const { interviewId, questions, userName } = interviewData;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isIntroPhase, setIsIntroPhase] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const isMicOnRef = useRef(true);
    useEffect(() => { isMicOnRef.current = isMicOn; }, [isMicOn]);
    const recognitionRef = useRef(null);
    const [isAiPlaying, setIsAiPlaying] = useState(false);
    // keep ref in sync so timer interval always reads the latest value
    useEffect(() => { isAiPlayingRef.current = isAiPlaying; }, [isAiPlaying]);
    const [answer, setAnswer] = useState('');
    const answerRef = useRef('');
    useEffect(() => { answerRef.current = answer; }, [answer]);
    const baseAnswerRef = useRef('');
    const [feedback, setFeedback] = useState('');
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [finishing, setFinishing] = useState(false);
    const [timeTaken, setTimeTaken] = useState(0);
    const [voiceGender, setVoiceGender] = useState("male");
    const [subtitle, setSubtitle] = useState("");
    const videoRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const isAiPlayingRef = useRef(false); // ref so setInterval can read live value
    const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;

    useEffect(() => {
        const loadVoices = () => {
            const voices = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis.getVoices() : [];
            
            const maleVoice = voices.find(v =>
                v.name.toLowerCase().includes('male') ||
                v.name.toLowerCase().includes('david') ||
                v.name.toLowerCase().includes('mark') ||
                v.name.toLowerCase().includes('google us english')
            );

            const femaleVoice = voices.find(v =>
                v.name.toLowerCase().includes('female') ||
                v.name.toLowerCase().includes('zira') ||
                v.name.toLowerCase().includes('sara') ||
                v.name.toLowerCase().includes('google uk english')
            );

            setSelectedVoice({
                male: maleVoice?.name || voices[0]?.name || 'default',
                female: femaleVoice?.name || voices[0]?.name || 'default'
            });
            setVoiceGender('male');
        };
        loadVoices();
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // Only maleVideo is imported; use it as fallback for both genders
    const videoSource = maleVideo;

    //speak function
    const speakText = (text) => {
        return new Promise((resolve) => {
            if (typeof window === 'undefined' || !window.speechSynthesis) {
                resolve();
                return;
            }

            try {
                window.speechSynthesis.cancel();
                window.speechSynthesis.resume();
            } catch (_) {}

            const humanText = text.replace(/,/g, ", ").replace(/\./g, ". ");
            const utterance = new SpeechSynthesisUtterance(humanText);

            if (selectedVoice) {
                const voiceName = voiceGender === 'male' ? selectedVoice.male : selectedVoice.female;
                const voices = window.speechSynthesis.getVoices();
                const foundVoice = voices.find(v => v.name === voiceName);
                if (foundVoice) {
                    utterance.voice = foundVoice;
                }
            }

            utterance.rate = 0.85;
            utterance.pitch = 0.9;
            utterance.volume = 1;

            let hasResolved = false;
            const safeResolve = () => {
                if (!hasResolved) {
                    hasResolved = true;
                    setSubtitle("");
                    resolve();
                }
            };

            const timeoutId = setTimeout(() => {
                isAiPlayingRef.current = false;
                setIsAiPlaying(false);
                if (isMicOnRef.current) startMic();
                safeResolve();
            }, Math.max(7000, text.length * 130));

            utterance.onstart = () => {
                isAiPlayingRef.current = true;
                setIsAiPlaying(true);
                stopMic();
                videoRef.current?.play().catch(() => {});
            };

            utterance.onend = () => {
                clearTimeout(timeoutId);
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                }
                isAiPlayingRef.current = false;
                setIsAiPlaying(false);

                if (isMicOnRef.current) startMic();
                startTimeRef.current = Date.now();
                setTimeout(safeResolve, 200);
            };

            utterance.onerror = (err) => {
                clearTimeout(timeoutId);
                isAiPlayingRef.current = false;
                setIsAiPlaying(false);
                if (isMicOnRef.current) startMic();
                safeResolve();
            };

            setSubtitle(text);
            window.speechSynthesis.speak(utterance);
        });
    };

        useEffect(()=>{
            if(!selectedVoice){ return;}

            const runIntro=async()=>{
                if(isIntroPhase){

                    await speakText(`hi ${userName} , its great to meet you today i hope u are ready so lets start the interview `);

                     await speakText(" i will ask you a few questions. just answer naturally and take a deep breath lets begin");
                setIsIntroPhase(false)
                }
                else if(currentQuestion && isMicOn){
                  await new Promise((r)=>setTimeout(r,800));
                  if(currentIndex=== totalQuestions-1){
                    await speakText(`Alright this might be a little bit challenging but i know u can do it   ${currentQuestion.question}`);
                  }
                  else{
                    await speakText(`${currentQuestion.question}`);
                  }
                  if (isMicOnRef.current) startMic();
                }

               
            }

            runIntro();
        },[selectedVoice, isIntroPhase , currentIndex])

    // Reset timer when question changes — pauses while AI is speaking
    useEffect(() => {
        const limit = questions[currentIndex]?.timeLimit || 60;
        setTimeLeft(limit);
        setAnswer('');
        answerRef.current = '';
        baseAnswerRef.current = '';
        setFeedback('');
        setAnswered(false);

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            // Don't count down while AI is speaking intro or question
            if (isAiPlayingRef.current) return;

            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentIndex]);

    // mic to text
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                setAnswer(prev => {
                    const newBase = prev ? (prev.trim() + ' ' + finalTranscript.trim()) : finalTranscript.trim();
                    baseAnswerRef.current = newBase;
                    return newBase;
                });
            } else if (interimTranscript) {
                const base = baseAnswerRef.current ? baseAnswerRef.current.trim() : '';
                setAnswer(base ? (base + ' ' + interimTranscript.trim()) : interimTranscript.trim());
            }
        };

        // Auto-restart on silence if mic is enabled and AI isn't speaking
        recognition.onend = () => {
            if (isMicOnRef.current && !isAiPlayingRef.current && recognitionRef.current) {
                try { recognitionRef.current.start(); } catch (_) {}
            }
        };

        recognition.onerror = (e) => {
            if (e.error === 'aborted' || e.error === 'no-speech') return;
            console.error('Speech recognition error:', e.error);
        };

        recognitionRef.current = recognition;
        if (isMicOnRef.current && !isAiPlayingRef.current) {
            try { recognition.start(); } catch (_) {}
        }
    }, []);

    const startMic = () => {
        if (!recognitionRef.current || isAiPlayingRef.current) return;
        try {
            recognitionRef.current.start();
        } catch (error) {
            // Already started
        }
    };

    const stopMic = () => {
        if (!recognitionRef.current && !isAiPlaying) return;
        try {
            recognitionRef.current.stop();
        } catch (error) {
            // Already stopped
        }
    };

    const toggleMic = () => {
        if (isMicOnRef.current) {
            setIsMicOn(false);
            isMicOnRef.current = false;
            stopMic();
        } else {
            setIsMicOn(true);
            isMicOnRef.current = true;
            startMic();
        }
    };

    const handleSubmitAnswer = async () => {
        if (loading || answered) return;
        clearInterval(timerRef.current);
        setIsSubmitting(true);
        const taken = Math.round((Date.now() - startTimeRef.current) / 1000);
        setTimeTaken(taken);
        setLoading(true);

        try {
            const apiUrl = serverUrl ? `${serverUrl}/api/interview/submit-answer` : '/api/interview/submit-answer';
            const result = await axios.post(apiUrl, {
                interviewId,
                questionIndex: currentIndex,
                answer: answer.trim(),
                timeTaken: taken,
            }, { withCredentials: true });

            setFeedback(result.data.feedback || 'Answer submitted!');
            setAnswered(true);
            if (result.data.feedback) {
                speakText(result.data.feedback);
            }
            setIsSubmitting(false);
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to submit answer.');
            setAnswered(true);
            setIsSubmitting(false);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleFinish = async () => {
        // Auto-submit current answer if not yet answered
        if (!answered) {
            await handleSubmitAnswer();
        }
        setFinishing(true);
        try {
            const apiUrl = serverUrl ? `${serverUrl}/api/interview/finish` : '/api/interview/finish';
            const result = await axios.post(apiUrl, { interviewId }, { withCredentials: true });
            onFinish(result.data);
        } catch (error) {
            console.error('Failed to finish interview:', error);
            setFinishing(false);
        }
    };

    const isLastQuestion = currentIndex === totalQuestions - 1;

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
            <div className='w-full max-w-7xl min-h-[40vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

                {/* Left Panel */}
                <div className='w-full lg:w-[30%] bg-gradient-to-b from-emerald-50 to-teal-200 p-6 flex flex-col items-center space-y-6 border-r border-gray-200 justify-center'>
                    <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
                        <video src={videoSource}
                        key={videoSource}
                        ref={videoRef}
                            muted playsInline preload='auto' className='w-full h-[200px] object-cover' />
                    </div>

                    {/* Status Panel */}
                    <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
                        <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-500'>Interview Status</span>
                            <span className='text-gray-700 text-sm font-semibold'>
                                {userName || 'Candidate'}
                            </span>
                        </div>

                        <div className='h-px bg-gray-200'></div>

                        <div className='flex justify-center'>
                            <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60} />
                        </div>

                        <div className='h-px bg-gray-200'></div>

                        <div className='grid grid-cols-2 gap-6 text-center'>
                            <div className='flex flex-col'>
                                <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>
                                <span className='text-xs text-gray-500 mt-1'>Current Question</span>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-2xl font-bold text-gray-400'>{totalQuestions}</span>
                                <span className='text-xs text-gray-500 mt-1'>Total Questions</span>
                            </div>
                        </div>

                        {/* Difficulty Badge */}
                        <div className='flex justify-center'>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                currentQuestion?.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                currentQuestion?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {currentQuestion?.difficulty?.toUpperCase() || 'MEDIUM'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className='flex-1 flex flex-col p-4 sm:p-8 md:p-6'>
                    <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>AI Smart Interview</h2>

                    {/* Question Box */}
                    <div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
                        <div className='flex justify-between items-center mb-2'>
                            <p className='text-gray-500 text-sm'>
                                Question {currentIndex + 1} of {totalQuestions}
                            </p>
                            {currentQuestion?.question && (
                                <button
                                    type="button"
                                    onClick={() => speakText(currentQuestion.question)}
                                    className='text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full font-medium transition flex items-center gap-1 cursor-pointer'
                                >
                                    🔊 Read Aloud
                                </button>
                            )}
                        </div>
                        <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed'>
                            {currentQuestion?.question || 'Loading question...'}
                        </div>
                    </div>

                    {/* subtitle */}

                    {subtitle && (
                        <div className='w-full max-w-md shadow-sm bg-gray-100 p-4 sm:p-6 mb-6 rounded-xl border border-gray-200'>
                            
                            <p className='text-gray-800 text-sm sm:text-base font-medium '>{subtitle}</p>
                        </div> 
                        
                    )} 

                    {/* Answer Box */}
                    <textarea
                        value={answer}
                        onChange={(e) => {
                            setAnswer(e.target.value);
                            baseAnswerRef.current = e.target.value;
                        }}
                        disabled={answered}
                        placeholder="Type or speak your answer here..."
                        className='flex-1 min-h-[180px] bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-300 focus:ring-emerald-500 transition text-gray-800 focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed'
                    />





                    {/* Feedback */}
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium'
                        >
                            💬 <span className='font-semibold'>Feedback:</span> {feedback}
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className='flex items-center gap-4 mt-6'>
                        {/* Mic button aligned with action buttons */}
                        <motion.button
                            type="button"
                            onClick={toggleMic}
                            whileTap={{ scale: 0.9 }}
                            className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center rounded-full text-white shadow-lg transition-all ${
                                isMicOn ? 'bg-red-600 hover:bg-red-500 animate-pulse' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                        >
                            {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
                        </motion.button>

                        {!answered ? (
                            <motion.button
                                onClick={handleSubmitAnswer}
                                disabled={loading || !answer.trim()}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className='flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-400 text-white py-3 rounded-full font-semibold transition shadow-md'
                            >
                                {loading ? 'Evaluating...' : 'Submit Answer'}
                            </motion.button>
                        ) : (
                            !isLastQuestion ? (
                                <motion.button
                                    onClick={handleNext}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className='flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-full font-semibold transition shadow-md'
                                >
                                    Next Question →
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={handleFinish}
                                    disabled={finishing}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className='flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-400 text-white py-3 rounded-full font-semibold transition shadow-md'
                                >
                                    {finishing ? 'Finishing...' : '🏁 Finish Interview'}
                                </motion.button>
                            )
                        )}

                        

                        {/* Skip / Finish early */}
                        {isLastQuestion && answered && null}
                        {!isLastQuestion && answered && (
                            <motion.button
                                onClick={handleFinish}
                                disabled={finishing}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className='px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-full font-medium transition'
                            >
                                {finishing ? '...' : 'End Early'}
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Step2Interview;