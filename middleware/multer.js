const multer = require('multer')
const moment = require('moment')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == 'profile') {
      cb(null, './public/images/profile')
    } else if (file.fieldname == 'categoryImage') {
      cb(null, './public/images/category')
    }
  },
  filename: (req, file, cb) => {
    const currentDate = moment().format('DD-MM-HH-mm-ss')
    cb(null, currentDate + '-' + file.originalname)
  }
})


const upload = multer({ storage: storage })
module.exports = upload


