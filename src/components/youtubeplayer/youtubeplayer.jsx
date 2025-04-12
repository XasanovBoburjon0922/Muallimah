"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, Settings, Maximize } from "lucide-react"
import Hls from "hls.js"
import axios from "axios"

export default function VideoPlayer({ videoUrl, lessonId }) {
  // Refs
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const progressRef = useRef(null)
  const volumeRef = useRef(null)
  const hlsRef = useRef(null)
  const controlsTimeoutRef = useRef(null)
  const saveIntervalRef = useRef(null)
  const retryCountRef = useRef(0)

  // State
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [qualities, setQualities] = useState([])
  const [selectedQuality, setSelectedQuality] = useState(-1)
  const [initialLoad, setInitialLoad] = useState(true)
  const [watchedProgress, setWatchedProgress] = useState(0)
  const [lastWatchedTime, setLastWatchedTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [storageKey] = useState(`video-progress-${lessonId}`)

  // Get user token from localStorage
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("muallimah-user") || "{}")
      return userData?.access_token
    }
    return null
  }

  // Initialize HLS
  const initializeHLS = () => {
    const video = videoRef.current
    if (!video || !videoUrl) return

    const masterPlaylistUrl = `https://beta.themuallimah.uz/v1/stream/video/${videoUrl}/playlist`

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }

      const hls = new Hls({
        maxMaxBufferLength: 30,
        maxBufferSize: 6000000,
        maxBufferLength: 30,
        enableWorker: true,
      })
      hlsRef.current = hls

      hls.loadSource(masterPlaylistUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels
        const qualityOptions = levels.map((level, index) => ({
          value: index,
          label: `${level.height}p`,
          bitrate: Math.round(level.bitrate / 1000),
        }))
        setQualities(qualityOptions)
        setIsLoading(false)
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data)
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (retryCountRef.current < 3) {
                retryCountRef.current += 1
                hls.startLoad()
              } else {
                setError("Failed to load video after multiple attempts")
              }
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              setError("Failed to load video")
              break
          }
        }
      })
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = masterPlaylistUrl
      video.addEventListener("loadedmetadata", () => setIsLoading(false))
      setIsLoading(false)
    } else {
      setError("Your browser doesn't support HLS streaming")
    }
  }

  // Load saved progress
  const loadSavedProgress = async () => {
    try {
      // Load from localStorage first
      const localData = localStorage.getItem(storageKey)
      if (localData) {
        const { timestamp, watchedProgress } = JSON.parse(localData)
        setWatchedProgress(watchedProgress)
        setLastWatchedTime(timestamp)
      }

      // Then load from server (if token and lessonId exist)
      const token = getAuthToken()
      if (!token || !lessonId) return

      const response = await axios.get(
        `https://beta.themuallimah.uz/v1/user-lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )

      if (response.data) {
        const lessonData = response.data
        if (lessonData.watched_progress) {
          setWatchedProgress(lessonData.watched_progress)
        }
        if (lessonData.last_watched_time) {
          setLastWatchedTime(lessonData.last_watched_time)
        }
      }
    } catch (error) {
      console.error("Error loading watch time:", error)
    }
  }

  // Save watch time
  const saveWatchTime = async (timestamp, watchedProgress) => {
    try {
      const token = getAuthToken()
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify({
        timestamp,
        watchedProgress,
        lastUpdated: Date.now()
      }))

      // Send to API (if token and lessonId exist)
      if (token && lessonId) {
        await axios.put(
          `https://beta.themuallimah.uz/v1/user/lessons/watch-time/${lessonId}`,
          {
            timestamp: Math.round(timestamp),
            watched_progress: Math.round(watchedProgress),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      }
    } catch (error) {
      console.error("Error saving watch time:", error)
    }
  }

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true)
      }).catch(err => {
        console.error("Play failed:", err)
        setIsPlaying(false)
      })
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

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
    const video = videoRef.current
    if (!progressBar || !video || !duration) return

    const rect = progressBar.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const newTime = pos * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
    
    const watchedProgress = Math.round((newTime / duration) * 100)
    saveWatchTime(newTime, watchedProgress)
  }

  // Format time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const player = playerRef.current
    if (!player) return

    if (!document.fullscreenElement) {
      player.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error("Fullscreen error:", err))
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Change quality
  const changeQuality = (level) => {
    setSelectedQuality(level)
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level
    }
    setShowSettings(false)
  }

  // Initialize on mount
  useEffect(() => {
    initializeHLS()
    loadSavedProgress()

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
      }
    }
  }, [videoUrl])

  // Setup video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video || !lessonId) return

    const onLoadedMetadata = () => {
      setDuration(video.duration)
      
      const setInitialTime = () => {
        if (initialLoad && lastWatchedTime > 0) {
          const startTime = Math.min(lastWatchedTime, video.duration)
          video.currentTime = startTime
          setCurrentTime(startTime)
          setInitialLoad(false)
          
          if (startTime < video.duration) {
            video.play().catch(e => console.error("Autoplay failed:", e))
            setIsPlaying(true)
          }
        }
      }

      setInitialTime()
    }

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      if (duration > 0) {
        const progress = (video.currentTime / duration) * 100
        setWatchedProgress(progress)
      }
    }

    const onEnded = () => {
      setIsPlaying(false)
      if (duration > 0) {
        saveWatchTime(duration, 100)
        setWatchedProgress(100)
      }
    }

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onWaiting = () => setIsLoading(true)
    const onPlaying = () => setIsLoading(false)

    video.addEventListener("loadedmetadata", onLoadedMetadata)
    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("ended", onEnded)
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)
    video.addEventListener("waiting", onWaiting)
    video.addEventListener("playing", onPlaying)

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("ended", onEnded)
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
      video.removeEventListener("waiting", onWaiting)
      video.removeEventListener("playing", onPlaying)
    }
  }, [lessonId, initialLoad, lastWatchedTime, duration])

  // Save progress every second
  useEffect(() => {
    if (lessonId && !initialLoad) {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
      }

      saveIntervalRef.current = setInterval(() => {
        if (videoRef.current && duration > 0) {
          const currentProgress = (currentTime / duration) * 100
          saveWatchTime(currentTime, currentProgress)
        }
      }, 1000)

      return () => {
        if (saveIntervalRef.current) {
          clearInterval(saveIntervalRef.current)
        }
      }
    }
  }, [lessonId, currentTime, duration, initialLoad])

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (videoRef.current && duration > 0) {
        const currentProgress = (currentTime / duration) * 100
        saveWatchTime(currentTime, currentProgress)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentTime, duration])

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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!videoRef.current) return

      switch (e.key) {
        case " ":
          togglePlay()
          e.preventDefault()
          break
        case "ArrowLeft":
          if (videoRef.current.currentTime > 5) {
            videoRef.current.currentTime -= 5
          } else {
            videoRef.current.currentTime = 0
          }
          break
        case "ArrowRight":
          if (videoRef.current.currentTime < videoRef.current.duration - 5) {
            videoRef.current.currentTime += 5
          } else {
            videoRef.current.currentTime = videoRef.current.duration
          }
          break
        case "ArrowUp":
          if (videoRef.current.volume < 1) {
            const newVolume = Math.min(videoRef.current.volume + 0.1, 1)
            setVolume(newVolume)
            videoRef.current.volume = newVolume
            setIsMuted(false)
          }
          break
        case "ArrowDown":
          if (videoRef.current.volume > 0) {
            const newVolume = Math.max(videoRef.current.volume - 0.1, 0)
            setVolume(newVolume)
            videoRef.current.volume = newVolume
            setIsMuted(newVolume === 0)
          }
          break
        case "f":
          toggleFullscreen()
          break
        case "m":
          toggleMute()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

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
      <video 
        ref={videoRef} 
        className="w-full h-full cursor-pointer" 
        onClick={togglePlay} 
        playsInline 
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/50">
          <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/80 p-4 text-white">
          <div className="text-center">
            <p className="mb-2 font-medium text-lg">{error}</p>
            <button 
              onClick={() => {
                setError(null)
                setIsLoading(true)
                initializeHLS()
              }} 
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Time Display - Top Left */}
      <div className="top-2 left-2 absolute bg-black/50 px-2 py-1 rounded text-white text-sm">
        {formatTime(currentTime)}
      </div>

      {/* Progress indicator showing watched progress from API */}
      {watchedProgress > 0 && (
        <div className="top-0 left-0 absolute bg-blue-500 h-1" style={{ width: `${watchedProgress}%` }} />
      )}

      {/* Controls Container */}
      {!error && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-black px-4 py-2 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* Progress Bar */}
            <div
              ref={progressRef}
              className="relative flex-1 bg-white/30 mx-2 rounded-full h-1 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="top-0 left-0 absolute bg-blue-500 rounded-full h-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Volume Control */}
            <button onClick={toggleMute} className="text-white hover:text-gray-300">
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Settings Button */}
            <button onClick={() => setShowSettings(!showSettings)} className="text-white hover:text-gray-300">
              <Settings className="w-6 h-6" />
            </button>

            {/* Fullscreen Button */}
            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
              <Maximize className="w-6 h-6" />
            </button>
          </div>
          {/* Settings Menu */}
          {showSettings && (
            <div className="right-12 bottom-14 absolute bg-black/90 p-2 rounded-md w-48">
              <div className="mb-1 px-2 font-medium text-white text-sm">Quality</div>
              <div className="max-h-40 overflow-y-auto">
                <button 
                  onClick={() => changeQuality(-1)}
                  className={`hover:bg-white/10 px-2 py-1 rounded w-full ${selectedQuality === -1 ? "text-blue-500" : "text-white"} text-sm text-left`}
                >
                  Auto
                </button>
                {qualities.map((quality) => (
                  <button
                    key={quality.value}
                    onClick={() => changeQuality(quality.value)}
                    className={`hover:bg-white/10 px-2 py-1 rounded w-full ${selectedQuality === quality.value ? "text-blue-500" : "text-white"} text-sm text-left`}
                  >
                    {quality.label} ({quality.bitrate} kbps)
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}