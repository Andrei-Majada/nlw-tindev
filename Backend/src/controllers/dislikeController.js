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
            console.log('deu match!')
        }

        loggedDev.dislikes.push(targerDev._id);

        await loggedDev.save();

        return res.json(loggedDev)
    }
};