const jwt=require('jsonwebtoken')
const User=require('../models/user')
const auth=async(req,res,next)=>{
   
    try { 
      // console.log('first')
      const token = req.header("Authorization").split(" ")[1];

      // console.log(token)
      const decoded = await jwt.verify(token,process.env.CHECKER);
      // console.log(decoded._id)
      const user = await User.findOne({
        _id: decoded._id,
        tokens: token,
      });

      if (!user) {
        throw new Error("user not found");
      }
      req.token = token;
      req.user = user;
      next();
    } catch (e) {
      console.log(e)
      res.status(401).send({ error: "please first authenticate" });
    }

}
module.exports=auth
