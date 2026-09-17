import { Uploader, UploadParams } from '#src/domain/transportation/application/storage/uploader.js'
import { randomUUID } from 'node:crypto'

interface Upload {
    fileName: string
    url: string
}


export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({fileName}: UploadParams) {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url
    })

    return { url }
  }
}