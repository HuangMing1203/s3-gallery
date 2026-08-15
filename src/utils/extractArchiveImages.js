import { unzip } from 'fflate'

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']

export async function extractArchiveImages(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const uint8Array = new Uint8Array(event.target.result)

      unzip(uint8Array, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        const imageFiles = Object.entries(data)
          .filter(([filename]) => {
            if (filename.endsWith('/')) return false
            const ext = filename.split('.').pop()?.toLowerCase()
            return !!ext && imageExtensions.includes(ext)
          })
          .map(([filename, uint8arr]) => {
            const ext = filename.split('.').pop()?.toLowerCase() || 'png'
            const imageBlob = new Blob([uint8arr], { type: `image/${ext}` })
            return {
              name: filename,
              url: URL.createObjectURL(imageBlob),
            }
          })
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))

        resolve(imageFiles)
      })
    }

    reader.onerror = () => {
      reject(reader.error)
    }

    reader.readAsArrayBuffer(blob)
  })
}
