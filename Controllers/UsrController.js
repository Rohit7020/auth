const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usrmdl = require('../Models/User');
const multer  = require('multer')                                                                                                                                       


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './img')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+"."+file.mimetype.split("/")[1])
    }
  });

const upload = multer({ storage: storage })

const saveData=(req,res)=>{
    console.log(req.file);
    res.end("data uploaded..")
}


const Get=async(req,res)=>{
    const data=await Usrmdl.find()
    res.json(data);
}

// user registration

const AddUsr=async(req,res)=>{

    //  finding usr ID...
    const reslt=await Usrmdl.findById({"_id":req.body._id});


    if(reslt){
        res.end("user already registered!!!")
    }
    else{

        // Adding new usr ...
        // generating plain pwd to hash code pwd
        
        const PwdH=await bcrypt.hash(req.body.Pwd,10);
       
        const newdata={...req.body,"Pwd":PwdH}
        
        const usr=  new Usrmdl(newdata);

        // saving data in database...
        usr.save().then(()=>{
            res.end("user Registered successfully!!")
        }).catch((er)=>{
            res.end(er);
        });

    };
};

// login user!!

const login=async(req,res)=>{

    // finding user details....
    const rslt=await Usrmdl.findById({"_id":req.body._id});                                                                                                                                                                                         
    if(rslt){

        // comparing plain password and hash code pwd
        const pwd=await bcrypt.compare(req.body.Pwd,rslt.Pwd);
        if(pwd){

            // generating jwt and sending token as a response in json format!!!
            const token=jwt.sign({"_id":req.body._id},"sree");
            res.json({"token":token})

            // entered details not match!!!
        }else{
            res.end(" wrong credentials!!");
        }

        // if user id is not found!!

    }
    else{
        res.end("usr not found!!");
    }

};

// Authentication

const isAuth=(req,res,next)=>{
    console.log(req.headers)
    try{
        const rs=jwt.verify(req.headers.authorization,"sree");

        if(rs){
            next();
        }
    }
    catch(er){
        res.end("pls provide valid token!!!");
    }

};

// Autherization 

const isAdmin=async(req,res,next)=>{
    let data=await Usrmdl.findById({"_id":req.headers._id});
    if(data.role=="admin"){
        next();
    }else{
        res.end("you are not allowed to add??")
    }

}

module.exports={AddUsr,Get,login,isAuth,isAdmin,upload,saveData};