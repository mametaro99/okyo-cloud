import React, { useState, useRef, useEffect } from 'react';

type VideoAndSubtitleProps = {
  video_url: string;
  phrases: { start: number; end: number; text: string; meaning: string; reading: string }[];
};

const VideoAndSubtitle: React.FC<VideoAndSubtitleProps> = ({ video_url, phrases }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<{ text: string; meaning: string; reading: string } | null>(null);

  useEffect(() => {
    const isVideo = video_url.endsWith('.mp4');
    const mediaRef = isVideo ? videoRef.current : audioRef.current;

    const handleTimeUpdate = () => {
      if (mediaRef) {
        const currentTime = mediaRef.currentTime;

        // デバッグ用ログ
        // console.log(`Current Time: ${currentTime}`);

        // 現在の再生位置に一致するフレーズを取得
        const activePhrase = phrases.find(
          (phrase) =>
            currentTime >= phrase.start - 0.2 && currentTime <= phrase.end + 0.2 // 少し余裕を持たせる
        );

        // フレーズが変更された場合のみ状態を更新
        setCurrentSubtitle(activePhrase || null);
      }
    };

    if (mediaRef) {
      mediaRef.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (mediaRef) {
        mediaRef.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [phrases, video_url]);

  const isVideo = video_url.endsWith('.mp4'); // 動画か音声かを判定

  return (
    <div>
      {isVideo ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000' }}>
          <video ref={videoRef} autoPlay muted controls style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <source src={`${video_url}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <audio ref={audioRef} autoPlay controls style={{ width: '100%' }}>
          <source src={`${video_url}`} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      )}
      <div
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: 'black',
          color: 'white',
          textAlign: 'center',
          fontSize: '1.2rem',
          borderRadius: '5px',
        }}
      >
        {currentSubtitle ? (
          <>
            <div>{currentSubtitle.text}</div>
            <div style={{ fontSize: '1rem', color: 'gray' }}>{currentSubtitle.reading}</div>
            <div style={{ fontSize: '1rem', color: 'lightgray' }}>{currentSubtitle.meaning}</div>
          </>
        ) : (
          '...'
        )}
      </div>
    </div>
  );
};

export default VideoAndSubtitle;
