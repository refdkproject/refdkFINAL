import jwt from "jsonwebtoken"

const generateToken = (res, userID) => {
  // create a jwt token
   return jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

export default generateToken
