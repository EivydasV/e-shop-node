import { RequestHandler } from 'express'
import multiparty from 'multiparty'

const parseBody: RequestHandler = async (req, res, next) => {
  const form = new multiparty.Form(req.body)
  form.parse(req, function (err, fields, files) {
    // fields fields fields
  })

  return next()
}
export default parseBody
