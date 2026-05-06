"use client";
import { TopBarLogo } from "./TopbarLogo";
import { TopBarNavigationTabs } from "./TopbarNavigationTabs";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "./notifications/NotificationBell";
import { User, Workspace } from "@/types/dashboard.types";

interface TopBarProps {
  user: User;
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  onWorkspaceChange: (workspace: Workspace) => void;
}

export function TopBar({
  user,
  workspaces,
  currentWorkspace,
  onWorkspaceChange,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-6">
        <TopBarLogo />
        <TopBarNavigationTabs />
        <div className="ml-auto flex items-center gap-3">
          {/* <WorkspaceSwitcher
            workspaces={workspaces}
            currentWorkspace={currentWorkspace}
            onWorkspaceChange={onWorkspaceChange}
          /> */}
          <NotificationBell />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}