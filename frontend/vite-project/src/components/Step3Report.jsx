import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "motion/react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Step3Report({ report }) {
    const navigate = useNavigate();

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg">Loading Report...</p>
            </div>
        );
    }

    const {
        finalScore = 0,
        confidence = 0,
        communication = 0,
        correctness = 0,
        questionWiseScore = [],
    } = report;

    const scores = typeof finalScore === 'number' ? finalScore : 0;
    const percentage = Math.min(100, Math.max(0, (scores / 10) * 100));

    const skills = [
        { label: "Confidence", value: confidence },
        { label: "Communication", value: communication },
        { label: "Correctness", value: correctness },
    ];

    let performanceText = "";
    let shortTagLine = "";

    if (scores >= 8) {
        performanceText = "Recruiter Approved 🏆";
        shortTagLine = "At this rate, HR might ask you to interview them instead.";
    } else if (scores >= 5) {
        performanceText = "Almost There 👍";
        shortTagLine = "Your answers had potential... they just needed a little less overthinking.";
    } else {
        performanceText = "Mission Retry 📚";
        shortTagLine = "Don't worry, even Google Chrome crashes sometimes. Try again! 😂";
    }

    const scoreColor = (s) => {
        if (s >= 7) return "text-emerald-600";
        if (s >= 4) return "text-yellow-500";
        return "text-red-500";
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 px-4 sm:px-6 lg:px-10 py-8">
            {/* Top Bar */}
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/history")}
                        className="p-3 rounded-full bg-white shadow hover:shadow-md transition"
                        title="Back to History"
                    >
                        <FaArrowLeft className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Interview Analytics Dashboard</h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">"No interviewers were harmed during this mock interview." 😄</p>
                    </div>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm sm:text-base whitespace-nowrap"
                >
                    Download PDF
                </button>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
                {/* Left Column: Overall & Skills */}
                <div className="space-y-6">
                    {/* Overall Performance Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center border border-gray-100"
                    >
                        <h3 className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base font-medium">Overall Performance</h3>
                        <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto">
                            <CircularProgressbar
                                value={percentage}
                                text={`${scores.toFixed(1)}/10`}
                                styles={buildStyles({
                                    pathColor: scores >= 7 ? "#10b981" : scores >= 4 ? "#eab308" : "#ef4444",
                                    trailColor: "#e5e7eb",
                                    textColor: "#111827",
                                    textSize: "18px",
                                })}
                            />
                        </div>

                        <p className="text-gray-400 mt-3 text-xs sm:text-sm font-medium">Score Out of 10</p>
                        <div className="mt-4">
                            <p className={`font-bold text-base sm:text-lg ${scoreColor(scores)}`}>{performanceText}</p>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-xs mx-auto">{shortTagLine}</p>
                        </div>
                    </motion.div>

                    {/* Skill Evaluation Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100"
                    >
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-6">Skill Evaluation</h3>
                        <div className="space-y-5">
                            {skills.map((s, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2 text-sm sm:text-base font-medium text-gray-700">
                                        <span>{s.label}</span>
                                        <span className={`font-semibold ${scoreColor(s.value)}`}>{s.value?.toFixed(1) ?? '—'}/10</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                s.value >= 7 ? 'bg-emerald-500' : s.value >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${Math.min(100, Math.max(0, (s.value / 10) * 100))}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Question-wise Breakdown */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100"
                    >
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-6">Question-wise Breakdown</h3>
                        {questionWiseScore.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-6">No individual question scores recorded.</p>
                        ) : (
                            <div className="space-y-4">
                                {questionWiseScore.map((q, i) => (
                                    <div
                                        key={i}
                                        className="border border-gray-200 rounded-2xl p-5 bg-gray-50 hover:bg-white transition"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <p className="font-semibold text-gray-800 text-sm sm:text-base flex-1">
                                                <span className="text-emerald-600 font-bold mr-2">Q{i + 1}.</span>
                                                {q.question}
                                            </p>
                                            <span className={`text-lg font-bold whitespace-nowrap ${scoreColor(q.score)}`}>
                                                {q.score}/10
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                            {[
                                                { label: "Confidence", val: q.confidence },
                                                { label: "Communication", val: q.communication },
                                                { label: "Correctness", val: q.correctness },
                                            ].map((m) => (
                                                <div key={m.label} className="bg-white rounded-xl p-2 text-center border border-gray-200">
                                                    <p className={`text-sm sm:text-base font-bold ${scoreColor(m.val)}`}>{m.val ?? "—"}</p>
                                                    <p className="text-xs text-gray-500">{m.label}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {q.feedback && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs sm:text-sm text-blue-700">
                                                💬 <span className="font-semibold">Feedback:</span> {q.feedback}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    onClick={() => navigate("/interview")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-semibold shadow-md transition"
                >
                    🔄 Take Another Interview
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold transition"
                >
                    🏠 Go Home
                </button>
            </div>
        </div>
    );
}

export default Step3Report;