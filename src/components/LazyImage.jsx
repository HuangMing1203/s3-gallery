import { useState, useRef, useEffect } from 'react'
import { Paper, Skeleton } from '@mui/material'

export default function LazyImage({ src, alt, onClick }) {
  const [loaded, setLoaded] = useState(false)
  const [ratio, setRatio] = useState({ width: 1, height: 1 })

  const handleLoad = (e) => {
    setRatio({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    })
    setLoaded(true)
  }

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${ratio.width} / ${ratio.height}`,
        transition: 'aspect-ratio 0.3s',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
        onLoad={handleLoad}
        onClick={onClick}
      />
    </Paper>
  )
}
