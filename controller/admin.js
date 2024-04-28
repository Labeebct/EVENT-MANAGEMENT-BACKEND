const signupModel = require('../models/signup')
const messageModel = require('../models/messages')
const categoryModel = require('../models/category')
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

        //Taking all messages to a variable and passing to frontent
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

exports.getCategory = async (req, res) => {
    try {

        //Assigning all categories to a variable and passing to frontent
        const category = await categoryModel.find()
        res.status(200).json({ msg: 'Categories has been sended to frontent', category })

    } catch (error) {
        console.log('Error in get category', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.putBlockCategory = async (req,res) => {
    try {

        const { id } = req.query

        //Checking whether category exist if not exist returning 404
        const findCategory = await categoryModel.findById(id)

        if (!findCategory) return res.status(404).json({ msg: 'Category not found' })

        await categoryModel.updateOne({ _id: id }, { $set: { isBlocked: findCategory.isBlocked ? false : true } })

        res.status(200).json({ msg: 'Category has been blocked or unblocked' })


    } catch (error) {
        console.log('Error in put block category', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.postAddCategory = async (req, res) => {
    try {

        //Returing with status if profile not exist
        if (!req.file) return res.status(422).json({ msg: 'Please provide a profile picture' })

        //Desstructuring filename from req.file and creating the image path
        const { filename } = req.file
        const imagePath = '/images/category/' + filename

        //Destructuring datas to validate
        const { categoryName, categoryDiscription } = req.body

        if (categoryName.trim() == '' || categoryDiscription.trim() == '') return res.status(422).json({ msg: 'Please fill all fields' })

        //Inserting the image path to the req.body
        req.body.categoryImage = imagePath
        await categoryModel.create(req.body)
        res.status(200).json({ msg: 'Category added success' })


    } catch (error) {
        console.log('Error in post add category');
        res.status(500).json({ msg: 'Internal server error', error })
    }
}