import { Router } from "express";

const router = Router()

router.get("/loggerTest", (req, res)=>{
    req.logger.fatal("Test fatal")
    req.logger.error("Test error")
    req.logger.warning("Test warning")
    req.logger.info("Test info")
    req.logger.http("Test http")
    req.logger.debug("Test debug")
    res.send("Logger test")
})

export default router