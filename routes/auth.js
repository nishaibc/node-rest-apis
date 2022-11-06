const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');

//REGISTER
router.post("/register", async (req, res) => {
 
  const newUser = new User({
    
    username: req.body.username,
    email: req.body.email,
   // password: req.body.password,
    password: await bcrypt.hash(req.body.password, 5),
  });
 
  try {
    console.log(newUser);
    const savedUser = await newUser.save();
   
    console.log("savedUser",savedUser);
    res.status(201).json(savedUser);
    
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {

        try {
          // var username = req.body.email
          // var password = req.body.password
          let { username, password } = req.body

          // console.log(username, password)
  
          const user = await User.findOne({ $or: [{ username}] })

          !user && res.status(401).json("Wrong User Name");
          // .then(user => {

          const match = await bcrypt.compare(password, user.password)
          console.log("matched", match);
          
          //   if (match) {
          //     res.send("User login successfully")
          //     console.log("password  match")
  
          //   } else {
          //     console.log("password not match")
          //   }
          // if(err) {
          //     console.log(err)
          //     res.json({
          //         error: err
          //     })
          // }
          if (match) {
              let token = await jwt.sign({ id: user._id, isAdmin: user.isAdmin}, 'verySecretValue');
              let decode =  await jwt.verify(token, 'verySecretValue')
              res.json({
                  message: 'login succesfully!',
                 token,
                 data : decode   ,
                 user : user 
              })
          }
  
          else {
              res.json({
                  message: 'password doesnot matched!'
              })
          }
  
      
     
        // const hashedPassword = CryptoJS.AES.decrypt(
        //     user.password,
        //     process.env.PASS_SEC
        // );


        //const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
       
       // const inputPassword = req.body.password;

        // originalPassword != inputPassword && 
        //     res.status(401).json("Wrong Password");

        // const token = jwt.sign(
        // {
        //     id: user._id,
        //     isAdmin: user.isAdmin,
        // },
        // process.env.JWT_SEC,
        //     {expiresIn:"3d"}
        // );
  
        // const { password, ...others } = user._doc;  
     //  res.status(200).json(others);
      
    }catch(err){
        res.status(500).json(err);
        console.log(err)
    }

});

module.exports = router;
