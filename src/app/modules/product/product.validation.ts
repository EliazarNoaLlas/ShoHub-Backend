import { z } from "zod";

const createProduct = z.object({
  name: z.string({message:"Name is required"}).trim().min(5,{message:"Product's Name should be more than 5 characters"}),
  description: z.string().min(1),
  price: z.number({message:"Price is required"}),
  regularPrice: z.number({message:"Regular price is required"}),
  inStock: z.number(),
  photo: z.string({message:"Photo is required"}).url(), // assuming it's a URL
  isDeleted: z.boolean().default(false),
  rating: z.number().default(0),
  brand: z.string({message:"Brand is required"}),
  processor_type: z.string(),
  processor_model: z.string(),
  generation: z.string(),
  display: z.string(),
  display_size: z.string(),
  display_type: z.string(),
  ram: z.string(),
  ram_type: z.string(),
  hdd: z.string().optional(),
  ssd: z.string(),
  graphics: z.string(),
  operating_system: z.string(),
  features: z.array(z.string()),

});

export const productValidation = { createProduct };
