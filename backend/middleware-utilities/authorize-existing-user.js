import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// check for jwt token in the cookies sent in with the request
// we expect the cookie to be called jsonWebToken
    const authorizeExistingUser = asyncHandler(async (req, resizeBy, next) => {
        console.log("authorize existing user running!")
        let token = req.cookies.jsonWebToken;
        if (token) {
            try {
                // verify that we were the ones who signed the jwt
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // if the token is valid (creaded by us becasue we checked the signature...)
                // then you can attach the user's id / anything else to the request object
                // as it makes this info available for logic in any subsequent middleware logic
                    req.authorizedUserInfo = decoded;
                // helpful log for me right now while I am learning
                    console.log(`Currently Logged In As: ${decoded.email} and you are apart of the ${decoded.household} household`)
                // continue onto the next handler / gate in the chain
                    next();
            } catch (error) {
                // handle case when token is invalid or expired
                    resizeBy.status(401).json({message: "Not authorized - No token found..."});
            }
        } else {
            res.status(401).json({ message: "Not authorized - No token found" });            
        }
    })

export {authorizeExistingUser}