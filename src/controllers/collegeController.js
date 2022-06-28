const collegeModel = require("../models/collegeModel")


const createColleges = async function(req,res){
    let response = req.body
    const dataCreated = await collegeModel.create(response)
    res.status(201).send({status:true, data:dataCreated})
}

const collegeDetails = async function(req,res){
    let college = req.query
    const result = await collegeModel.find({college})
    console.log(result)
    res.send(result)

}


module.exports = {createColleges,collegeDetails}