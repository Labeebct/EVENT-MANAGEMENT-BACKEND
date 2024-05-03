const categoryModel = require('../models/category')

exports.getCategory = async (req, res) => {
    try {

        const categories = await categoryModel.find()
        res.status(200).json({ msg: 'Category list has been sended to the frontent', categories })

    } catch (error) {
        console.log('Error in get catgory');
        res.status(500).json({ msg: 'Internal server error', error })
    }
}
