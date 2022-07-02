const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const validation = require("../validator/validator");

let { isEmpty, isValidName, isValidFullName, isValidLogoLink } = validation;          //Destructing Validation Functions


//==================================================Creating College Data================================================

const createColleges = async function (req, res) {
  try {
        let data = req.body
        let { name, fullName, logoLink } = data;
        
        let fullNameSpaced = fullName.replace(/\s+/g, " ")             
        data['fullName'] = fullNameSpaced

        let nameUnSpaced = name.replace(/\s+/g, " ").toLowerCase()
        data['name'] = nameUnSpaced

        // Validating Requested Data Of User      

        if (Object.keys(data).length < 1) return res.status(400).send({ status: false, msg: "Insert Data : BAD REQUEST" })

        
        let checkCollege = await collegeModel.findOne({ name: data.name })
        if (checkCollege) {
          return res.status(400).send({ status: false, msg: "college name already exists" })
        }


        if (!isEmpty(name)) {
          return res.status(400).send({ status: false, msg: "Enter College Name" })
        }
        if (!isValidName(name)) {
          return res.status(400).send({ status: false, msg: "name only take alphabets" })
        }


        if (!isValidFullName(fullName)) {
          return res.status(400).send({ status: false, msg: "Enter Full Name" })
        }
        if (!isValidFullName(fullName)) {
          return res.status(400).send({ status: false, msg: "fullname only take alphabets" })
        }


        if (!isValidLogoLink(logoLink)) {
          return res.status(400).send({ status: false, msg: "Enter Logo Link" })
        }

    // Creating College Data After Validations

        
        let savedData = await collegeModel.create(data);

        return res.status(201).send({ status: true, msg: "college details are successfully created", data: savedData })
  } 
  catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
  }
}


//===================================Getting College Details AlongWith Intern's Details=================================

const collegeDetails = async function (req, res) {
  try {
        let collegeName = req.query
        let collegeToLowerCase = collegeName.collegeName.replace(/\s+/g, " ") .toLowerCase()

        if (!collegeName.collegeName) {
          return res.status(400).send({ status: false, msg: "Provide The College Name" })
        }

        let collegefound = await collegeModel.findOne({ name: collegeToLowerCase })      
        if (!collegefound) {
          return res.status(404).send({ status: false, msg: "No College Found" })
        }


        const { _id, name, fullName, logoLink } = collegefound

        let interns = await internModel.find({ collegeId: _id }).select({ _id: 1, name: 1, email: 1, mobile: 1, collegeId: 1 })         
        if (interns.length == 0) {
          let noIntern = "This College doesn't have any Intern"
          interns = noIntern
        }

        return res.status(200).send({ status: true, msg: "List Of The Interns Of This College", data: { name, fullName, logoLink, interns }  })  
  }
  catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
  }
}


module.exports = { createColleges, collegeDetails }