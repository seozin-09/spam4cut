import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import '../App.css';
import { getPhotoGridStyle, getPhotoScale } from '../frameConfig';

function getFilterStyle(filter) {
  switch (filter) {
    case "soft":    return { filter: "brightness(1.1) blur(1px)" };
    case "warm":    return { filter: "sepia(0.4) saturate(1.2)" };
    case "sunset":  return { filter: "hue-rotate(-20deg) saturate(1.5)" };
    case "cool":    return { filter: "hue-rotate(180deg) brightness(0.9)" };
    case "bw":      return { filter: "grayscale(1)" };
    default:        return { filter: "none" };
  }
}

export default function FinalPage({ finalFrame, photos, photoOffsets, stickers, selectedFilter, onReset }) {
  const componentRef = useRef();
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  useEffect(() => {
    let isMounted = true;
    const uploadImage = async () => {
      if (!componentRef.current || qrCodeUrl || isUploading) return;

      setIsUploading(true);
      try {
        const canvas = await html2canvas(componentRef.current, {
          useCORS: true,
          scale: 2,
        });

        const blob = await new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob), 'image/png');
        });

        const formData = new FormData();
        formData.append('image', blob, 'result.png');

        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://10.125.93.230:8000';
        const response = await fetch(`${apiBaseUrl}/api/photos/upload/`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok && isMounted) {
          const data = await response.json();
          if (data.qr_code_url) {
            setQrCodeUrl(data.qr_code_url);
          } else if (data.qr_code) {
            setQrCodeUrl(`${apiBaseUrl}${data.qr_code}`);
          }
        }
      } catch (error) {
        console.error("Error capturing or uploading image:", error);
      } finally {
        if (isMounted) setIsUploading(false);
      }
    };

    const timer = setTimeout(uploadImage, 1500);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []); // 의존성 배열을 비워 처음에 한 번만 실행되도록 함

  return (
    <div className="final-page">
      <div className="final-layout">
        <div className="final-left">
          <div ref={componentRef} className="final-frame-container" style={{ position: 'relative', display: 'inline-block', width: '520px' }}>
            {/* 높이 확보용 */}
            <img src={finalFrame} alt="완성된 프레임" className="decorate-frame-image" style={{ visibility: 'hidden' }} />

            <div style={getPhotoGridStyle(finalFrame, getFilterStyle(selectedFilter))}>
              {photos && photos.map((photo, i) => (
                <img key={i} src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: `translate(${photoOffsets?.[i]?.x || 0}px, ${photoOffsets?.[i]?.y || 0}px) scale(${getPhotoScale(finalFrame)})` }} />
              ))}
            </div>

            {/* 프레임 오버레이 */}
            <img src={finalFrame} alt="완성된 프레임" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />

            {/* 스티커 */}
            {stickers && stickers.map((sticker) => (
              <img
                key={sticker.id}
                src={sticker.img}
                alt="sticker"
                style={{
                  position: 'absolute',
                  top: `calc(100px + ${sticker.y}px)`,
                  left: `calc(100px + ${sticker.x}px)`,
                  width: sticker.width,
                  height: sticker.height,
                  transform: `rotate(${sticker.rotate}deg)`,
                  pointerEvents: 'none',
                  zIndex: 999,
                  opacity: sticker.id.toString().includes('star') || (typeof sticker.img === 'string' && sticker.img.includes('Star')) ? 0.3 : 1,
                  display: 'block',
                }}
              />
            ))}
          </div>
        </div>

        <div className="final-right">
          <div className="final-qr-card">
            <div className="final-qr-text">
              QR 코드를 스캔해 완성본을
              <br />
              저장하세요!
            </div>
            <div className="final-qr-box">
              {isUploading ? (
                <div className="qr-loading-text">생성 중...</div>
              ) : qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR" style={{ width: '100%', height: '100%' }} />
              ) : (
                "QR"
              )}
            </div>
          </div>

          <div className="button-group">
            <button className="final-button" onClick={onReset}>처음으로</button>
            {/* <button className="final-print-button" onClick={() => handlePrint()}>출력하기</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}