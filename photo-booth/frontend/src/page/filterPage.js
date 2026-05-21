import '../App.css';
import { getPhotoGridStyle, getPhotoScale } from '../frameConfig';
import timer90 from "../assets/timer_90.png";
import filterNormal from "../assets/filter_normal.png";
import filterSoft from "../assets/filter_soft.png";
import filterWarm from "../assets/filter_warm.png";
import filterSunset from "../assets/filter_sunset.png";
import filterCool from "../assets/filter_cool.png";
import filterBw from "../assets/filter_bw.png";

import { useState, useEffect } from "react";

const FILTER_ITEMS = [
  { id: "normal", label: "일반", image: filterNormal },
  { id: "soft", label: "부드러운", image: filterSoft },
  { id: "warm", label: "따뜻한", image: filterWarm },
  { id: "sunset", label: "노을", image: filterSunset },
  { id: "cool", label: "차가운", image: filterCool },
  { id: "bw", label: "흑백", image: filterBw },
];

export default function FilterPage({
  stickers,
  finalFrame,
  photos,
  photoOffsets,
  selectedFilter,
  setSelectedFilter,
  onNext,
}) {
  // 🛠️ 1. 필터 페이지 전용 로컬 타이머 상태 추가 (초기값 90초)
  const [localTime, setLocalTime] = useState(90);

  // 🛠️ 2. 컴포넌트가 마운트(시작)될 때 1초마다 숫자를 줄이는 타이머 가동
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // 0초가 되면 타이머를 멈추고
          onNext();               // 자동으로 다음 페이지로 이동
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 사용자가 '넘어가기'를 직접 누르는 등 페이지를 벗어날 때 타이머를 메모리에서 깨끗이 제거
    return () => clearInterval(interval);
  }, [onNext]);

  function getFilterStyle(filter) {
    switch (filter) {
      case "soft":
        return { filter: "brightness(1.1) blur(1px)" };

      case "warm":
        return { filter: "sepia(0.4) saturate(1.2)" };

      case "sunset":
        return { filter: "hue-rotate(-20deg) saturate(1.5)" };

      case "cool":
        return { filter: "hue-rotate(180deg) brightness(0.9)" };

      case "bw":
        return { filter: "grayscale(1)" };

      default:
        return { filter: "none" };
    }
  }

  return (
    <div className="filter-page">

      <div className="filter-timer-wrap">
        <img
          src={timer90}
          alt=""
          className="filter-timer-image"
        />

        {/* 🛠️ 3. 외부 props 대신 독립적으로 돌아가는 localTime을 렌더링 */}
        <span className="filter-timer-text">
          {localTime}
        </span>
      </div>

      <div className="filter-top-area">

        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '520px',
          }}
        >
          {/* 컨테이너 높이 확보용 (투명) */}
          <img
            src={finalFrame}
            alt=""
            style={{ width: '100%', display: 'block', visibility: 'hidden' }}
          />

          <div style={getPhotoGridStyle(finalFrame, getFilterStyle(selectedFilter))}>
            {photos && photos.map((photo, i) => (
              <img key={i} src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: `translate(${photoOffsets?.[i]?.x || 0}px, ${photoOffsets?.[i]?.y || 0}px) scale(${getPhotoScale(finalFrame)})` }} />
            ))}
          </div>

          {/* 프레임 오버레이 - 필터 없음 */}
          <img
            src={finalFrame}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* 스티커 */}
          {stickers && stickers.map((s) => (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                left: `${100 + s.x}px`,
                top: `${100 + s.y}px`,
                width: `${s.width}px`,
                height: `${s.height}px`,
                backgroundImage: `url("${s.img}")`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                transform: `rotate(${s.rotate}deg)`,
                zIndex: 999,
                pointerEvents: 'none',
                display: 'block',
                opacity: s.id.toString().includes('star') || (typeof s.img === 'string' && s.img.includes('Star')) ? 0.3 : 1,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          className="filter-next-button"
          onClick={onNext}
        >
          넘어가기
        </button>
      </div>

      <div className="filter-bottom-panel">
        <div className="filter-list">

          {FILTER_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`filter-item ${
                selectedFilter === item.id ? "active" : ""
              }`}
              onClick={() => setSelectedFilter(item.id)}
            >
              <img
                src={item.image}
                alt={item.label}
                className="filter-thumb-image"
              />

              <div className="filter-label">
                {item.label}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}