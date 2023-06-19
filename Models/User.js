const mongoose=require('mongoose');

const Sch=new mongoose.Schema({
    "_id":String,
    "name":String,
    "Pwd":String,
    "role":{
        type:String,
        default:"admin" 
    }
})

const Usrmdl=mongoose.model("Users",Sch);
module.exports=Usrmdl;