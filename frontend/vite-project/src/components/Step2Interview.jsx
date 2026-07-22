import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import maleVideo from "../assets/videos/malevideo.mp4";
import Timer from "./Timer";
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { serverUrl } from '../config';

function Step2Interview({ interviewData, onFinish }) {
    const { interviewId, questions, userName } = interviewData;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isIntroPhase, setIsIntroPhase] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState('');
    const [isAiPlaying, setIsAiPlaying] = useState(false);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [finishing, setFinishing] = useState(false);
    const [voiceGender] = useState('male');
    const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

    const isMicOnRef = useRef(true);
    const isListeningRef = useRef(false);
    const isAiPlayingRef = useRef(false);
    const recognitionRef = useRef(null);
    const finalTranscriptRef = useRef('');   // text confirmed across ALL sessions for this question
    const sessionFinalRef = useRef('');       // text confirmed in the CURRENT session only
    const answerRef = useRef('');             // always mirrors answer state
    const baseForSessionRef = useRef('');     // answer value at the time this session started
    const videoRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const selectedVoiceRef = useRef(null);

    useEffect(() => { isMicOnRef.current = isMicOn; }, [isMicOn]);
    useEffect(() => { isAiPlayingRef.current = isAiPlaying; }, [isAiPlaying]);
    useEffect(() => { selectedVoiceRef.current = selectedVoice; }, [selectedVoice]);

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;

    const stopMic = useCallback(() => {
        if (!recognitionRef.current) return;
        try { recognitionRef.current.stop(); } catch (_) {}
        isListeningRef.current = false;
        setIsListening(false);
    }, []);

    const startMic = useCallback(() => {
        const rec = recognitionRef.current;
        if (!rec) return;
        if (isAiPlayingRef.current) return;
        if (!isMicOnRef.current) return;
        if (isListeningRef.current) return;
        try {
            rec.start();
        } catch (err) {
            if (err.name !== 'InvalidStateError') {
                console.error('startMic error:', err);
            }
        }
    }, []);

    // Helper to deduplicate repeating trailing words/phrases from speech recognition
    const appendDeduplicated = (existing, addition) => {
        const e = (existing || '').trim();
        const a = (addition || '').trim();
        if (!a) return e;
        if (!e) return a;

        if (e.toLowerCase().endsWith(a.toLowerCase())) {
            return e;
        }

        const eWords = e.split(/\s+/);
        const aWords = a.split(/\s+/);

        let overlap = 0;
        const maxCheck = Math.min(eWords.length, aWords.length);
        for (let len = maxCheck; len > 0; len--) {
            const eTail = eWords.slice(-len).join(' ').toLowerCase();
            const aHead = aWords.slice(0, len).join(' ').toLowerCase();
            if (eTail === aHead) {
                overlap = len;
                break;
            }
        }

        if (overlap > 0) {
            const nonOverlappingAddition = aWords.slice(overlap).join(' ');
            return nonOverlappingAddition ? `${e} ${nonOverlappingAddition}` : e;
        }

        return `${e} ${a}`;
    };

    // Dynamically find the best male voice
    const getBestMaleVoice = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return null;
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;

        const explicitMale = voices.find(v =>
            /\b(david|mark|george|james|richard|guy|stefan|daniel|alex|fred|male)\b/i.test(v.name) ||
            /microsoft.*(david|mark|george|male)/i.test(v.name) ||
            /google.*male/i.test(v.name)
        );
        if (explicitMale) return explicitMale;

        const nonFemaleEn = voices.find(v =>
            v.lang.startsWith('en') &&
            !/zira|sara|hazel|helen|victoria|karen|samantha|catherine|lisa|eva|fiona|female|google us english/i.test(v.name)
        );
        return nonFemaleEn || voices.find(v => !/zira|sara|hazel|female|samantha/i.test(v.name)) || voices[0];
    };

    useEffect(() => {
        const load = () => {
            if (window.speechSynthesis) {
                const maleVoice = getBestMaleVoice();
                setSelectedVoice(maleVoice?.name || 'default');
                selectedVoiceRef.current = maleVoice;
            }
        };
        load();
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = load;
        }
    }, []);

    // Only maleVideo is imported; use it as fallback for both genders
    const videoSource = maleVideo;

    //speak function
    const speakText = useCallback((text) => {
        return new Promise((resolve) => {
            if (!window.speechSynthesis) { resolve(); return; }
            try { window.speechSynthesis.cancel(); } catch (_) {}

            isAiPlayingRef.current = true;
            setIsAiPlaying(true);
            stopMic();

            const utterance = new SpeechSynthesisUtterance(
                text.replace(/,/g, ', ').replace(/\./g, '. ')
            );

            const maleVoice = getBestMaleVoice();
            if (maleVoice) {
                utterance.voice = maleVoice;
            }

            utterance.rate = 0.78; // Measured, steady, confident heavy pace
            utterance.pitch = 0.5; // Deep, bass-heavy sigma masculine voice
            utterance.volume = 1;

            let settled = false;
            const done = () => {
                if (settled) return;
                settled = true;
                isAiPlayingRef.current = false;
                setIsAiPlaying(false);
                if (isMicOnRef.current) startMic();
                resolve();
            };

            const tid = setTimeout(done, Math.max(8000, text.length * 120));

            utterance.onstart = () => { videoRef.current?.play().catch(() => {}); };
            utterance.onend = () => {
                clearTimeout(tid);
                if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
                startTimeRef.current = Date.now();
                // Wait 1200ms for speaker audio to dissipate before opening mic
                setTimeout(done, 1200);
            };
            utterance.onerror = () => { clearTimeout(tid); done(); };

            window.speechSynthesis.speak(utterance);
        });
    }, [stopMic, startMic]);

    useEffect(() => {
        if (isIntroPhase || currentQuestion) {
            let cancelled = false;
            const run = async () => {
                if (isIntroPhase) {
                    await speakText(`Hi ${userName || 'Candidate'}, great to meet you! Let us start the interview.`);
                    await speakText("I will ask you a few questions. Just answer naturally when you are ready.");
                    if (!cancelled) setIsIntroPhase(false);
                } else if (currentQuestion) {
                    await new Promise(r => setTimeout(r, 400));
                    if (!cancelled) await speakText(currentQuestion.question);
                    if (!cancelled && isMicOnRef.current) startMic();
                }
            };
            run();
            return () => { cancelled = true; };
        }
    }, [isIntroPhase, currentIndex, speakText, startMic, currentQuestion, userName]);

    useEffect(() => {
        const limit = questions[currentIndex]?.timeLimit || 60;
        setTimeLeft(limit);
        setAnswer('');
        answerRef.current = '';
        baseForSessionRef.current = '';
        setFeedback('');
        setAnswered(false);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            if (isAiPlayingRef.current) return;
            setTimeLeft(prev => {
                if (prev <= 1) { clearInterval(timerRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [currentIndex, questions]);

    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            setMicError('Speech Recognition is not supported. Please use Google Chrome or Edge.');
            return;
        }

        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        rec.maxAlternatives = 1;

        rec.onstart = () => {
            baseForSessionRef.current = answerRef.current.trim();
            isListeningRef.current = true;
            setIsListening(true);
            setMicError('');
        };

        rec.onresult = (event) => {
            let sessionFinals = '';
            let interim = '';

            for (let i = 0; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    sessionFinals = appendDeduplicated(sessionFinals, t);
                } else {
                    interim = t.trim();
                }
            }

            const currentBase = baseForSessionRef.current ? baseForSessionRef.current.trim() : '';
            const confirmedText = appendDeduplicated(currentBase, sessionFinals);

            const display = interim
                ? (confirmedText ? `${confirmedText} ${interim}` : interim)
                : confirmedText;

            answerRef.current = display;
            setAnswer(display);
        };

        rec.onend = () => {
            isListeningRef.current = false;
            setIsListening(false);

            if (answerRef.current) {
                baseForSessionRef.current = answerRef.current.trim();
            }

            if (isMicOnRef.current && !isAiPlayingRef.current) {
                setTimeout(() => {
                    if (isMicOnRef.current && !isAiPlayingRef.current && !isListeningRef.current) {
                        try { rec.start(); } catch (_) {}
                    }
                }, 600);
            }
        };

        rec.onerror = (e) => {
            if (e.error === 'no-speech' || e.error === 'aborted') return;
            isListeningRef.current = false;
            setIsListening(false);
            if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
                setMicError('Microphone permission denied. Allow mic in your browser and click Retry.');
            } else if (e.error === 'network') {
                setMicError('Network error with speech service. Check your internet connection.');
            } else {
                console.warn('Speech recognition error:', e.error);
            }
        };

        recognitionRef.current = rec;

        const kickoff = setTimeout(() => {
            if (isMicOnRef.current && !isAiPlayingRef.current) startMic();
        }, 1000);

        return () => {
            clearTimeout(kickoff);
            rec.onstart = null;
            rec.onresult = null;
            rec.onend = null;
            rec.onerror = null;
            try { rec.stop(); } catch (_) {}
            recognitionRef.current = null;
            isListeningRef.current = false;
            setIsListening(false);
        };
    }, [startMic]);

    const toggleMic = useCallback(() => {
        if (isMicOnRef.current) {
            isMicOnRef.current = false;
            setIsMicOn(false);
            stopMic();
        } else {
            isMicOnRef.current = true;
            setIsMicOn(true);
            setMicError('');
            navigator.mediaDevices?.getUserMedia({ audio: true })
                .then(stream => { stream.getTracks().forEach(t => t.stop()); startMic(); })
                .catch(() => {
                    setMicError('Microphone access denied. Please allow it in your browser settings.');
                    isMicOnRef.current = false;
                    setIsMicOn(false);
                });
        }
    }, [stopMic, startMic]);

    const handleSubmitAnswer = async () => {
        if (loading || answered) return;
        clearInterval(timerRef.current);
        const taken = Math.round((Date.now() - startTimeRef.current) / 1000);
        setLoading(true);
        stopMic();
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
            if (result.data.feedback) speakText(result.data.feedback);
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to submit answer.');
            setAnswered(true);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            finalTranscriptRef.current = '';
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleFinish = async () => {
        if (!answered) await handleSubmitAnswer();
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

                <div className='w-full lg:w-[30%] bg-gradient-to-b from-emerald-50 to-teal-200 p-6 flex flex-col items-center space-y-6 border-r border-gray-200 justify-center'>
                    <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
                        <video src={maleVideo} ref={videoRef} muted playsInline preload='auto' className='w-full h-[200px] object-cover' />
                    </div>
                    <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
                        <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-500'>Interview Status</span>
                            <span className='text-gray-700 text-sm font-semibold'>{userName || 'Candidate'}</span>
                        </div>
                        <div className='h-px bg-gray-200' />
                        <div className='flex justify-center'>
                            <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60} />
                        </div>
                        <div className='h-px bg-gray-200' />
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

                <div className='flex-1 flex flex-col p-4 sm:p-8 md:p-6'>
                    <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>AI Smart Interview</h2>

                    <div className='relative mb-4 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
                        <div className='flex justify-between items-center mb-2'>
                            <p className='text-gray-500 text-sm'>Question {currentIndex + 1} of {totalQuestions}</p>
                            {currentQuestion?.question && (
                                <button
                                    type='button'
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

                    <div className='flex items-center justify-between mb-2 px-1'>
                        <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Your Answer</span>
                        <div>
                            {isListening ? (
                                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 animate-pulse'>
                                    <span className='w-2 h-2 rounded-full bg-red-500 inline-block' />
                                    🎙️ Listening... speak now
                                </span>
                            ) : isAiPlaying ? (
                                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                                    🤖 AI speaking... mic paused
                                </span>
                            ) : isMicOn ? (
                                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700'>
                                    🎤 Mic on - waiting...
                                </span>
                            ) : (
                                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600'>
                                    🔇 Mic muted
                                </span>
                            )}
                        </div>
                    </div>

                    {micError && (
                        <div className='mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center justify-between'>
                            <span>⚠️ {micError}</span>
                            <button
                                type='button'
                                onClick={() => { setMicError(''); toggleMic(); }}
                                className='ml-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer'
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    <textarea
                        value={answer}
                        onChange={(e) => {
                            const v = e.target.value;
                            setAnswer(v);
                            answerRef.current = v;
                            baseForSessionRef.current = v; // keep base in sync with manual edits
                            sessionFinalRef.current = '';  // manual edit invalidates session accumulation
                        }}
                        disabled={answered}
                        placeholder='Type or speak your answer here...'
                        className='flex-1 min-h-[180px] bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-300 focus:ring-emerald-500 transition text-gray-800 focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed'
                    />

                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium'
                        >
                            💬 <span className='font-semibold'>Feedback:</span> {feedback}
                        </motion.div>
                    )}

                    <div className='flex items-center gap-4 mt-6'>
                        <motion.button
                            type='button'
                            onClick={toggleMic}
                            whileTap={{ scale: 0.9 }}
                            className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center rounded-full text-white shadow-lg transition-all ${
                                isMicOn ? 'bg-red-600 hover:bg-red-500 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'
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
                                    {finishing ? 'Finishing...' : 'Finish Interview'}
                                </motion.button>
                            )
                        )}

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
