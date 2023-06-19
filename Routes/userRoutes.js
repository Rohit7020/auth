const express=require("express");
const {AddUsr,Get, login, isAuth, isAdmin, upload, saveData} = require("../Controllers/UsrController");

const UsrRoute=express.Router();

UsrRoute.get("/Get",Get);
UsrRoute.post("/add",AddUsr);
UsrRoute.post("/login",login);
UsrRoute.post("/save",isAuth,isAdmin,upload.single("myImg"),saveData)


module.exports=UsrRoute;