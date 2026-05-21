import { useState, useEffect } from "react";
import '../App.css';
import shootLight1 from "../assets/조명1.png";
import shootLight2 from "../assets/조명2.png";
import shootCardOnly from "../assets/card.png";
import five from "../assets/5.png";
import four from "../assets/4.png";
import three from "../assets/3.png";
import two from "../assets/2.png";
import one from "../assets/1.png";
import shutterBar from "../assets/shutter_bar.png";

const COUNTDOWN_IMAGES = [five, four, three, two, one];

export default function ShootPage({ onComplete }) {
const [photoIndex, setPhotoIndex] = useState(1);
const [countIndex, setCountIndex] = useState(0);
const [showCountdown, setShowCountdown] = useState(false);
const [hasStarted, setHasStarted] = useState(false);

useEffect(() => {
if (!showCountdown) return;

if (countIndex >= COUNTDOWN_IMAGES.length - 1) {
    const finishTimer = setTimeout(() => {
    setShowCountdown(false);

    if (photoIndex < 4) {
        setPhotoIndex((prev) => prev + 1);
    } else {
        setTimeout(() => {
        onComplete();
        }, 800);
    }
    }, 1000);

    return () => clearTimeout(finishTimer);
}

const nextTimer = setTimeout(() => {
    setCountIndex((prev) => prev + 1);
}, 1000);

return () => clearTimeout(nextTimer);
}, [showCountdown, countIndex, photoIndex, onComplete]);

useEffect(() => {
if (!hasStarted) return;
if (showCountdown) return;
if (photoIndex === 1) return;
if (photoIndex > 4) return;

const autoTimer = setTimeout(() => {
    setCountIndex(0);
    setShowCountdown(true);
}, 1200);

return () => clearTimeout(autoTimer);
}, [photoIndex, hasStarted, showCountdown]);

const startShoot = () => {
if (hasStarted) return;

setHasStarted(true);
setCountIndex(0);
setShowCountdown(true);
};

return (
<div className="shoot-app">
    <div className="shoot-screen">
        <div className="frame-preview-box">
            <div className="frame-slot">
                <img src={shootLight1} alt="" className="shoot-light shoot-light-1" />
                <img src={shootLight2} alt="" className="shoot-light shoot-light-2" />
                <img src={shootCardOnly} alt="" className="shoot-card-image" />

                {showCountdown && (
                    <img
                    src={COUNTDOWN_IMAGES[countIndex]}
                    alt=""
                    className="countdown-image"
                    />
                )}
                </div>
            </div>

            <div className="shoot-control">
                <div className="shoot-count">{photoIndex}/4</div>

                <button
                className="shutter-button-reset"
                onClick={startShoot}
                disabled={hasStarted}
                >
                    <img src={shutterBar} alt="" className="shutter-bar-image"></img>
                </button>
            </div>
        </div>
    </div>
);
}
