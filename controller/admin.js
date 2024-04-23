const signupModel = require('../models/signup')
const profileModel = require('../models/profile')

exports.getUsersList = async (req, res) => {
    try {

        
        //Aggregating user datas to get both signup data and profile datas
        const usersList = await signupModel.aggregate([
            {
                $match: {
                    role: 'user'
                }
            },
            {
                $lookup:
                {
                    from: "profiles",
                    localField: "_id",
                    foreignField: "userId",
                    as: 'profile'
                }
            }])

        //Returning 404 if no usersList not found
        if (!usersList) return res.status(404).json({ msg: 'No users list found' })
        res.status(200).json({ msg: 'Users list has been sended', usersList })

    } catch (error) {
        console.log('Error in get users list', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.getAgentsList = async (req, res) => {
    try {

        //Aggregating user datas to get both signup data and profile datas
        const agentsList = await signupModel.aggregate([
            {
                $match: {
                    role: 'agent'
                }
            },
            {
                $lookup:
                {
                    from: "profiles",
                    localField: "_id",
                    foreignField: "userId",
                    as: 'profile'
                }
            }])

        //Returning 404 if no agentsList not found
        if (!agentsList) return res.status(404).json({ msg: 'No agents list found' })
        res.status(200).json({ msg: 'Agents list has been sended', agentsList })

    } catch (error) {
        console.log('Error in get agents list', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}