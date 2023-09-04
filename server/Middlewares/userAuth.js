import jwt from "jsonwebtoken";
export const requireAuth = async (req, res, next) => {
  try {
    const {token} = req.cookies;
    console.log(token,"token")
    if (!token) {
      throw new Error("please Login To acces the resources");
    }

    const decode = jwt.verify(token, process.env.JWTKEY);
     console.log(decode)
    req.userId = decode.id;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
