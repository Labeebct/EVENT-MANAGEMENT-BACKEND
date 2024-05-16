const signupModel = require('../models/signup')
const usersSignupModel = require('../models/adminSignup')
const bookingModel = require('../models/booking')
const messageModel = require('../models/messages')
const categoryModel = require('../models/category')
const eventsModel = require('../models/events')
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
                    foreignField: "memberId",
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
                    foreignField: "memberId",
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

exports.putBlockCategory = async (req, res) => {
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

exports.posEditCategory = async (req, res) => {
    try {

        //Desstructuring filename from req.file and creating the image path
        let imagePath;
        const { id } = req.query
        const findCategory = await categoryModel.findById(id)

        if (!req.file) imagePath = findCategory.categoryImage
        else imagePath = '/images/category/' + req.file.filename

        //Destructuring datas to validate
        const { categoryName, categoryDiscription } = req.body

        if (categoryName.trim() == '' || categoryDiscription.trim() == '') return res.status(422).json({ msg: 'Please fill all fields' })

        //Inserting the image path to the req.body
        req.body.categoryImage = imagePath
        await categoryModel.updateOne({ _id: id }, req.body, { upsert: true })
        res.status(200).json({ msg: 'Category Edited success' })


    } catch (error) {
        console.log('Error in post add category');
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.getEditCategory = async (req, res) => {
    try {

        const { id } = req.query

        //Checking whether category exist or not 
        const category = await categoryModel.findById(id)
        if (!category) return res.status(404).json({ msg: 'Category is not found' })

        res.status(200).json({ msg: 'Category has been sended to the frontent', category })


    } catch (error) {
        console.log('Error in get edit category', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.postSortMessages = async (req, res) => {
    try {
        const { sortValue } = req.body

        //If sortvalue is all finding all messages in the database else finding related to role
        const messages = sortValue == "all" ? await messageModel.find() : await messageModel.find({ role: sortValue })
        res.status(200).json({ msg: 'Messages has been send to the frontent', messages })

    } catch (error) {
        console.log('Error in post sortmessages', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.getAdminDashboard = async (req, res) => {
    try {

        const usersCount = await usersSignupModel.countDocuments({})
        const catagoryCount = await categoryModel.countDocuments({})
        const eventsCount = await eventsModel.countDocuments({})

        if (!usersCount || !catagoryCount) return res.status(404).json({ msg: 'Category or users are not found' })
        res.status(200).json({ msg: 'Users count and category count has been send to the frontent', usersCount, catagoryCount, eventsCount })

    } catch (error) {
        console.log('Error in get admim dashboard', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.getEventsList = async (req, res) => {
    try {

        const events = await eventsModel.find()
        res.status(200).json({ msg: 'Events list has been sended to frontent', events })
    } catch (error) {
        console.log('Error in get events list', error);
        res.status(500).json({ msg: 'Internal server error' })
    }
}

exports.getBookings = async (req, res) => {
    try {


        const bookings = await bookingModel.aggregate([
            {
                $lookup: {
                    from: "profiles",
                    localField: "user",
                    foreignField: "memberId",
                    as: 'userProfile'
                }
            },
            {
                $lookup: {
                    from: "profiles",
                    localField: "agent",
                    foreignField: "memberId",
                    as: 'agentProfile'
                }
            }
        ]);

        res.status(200).json({ msg: 'Bookings list has been sended to the frontent', bookings })
    } catch (error) {
        console.log('Error in get events list', error);
        res.status(500).json({ msg: 'Internal server error' })
    }
}