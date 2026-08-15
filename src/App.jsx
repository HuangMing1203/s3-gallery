import { lazy, Suspense, useState } from 'react'
import { useErrorMessage } from './components/ErrorMessageProvider'
import parseS3FileList from './utils/parseS3FileList'
import { isZipBlob } from './utils/fileType'
import { extractArchiveImages } from './utils/extractArchiveImages'

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
      const isZip = await isZipBlob(blob)

      let imgs = []
      if (isZip) {
        imgs = await extractArchiveImages(blob)
        if (imgs.length === 0) setError('No images found in the provided ZIP archive.')
      } else {
        const content = await blob.text()
        imgs = parseS3FileList(content, url)
        if (imgs.length === 0) setError('No images found in the provided S3 list.')
      }

      setImages(imgs)
    } catch (err) {
      const message = err?.message || 'Failed to load the selected file.'
      setError(
        message.includes('zip') || message.includes('archive')
          ? 'Failed to parse the ZIP archive.'
          : 'Failed to parse the S3 file list.',
      )
    }
  }

  return (
    <FileSelector
      placeholder="S3 file list URL (XML) or ZIP archive URL"
      accept="text/xml,application/xml,application/zip,application/x-zip-compressed"
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
