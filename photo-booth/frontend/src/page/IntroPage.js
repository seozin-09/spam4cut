import "../App.css";

import square from "../assets/square.png";
import triangle from "../assets/triangle.png";
import circle from "../assets/circle.png";
import introFrame from "../assets/intro-frame.png";
import spam from "../assets/spam.png";
import startButton from "../assets/start-button.png";

export default function IntroPage({ onNext }) {
  return (
    <div className="intro-page">
      <div className="intro-wrap">
        <div className="intro-image-box">

          {/* 위 아이콘 */}
          <img src={square} alt="" className="intro-square" />
          <img src={triangle} alt="" className="intro-triangle" />
          <img src={circle} alt="" className="intro-circle" />

          {/* 메인 틀 */}
          <img
            src={introFrame}
            alt=""
            className="intro-frame-image"
          />

          {/* SPAM 로고 */}
          <img
            src={spam}
            alt=""
            className="spam-logo-image"
          />

          {/* 시작하기 버튼 */}
          <button
            type="button"
            className="intro-start-button"
            onClick={onNext}
          >
            <img src={startButton} alt="시작하기" />
          </button>

        </div>
      </div>
    </div>
  );
}