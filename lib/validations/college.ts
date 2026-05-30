import { z } from "zod";
import { CollegeType } from "@prisma/client";

export const collegeQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  type: z.nativeEnum(CollegeType).optional().or(z.literal("")),
  state: z.string().optional(),
  minFees: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().nonnegative())
    .optional(),
  maxFees: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().nonnegative())
    .optional(),
  minRating: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().min(0).max(5))
    .optional(),
  sortBy: z.enum(["rating", "fees", "name", "placements"]).default("rating"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z
    .string()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive()),
  limit: z
    .string()
    .default("12")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive()),
});

export type CollegeQueryInput = z.infer<typeof collegeQuerySchema>;

const courseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters"),
  duration: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 year")
    .max(6, "Duration cannot exceed 6 years"),
  fees: z.number().positive("Fees must be a positive number"),
  seats: z.number().positive("Seats must be a positive number").optional(),
});

const placementSchema = z.object({
  avgPackage: z.number().positive("Average package must be positive"),
  highestPackage: z.number().positive("Highest package must be positive"),
  placementRate: z
    .number()
    .min(0, "Placement rate cannot be below 0")
    .max(100, "Placement rate cannot exceed 100"),
  topRecruiters: z.array(z.string()).optional(),
  year: z.number().int(),
});

export const createCollegeSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name cannot exceed 200 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  rating: z
    .number()
    .min(0, "Rating cannot be below 0")
    .max(5, "Rating cannot exceed 5")
    .default(0),
  totalFees: z
    .number()
    .int("Total fees must be an integer")
    .positive("Total fees must be positive"),
  established: z
    .number()
    .int()
    .min(1800, "Established year must be 1800 or later")
    .max(new Date().getFullYear(), "Established year cannot be in the future")
    .optional(),
  type: z.nativeEnum(CollegeType),
  category: z.enum([
    "Engineering",
    "Medical",
    "Management",
    "Law",
    "Arts",
    "Commerce",
  ]),
  overview: z
    .string()
    .min(20, "Overview must be at least 20 characters")
    .max(5000, "Overview cannot exceed 5000 characters"),
  imageUrl: z.string().url("Image URL must be a valid URL").optional(),
  website: z.string().url("Website must be a valid URL").optional(),
  courses: z.array(courseSchema).optional(),
  placement: placementSchema.optional(),
});

export type CreateCollegeInput = z.infer<typeof createCollegeSchema>;
