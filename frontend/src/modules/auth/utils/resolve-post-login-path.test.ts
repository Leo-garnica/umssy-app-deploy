import { describe, expect, it } from "vitest";
import { resolvePostLoginPath } from "./resolve-post-login-path";
describe("scoped post-login navigation", () => {
 it.each(["titulado","mentor","estudiante"])("returns %s to an allowed profile path",role=>{
  expect(resolvePostLoginPath(role,"/profile/documents")).toBe("/profile/documents");
  expect(resolvePostLoginPath(role,"/vacancies/abc?tab=details")).toBe("/vacancies/abc?tab=details");
 });
 it("chooses a published workspace for each role",()=>{
  expect(resolvePostLoginPath("titulado",null)).toBe("/dashboard");
  expect(resolvePostLoginPath("empresa",null)).toBe("/recruiters");
  expect(resolvePostLoginPath("administrativo",null)).toBe("/affinity-radar/review-queue");
  expect(resolvePostLoginPath(["titulado","empresa"],null)).toBe("/recruiters");
 });
 it.each(["//evil.com","https://evil.com","/login","/","/chat","/events","/backoffice/solicitudes"])("rejects unsafe or unpublished path %s",next=>{
  expect(resolvePostLoginPath("titulado",next)).toBe("/dashboard");
  expect(resolvePostLoginPath("administrativo",next)).toBe("/affinity-radar/review-queue");
 });
 it("enforces roles and preserves an authorized return path",()=>{
  expect(resolvePostLoginPath("empresa","/vacancies")).toBe("/recruiters");
  expect(resolvePostLoginPath("titulado","/matching")).toBe("/dashboard");
  expect(resolvePostLoginPath("administrativo","/recruiters")).toBe("/affinity-radar/review-queue");
  expect(resolvePostLoginPath("empresa","/matching?vacancyId=abc")).toBe("/matching?vacancyId=abc");
 });
});
