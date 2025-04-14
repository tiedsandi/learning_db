const { User, Biodata } = require("../../models")
const jwt = require('jsonwebtoken')
const moment = require('moment')
const privateKey = process.env.JWT_PRIVATE_KEY
const { v4: uuidv4 } = require('uuid')
const Mailer = require("../../utils/Mailer")
const { genOTP } = require("../../utils/otp")
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const Validator = require('validatorjs')

class AuthController {
  
  async login(req, res) {
    let rules = {
      email: 'required|email',
      password: 'required' 
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }
  
    let {email, password} = req.body

    let user = await User.findOne({where: {email: email}})
    if(user == undefined){
      return res.status(200).json({
        status: false,
        message: 'Email not found'
      })
    }

    if(!bcrypt.compareSync(password, user.password)){
      return res.status(200).json({
        status: false,
        message: 'Invalid password'
      })
    }

    let token = jwt.sign({id: user.id, uid: user.uid, email: user.email}, privateKey, { expiresIn: '1d'})
    await User.update({token: token}, {where: {id: user.id}})

    return res.status(200).json({
      status: true,
      message: 'Email & Password Match',
      data: {
        token: token,
        user_id: user.id,
        expired_at: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
    })
  }

  async register(req, res) {
    let rules = {
      name: 'required',
      email: 'required|email',
      password: 'required|min:7',
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }

    let {email, name, password} = req.body

    let user = await User.findOne({where: {email: email}})
    if(user != undefined && user.email){
      return res.status(200).json({
        status: false,
        message: 'Email already used'
      })
    }

    let nUser = await User.create({
      uuid: uuidv4(),
      email: email,
      password: bcrypt.hashSync(password, salt)
    })

    let nBiodata = await Biodata.create({
      fullname: name,
      user_id: nUser.id,
      profile_picture: 'https://res.cloudinary.com/aribrilliantsyah/image/upload/v1656950809/profile/default_sjylgs.jpg'
    })

    new Mailer({
      from: process.env.MAIL_SENDER
    }).prepare({
      to: email,
      subject: 'Thank you 🎉',
      text: `Thank you for registering in second-hand platform, ${name}`,
      html: `<h1>Thank you for registering in second-hand platform ${name}</h1>`
    }).send()

    return res.status(201).json({
      status: true,
      message: 'Register success, please sign in',
      data: {
        name: nBiodata.fullname,
        email: nUser.email
      }
    })
  }
  
  async forgot_password(req, res) {
    let rules = {
      email: 'required|email'
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }

    let { email } = req.body
    let user = await User.findOne({where: {email: email }})
    if(user == undefined){
      return res.status(200).json({
        status: false,
        message: 'Email not found'
      })
    }
  
    let otp = genOTP(6)
    await User.update({otp: otp}, {where: {id: user.id}})

    new Mailer({
      from: process.env.MAIL_SENDER
    }).prepare({
      to: email,
      subject: 'Forgot Password 🔒',
      text: `OTP for reset password: ${otp}`,
      html: `<h1>OTP for reset password: ${otp}</h1>`
    }).send()

    return res.status(200).json({
      status: true,
      message: 'Success OTP Send to Email',
      data: {
        email: email
      }
    })
  }

  async verify_otp(req, res){
    let rules = {
      email: 'required|email',
      otp: 'required|min:6|max:6',
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }

    let {otp, email} = req.body

    let user = await User.findOne({where: {email: email }})

    if(user == undefined){
      return res.status(200).json({
        status: false,
        message: 'Email not found'
      })
    }

    if(user.otp != otp){
      return res.status(200).json({
        status: false,
        message: 'Invalid OTP',
        data: {
          match: false
        }
      })
    }

    await User.update({otp: null}, {where: {id: user.id}})

    return res.status(200).json({
      status: true,
      message: 'OTP Match',
      data: {
        match: true,
        uid: user.uuid
      }
    })
  }

  async change_password(req, res){
    let rules = {
      uid: 'required',
      password: 'required|min:7',
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }

    let {uid, password} = req.body
    let user = await User.findOne({where: {uuid: uid}})

    if(user == undefined){
      return res.status(200).json({
        status: false,
        message: 'User not found'
      })
    }
    
    await User.update({password: bcrypt.hashSync(password, salt)}, {
      where: {
        id: user.id
      }
    })

    return res.status(200).json({
      status: true,
      message: 'Password Changed',
    })
  }
}

module.exports = AuthController