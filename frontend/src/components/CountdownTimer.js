import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const getTargetDate = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let targetDate = new Date(currentYear, 9, 31, 23, 59, 59); // Oct 31, 11:59:59 PM
      if (targetDate < now) {
        targetDate.setFullYear(currentYear + 1);
      }
      return targetDate;
    };

    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = getTargetDate().getTime();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days.toString().padStart(2, "0"),
          hours: hours.toString().padStart(2, "0"),
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0"),
        });
      } else {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        .countdown-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .countdown-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .pre-sale-text {
          font-size: 12px;
          font-weight: 600;
          color: #FFD700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .book-release-text {
          font-size: 10px;
          color: #FFFFFF;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .countdown-timer {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .time-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .time-value {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 1px solid #444;
          border-radius: 6px;
          padding: 6px 8px;
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          min-width: 32px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          font-family: 'Courier New', monospace;
        }

        .time-label {
          font-size: 8px;
          color: #FFFFFF;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .time-separator {
          font-size: 16px;
          font-weight: 700;
          color: #FFD700;
          margin: 0 2px;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }

        @media (max-width: 768px) {
          .countdown-container {
            gap: 6px;
          }
          .pre-sale-text {
            font-size: 10px;
          }
          .book-release-text {
            font-size: 8px;
          }
          .time-value {
            font-size: 14px;
            padding: 4px 6px;
            min-width: 28px;
          }
          .time-label {
            font-size: 7px;
          }
          .time-separator {
            font-size: 14px;
          }
          .countdown-timer {
            gap: 6px;
          }
        }

        @media (max-width: 480px) {
          .pre-sale-text {
            font-size: 9px;
          }
          .book-release-text {
            font-size: 7px;
          }
          .time-value {
            font-size: 12px;
            padding: 3px 5px;
            min-width: 24px;
          }
          .time-label {
            font-size: 6px;
          }
          .time-separator {
            font-size: 12px;
          }
          .countdown-timer {
            gap: 4px;
          }
        }
      `}</style>

      <div className="countdown-container">
        <div className="countdown-text">
          <span className="pre-sale-text">Pre-Sale ending soon</span>
          <span className="book-release-text">Book releasing on 31st October</span>
        </div>

        <div className="countdown-timer">
          <div className="time-unit">
            <div className="time-value">{timeLeft.days}</div>
            <div className="time-label">Days</div>
          </div>
          <div className="time-separator">:</div>
          <div className="time-unit">
            <div className="time-value">{timeLeft.hours}</div>
            <div className="time-label">Hours</div>
          </div>
          <div className="time-separator">:</div>
          <div className="time-unit">
            <div className="time-value">{timeLeft.minutes}</div>
            <div className="time-label">Minutes</div>
          </div>
          <div className="time-separator">:</div>
          <div className="time-unit">
            <div className="time-value">{timeLeft.seconds}</div>
            <div className="time-label">Seconds</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CountdownTimer;
