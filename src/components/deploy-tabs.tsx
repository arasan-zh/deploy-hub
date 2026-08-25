"use client";

import { Tabs } from "@heroui/react";
import { UploadHtmlForm } from "./upload-html-form";
import { DeployGitForm } from "./deploy-git-form";

export function DeployTabs() {
  return (
    <Tabs.Root defaultSelectedKey="html">
      <Tabs.ListContainer className="mb-6">
        <Tabs.List aria-label="Deploy method" className="inline-flex gap-1 rounded-full bg-surface-secondary p-1">
          <Tabs.Tab
            id="html"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground/55 outline-none transition data-[selected]:bg-surface data-[selected]:text-foreground data-[selected]:shadow-surface"
          >
            Single HTML file
          </Tabs.Tab>
          <Tabs.Tab
            id="git"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground/55 outline-none transition data-[selected]:bg-surface data-[selected]:text-foreground data-[selected]:shadow-surface"
          >
            Git repository
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel id="html">
        <UploadHtmlForm />
      </Tabs.Panel>
      <Tabs.Panel id="git">
        <DeployGitForm />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
