export default function parseS3FileList(xml, inputUrl) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')
  const contents = doc.getElementsByTagName('Contents')

  // Get base URL without query or trailing slash. If inputUrl isn't a valid URL
  // (for example a `file:` or `blob:` pseudo-url) fall back to empty base.
  let baseUrl = ''
  try {
    const urlObj = new URL(inputUrl)
    baseUrl = urlObj.origin + urlObj.pathname.replace(/\/$/, '')
  } catch (e) {
    baseUrl = ''
  }

  const images = []
  for (let i = 0; i < contents.length; i++) {
    const key = contents[i].getElementsByTagName('Key')[0]?.textContent
    const lastModified =
      contents[i].getElementsByTagName('LastModified')[0]?.textContent
    if (key && /\.(jpe?g|png|gif|bmp|webp)$/i.test(key)) {
      // Join baseUrl and key (handle leading/trailing slash). If baseUrl is
      // empty, use the key as-is which may be a relative path.
      const imgUrl = baseUrl
        ? baseUrl.replace(/\/$/, '') + '/' + key.replace(/^\/+/, '')
        : key
      images.push({
        url: imgUrl,
        lastModified: lastModified ? new Date(lastModified) : new Date(0),
      })
    }
  }
  // Sort from newest to oldest
  images.sort((a, b) => b.lastModified - a.lastModified)
  return images
}
