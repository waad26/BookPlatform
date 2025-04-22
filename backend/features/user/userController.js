const User = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsnowebtoken');
const { and } = require('sequelize');

//sign up 
exports.signup = async (req,res) => {
    try {
        const {name , UserName , email , password} = req.body;

        // check if the user is already have account
        const existUser = await User.findOne({where:{email}});
        if (existUser){
            return res.statuse(400).json({message :'User already exists' });
        }// end try 

        //encryption
        const HashPass = await bcrypt.hash(password,10);
        
        //sign up (new account)
        const user = await User.create ({
            name,
            UserName,
            email,
            password: HashPass ,
        });

        res.status(201).json({message: 'User created successfully',user});
    } catch (error){
        res.status(500).json({message: error.message});

    }
};

// login 
exports.login = async (req, res) => {
    try {
        const {email, password } = req.body ;

        const user = await user.findOne({where : {email}});
        if(!user){
            return res.status(400).json({message: 'invalid email'});
        } 

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message : 'invalid password'});
        }
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

//view info
exports.viewInfo = async (req , res) => {
    try {
        const userId = req.params.id;

        const user = await user.findByPk(userId,{
            attributes: {exclude:['password']},
        });

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        res.jsonb(user);
    }catch (error){
        res.status(500).json({message : error.message});

    }
};

//logout 
exports.logout = async (req,res) => {

};

//update user
exports.updateUser = async (req,res)=>{

};

//delete user
exports.deleteUser = async (req,res) => {

};

//change password 
exports.changePass = async (req,res) => { 

};

//forget password 
exports.forgetPass = async (req ,res) => {

};

//reset password 
exports.resetPass = async (req, res) => {

};

//verify email 
exports.verifyEmail = async (req, res) =>{

};

//block user
exports.blockUser = async (req, res) => { 

};

//unblock user 
exports.unblock = async (req, res) => {

};

//assign rule 
exports.assignRule = async (req, res) => {

};

//upload profile picture
exports.profPicture = async (req, res) => {

};

//refresh token
exports.reToken = async (req, res) => {

};