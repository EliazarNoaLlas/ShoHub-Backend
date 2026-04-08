import {z} from 'zod'

const createReview = z.object({
    userId: z.string({message:"User ID can not be undefined"}),
    productId: z.string(),
    rating: z.number().max(5,{message: "Maximum number is 5"}),
    message: z.string().min(10,{message:"Minimum character should be 10"})
});


export const reviewValidation = {createReview}