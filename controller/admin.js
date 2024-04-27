const signupModel = require('../models/signup')
const profileModel = require('../models/profile')
const messageModel = require('../models/messages')
const { blockUser, unblockUser } = require('../utils/userBlockUnblock')

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

exports.postBlockUserAgent = async (req, res) => {
    try {
        //Destructuring id from req query
        const { id } = req.query
        //Finding the member to check the current status of the member
        const findMember = await signupModel.findById(id)
        const { username, email } = findMember

        //Sending 404 if no user found
        if (!findMember) return res.status(404).json({ msg: 'No user found' })

        //Setting newstatus according to the old status
        const newStatus = findMember.status == 'active' ? 'blocked' : 'active'

        if (newStatus == 'blocked') blockUser(username, email)
        else unblockUser(username, email)

        const blockMember = await signupModel.findByIdAndUpdate(id, { $set: { status: newStatus } }, { new: true })

        if (blockMember.status == newStatus) return res.status(200).json({ msg: 'Status updated success' })
        else return res.status(404).json({ msg: 'Block status failed' })

    } catch (error) {
        console.log('Error in post block user and agent', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.getMessages = async (req, res) => {
    try {

        const messages = await messageModel.find()
        res.status(200).json({ msg: 'Messages list has been sended', messages })

    } catch (error) {
        console.log('Error in get messages', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.deleteMessages = async (req, res) => {
    try {

        const { id } = req.query
        const messageExist = await messageModel.findById(id)
        if (!messageExist) return res.status(404).json({ msg: 'Message doesnt exist' })

        await messageModel.deleteOne({ _id: id })
        res.status(200).json({ msg: 'Messages has been deleted' })


    } catch (error) {
        console.log('Error in delete messages', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}