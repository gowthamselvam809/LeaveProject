const jwt = require('jsonwebtoken');

module.exports = {
    async logging(req, res, next) {
        console.log(new Date().toLocaleString(), req.method, req.url)
        next();
    },

    async jwtTokenValidation(req, res, next) {
        try {
            // console.log(req.headers)
            if (!req.headers || !req.headers.authorization) {
                try{
                    return res.status(401).json({ message: "session is expired 1", link: "http://localhost:3001/auth/signin" })
                }catch(err){
                    console.log(err)
                }
            } else {
                const [tokenType, token] = req.headers.authorization.split(' ');
                if (tokenType !== 'Bearer' || !token) {
                    return res.status(401).json({ message: "session is expired 2", link: "http://localhost:3001/auth/signin" })
                } else {
                    try {
                        req.user = jwt.verify(token, process.env.JWT_KEY);
                        next()
                    } catch (error) {
                        console.log(error)
                        return res.status(401).json({ message: "session is expired 3", link: "http://localhost:3001/auth/signin" })
                    }
                }
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "error while validating session 4", link: "http://localhost:3001/auth/signin" })
        }
    }
}