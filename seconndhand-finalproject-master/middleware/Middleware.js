const jwt = require('jsonwebtoken')
const { Biodata } = require('../models');
const privateKey = process.env.JWT_PRIVATE_KEY

class Middleware {

  static verifyJwt(req, res, next){
    const authHeader = req.headers['authorization']
    if(!authHeader){
      return res.status(401).json({
        status: false,
        message: 'Unauthorized'
      })
    }

    const token = authHeader && authHeader.split(' ')[1]
    if(authHeader.split(' ')[0] != 'Bearer') return res.status(422).json({
      status: false,
      message: 'Invalid Bearer Token'
    })

    if (token == null) return res.status(401).json({
      status: false,
      message: 'Unauthorized'
    })

    jwt.verify(token, privateKey, (err, user) => {
      if (err) return res.status(403).json({
        message: 'Forbidden'
      })

      req.user = user
      next()
    })
  }

  static async checkProfile(req, res, next){
    if(req.user){
      const biodata = await Biodata.findOne({
        where: {user_id: req.user.id}
      })
      if(!biodata.fullname ||
        !biodata.profile_picture ||
        !biodata.city_id ||
        !biodata.address ||
        !biodata.number_phone){
          return res.status(400).json({
            status: false,
            message: 'Please complete your profile first!'
          })
        }
    }
    next()
  }
  
}

module.exports = Middleware