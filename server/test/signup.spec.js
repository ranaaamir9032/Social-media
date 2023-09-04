import dotenv from 'dotenv'; 
dotenv.config({ path: '.env.test' });
import { Signup} from '../Controllers/AuthController.js';
import UserModel from '../Models/userModel';
import cloudinary from 'cloudinary';
import { Login } from '../Controllers/AuthController.js';
import bcrypt from 'bcrypt';
import * as Auth from '../Controllers/AuthController.js'


jest.mock('../Models/userModel'); 
jest.mock('cloudinary');

describe('Signup Function', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        password: 'testpassword',
        firstname: 'Test',
        lastname: 'User',
      },
      file: {
        // Mock file object
        originalname: 'test-image.jpg',
        buffer: Buffer.from('file'),
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    UserModel.findOne.mockReset();
    cloudinary.v2.uploader.upload.mockReset();
    UserModel.create.mockReset();
  });

  it('should create a new user when required data is provided', async () => {
    UserModel.findOne.mockResolvedValue(null);
    cloudinary.v2.uploader.upload.mockResolvedValue({
      public_id: 'mock-public-id',
      secure_url: 'mock-secure-url',
    });

    UserModel.create.mockResolvedValue({
      _id: 'mock-user-id',
      username: 'testuser',
      firstname: 'Test',
      lastname: 'User',
      image: {
        public_id: 'mock-public-id',
        url: 'mock-secure-url',
      },
    });

    await Signup(req, res);

    // Assertions
    // expect(UserModel.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    // expect(cloudinary.v2.uploader.upload).toHaveBeenCalledWith(
    // expect.objectContaining({ buffer: expect.stringMatching(/^data:image\/jpeg;base64,/)}),
    // );
      
    expect(UserModel.create).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpassword',
      firstname: 'Test',
      lastname: 'User',
      image: {
        public_id: 'mock-public-id',
        url: 'mock-secure-url',
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Register Successfully',
      user: {
        _id: 'mock-user-id',
        username: 'testuser',
        firstname: 'Test',
        lastname: 'User',
        image: {
          public_id: 'mock-public-id',
          url: 'mock-secure-url',
        },
      },
      token: expect.any(String),
    });
  });

  it('should return an error when username is already exist', async () => {
    UserModel.findOne.mockResolvedValue({
      _id: 'mock-user-id',
      username: 'testuser',
      firstname: 'Test',
      lastname: 'User',
      image: {
        public_id: 'mock-public-id',
        url: 'mock-secure-url',
      },
    });
 await Signup(req ,res)
    expect(cloudinary.v2.uploader.upload).toHaveBeenCalledTimes(0)
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already exists"
    })
  })

});


//---------------------Login Function use case--------------------------------

jest.mock('bcrypt')


describe('Login function', () => {
  it('should successfully log in a user', async () => {
    const mockUser = {
      _id: 'mockUserId',
      username: 'testuser',
      password: 'hashedPassword',
    };

    const req = {
      body: {
        username: 'testuser',
        password: 'password123',
      },
    };

    const res = {
      status: jest.fn(()=> res),
      json: jest.fn(),
      
    };

    // const mockCreateToken = jest.spyOn(Auth, 'createToken');
    // mockCreateToken.mockResolvedValue('mockedToken');

    // const createToken = {
    //   jwt: {
    //     sign: jest.fn(),
    //   },
    // };
    
    

    UserModel.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue('true');
    // createToken.jwt.sign.mockReturnValue("mockedToken");

    await Login(req, res);
    console.log(res , "response jhkjhjhgfhg")
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Loggin Successfully',
      user: mockUser,
      token:expect.any(String),
    });
  });


});

