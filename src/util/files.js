export const getFileData = file => new Promise((resolve, reject) => {
  let reader = new FileReader()

  reader.onload = () => {
    let result = reader.result
    let pieces = result.split(',')
    let mimeTypeMatch = pieces[0].substring(5)
    let mimeType = mimeTypeMatch.split(';')[0]
    let data = pieces[1]

    let img = document.createElement('img')
    img.src = result
    img.alt = ''
    document.body.appendChild(img)

    window.setTimeout(() => {
      let width = img.width
      let height = img.height
      document.body.removeChild(img)

      resolve({ data, mimeType, width, height })
    }, 0)
  }

  reader.onerror = () => {
    reject(new Error('FileReader failed'))
  }

  reader.onabort = () => {
    reject(new Error('FileReader aborted'))
  }

  reader.readAsDataURL(file)
})




// WEBPACK FOOTER //
// ./app/util/files.js