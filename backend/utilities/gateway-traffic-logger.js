// A simple middleware to log a message every time a request passes through it.
export const createGateTrafficLogger = (gateName) => {
    // Log a message indicating a request has passed through this middleware.
    // We can also log the method and URL to give more context.
    return (req, res, next) => {
        console.log("-------------------Request Passed Through Gate---------------------------")
        console.log(`A request just passed through the ${gateName} gate!`)
        console.log(`[${new Date().toISOString()}] - Request passed through: ${req.method} ${req.originalUrl}`);
        console.log("--------------------------------------------------------------------------")
        // Call next() to pass the request to the next middleware or gate handler.
        next();
    }
};