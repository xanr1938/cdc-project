import { z } from 'zod';

// Server-side validation baseline. Adjust required fields only after the center
// confirms its official admission criteria and privacy notice.
export const applicationSchema = z.object({
  academicYear: z.number().int().min(2560).max(2700),
  childFirstName: z.string().trim().min(1).max(100),
  childLastName: z.string().trim().min(1).max(100),
  childDateOfBirth: z.iso.date(),
  childAddress: z.string().trim().min(1).max(1000),
  guardianFullName: z.string().trim().min(1).max(200),
  guardianRelation: z.string().trim().min(1).max(100),
  guardianPhone: z.string().trim().regex(/^[0-9+()\-\s]{8,25}$/),
  guardianEmail: z.email().max(254).optional().or(z.literal('')),
  privacyNoticeVersion: z.string().trim().min(1).max(40),
  privacyNoticeAccepted: z.literal(true)
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
