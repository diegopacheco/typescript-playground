import * as yup from "yup";

export const rentalSchema = yup.object({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{10,15}$/, "Phone must be 10-15 digits"),
  pickupDate: yup
    .string()
    .required("Pickup date is required"),
  returnDate: yup
    .string()
    .required("Return date is required"),
  carType: yup
    .string()
    .required("Please select a car type")
    .oneOf(["economy", "sedan", "suv", "luxury"], "Invalid car type"),
});

export type RentalForm = yup.InferType<typeof rentalSchema>;

export async function validateRental(data: unknown): Promise<{ success: boolean; errors?: Record<string, string>; data?: RentalForm }> {
  try {
    const validated = await rentalSchema.validate(data, { abortEarly: false });
    return { success: true, data: validated };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      for (const e of err.inner) {
        if (e.path && !errors[e.path]) {
          errors[e.path] = e.message;
        }
      }
      return { success: false, errors };
    }
    return { success: false, errors: { form: "Unexpected validation error" } };
  }
}
