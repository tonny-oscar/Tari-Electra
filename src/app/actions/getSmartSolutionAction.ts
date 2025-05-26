// src/app/actions/getSmartSolutionAction.ts
"use server";

import { getSmartSolution, SmartSolutionAdvisorInput, SmartSolutionAdvisorOutput } from '@/ai/flows/smart-solution-advisor';
import { z } from 'zod';

const InputSchema = z.object({
  propertyType: z.string().min(3, "Property type must be at least 3 characters"),
  usagePatterns: z.string().min(10, "Usage patterns description must be at least 10 characters"),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  recommendation?: SmartSolutionAdvisorOutput;
  isError?: boolean;
};

export async function getSmartSolutionAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    propertyType: formData.get('propertyType'),
    usagePatterns: formData.get('usagePatterns'),
  };

  const validatedFields = InputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Invalid form data. Please check your inputs.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      isError: true,
    };
  }

  const inputData: SmartSolutionAdvisorInput = {
    propertyType: validatedFields.data.propertyType,
    usagePatterns: validatedFields.data.usagePatterns,
  };

  try {
    const result = await getSmartSolution(inputData);
    return {
      message: "Successfully received recommendation!",
      recommendation: result,
      isError: false,
    };
  } catch (error) {
    console.error("Error calling Smart Solution Advisor:", error);
    return {
      message: "An error occurred while generating the recommendation. Please try again later.",
      isError: true,
    };
  }
}
