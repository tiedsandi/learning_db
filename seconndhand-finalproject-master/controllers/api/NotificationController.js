const { Notification, User } = require("../../models")
const Validator = require('validatorjs')
const Sequelize = require('sequelize');
const Op = Sequelize.Op

class NotificationController {
  //read all
  async getAll(req, res){
    let qRes = [];
    let page = req.query.page
    let limit = req.query.limit || 10
    let offset = (page - 1) * limit
    
    let qWhere = {}
    if(req.query.user_id != undefined) qWhere.user_id = req.query.user_id
    if(req.query.title) qWhere.title = { [Op.iLike]: `%${req.query.title}%` }  
    
    let qOrder = []
    if(req.query.order != undefined){
      let order = req.query.order
      order = order.split(',')
      if(order.length > 0){
        order.forEach((element, i) => {
          let column = element.split(':')
          if(column.length > 0){
            if(column[1] == 'ASC' || column[1] == 'DESC'){
              qOrder[i] = [
                column[0], column[1]
              ]
            }
          }
        })
      }
    }
    
    if(!page){
      qRes = await Notification.findAll({
        include: [
          {
            model: User,
            as: 'user',   
            attributes: ['id', 'uuid', 'email']
          }
        ],
        order: qOrder,
        where: qWhere
      })
    }else{
      qRes = await Notification.findAll({
        offset: offset,
        limit: limit,
        include: [
          {
            model: User,
            as: 'user',   
            attributes: ['id', 'uuid', 'email']
          }
        ],
        order: qOrder,
        where: qWhere
      })
    }

    return res.status(200).json({
      status: true,
      data: qRes
    })
  }

  //read single
  async findByID(req, res){
    let qRes = await Notification.findOne({
      include: [
        {
          model: User,
          as: 'user',   
          attributes: ['id', 'uuid', 'email']
        }
      ],
      where: {id: req.params.id}
    })

    return res.status(200).json({
      status: true,
      data: qRes
    })
  }

  //create
  async create(req, res){
    let rules = {
      user_id: 'required',
      title: 'required', 
      subtitle: 'required',
      message: 'required',
      path: 'required',
      image: 'required',
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }

    
    let { user_id, title, subtitle, message, path, image } = req.body
    
    let user = await User.findOne({where: {id: user_id}})
    if(!user?.email){
      return res.status(200).json({
        status: false,
        message: 'User not found',
      })
    }

    let qRes = await Notification.create({
      user_id: user_id,
      title: title,
      subtitle: subtitle,
      message: message,
      path: path,
      image: image,
      createdBy: req.user.id
    })

    if(qRes?.id) {
      return res.status(201).json({
        status: true,
        message: 'Create Successfully',
        data: qRes
      })
    }

    return res.status(200).json({
      status: false,
      message: 'Create Failed',
    })
  }

  //update
  async update(req, res){
    let rules = {
      user_id: 'required',
      title: 'required', 
      subtitle: 'required',
      message: 'required',
      path: 'required',
      image: 'required',
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }
    
    let { user_id, title, subtitle, message, path, image } = req.body

    let notification = await Notification.findOne({where: {id: req.params.id}})
    if(!notification?.title){
      return res.status(200).json({
        status: false,
        message: 'Data not found',
      })
    }

    let user = await User.findOne({where: {id: user_id}})
    if(!user?.email){
      return res.status(200).json({
        status: false,
        message: 'User not found',
      })
    }

    let data = {
      user_id: user_id,
      title: title,
      subtitle: subtitle,
      message: message,
      path: path,
      image: image,
      updatedBy: req.user.id
    }

    let qRes = await Notification.update(data, {
      where: {id: req.params.id}
    })

    if(qRes) {
      return res.status(200).json({
        status: true,
        message: 'Update Successfully',
        data: data
      })
    }

    return res.status(200).json({
      status: false,
      message: 'Update Failed',
    })
  }

  //delete
  async delete(req, res){
    let notification = await Notification.findOne({where: {id: req.params.id}})
    if(!notification?.title){
      return res.status(200).json({
        status: false,
        message: 'Data not found',
      })
    }

    let qRes = await Notification.destroy({
      where: {id: req.params.id}
    })

    if(qRes){
      return res.status(200).json({
        status: true,
        message: 'Delete Successfully',
      })
    }

    return res.status(200).json({
      status: false,
      message: 'Delete Failed',
    })
  }

  //mark_as_read
  async markAsRead(req, res){
    let notification = await Notification.findOne({where: {id: req.params.id}})
    if(!notification?.title){
      return res.status(200).json({
        status: false,
        message: 'Data not found',
      })
    }

    let qRes = await Notification.update({
      read: 1,
      updatedBy: req.user.id
    },{
      where: {id: req.params.id}
    })

    if(qRes){
      return res.status(200).json({
        status: true,
        message: 'Change Status Successfully',
      })
    }

    return res.status(200).json({
      status: false,
      message: 'Change Status Failed',
    })
  }

}


module.exports = NotificationController