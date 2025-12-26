import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

export default function LazyImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false)
  const [ratio, setRatio] = useState({ width: 1, height: 1 })
  const [open, setOpen] = useState(false)

  const handleLoad = (e) => {
    setRatio({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    })
    setLoaded(true)
  }

  const handleClick = () => {
    setOpen(true)
  }

  return (
    <>
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
            cursor: 'zoom-in',
          }}
          onLoad={handleLoad}
          onClick={handleClick}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        slotProps={{ paper: { sx: { borderRadius: 0 } } }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
          }}
        />
      </Dialog>
    </>
  )
}
