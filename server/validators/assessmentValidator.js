/**
 * Assessment & Roadmap Validators
 */

const { z } = require('zod');

const saveAssessmentStepSchema = z.object({
  stepNumber: z.number().int().min(1).max(5),
  questionKey: z.string().min(1),
  answer: z.any()
});

const completeAssessmentSchema = z.object({
  answers: z.array(z.object({
    stepNumber: z.number().int().min(1).max(5),
    questionKey: z.string().min(1),
    answer: z.any()
  })).optional()
});

const updateRoadmapItemStatusSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed'])
});

module.exports = {
  saveAssessmentStepSchema,
  completeAssessmentSchema,
  updateRoadmapItemStatusSchema
};
