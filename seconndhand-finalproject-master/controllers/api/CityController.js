const { City, Biodata } = require("../../models")
const Validator = require('validatorjs')

class CityController {
  //read all
  async getAll(req, res){
    let qRes = await City.findAll()

    return res.status(200).json({
      status: true,
      data: qRes
    })
  }

  //read single
  async findByID(req, res){
    let qRes = await City.findOne({
      include: [
        {
          model: Biodata,
          as: 'biodata'
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
      city: 'required'
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }

    
    let { city } = req.body
    

    let qRes = await City.create({
      city: city,
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
      city: 'required'
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }
    
    let { city } = req.body

    let kota = await City.findOne({where: {id: req.params.id}})
    if(!kota?.city){
      return res.status(200).json({
        status: false,
        message: 'Data not found',
      })
    }

    let data = {
      city: city,
      updatedBy: req.user.id
    }

    let qRes = await City.update(data, {
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
    let kota = await City.findOne({where: {id: req.params.id}})
    if(!kota?.city){
      return res.status(200).json({
        status: false,
        message: 'Data not found',
      })
    }

    let qRes = await City.destroy({
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
}


module.exports = CityController