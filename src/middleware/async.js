/**
 * we're passing a function as arguments 
 * how to get the acces to req, res by returning the route 
 * handler function
 * 
 * */


export default function asyncmiddleWare(handler) {

    return async (req, res, next) => {
        try {
            await handler(req, res)

        }
        catch (ex) {
            next(ex)
        }

    }

}