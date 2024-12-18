import { z } from "zod";

export const DogSchema = z.object({
  ownerKey: z.string(),
  name: z.string(),
  age: z.number().int().nonnegative(),
  breed: z.string(),
  sensors: z.array(z.string()).default([]),
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

export const UpdateDogSchema = DogSchema.partial().extend({
  key: z.string().min(1, "Key is required"),
});
