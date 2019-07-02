class responseHandler {
    constructor() { }

     makeResponse = (res, status, code, msg, result) => {

        res.status(code).send({
            status: status,
            code: code,
            msg: msg,
            result: result ? result : []
        });
     }
}

export default new responseHandler();