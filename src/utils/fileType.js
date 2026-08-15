export async function isZipBlob(blob) {
  if (!(blob instanceof Blob) && !(blob instanceof File)) {
    return false
  }

  try {
    const slice = blob.slice(0, 4)
    const buffer = await slice.arrayBuffer()
    const header = new Uint8Array(buffer)
    return header.length >= 4 && header[0] === 0x50 && header[1] === 0x4b && (header[2] === 0x03 || header[2] === 0x05 || header[2] === 0x07) && (header[3] === 0x04 || header[3] === 0x06 || header[3] === 0x08)
  } catch {
    return false
  }
}
