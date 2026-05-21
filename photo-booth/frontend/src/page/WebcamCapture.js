import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Webcam from "react-webcam";
import "./WebcamCapture.css";
import shutterCircle from "../assets/shutter_circle.png";
import mp3Sound from "../assets/mp3.mp3";

const WebcamCapture = ({ addPhoto, photoCount, clearPhoto, onComplete }) => {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  // 오디오 객체를 미리 생성하여 지연 시간 방지
  const audio = useMemo(() => new Audio(mp3Sound), []);

  const getVideoDevices = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      );

      setVideoDevices(videoInputs);

      if (videoInputs.length >= 3) {
        setSelectedDeviceId(videoInputs[2].deviceId);
      } else if (videoInputs.length > 0) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (error) {
      console.error("비디오 장치 감지 오류:", error);
    }
  }, []);

  useEffect(() => {
    getVideoDevices();
    navigator.mediaDevices.addEventListener("devicechange", getVideoDevices);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getVideoDevices);
    };
  }, [getVideoDevices]);

  const playSound = useCallback(() => {
    audio.currentTime = 0; // 재생 위치 초기화
    audio.play().catch((err) => console.log("오디오 재생 실패:", err));
  }, [audio]);

  const handleAddPhoto = useCallback(
    (imageSrc) => {
      addPhoto(imageSrc);

      if (photoCount + 1 >= 4) {
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    },
    [addPhoto, photoCount, onComplete]
  );

  const cropImage = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1920;
        canvas.height = 2560;

        const ctx = canvas.getContext("2d");
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );

        const x = canvas.width / 2 - (img.width / 2) * scale;
        const y = canvas.height / 2 - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        resolve(canvas.toDataURL("image/jpeg", 1.0));
      };
    });
  };

  const capture = () => {
    if (photoCount >= 4 || capturing) return;
    setCapturing(true);
    setCountdown(5);
    setPhotoIndex(0);
  };

  useEffect(() => {
    let timer;

    if (capturing && countdown > 0) {
      timer = setTimeout(() => {
        // 카운트다운이 1에서 0으로 넘어가는 시점에 미리 소리를 실행하여 딜레이 제거
        if (countdown === 1) {
          playSound();
        }
        setCountdown(countdown - 1);
      }, 1000);
    } else if (
      countdown === 0 &&
      capturing &&
      photoIndex < 4 &&
      !isProcessing
    ) {
      setIsProcessing(true);
      
      const imageSrc = webcamRef.current?.getScreenshot();

      if (imageSrc) {
        cropImage(imageSrc).then((croppedImage) => {
          handleAddPhoto(croppedImage);
          setPhotoIndex((prev) => prev + 1);
          setCountdown(5);
          setIsProcessing(false);
        });
      } else {
        setIsProcessing(false);
      }
    }

    if (photoIndex >= 4 || photoCount >= 4) {
      setCapturing(false);
    }

    return () => clearTimeout(timer);
  }, [
    capturing,
    countdown,
    handleAddPhoto,
    photoIndex,
    photoCount,
    isProcessing,
    playSound
  ]);

  return (
    <div className="webcam-container">
      {selectedDeviceId ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            deviceId: { exact: selectedDeviceId },
            width: 960,
            height: 1280,
          }}
          className="webcam"
        />
      ) : (
        <div className="webcam-loading">카메라를 찾는 중...</div>
      )}

      {capturing && countdown > 0 && (
        <div className="countdown-overlay">{countdown}</div>
      )}

      <div className="controls">
        <p>{photoCount}/4</p>
      </div>

      <button
        className="camera-button"
        onClick={capture}
        disabled={!selectedDeviceId || capturing}
      >
        <img className="camera-icon" src={shutterCircle} alt="촬영" />
      </button>
    </div>
  );
};

export default WebcamCapture;
