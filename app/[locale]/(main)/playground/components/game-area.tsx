"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { CheckIcon, FastForwardIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";

import { TrackType } from "@/types/ytmusic.type";

// 柱狀波浪動畫
function MusicAnimation() {
  return (
    <div className="flex size-8 items-end justify-center gap-0.5">
      {[...Array(5).keys()].map((index) => (
        <motion.div
          key={index}
          className="bg-primary w-1/5"
          animate={{
            height: [8, 32, 8], // Keyframes 陣列：從 8 -> 32 -> 8 循環
          }}
          transition={{
            duration: 1, // 一次循環的時間
            repeat: Infinity, // 無限循環
            ease: "easeInOut",
            delay: index * 0.1, // 錯開每個 bar 的時間
          }}
        />
      ))}
    </div>
  );
}

interface QuestionAreaProps {
  currentTrack: TrackType | null;
  onNext: () => void;
}

function GameArea(props: QuestionAreaProps) {
  const { currentTrack, onNext } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const t = useTranslations("playground");

  useEffect(() => {
    if (currentTrack) {
      setIsPlaying(true);
      setShowAnswer(false);
    } else {
      setIsPlaying(false);
      setShowAnswer(false);
    }
  }, [currentTrack]);

  function togglePlay() {
    setIsPlaying((prev) => !prev);
  }

  function handleNext() {
    setShowAnswer(false);
    setIsPlaying(false);
    onNext();
  }

  function handleAnswer() {
    setShowAnswer(true);
    setIsPlaying(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full">
        <div className="hidden">
          {currentTrack && (
            <ReactPlayer
              key={currentTrack.video_id} // Force reload on track change
              src={`${process.env.NEXT_PUBLIC_YTMUSIC_URL}?v=${currentTrack.video_id}`}
              controls={false}
              width="0"
              height="0"
              playing={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>
        <div className="flex h-24 w-full items-center justify-center">
          {isPlaying ? (
            <div className="flex flex-col items-center gap-2">
              <MusicAnimation />
              <span className="text-muted-foreground animate-pulse text-xs">{t("playing")}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{currentTrack ? t("pause") : ""}</span>
          )}
        </div>
        {showAnswer && currentTrack && (
          <div className="bg-background absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-lg p-4 text-center">
            <p className="text-xl font-bold">{currentTrack.track_name}</p>
            <p className="text-muted-foreground *:text-sm">{currentTrack.artists.map((a) => a.name).join(", ")}</p>
            <p className="text-muted-foreground text-sm">{currentTrack.album.name}</p>
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-center gap-2">
        {currentTrack ? (
          <Button variant="outline" className="w-28 cursor-pointer" onClick={togglePlay}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span>{isPlaying ? t("pause") : t("play")}</span>
          </Button>
        ) : (
          <Button variant="outline" className="w-28 cursor-pointer" onClick={handleNext}>
            <PlayIcon />
            <span>{t("start")}</span>
          </Button>
        )}
        {showAnswer ? (
          <Button variant="default" className="w-28 cursor-pointer" onClick={handleNext}>
            <FastForwardIcon />
            <span>{t("next")}</span>
          </Button>
        ) : (
          <Button variant="outline" className="w-28 cursor-pointer" onClick={handleAnswer} disabled={!currentTrack}>
            <CheckIcon />
            <span>{t("answer")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export { GameArea };
