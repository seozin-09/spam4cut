import '../App.css';
import tutorialStrip from "../assets/tutorial_strip.png";
import blackBar from "../assets/blackbar.png";
import peopleIcon from "../assets/people_icon.png";

export default function TutorialPage({ onNext }) {
    return (
    <div className="app">
        <div className="main-card">
        <h1 className="title">HOW TO USE</h1>

        <div className="content-row">
            <div className="image-area">
                <div className="frame">
                    <img src={tutorialStrip} alt="" className="tutorial-image" />
                    <img src={blackBar} alt="" className="bottom-bar" />
                    <img src={peopleIcon} alt="" className="people-icon" />
                </div>
            </div>

                <div className="text-area">
                    <p>• 촬영 전 마음에 드는 프레임을 골라 주세요.</p>
                    <p>
                        • 5초에 한 번씩 네 번의 사진이 촬영됩니다.
                        <br />
                        시간에 맞추어 포즈를 취해 주세요!
                    </p>
                    <p>
                        • 완성된 스팸네컷을 출력 하거나 다운로드하여
                        <br />
                        간직하세요.
                    </p>
                </div>
            </div>

                <button className="next-button" onClick={onNext}>
                    다음
                </button>
            </div>
        </div>
    );
}