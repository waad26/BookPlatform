const User = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsnowebtoken');
const { and } = require('sequelize');
const crypto = require('crypto');
const { match } = require('assert');

const isAdmin = (req) => req.user && req.user.role === 'admin';

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
exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        console.warn(`Failed login attempt for email: ${email} at ${new Date().toISOString()}`);
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        console.warn(`Failed login attempt for email: ${email} at ${new Date().toISOString()}`);
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      console.log(`User logged in: ${user.email} at ${new Date().toISOString()}`);
  
      res.status(200).json({ token });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ message: "Server error" });
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
exports.logoutUser = (req, res) => {
    try {
      console.log(`User ${req.user.email} logged out at ${new Date().toISOString()}`);
      res.clearCookie("token"); 
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  
//update Account 
exports.updateAC = async (req,res)=>{
    try{
    const userId = req.params.id;
    const { name, UserName, email, password } = req.body;
    const user = await user.findByPk(userId);

    if(!user){
     return res.status(404).json({message:'user not found'});
    }
    
    if (password){
    const HashPass = await bcrypt.hash(password,10);
    user.password= HashPass;
    }

    if (user) user.name = user || user.name ;
    if (UserName) user.UserName = UserName || user.UserName ;
    if (email) user.email = email || user.email ;

    await user.save();

    res.status(201).json({message:'Info was updated successfully',user});
} catch (error){
    res.status(500).json({message:'server error',error});
}

};

//delete user
exports.deleteUser = async (req,res) => {
    try{
        const userId = req.user.id; 
        const user = await user.findByPk(userId);
        if(!user){
            return res.status(404).json({message:'user not found'});
        }

       await user.destory();

       res.status(200).json({message:'Your account has been deleted'});  
    }catch(error){
        res.status(500).json({message:'somthing went wrong while deleting your account'});
    };

};

//change password 
exports.changePass = async (req,res) => {
    try{ 
    userId = req.user.id;
    const {currentPassword , NewPassword } = req.body;

    const user = await user.findByPk(userId);
    if(!user){
        res.status(404).json({message:'user not found'});
    }

    const isMatch = await bcrypt.compare(currentPassword , user.password);
    if (isMatch){
        res.status(400).json({message:'incorrect password'});
    }


    const NewPass = await bcrypt(password,10);
    password = NewPass ;
    await user.save();

    res.status(200).json({message:'changed password successfully'});
} catch(error){
    req.status(500).json({message:'somthing went wrong'});
}
};

//forget password 
exports.forgetPass = async (req ,res) => {
    try{
            const {email} = req.body;
            const user = await user.findOne({where:{email}});
            if (!user){
                res.status(404).json({message:'user not found'});
             }
            
            const resetcode = Math.floor(100000 + Math.random() *900000).toString();
            const resetToken = crypto.createHash("sha256").update(resetcode).digest("hex");

            user.resetToken = resetToken ;
            user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
            await user.save();

            // send code to email
            console.log('reset code for you password : ${resetcode}');

            res.status(200).json({ message: "Reset code sent to email" });
        } catch (error) {
          res.status(500).json({ message: "Something went wrong" });
        }
};

// reset password
exports.resetPass = async (req, res) => {
    try {
      const { email, resetCode, newPassword } = req.body;
      const user = await User.findOne({ where: { email } });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const hashedCode = crypto.createHash("sha256").update(resetCode).digest("hex");
  
      if (user.resetToken !== hashedCode || Date.now() > user.resetTokenExpiry) {
        return res.status(400).json({ message: "Invalid or expired code" });
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };

//verify email 
exports.verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;
  
      const user = await User.findOne({ where: { emailVerificationToken: token } });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      user.isVerified = true;
      user.emailVerificationToken = null;
      await user.save();
  
      res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
      console.error("Verify Email Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }; 

// block user
exports.blockUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!isAdmin(req)) {
        return res.status(403).json({ message: "Access denied." });
      }
  
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      if (user.id === req.user.id) {
        return res.status(400).json({ message: "You cannot block yourself." });
      }
  
      user.isBlocked = true;
      await user.save();
  
      res.status(200).json({ message: `User ${user.name} has been blocked.` });
    } catch (error) {
      console.error("Block User Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
// unblock user
exports.unblock = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!isAdmin(req)) {
        return res.status(403).json({ message: "Access denied." });
      }
  
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      user.isBlocked = false;
      await user.save();
  
      res.status(200).json({ message: `User ${user.name} has been unblocked.` });
    } catch (error) {
      console.error("Unblock User Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  