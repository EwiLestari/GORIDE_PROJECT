import { z } from 'zod';

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        status: 'error',
        message: 'Validation Error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

// Example Schemas
export const motorcycleSchema = z.object({
  category_id: z.string().uuid("Invalid category ID").optional(), // Sometimes frontend sends empty or we handle it later
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  license_plate: z.string().min(3, "License plate is required"),
  cc: z.preprocess((val) => Number(val), z.number().positive("CC must be a positive number")),
  color: z.string().min(3, "Color is required"),
  price_per_day: z.preprocess((val) => Number(val), z.number().positive("Price must be a positive number")),
  stock: z.preprocess((val) => Number(val), z.number().min(0, "Stock cannot be negative")),
  status: z.enum(['available', 'unavailable', 'maintenance']).default('available'),
  description: z.string().optional(),
  image_url: z.string().url("Invalid Image URL").optional().or(z.literal(''))
});

export const bookingSchema = z.object({
  motorcycle_id: z.string().uuid("Invalid motorcycle ID"),
  start_time: z.string().min(10, "Invalid start time"),
  end_time: z.string().min(10, "Invalid end time"),
  payment_method: z.string().min(2, "Payment method is required")
});

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});
