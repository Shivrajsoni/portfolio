"use client";

import { useState, useEffect, useRef } from 'react';

const SongPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      // Remove the listener after the first interaction
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    // Listen for any click or keydown event on the window
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const handleScroll = () => {
      // Only attempt to play if the user has interacted and is at the bottom
      if (hasInteracted && window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        if (audioRef.current && !isPlaying) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPlaying, hasInteracted]); // Depend on hasInteracted to re-evaluate scroll logic

  return (
    <audio ref={audioRef} src="/song.mp3" />
  );
};

export default SongPlayer;
