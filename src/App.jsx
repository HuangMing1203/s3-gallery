import { useState } from 'react'
import { useErrorMessage } from './components/ErrorMessageProvider'
import parseS3FileList from './utils/parseS3FileList'

import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import FileSelector from './components/FileSelector'
import LazyImage from './components/LazyImage'
import ErrorMessageProvider from './components/ErrorMessageProvider'

function S3FileSelector({ setImages }) {
  const setError = useErrorMessage()

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
    <FileSelector
      placeholder="S3 file list URL (XML)"
      accept="text/xml,application/xml"
      onSubmit={handleFileSubmit}
    />
  )
}

export default function App() {
  const [images, setImages] = useState([])
  const [previewImg, setPreviewImg] = useState(null)

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
        <ErrorMessageProvider>
          <S3FileSelector setImages={setImages} />
        </ErrorMessageProvider>

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
