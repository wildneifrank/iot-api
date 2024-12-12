import { z } from "zod";

export const DogSchema = z.object({
  ownerId: z.string(),
  name: z.string(),
  age: z.number().int().nonnegative(),
  breed: z.string(),
  sensors: z.array(
    z.object({
      id: z.string(),
      data: z.record(z.any()),
      lastUpdated: z.string(),
      history: z
        .array(
          z.object({
            timestamp: z.string(),
            data: z.record(z.any()),
          })
        )
        .optional(),
    })
  ),
});

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  tel: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Invalid phone number format. Use (XX) XXXXX-XXXX"
    ),
});

export const UpdateUserSchema = UserSchema.partial().extend({
  key: z.string().min(1, "Key is required"),
});
