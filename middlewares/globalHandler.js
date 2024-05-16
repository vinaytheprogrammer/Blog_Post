const globalErrHandler = (err, req, res, next) => {
  //status: failed/something/server error
  //messsage
  //stack
  const stack = err.stack;
  const messsage = err.message;
  const status = err.status ? err.status : "failed";
  const statusCode = err.statusCode ? err.statusCode : 500;
  //send response
  res.status(statusCode).json({
    messsage,
    status,
    stack,
  });
};
module.exports = globalErrHandler;
