import createError from 'http-errors'
import multer, { FileFilterCallback } from 'multer'

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.split('/')[0] === 'image') {
      cb(null, true)
    } else {
      cb(new createError.BadRequest('You can only upload images'))
    }
  },
  limits: {
    files: 6,
    fileSize: 5000000, //5mb
  },
})
export default upload
