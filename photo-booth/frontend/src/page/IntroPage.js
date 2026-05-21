import "../App.css";
import mainIntro from "../assets/main.png";

export default function IntroPage({ onNext }) {
  return (
    <div className="intro-page">
      <div className="intro-wrap">
        <div className="intro-image-box">
          {/* 메인 배경 이미지 */}
          <img
            src={mainIntro}
            alt="SPAM 첫 화면"
            className="intro-main-image"
          />

          {/* 진짜 시작하기 버튼 */}
          <button
            type="button"
            className="intro-start-button"
            onClick={onNext}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}