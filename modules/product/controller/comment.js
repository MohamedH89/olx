const commentModel = require("../../../DB/model/Comment");
const productModel = require("../../../DB/model/Product");
const { getIo } = require("../../../services/socket");



const createComment = async (req, res) => {
    const { body } = req.body;
    const { productId } = req.params; // product id
    const { _id } = req.user;

    const product = await productModel.findOne({ _id: productId });
    if (!product) {
        res.status(404).json({ message: 'in-valid product id' });
    }
    else {
        const createComment = new commentModel({ body, createdBy: _id, productId: product._id });
        const savedComment = await createComment.save();

        await productModel.findByIdAndUpdate(product._id, { $push: { comments: savedComment._id } }, { new: true });
        getIo().emit('comment', [savedComment]);
        res.status(201).json({ message: 'Done', savedComment });
    }
}


const replyOnComment = async (req, res) => {
    try {
        const { body } = req.body;
        const { productId, commentId } = req.params;
        const { _id } = req.user;

        const product = await productModel.findOne({ _id: productId });
        if (!product) {
            res.status(404).json({ message: 'in-valid product id' });
        }
        else {
            const comment = await commentModel.findOne({ _id: commentId, productId: product._id });
            if (!comment) {
                res.status(404).json({ message: 'in-valid comment id' });
            }
            else {
                const createComment = new commentModel({ body, createdBy: _id, productId: product._id });
                const savedComment = await createComment.save();

                await commentModel.findByIdAndUpdate(commentId, { $push: { replies: savedComment._id } });

                res.status(201).json({ message: 'Done', savedComment });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

const updateComment = async (req, res) => {
    try {
        const { body } = req.body;
        const { productId, commentId } = req.params;
        const { _id } = req.user;

        const product = await productModel.findOne({ _id: productId });
        if (!product) {
            res.status(404).json({ message: 'in-valid product id' });
        }
        else {
            const comment = await commentModel.findOne({ _id: commentId, productId: product._id, createdBy: _id });
            if (!comment) {
                res.status(404).json({ message: 'in-valid comment id' });
            }
            else {
                await commentModel.findByIdAndUpdate(commentId, { body });
                res.status(201).json({ message: 'Done' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}


const deleteComment = async (req, res) => {
    try {
        const { productId, commentId } = req.params;
        const { _id } = req.user;

        const product = await productModel.findOne({ _id: productId });
        if (!product) {
            res.status(404).json({ message: 'in-valid product id' });
        }
        else {
            const comment = await commentModel.findOne({ _id: commentId, productId: product._id });
            if (!comment) {
                res.status(404).json({ message: 'in-valid comment id' });
            }
            else {
                if (product.comments.includes(comment._id)) {
                    if (comment.createdBy.equals(_id) || product.createdBy.equals(_id)) {
                        await commentModel.findByIdAndDelete(commentId);
                        await productModel.findByIdAndUpdate(product._id, { $pull: { comments: comment._id } });
                        res.status(201).json({ message: 'Done' });
                    } else {
                        res.status(400).json({ message: 'you cant delete this comment' });
                    }
                } else {
                    if (comment.createdBy.equals(_id) || product.createdBy.equals(_id)) {
                        await commentModel.findByIdAndDelete(commentId);

                        // const parentComment = await commentModel
                        await commentModel.findOneAndUpdate({ replies: comment._id }, { $pull: { replies: comment._id } });
                        res.status(201).json({ message: 'Done' });
                    } else {
                        res.status(400).json({ message: 'you cant delete this comment' });
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}


const likeComment = async (req, res) => {
    try {
        const { productId, commentId } = req.params;
        const { _id } = req.user;

        const product = await productModel.findOne({ _id: productId });
        if (!product) {
            res.status(404).json({ message: 'in-valid product id' });
        }
        else {
            const comment = await commentModel.findOne({ _id: commentId, productId: product._id });
            if (!comment) {
                res.status(404).json({ message: 'in-valid comment id' });
            }
            else {
                if (comment.likes.includes(_id)) {
                    await commentModel.findByIdAndUpdate(commentId, { $pull: { likes: _id } });
                    res.status(409).json({ message: 'you unliked the comment' });
                } else {
                    await commentModel.findByIdAndUpdate(commentId, { $push: { likes: _id } });
                    res.status(409).json({ message: 'you liked the comment' });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}


module.exports = {
    createComment,
    replyOnComment,
    updateComment,
    deleteComment,
    likeComment
}