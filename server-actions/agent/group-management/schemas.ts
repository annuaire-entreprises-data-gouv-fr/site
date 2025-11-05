import { z } from "zod";

const emailValidator = z
  .string()
  .email("Must be a valid email address")
  .min(1, "Email is required");

const groupIdValidator = z
  .number()
  .int("Group ID must be an integer")
  .positive("Group ID must be positive");

const roleIdValidator = z
  .number()
  .int("Role ID must be an integer")
  .positive("Role ID must be positive");

const userIdValidator = z
  .number()
  .int("User ID must be an integer")
  .positive("User ID must be positive");

const groupNameValidator = z
  .string()
  .min(1, "Group name is required")
  .max(255, "Group name must be less than 255 characters")
  .trim();

export const addUserToGroupSchema = z.object({
  groupId: groupIdValidator,
  userEmail: emailValidator,
  roleId: roleIdValidator,
});

export const removeUserFromGroupSchema = z.object({
  groupId: groupIdValidator,
  userId: userIdValidator,
});

export const updateGroupNameSchema = z.object({
  groupId: groupIdValidator,
  groupName: groupNameValidator,
});

export const updateUserRoleInGroupSchema = z.object({
  groupId: groupIdValidator,
  userId: userIdValidator,
  roleId: roleIdValidator,
});
