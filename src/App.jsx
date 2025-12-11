import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Alert,
  Dialog,
} from '@mui/material'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import FileSelector from './components/FileSelector'
import LazyImage from './components/LazyImage'
import parseS3FileList from './utils/parseS3FileList'

export default function App() {
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [previewImg, setPreviewImg] = useState(null)

  const handleFileSubmit = async (blob, url, source) => {
    setError('')
    setImages([])
    try {
      const content = await blob.text()
      const imgs = parseS3FileList(content, url)
      if (imgs.length === 0)
        setError('No images found in the provided S3 list.')
      setImages(imgs)
    } catch (err) {
      setError('Failed to parse the S3 file list.')
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <PhotoLibraryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            S3 Gallery
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="xl"
        sx={{ my: 4, display: 'flex', flexFlow: 'nowrap column', gap: 3 }}
      >
        <FileSelector
          placeholder="S3 file list URL (XML)"
          accept="text/xml,application/xml"
          onSubmit={handleFileSubmit}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        {images.length > 0 ? (
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
                onClick={() => setPreviewImg(img)}
              />
            ))}
          </Box>
        ) : (
          !error && (
            <Typography variant="body2" color="text.secondary" align="center">
              No images loaded yet.
            </Typography>
          )
        )}
        {/* Image preview dialog */}
        <Dialog
          open={!!previewImg}
          onClose={() => setPreviewImg(null)}
          maxWidth={false}
          slotProps={{ paper: { sx: { borderRadius: 0 } } }}
        >
          <img
            src={previewImg?.url}
            alt="preview"
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
            }}
          />
        </Dialog>
      </Container>
    </>
  )
}
