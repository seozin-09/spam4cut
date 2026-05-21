import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import '../App.css';
import { getPhotoGridStyle, getPhotoScale } from '../frameConfig';

import timer90 from "../assets/timer_90.png";
import star8 from "../assets/Star8.png";
import star9 from "../assets/Star9.png";
import star10 from "../assets/Star10.png";
import star11 from "../assets/Star11.png";
import star12 from "../assets/Star12.png";

import heart_R from "../assets/stickers/Group 1597881030.png";
import heart_O from "../assets/stickers/Group 1597881031.png";
import heart_Y from "../assets/stickers/Group 1597881032.png";
import heart_B from "../assets/stickers/Group 1597881033.png";
import heart_P from "../assets/stickers/Group 1597881034.png";
import heart_c from "../assets/stickers/Group 1597881035.png";
import heart_W from "../assets/stickers/Group 1597881036.png";
import heart_1 from "../assets/stickers/Vector 122.png";
import heart_2 from "../assets/stickers/Vector 123.png";
import love from "../assets/stickers/love.png";

import smile from "../assets/stickers/Smile.png";
import merong from "../assets/stickers/merong.png";
import sadness from "../assets/stickers/Sadness.png";
import sunglasses from "../assets/stickers/Sunglasses.png";
import glasses from "../assets/stickers/Glasses.png";

import Tears from "../assets/stickers/Tears.png";
import Angry from "../assets/stickers/Angry.png";
import Ribbon from "../assets/stickers/Ribbon.png";
import angel from "../assets/stickers/angel.png";
import Devil from "../assets/stickers/Devil.png";

import cloud from "../assets/stickers/cloud.png";
import Wings from "../assets/stickers/Vector 149.png";
import Nakutomaki from "../assets/stickers/Nakutomaki.png";
import ice_cream from "../assets/stickers/ice cream.png";

import crown from "../assets/stickers/crown.png";
import clover from "../assets/stickers/clover.png";
import Twinkle from "../assets/stickers/Twinkle.png";
import Black from "../assets/stickers/Black_logo.png";
import White from "../assets/stickers/White_logo.png";

