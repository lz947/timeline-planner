"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import TimelineNav from "@/components/TimelineNav/TimelineNav";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  // Header component states
  const [editingProject, setEditingProject] = React.useState(false);
  const [projectName, setProjectName] = React.useState('');

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <TimelineNav 
          editingProject={editingProject} 
          setEditingProject={setEditingProject}
          projectName={projectName}
          setProjectName={setProjectName}
        />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
