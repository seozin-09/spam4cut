// 스타일 시트 및 이미지 에셋 임포트
import "../App.css";

import frame1 from "../assets/frame1.png";
import frame2 from "../assets/frame2.png";
import frame3 from "../assets/frame3.png";
import frame4 from "../assets/frame4.png";
import frame5 from "../assets/frame5.png";
import frame6 from "../assets/frame6.png";

import frameBg from "../assets/frame_bg.png";
import shootButton from "../assets/shoot-button.png";

export default function FramePage({ onNext, selectedFrame, setSelectedFrame }) {
  const frames = [frame1, frame2, frame3, frame4, frame5, frame6];

  return (
    <div className="app">
      <div className="main-card frame-page">
        <h1 className="title">FRAME</h1>

        <div className="frame-stage">
          <img src={frameBg} alt="" className="frame-bg" />

          <div className="frame-overlay">
            <div className="scroll-box">
              {frames.map((frame) => (
                <img
                  key={frame}
                  src={frame}
                  alt=""
                  className={`frame-item ${
                    selectedFrame === frame ? "active" : ""
                  }`}
                  onClick={() => setSelectedFrame(frame)}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="next-button image-next-button"
          onClick={() => {
            if (!selectedFrame) {
              alert("프레임을 선택하세요");
              return;
            }

            onNext();
          }}
        >
          <img src={shootButton} alt="촬영하기" />
        </button>
      </div>
    </div>
  );
}