import { useEffect, useRef } from 'react'
import { useErrorMessage } from './ErrorMessageProvider'

import CloseIcon from '@mui/icons-material/Close'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

export default function ReaderView({ images, currentIndex, setCurrentIndex }) {
  const touchStartX = useRef(0)
  const showErrorMessage = useErrorMessage()

  const currentImage = Array.isArray(images) ? images[currentIndex] : null
  const open = Array.isArray(images) && images.length > 0 && currentIndex !== null

  const goToPrevious = () => {
    if (currentIndex === null || currentIndex === undefined) {
      return
    }

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      showErrorMessage('This is the first page')
    }
  }

  const goToNext = () => {
    if (currentIndex === null || currentIndex === undefined) {
      return
    }

    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      showErrorMessage('This is the last page')
    }
  }

  const goToList = () => setCurrentIndex(null)

  useEffect(() => {
    if (currentIndex === null || currentIndex === undefined) {
      return
    }

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') goToList()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, images])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (diff > 50) goToNext()
    if (diff < -50) goToPrevious()
  }

  const handleZoneClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const oneThird = width / 3

    if (x < oneThird) {
      goToPrevious()
    } else if (x > oneThird * 2) {
      goToNext()
    } else {
      goToList()
    }
  }

  return (
    <Dialog
      open={open}
      fullScreen
      onClose={goToList}
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#000',
          },
        },
      }}
    >
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {`Page ${currentIndex + 1} of ${images.length}`}
          </Typography>
          <Typography variant="body2" component="div" sx={{ mr: 1 }}>
            {currentImage?.url?.split('/').pop() || `Image ${currentIndex + 1}`}
          </Typography>
          <IconButton color="inherit" onClick={goToList}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <img
        src={currentImage?.url}
        alt={`Page ${currentIndex + 1}`}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          userSelect: 'none',
          backgroundColor: '#000',
          cursor: 'pointer',
        }}
        onClick={handleZoneClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
    </Dialog>
  )
}
