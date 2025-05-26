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
  isSuccess?: boolean; // Added for consistency
};

export async function getSmartSolutionAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("[getSmartSolutionAction] Action invoked.");
  try {
    const rawFormData = {
      propertyType: formData.get('propertyType'),
      usagePatterns: formData.get('usagePatterns'),
    };
    console.log("[getSmartSolutionAction] Raw form data:", rawFormData);

    const validatedFields = InputSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      console.error("[getSmartSolutionAction] Validation failed:", validatedFields.error.flatten().fieldErrors);
      return {
        message: "Invalid form data. Please check your inputs.",
        fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
        isError: true,
        isSuccess: false,
      };
    }
    console.log("[getSmartSolutionAction] Validation successful.");

    const inputData: SmartSolutionAdvisorInput = {
      propertyType: validatedFields.data.propertyType,
      usagePatterns: validatedFields.data.usagePatterns,
    };

    const result = await getSmartSolution(inputData);
    return {
      message: "Successfully received recommendation!",
      recommendation: result,
      isError: false,
      isSuccess: true,
    };
  } catch (error) {
    console.error("[getSmartSolutionAction] Error calling Smart Solution Advisor:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while generating the recommendation.";
    return {
      message: `An error occurred: ${errorMessage}. Please try again later.`,
      isError: true,
      isSuccess: false,
    };
  }
}
