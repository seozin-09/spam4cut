import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import '../App.css';
import bubble from "../assets/bubble.png";
import { getPhotoGridStyle, getPhotoScale } from '../frameConfig';

export default function ResultPage({ finalFrame, photos, photoOffsets, setPhotoOffsets, onDecorate, onReset }) {
  const photoRefs = useRef([
    React.createRef(), React.createRef(), React.createRef(), React.createRef()
  ]);
  const componentRef = useRef();
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  useEffect(() => {
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

        if (response.ok) {
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
        setIsUploading(false);
      }
    };

    const timer = setTimeout(uploadImage, 1000);
    return () => clearTimeout(timer);
  }, [componentRef, qrCodeUrl, isUploading]);

  return (
    <div className="result-app">
      <div className="result-screen">
        <div className="result-left">
          <div ref={componentRef} style={{ position: 'relative', display: 'inline-block', width: '520px' }}>
            {/* 높이 확보용 */}
            <img src={finalFrame} alt="" style={{ width: '100%', display: 'block', visibility: 'hidden' }} />

            <div style={{ ...getPhotoGridStyle(finalFrame), overflow: 'hidden' }}>
              {photos && photos.map((photo, i) => (
                <Draggable
                  key={i}
                  nodeRef={photoRefs.current[i]}
                  position={photoOffsets?.[i] || { x: 0, y: 0 }}
                  onStop={(e, data) => {
                    const newOffsets = [...(photoOffsets || [])];
                    newOffsets[i] = { x: data.x, y: data.y };
                    setPhotoOffsets(newOffsets);
                  }}
                >
                  <div ref={photoRefs.current[i]} style={{ width: '100%', height: '100%' }}>
                    <img
                      src={photo}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'grab', transform: `scale(${getPhotoScale(finalFrame)})` }}
                    />
                  </div>
                </Draggable>
              ))}
            </div>

            {/* 프레임 오버레이 */}
            <img src={finalFrame} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />
          </div>

          <button
            className="common-button decorate-button"
            onClick={onDecorate}
          >
            꾸미기
          </button>

          <img src={bubble} alt="" className="left-bubble-image" />
        </div>

        <div className="result-right">
          <div className="qr-card">
            <div className="qr-guide-text">
              QR 코드를 스캔해 완성본을
              <br />
              저장하세요!
            </div>

            <div className="qr-card-image-wrap">
              <div className="final-qr-box" style={{ background: '#cfc8c8', width: '160px', height: '160px', borderRadius: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                {isUploading ? (
                  <div className="qr-loading-text">생성 중...</div>
                ) : qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR" style={{ width: '100%', height: '100%' }} />
                ) : (
                  <span style={{ fontSize: '34px', fontStyle: 'italic', color: '#111' }}>QR</span>
                )}
              </div>
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
