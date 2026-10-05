import type { ProfileFieldErrors } from "../types/profile-field-errors.types";

export const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "cityId",
  "phone",
  "personalEmail",
  "headline",
  "aboutMe",
] as const satisfies readonly (keyof ProfileFieldErrors)[];

// Turn on when the users.interested_opportunities column exists (issues #62 and #63).
export const IS_INTERESTED_OPPORTUNITIES_ENABLED = false;
