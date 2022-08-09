import joi from "joi";

const postSchema = joi.object({
    content: joi.string(),
    postUrl: joi.string().uri().pattern(/^https?:\/\//).required()
});

export default postSchema;