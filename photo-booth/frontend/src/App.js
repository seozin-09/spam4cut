import React, { useState, useEffect } from "react";
import "./App.css";

import IntroPage from "./page/IntroPage";
import TutorialPage from "./page/tutorialPage";
import FramePage from "./page/framePage";
import WebcamCapture from "./page/WebcamCapture";
import ResultPage from "./page/resultPage";
import DecoratePage from "./page/decoratePage";
import FilterPage from "./page/filterPage";
import FinalPage from "./page/finalPage";

import frame1 from "./assets/frame1.png";
import { getDefaultPhotoOffsets } from "./frameConfig";

export default function App() {
  // const [page, setPage] = useState("decorate");
  const [page, setPage] = useState("intro");
  const [selectedFrame, setSelectedFrame] = useState(frame1);
  const [photos, setPhotos] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);

  const [selectedFilter, setSelectedFilter] = useState("normal");
  const [photoOffsets, setPhotoOffsets] = useState(() => getDefaultPhotoOffsets(frame1));

  const [stickers, setStickers] = useState(() => {
    try {
      const saved = localStorage.getItem("photo-stickers");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("photo-stickers", JSON.stringify(stickers));
  }, [stickers]);

  useEffect(() => {
    if (page !== "decorate" && page !== "filter") return;
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, page]);

  const addPhoto = (imageSrc) => {
    setPhotos((prev) => [...prev, imageSrc]);
  };

  const resetProject = () => {
    setPhotos([]);
    setStickers([]);
    localStorage.removeItem("photo-stickers");
    setSelectedFrame(frame1);
    setSelectedFilter("normal");
    setPhotoOffsets(getDefaultPhotoOffsets(frame1));
    setTimeLeft(90);
    setPage("intro");
  };

  if (page === "intro") {
    return <IntroPage onNext={() => setPage("tutorial")} />;
  }

  if (page === "tutorial") {
    return <TutorialPage onNext={() => setPage("frame")} />;
  }

  if (page === "frame") {
    return (
      <FramePage
        selectedFrame={selectedFrame}
        setSelectedFrame={(frame) => {
          setSelectedFrame(frame);
          setPhotoOffsets(getDefaultPhotoOffsets(frame));
        }}
        onNext={() => {
          setPhotoOffsets(getDefaultPhotoOffsets(selectedFrame));
          setPage("shoot");
        }}
      />
    );
  }

  if (page === "shoot") {
    return (
      <WebcamCapture
        addPhoto={addPhoto}
        photoCount={photos.length}
        clearPhoto={() => setPhotos([])}
        onComplete={() => setPage("result")}
      />
    );
  }

  if (page === "result") {
    return (
      <ResultPage
        onReset={resetProject}
        finalFrame={selectedFrame}
        photos={photos}
        photoOffsets={photoOffsets}
        setPhotoOffsets={setPhotoOffsets}
        onDecorate={() => {
          setTimeLeft(90);
          setPage("decorate");
        }}
        onNext={() => {
          setTimeLeft(90);
          setPage("decorate");
        }}
      />
    );
  }

  if (page === "decorate") {
    return (
      <DecoratePage
        finalFrame={selectedFrame}
        photos={photos}
        photoOffsets={photoOffsets}
        stickers={stickers}
        setStickers={setStickers}
        onNext={() => setPage("filter")}
        timeLeft={timeLeft}
      />
    );
  }

  if (page === "filter") {
    return (
      <FilterPage
        finalFrame={selectedFrame}
        photos={photos}
        photoOffsets={photoOffsets}
        stickers={stickers}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        onNext={() => setPage("final")}
        timeLeft={timeLeft}
      />
    );
  }

  if (page === "final") {
    return (
      <FinalPage
        finalFrame={selectedFrame}
        photos={photos}
        photoOffsets={photoOffsets}
        stickers={stickers}
        selectedFilter={selectedFilter}
        onReset={resetProject}
      />
    );
  }

  return null;
}