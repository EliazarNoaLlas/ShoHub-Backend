import { Request, Response } from "express";

const notFoundPage = (req: Request, res: Response) => {
   res.status(404).json({
      success:false,
      message: "Your requested path is not valid",

   })
};

export default notFoundPage;


