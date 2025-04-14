const express = require('express')
const router = express.Router()
const path = require('path')
const ProductController = require('../../controllers/api/ProductController')
const Middleware = require('../../middleware/Middleware')
const ctl = new ProductController()
const multer = require('multer')
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
	  folder: "product",
    allowed_formats: ['png', 'jpg', 'jpeg'],
	},
});

const upload = multer({
	storage: storage,
})

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `./uploads/product/`)
//   },
//   filename: function (req, file, cb) {
//     let ext = path.extname(file.originalname)
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext)
//   }
// })

// const upload = multer({
// 	storage: storage,
// 	fileFilter: (req, file, cb) => {
// 		if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
// 			cb(null, true);
// 		} else {
// 			cb(null, false);
// 			return cb(new Error('Only .png, .jpg and .jpeg format allowed'));
// 		}
// 	}
// })

router.get(`/product/public`, ctl.getAll)
router.get(`/product/`, Middleware.verifyJwt, Middleware.checkProfile, ctl.getAll)
router.get(`/product/:id/public`, ctl.findByID)
router.get(`/product/:id`, Middleware.verifyJwt, Middleware.checkProfile, ctl.findByID)
router.post(`/product`, Middleware.verifyJwt, Middleware.checkProfile, ctl.create)
router.put(`/product/:id`, Middleware.verifyJwt, Middleware.checkProfile, ctl.update)
router.delete(`/product/:id`, Middleware.verifyJwt, Middleware.checkProfile, ctl.delete)
router.post(`/product/upload-pics/`, upload.array('pictures', 4), Middleware.verifyJwt, Middleware.checkProfile, ctl.uploadPics)
router.delete(`/product/delete-pics/:id`, Middleware.verifyJwt, Middleware.checkProfile, ctl.deletePics)

module.exports = router