export default function DecoratePage({ stickers, setStickers, finalFrame, photos, photoOffsets, onNext, timeLeft }) {
  const [topStickerId, setTopStickerId] = useState(null);
  const nodeRefs = useRef({});

  const stickerAssets = [
    { id: 'star8', img: star8 },
    { id: 'star9', img: star9 },
    { id: 'star10', img: star10 },
    { id: 'star11', img: star11 },
    { id: 'star12', img: star12 },
    { id: 'heart_R', img: heart_R },
    { id: 'heart_O', img: heart_O },
    { id: 'heart_Y', img: heart_Y },
    { id: 'heart_B', img: heart_B },
    { id: 'heart_P', img: heart_P },
    { id: 'heart_c', img: heart_c },
    { id: 'heart_W', img: heart_W },
    { id: 'heart_1', img: heart_1 },
    { id: 'heart_2', img: heart_2 },
    { id: 'love', img: love },
    { id: 'smile', img: smile },
    { id: 'merong', img: merong },
    { id: 'sadness', img: sadness },
    { id: 'sunglasses', img: sunglasses },
    { id: 'glasses', img: glasses },
    { id: 'Tears', img: Tears },
    { id: 'Angry', img: Angry },
    { id: 'Ribbon', img: Ribbon },
    { id: 'angel', img: angel },
    { id: 'Devil', img: Devil },
    { id: 'cloud', img: cloud },
    { id: 'Wings', img: Wings },
    { id: 'Nakutomaki', img: Nakutomaki },
    { id: 'ice_cream', img: ice_cream },
    { id: 'crown', img: crown },
    { id: 'clover', img: clover },
    { id: 'Twinkle', img: Twinkle },
    { id: 'Black', img: Black },
    { id: 'White', img: White },
  ];

  // 👇 1. 자동으로 다음 페이지로 넘어가게 하는 효과 추가
  useEffect(() => {
    if (timeLeft === 0) {
      onNext(); // 시간이 0이 되면 부모가 내려준 넘어가기 함수 실행
    }
  }, [timeLeft, onNext]);

  const spawnSticker = (imgSrc) => {
    const newId = Date.now();
    
    // 1. 가상의 이미지 객체를 생성해 원본 크기 구하기
    const img = new Image();
    img.src = imgSrc;
    
    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;
      const aspectRatio = originalWidth / originalHeight;

      // 2. 기본 기준 크기(가로 120px)를 잡고, 세로는 비율에 맞게 자동 계산
      const defaultWidth = 120;
      const defaultHeight = defaultWidth / aspectRatio;

      // 3. 비율이 유지된 크기로 스티커 추가
      setStickers((prev) => [
        ...prev,
        { 
          id: newId, 
          img: imgSrc, 
          width: defaultWidth, 
          height: defaultHeight, 
          rotate: 0, 
          x: 0, 
          y: 0 
        }
      ]);
      setTopStickerId(newId);
    };
  };
  
  const handleStop = (id, data) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x: data.x, y: data.y } : s))
    );
  };

  const handleRotate = (id, e) => {
    e.stopPropagation();
    // pointerdown에서 preventDefault를 호출하면 포커스 등 브라우저 기본 동작이 방지될 수 있으나, 
    // 터치 환경에서는 스크롤 방지를 위해 touch-action: none이 더 중요합니다.

    const targetRef = nodeRefs.current[id].current;
    if (!targetRef) return;

    const rect = targetRef.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const onPointerMove = (moveEvent) => {
      const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
      const degree = angle * (180 / Math.PI);
      setStickers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, rotate: degree } : s))
      );
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const handleResize = (id, e) => {
    e.stopPropagation();

    const startX = e.clientX;
    const targetSticker = stickers.find((s) => s.id === id);
    if (!targetSticker) return;

    const startWidth = targetSticker.width;
    const aspect = targetSticker.width / targetSticker.height;

    const onPointerMove = (moveEvent) => {
      const newWidth = Math.max(40, startWidth + (moveEvent.clientX - startX));

      setStickers((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, width: newWidth, height: newWidth / aspect }
            : s
        )
      );
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div className="decorate-page" onClick={() => setTopStickerId(null)}>
      {/* 👇 2. 타이머 클릭 시 부모 클릭 이벤트 방지(stopPropagation) 추가 */}
      <div className="decorate-timer-wrap" onClick={(e) => e.stopPropagation()}>
        <img src={timer90} alt="" className="decorate-timer-image" />
        <span className="decorate-timer-text">{timeLeft}</span>
      </div>

      <div className="decorate-layout">
        <button
          type="button"
          onClick={onNext}
          className="decorate-next-button"
        >
          넘어가기
        </button>

        <div
          className="decorate-frame-container"
          style={{ position: 'relative', display: 'inline-block', width: '520px' }}
        >
          {/* 높이 확보용 */}
          <img src={finalFrame} alt="frame" className="decorate-frame-image" style={{ visibility: 'hidden' }} />

          <div style={getPhotoGridStyle(finalFrame)}>
            {photos && photos.map((photo, i) => (
              <img key={i} src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: `translate(${photoOffsets?.[i]?.x || 0}px, ${photoOffsets?.[i]?.y || 0}px) scale(${getPhotoScale(finalFrame)})` }} />
            ))}
          </div>

          {/* 프레임 오버레이 */}
          <img src={finalFrame} alt="frame" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />

          {stickers.map((sticker) => {
            if (!nodeRefs.current[sticker.id]) {
              nodeRefs.current[sticker.id] = React.createRef();
            }

            const isSelected = topStickerId === sticker.id;

            return (
              <Draggable
                key={sticker.id}
                nodeRef={nodeRefs.current[sticker.id]}
                position={{ x: sticker.x, y: sticker.y }}
                onStop={(e, data) => handleStop(sticker.id, data)}
                onStart={() => setTopStickerId(sticker.id)}
                cancel=".action-btn"
                bounds="parent"
              >
                <div
                  ref={nodeRefs.current[sticker.id]}
                  style={{
                    position: 'absolute',
                    top: '100px',
                    left: '100px',
                    width: sticker.width,
                    height: sticker.height,
                    zIndex: isSelected ? 999 : 10,
                    cursor: 'grab',
                  }}
                >
                  <div
                    className="sticker-content"
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url("${sticker.img}")`,
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      transform: `rotate(${sticker.rotate}deg)`,
                      outline: isSelected ? '2px dashed #4dabf7' : 'none',
                      opacity: sticker.id.toString().includes('star') || (typeof sticker.img === 'string' && sticker.img.includes('Star')) ? 0.3 : 1,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isSelected && (
                      <>
                        <div
                          className="action-btn"
                          onClick={() =>
                            setStickers(stickers.filter((s) => s.id !== sticker.id))
                          }
                          style={{
                            position: 'absolute',
                            top: -15,
                            left: -15,
                            width: 25,
                            height: 25,
                            background: 'red',
                            color: '#fff',
                            borderRadius: '50%',
                            textAlign: 'center',
                            cursor: 'pointer',
                            lineHeight: '22px',
                          }}
                        >
                          ×
                        </div>

                        <div
                          className="action-btn"
                          onPointerDown={(e) => handleRotate(sticker.id, e)}
                          style={{
                            position: 'absolute',
                            top: -15,
                            right: -15,
                            width: 26,
                            height: 26,
                            background: '#4dabf7',
                            borderRadius: '50%',
                            cursor: 'alias',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            border: '2px solid white',
                            touchAction: 'none',
                          }}
                        >
                          🔄
                        </div>

                        <div
                          className="action-btn"
                          onPointerDown={(e) => handleResize(sticker.id, e)}
                          style={{
                            position: 'absolute',
                            bottom: -10,
                            right: -10,
                            width: 20,
                            height: 20,
                            background: '#333',
                            border: '2px solid white',
                            borderRadius: '50%',
                            cursor: 'nwse-resize',
                            touchAction: 'none',
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </Draggable>
            );
          })}
        </div>

        <div className="decorate-sticker-panel">
          {stickerAssets.map((asset) => (
            <img
              key={asset.id}
              src={asset.img}
              alt="origin"
              style={{ cursor: 'pointer', width: 100, height: 'auto' }}
              onClick={(e) => {
                e.stopPropagation();
                spawnSticker(asset.img);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}