import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { WorkspaceSectionMenu } from "./workspace-section-menu";
afterEach(cleanup);
describe("scoped workspace menu",()=>{
 it("supports profile navigation by keyboard",async()=>{
  const user=userEvent.setup();render(<WorkspaceSectionMenu pathname="/profile/settings" roles={["titulado"]}/>);
  const trigger=screen.getByRole("button",{name:"Secciones de Perfil profesional"});trigger.focus();await user.keyboard("{Enter}");
  expect(await screen.findByRole("menuitem",{name:"Configuración del perfil"})).toHaveAttribute("aria-current","page");
  expect(screen.getByRole("menuitem",{name:"Documentos y CV"})).toHaveAttribute("href","/profile/documents");
  await user.keyboard("{Escape}");await waitFor(()=>expect(trigger).toHaveAttribute("aria-expanded","false"));
 });
 it("lists only company routes included in this deploy",async()=>{
  const user=userEvent.setup();render(<WorkspaceSectionMenu pathname="/recruiters" roles={["empresa"]}/>);
  await user.click(screen.getByRole("button",{name:"Secciones de Empresas"}));
  expect(await screen.findByRole("menuitem",{name:"Publicar vacante"})).toHaveAttribute("href","/recruiters/job-offers/new");
  expect(screen.queryByRole("menuitem",{name:"Historial"})).toBeNull();
 });
 it("does not create a menu for excluded modules",()=>{render(<WorkspaceSectionMenu pathname="/chat" roles={["titulado"]}/>);expect(screen.queryByRole("button")).toBeNull();});
});
