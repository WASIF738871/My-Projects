const jwt = require('jsonwebtoken')
const blogModel = require('../models/blogModel')

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key" || "X-Api-Key"]

        if (!token) {
            return res.status(400).send({ status: false, msg: "please send the token" })
        }

        let decodedToken = jwt.verify(token, "WaJaiDhi-radon")

        if (!decodedToken) {
            return res.status(400).send({status: false, msg: "token is invalid"})
        }

        req["decodedToken"] = decodedToken

        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



const authorization = async function (req, res, next) {
    try {
        let validAuthorId = req.decodedToken.authorId
        let loginAuthor = req.params.blogId

        let author = await blogModel.findById(loginAuthor)
        if (author.authorId != validAuthorId) {
            return res.status(403).send({ status: false, msg: "Author is not authorized" })
        }

        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const authorizationForQuery = async function (req,res,next) {
    
    let data = req.query
    let {authorId, category, tags, subcategory, isPublished} = req.query
    let validAuthorId = req.decodedToken.authorId

    if (Object.keys(data).length == 0) {
        return res.status(400).send({status: false, msg : "please enter a query"})
    }

    let findAuthorId = await blogModel.find({
        authorId : req.decodedToken.authorId, $or: [
            {authorId : authorId}, 
            {tags: tags}, 
            {subcategory : subcategory}, 
            {category: category}, 
            {isPublished: isPublished}] 
        }).select({_id:0, authorId:1})

        console.log(findAuthorId)
        

    if (!findAuthorId[0]) {
        return res.status(404).send({status: false, msg: "document not found / you are not authorized"})
    }

    next()
}


module.exports.authentication = authentication
module.exports.authorization = authorization
module.exports.authorizationForQuery = authorizationForQuery