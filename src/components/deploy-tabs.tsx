"use client";

import { Tabs } from "@heroui/react";
import { UploadHtmlForm } from "./upload-html-form";
import { DeployGitForm } from "./deploy-git-form";

export function DeployTabs() {
  return (
    <Tabs.Root defaultSelectedKey="html">
      <Tabs.ListContainer className="mb-6">
        <Tabs.List aria-label="Deploy method" className="inline-flex gap-1 rounded-full bg-black/[.04] p-1">
          <Tabs.Tab
            id="html"
            className="rounded-full px-4 py-2 text-sm font-medium text-black/60 outline-none data-[selected]:bg-white data-[selected]:text-black data-[selected]:shadow-sm"
          >
            Single HTML file
          </Tabs.Tab>
          <Tabs.Tab
            id="git"
            className="rounded-full px-4 py-2 text-sm font-medium text-black/60 outline-none data-[selected]:bg-white data-[selected]:text-black data-[selected]:shadow-sm"
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
