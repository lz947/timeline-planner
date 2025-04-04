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
  // Global Project Data
  const [projectData, setProjectData] = React.useState({});

  // Header component states
  const [editingProject, setEditingProject] = React.useState(false);
  const [projectName, setProjectName] = React.useState('');

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <TimelineNav 
          projectData={projectData}
          setProjectData={setProjectData}
          editingProject={editingProject} 
          setEditingProject={setEditingProject}
        />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
