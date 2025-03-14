module.exports = (fn) => {
    return async (req, res, next) => {  // Ensure async function
        try {
            await fn(req, res, next);   // Await async execution
        } catch (err) {
            next(err);
        }
    };
};
