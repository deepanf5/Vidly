import logger from "./logger.js"


export default function(err,req,res,next) {
  
    // logging level determine the important of the message 
    /**
     * we have 
     * error 
     * warn
     * info
     * verbise
     * debug
     * silly
     * **/

    logger.error(err);
    
    res.status(500).send('Something failed')
}