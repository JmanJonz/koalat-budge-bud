// A middleware function to log only the body of an incoming request.
// This requires the express.json() middleware to be applied beforehand.
export const reqBodyLogger = (req, res, next) => {
    // Check if the request body is present and not empty
    if (req.body && Object.keys(req.body).length > 0) {
        // Log a header and then the body content
        console.log("-------------------- Incoming Request Body --------------------");
        console.log(`From: ${req.ip}`)
        console.log(req.body);
        console.log("---------------------------------------------------------------");
    } else {
        // Log a message if the body is empty or not present
        console.log("-------------------- Incoming Request Body --------------------");
        console.log("Request body is empty.");
        console.log("---------------------------------------------------------------");
    }

    // Pass control to the next middleware in the stack
    next();
};