import { z } from 'zod';

const emailValidator = z
  .string()
  .email('Must be a valid email address')
  .min(1, 'Email is required');

const groupIdValidator = z
  .string()
  .regex(/^\d+$/, 'Group ID must be a number')
  .transform((val) => parseInt(val, 10))
  .refine((val) => Number.isInteger(val) && val > 0, {
    message: 'Group ID must be a positive integer',
  });

const demandeIdValidator = z
  .string()
  .regex(/^\d+$/, 'Demande ID must be a number')
  .transform((val) => parseInt(val, 10))
  .refine((val) => Number.isInteger(val) && val > 0, {
    message: 'Demande ID must be a positive integer',
  });

const roleIdValidator = z
  .number()
  .int('Role ID must be an integer')
  .positive('Role ID must be positive');

const groupNameValidator = z
  .string()
  .min(1, 'Group name is required')
  .max(255, 'Group name must be less than 255 characters')
  .trim();

const emailsValidator = z
  .string()
  .transform((value) => value.split(','))
  .pipe(emailValidator.array())
  .optional();

export const validateSchema = z.object({
  groupName: groupNameValidator,
  demandeId: demandeIdValidator,
  emails: emailsValidator,
});

export const addUserSchema = z.object({
  userEmail: emailValidator,
  roleId: roleIdValidator,
});

export const updateUserSchema = z.object({
  userEmail: emailValidator,
  roleId: roleIdValidator,
});

export const removeUserSchema = z.object({
  userEmail: emailValidator,
});

export const updateNameSchema = z.object({
  groupName: groupNameValidator,
});

export const groupIdParamSchema = z.object({
  groupId: groupIdValidator,
});

export type AddUserInput = z.infer<typeof addUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type RemoveUserInput = z.infer<typeof removeUserSchema>;
export type UpdateNameInput = z.infer<typeof updateNameSchema>;
export type GroupIdParam = z.infer<typeof groupIdParamSchema>;
