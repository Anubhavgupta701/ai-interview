import React from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer({ timeLeft, totalTime }) {
    const percentage = (timeLeft / totalTime) * 100
    return (
        <div className="w-20 h-20">
            <CircularProgressbar value={percentage}
                text={`${timeLeft}s`}
                styles={buildStyles({
                    pathColor: timeLeft<=10 ? "#ef4444" : "#6366f1",
                    trailColor: "#e5e7eb",
                    textColor: "#111827",
                    textSize: "28px",
                })}
             />
        </div>
    )
}

export default Timer

