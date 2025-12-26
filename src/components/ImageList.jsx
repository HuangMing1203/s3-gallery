import Box from '@mui/material/Box'
import LazyImage from './LazyImage'

export default function ImageList({ images }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 2,
      }}
    >
      {images.map((img, i) => (
        <LazyImage key={img.url} src={img.url} alt={`img-${i}`} />
      ))}
    </Box>
  )
}
