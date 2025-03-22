"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipBack, SkipForward } from "lucide-react"

export default function YouTubeStylePlayer({ videoUrl }) {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const progressRef = useRef(null)
  const volumeRef = useRef(null)
  const hlsRef = useRef(null)
  const controlsTimeoutRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [qualities, setQualities] = useState([])
  const [selectedQuality, setSelectedQuality] = useState(-1)
  const [showSettings, setShowSettings] = useState(false)

  // Initialize HLS
  useEffect(() => {
    if (videoUrl && videoRef.current) {
      const video = videoRef.current
      const masterPlaylistUrl = `https://beta.themuallimah.uz/v1/stream/video/${videoUrl}/playlist`

      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy()
        }

        const hls = new Hls()
        hlsRef.current = hls

        hls.loadSource(masterPlaylistUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Populate quality options based on hls.levels
          const levels = hls.levels
          const qualityOptions = levels.map((level, index) => ({
            value: index,
            label: `${level.height}p`,
            bitrate: Math.round(level.bitrate / 1000),
          }))
          setQualities(qualityOptions)
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data)
        })
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = masterPlaylistUrl
      }
    }
  }, [videoUrl])

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const onEnded = () => {
      setIsPlaying(false)
    }

    video.addEventListener("loadedmetadata", onLoadedMetadata)
    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("ended", onEnded)

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("ended", onEnded)
    }
  }, [])

  // Handle controls visibility
  useEffect(() => {
    const hideControls = () => {
      if (!isPlaying) return
      setShowControls(false)
    }

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    if (showControls && isPlaying) {
      controlsTimeoutRef.current = setTimeout(hideControls, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, isPlaying])

  // Handle play/pause
  const togglePlay = () => {
    const video = videoRef.current
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    videoRef.current.volume = newVolume
    setIsMuted(newVolume === 0)
  }

  // Handle mute toggle
  const toggleMute = () => {
    const video = videoRef.current
    if (isMuted) {
      video.volume = volume || 1
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  // Handle progress bar click
  const handleProgressClick = (e) => {
    const progressBar = progressRef.current
    const rect = progressBar.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = pos * duration
  }

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const player = playerRef.current

    if (!document.fullscreenElement) {
      player
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle quality change
  const changeQuality = (level) => {
    setSelectedQuality(level)
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level
    }
    setShowSettings(false)
  }

  // Format time (seconds to MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Skip forward/backward
  const skip = (seconds) => {
    const video = videoRef.current
    video.currentTime += seconds
  }

  return (
    <div
      ref={playerRef}
      className="group relative bg-black rounded-lg w-full aspect-video overflow-hidden"
      onMouseMove={() => {
        setShowControls(true)
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }
        if (isPlaying) {
          controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
        }
      }}
    >
      {/* Video Element */}
      <video ref={videoRef} className="w-full h-full cursor-pointer" onClick={togglePlay} playsInline />

      {/* Play/Pause Overlay Button (shows briefly when clicking) */}
      {isPlaying ? (
        <button
          onClick={togglePlay}
          className="top-1/2 left-1/2 absolute bg-black/40 opacity-0 group-active:opacity-100 p-4 rounded-full transition-opacity -translate-x-1/2 -translate-y-1/2 transform"
        >
          <Pause className="w-8 h-8 text-white" />
        </button>
      ) : (
        <button
          onClick={togglePlay}
          className="top-1/2 left-1/2 absolute bg-black/40 p-4 rounded-full -translate-x-1/2 -translate-y-1/2 transform"
        >
          <Play className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Controls Container */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-2 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="group/progress relative bg-white/30 mb-3 rounded-full h-1 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="top-0 left-0 absolute bg-red-600 rounded-full h-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          <div
            className="top-0 left-0 absolute bg-red-600 rounded-full w-3 h-3 h-full -translate-y-1/3"
            style={{ left: `${(currentTime / duration) * 100}%`, display: showControls ? "block" : "none" }}
          />
          <div className="top-0 left-0 absolute w-full h-full group-hover/progress:h-2 transition-all" />
        </div>

        {/* Controls Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Skip Buttons */}
            <button onClick={() => skip(-10)} className="text-white hover:text-gray-300">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={() => skip(10)} className="text-white hover:text-gray-300">
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Volume Control */}
            <div className="group/volume flex items-center gap-1">
              <button onClick={toggleMute} className="text-white hover:text-gray-300">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300">
                <input
                  ref={volumeRef}
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-red-600"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Settings Button */}
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="text-white hover:text-gray-300">
                <Settings className="w-5 h-5" />
              </button>

              {/* Quality Menu */}
              {showSettings && (
                <div className="right-0 bottom-full absolute bg-black/90 mb-2 p-2 rounded-md w-48">
                  <div className="mb-1 px-2 font-medium text-white text-sm">Sifat</div>
                  <div className="max-h-40 overflow-y-auto">
                    <button
                      onClick={() => changeQuality(-1)}
                      className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-white/10 ${selectedQuality === -1 ? "text-red-500" : "text-white"}`}
                    >
                      Auto
                    </button>
                    {qualities.map((quality) => (
                      <button
                        key={quality.value}
                        onClick={() => changeQuality(quality.value)}
                        className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-white/10 ${selectedQuality === quality.value ? "text-red-500" : "text-white"}`}
                      >
                        {quality.label} ({quality.bitrate} kbps)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

