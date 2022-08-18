import joi from "joi";

const commentSchema = joi.object({
    postId: joi.number().integer(),
    comment: joi.string().required()
});

export default commentSchema;