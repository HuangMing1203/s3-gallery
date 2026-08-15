import { useState } from 'react'
import Box from '@mui/material/Box'
import LazyImage from './LazyImage'
import ReaderView from './ReaderView'

export default function ImageList({ images }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 2,
        }}
      >
        {images.map((img, i) => (
          <LazyImage
            key={img.url}
            src={img.url}
            alt={`img-${i}`}
            onClick={() => setSelectedImageIndex(i)}
          />
        ))}
      </Box>

      <ReaderView
        images={images}
        currentIndex={selectedImageIndex}
        setCurrentIndex={setSelectedImageIndex}
      />
    </>
  )
}
