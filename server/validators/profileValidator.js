/**
 * Profile & Skills Validators using Zod
 */

const { z } = require('zod');

const skillItemSchema = z.object({
  skillId: z.string().optional(),
  name: z.string().min(1, 'Skill name is required').trim(),
  category: z.string().optional().default('General'),
  proficiencyLevel: z.number().min(0).max(100).default(50)
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  degree: z.string().max(150).optional().default(''),
  branch: z.string().max(150).optional().default(''),
  college: z.string().max(250).optional().default(''),
  graduationYear: z.number().int().min(2020).max(2035).optional().default(2026),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional().default('Beginner'),
  bio: z.string().max(1000).optional().default(''),
  desiredCareer: z.string().max(150).optional().default(''),
  preferredJobType: z.enum(['Full-time', 'Internship', 'Remote', 'Hybrid', 'Part-time']).optional().default('Full-time'),
  targetIndustry: z.string().max(150).optional().default(''),
  preferredLocation: z.string().max(150).optional().default(''),
  hoursPerWeek: z.number().int().min(1).max(80).optional().default(10),
  skills: z.array(skillItemSchema).optional().default([])
});

module.exports = {
  updateProfileSchema,
  skillItemSchema
};
