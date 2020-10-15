const Dev = require('../models/Dev')

module.exports = {
    async store(req, res) {
        const { devId } = req.params;
        const { user } = req.headers;

        const  loggedDev = await Dev.findById(user);
        const targerDev = await Dev.findById(devId);

        if(!targerDev) {
            return res.status(400).json({    error:   'dev not exists'   });
        }

        if (targerDev.likes.includes(user)) {
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if (loggedSocket) {
                req.io.to("match", targerDev);
            }

            if (targerDev) {
                req.io.to("match", loggedSocket);
            }
        }

        loggedDev.likes.push(targerDev._id);

        await loggedDev.save();

        return res.json(loggedDev)
    }
};