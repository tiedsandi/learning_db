require('dotenv').config()

const controller = require('../controllers/api/AuthController')
const { sequelize, User } = require('../models')
const { QueryTypes } = require('sequelize')
const mockRequest = (body = {}) => ({ body })
const mockResponse = () => {
  const res = {}
  res.json = jest.fn().mockReturnValue(res)
  res.status = jest.fn().mockReturnValue(res)
  return res
}
const base = new controller();

describe('AuthController Unit Test', () => {
  beforeAll(async () => {

  })

  afterAll(async () => {
    User.destroy({
      where: {
        email: "test@gmail.com"
      }
    })
  })

  test('function register with success', async () => {
    const req = mockRequest({
      name: 'test',
      email: "test@gmail.com",
      password: 'rahasia',
    })
    const res = mockResponse()
    await base.register(req, res)
    expect(res.status).toBeCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        "message": "Register success, please sign in", 
      })
    )
  })

  test('function register with failed', async () => {
    const req = mockRequest()
    const res = mockResponse()
    await base.register(req, res)
    expect(res.status).toBeCalledWith(422)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        "message": "The form is not complete", 
      })
    )
  })

  test('function login with success', async () => {
    const req = mockRequest({
      email: 'ariardiansyah101@gmail.com',
      password: 'rahasia'
    })
    const res = mockResponse()
    await base.login(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        "message": "Email & Password Match", 
      })
    )
  })

  test('function login with failed', async () => {
    const req = mockRequest()
    const res = mockResponse()
    await base.login(req, res)
    expect(res.status).toBeCalledWith(422)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        "message": "The form is not complete", 
      })
    )
  })

  test('function login with email not found', async () => {
    const req = mockRequest({
      email: 'ari@gmail.com',
      password: 'rahasia'
    })
    const res = mockResponse()
    await base.login(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({
      message: "Email not found",
      status: false, 
    })
  })

  test('function login with invalid password', async () => {
    const req = mockRequest({
      email: 'ariardiansyah101@gmail.com',
      password: 'rahasia123'
    })
    const res = mockResponse()
    await base.login(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({
      message: "Invalid password",
      status: false, 
    })
  })
})