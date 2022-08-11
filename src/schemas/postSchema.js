import joi from "joi";

const postSchema = joi.object({
    postText: joi.string(),
    postUrl: joi.string().uri().pattern(/^https?:\/\//).required()
});

export default postSchema;