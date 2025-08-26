export const logIfExecuted = (req, res, next) => {
    console.log("Middleware Execution Test Ran");
    next()
} 