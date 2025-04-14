const { Biodata, User, City } = require("../../models")
const Validator = require('validatorjs')
const fs = require('fs')

class BiodataController {
  //read single
  async findByUserID(req, res){
    if(req?.params?.user_id == 'undefined'){
      return res.status(200).json({
        status: false,
        message: 'Invalid User ID',
      })
    }
    let qRes = await Biodata.findOne({
      include: [
        {
          model: User,
          as: 'user',   
          attributes: ['id', 'uuid', 'email']
        },
        {
          model: City,
          as: 'city',   
          attributes: ['id', 'city']
        }
      ],
      where: {user_id: req.params.user_id}
    })

    return res.status(200).json({
      status: true,
      data: qRes
    })
  }

  //update
  async update(req, res){
    if(req?.params?.user_id == 'undefined'){
      return res.status(200).json({
        status: false,
        message: 'Invalid User ID',
      })
    }
    let rules = {
      fullname: 'required',
      // profile_picture: 'required', 
      city_id: 'required',
      number_phone: 'required',
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }
    let { fullname, city_id, address, number_phone } = req.body
    
    let biodata = await Biodata.findOne({where: {user_id: req.params.user_id}})
    if(!biodata?.fullname){
      return res.status(200).json({
        status: false,
        message: 'Data not found',
      })
    }

    let profile_picture = biodata.profile_picture;
    if(req?.body?.profile_picture){
      try {
          let _path = `./${biodata?.profile_picture}`
          if(_path != `./uploads/profile/default.png`){
            if(fs.existsSync(_path)){
              fs.unlinkSync(_path)
            }
          }
          profile_picture = req?.body?.profile_picture
      } catch(err) {
        return res.status(500).json({
          message: 'Process Error'
        })
      }
    }

    let city = await City.findOne({where: {id: city_id}})
    if(!city?.city){
      return res.status(200).json({
        status: false,
        message: 'City not found',
      })
    }

    let data = {
      fullname: fullname,
      profile_picture: profile_picture,
      city_id: city_id,
      address: address,
      number_phone: number_phone,
      updatedBy: req.user.id
    }

    let qRes = await Biodata.update(data, {
      where: {id: req.params.user_id}
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

  async uploadProfilePicture(req, res){
    if(req?.file == undefined){
			return res.status(200).json({
				status: false,
				message: 'Profile Picture Required'
			})
		}

		return res.status(200).json({
			status: true,
			message: req.file,
		});
  }
}


module.exports = BiodataController