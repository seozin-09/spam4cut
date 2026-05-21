// 스타일 시트 및 이미지 에셋 임포트
import '../App.css'; // 전역 스타일 파일 로드
// 사진 프레임으로 사용할 이미지들을 각각 불러옵니다.
import frame1 from "../assets/frame1.png"; 
import frame2 from "../assets/frame2.png";
import frame3 from "../assets/frame3.png";
import frame4 from "../assets/frame4.png";
import frame5 from "../assets/frame5.png";
import frame6 from "../assets/frame6.png";
// 프레임 선택 영역의 배경이 되는 이미지
import frameBg from "../assets/frame_bg.png";

/**
 * FramePage 컴포넌트
 * @param {Function} onNext - 다음 페이지(촬영)로 넘어가는 함수
 * @param {String} selectedFrame - 현재 선택된 프레임 이미지의 경로/데이터
 * @param {Function} setSelectedFrame - 선택된 프레임을 변경하는 상태 관리 함수
 */
export default function FramePage({ onNext, selectedFrame, setSelectedFrame }) {
  // 불러온 프레임 이미지들을 배열로 묶어 관리 (map 함수 사용을 위해)
  const frames = [frame1, frame2, frame3, frame4, frame5, frame6];

  return (
    <div className="app">
        {/* 메인 카드 레이아웃 컨테이너 */}
        <div className="main-card frame-page">
            <h1 className="title">FRAME</h1>

            {/* 프레임 선택 영역 (배경 + 실제 프레임들) */}
            <div className="frame-stage">
                {/* 1. 배경 이미지: 버튼 클릭을 방해할 수 있으므로 CSS에서 z-index 확인 필요 */}
                <img src={frameBg} alt="" className="frame-bg" />
                
                {/* 2. 프레임 이미지들이 나열될 오버레이 영역 */}
                <div className="frame-overlay">
                    <div className='scroll-box'>
                        {/* 배열에 담긴 프레임들을 하나씩 화면에 렌더링 */}
                        {frames.map((frame) => (
                            <img
                                key={frame} // 리스트 렌더링을 위한 고유 키값
                                src={frame} // 각 프레임 이미지 소스
                                alt=""
                                /* 현재 선택된 프레임과 배열의 프레임이 일치하면 
                                   'active' 클래스를 붙여 테두리 효과 등을 줌 
                                */
                                className={`frame-item ${selectedFrame === frame ? "active" : ""}`}
                                /* 클릭 시 부모(App.js)의 selectedFrame 상태를 업데이트 */
                                onClick={() => setSelectedFrame(frame)}
                            />
                        ))}
                    </div>
                </div>
            </div>    

            {/* 다음 단계로 이동하는 버튼
                문제가 되었던 '아랫부분만 눌리는 현상'은 이 버튼 위에 
                위의 '.frame-stage' 영역이 겹쳐져 있을 가능성이 큽니다.
            */}
            <button
                className="next-button"
                onClick={() => {
                    // 프레임을 선택하지 않고 버튼을 누를 경우 경고창 띄움
                    if (!selectedFrame) {
                        alert("프레임을 선택하세요");
                        return;
                    }
                    // 선택이 완료되었다면 부모가 준 onNext 실행 (촬영 페이지 이동)
                    onNext();
                }}
            >
                촬영하기
            </button>
        </div>
    </div>
  );
}