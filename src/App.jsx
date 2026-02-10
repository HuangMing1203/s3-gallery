import { lazy, Suspense, useState } from 'react'
import { useErrorMessage } from './components/ErrorMessageProvider'
import parseS3FileList from './utils/parseS3FileList'

import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import FileSelector from './components/FileSelector'
import ErrorMessageProvider from './components/ErrorMessageProvider'

const ImageList = lazy(() => import('./components/ImageList'))

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

  return (
    <>
      <AppBar position="static">
        <Toolbar>
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

        <Suspense>
          <ImageList images={images} />
        </Suspense>
      </Container>
    </>
  )
}
