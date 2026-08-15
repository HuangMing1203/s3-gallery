import test from 'node:test'
import assert from 'node:assert/strict'

import { isZipBlob } from '../src/utils/fileType.js'

test('detects ZIP content by file signature', async () => {
  const zipBytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00])
  const blob = new Blob([zipBytes])

  assert.equal(await isZipBlob(blob), true)
})

test('rejects non-ZIP content', async () => {
  const xmlBytes = new TextEncoder().encode('<?xml version="1.0"?><List/>')
  const blob = new Blob([xmlBytes], { type: 'text/xml' })

  assert.equal(await isZipBlob(blob), false)
})
