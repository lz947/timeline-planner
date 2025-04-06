"use client"

import * as React from "react";
import {useLocale, useTranslations} from "next-intl";
import {
  Navbar, 
  NavbarProps, 
  NavbarContent, 
  NavbarItem, 
  Link,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Selection
} from "@heroui/react";
import { NewProjectIcon } from "@/public/icons/NewProjectIcon";
import { LoadProjectIcon } from "@/public/icons/LoadProjectIcon";
import { SaveProjectIcon } from "@/public/icons/SaveProjectIcon";
import { LanguageIcon } from "@/public/icons/LanguageIcon";
import { useProjectState } from "@/utils/ProjectState";
import NewProjectModal from "../Modals/NewProjectModal";
import { locales, localNames } from "@/i18n/config";
import { setUserLocale } from "@/utils/locale";
import { RenameProjectIcon } from "@/public/icons/RenameProjectIcon";
import RenameProjectModal from "../Modals/RenameProjectModal";
import { useRouter } from "next/navigation";

const TimelineNav = ( props: NavbarProps ) => {
  const router = useRouter();
  // Locals
  const t = useTranslations("TimelineNav");
  const currentLocale = useLocale();

  // UI
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  // States
  // Global state
  const { projectState } = useProjectState();
  // Nav Projects state 
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false);
  const [projectDropdownTimeoutId, setProjectDropdownTimeoutId] = React.useState<any>(null);
  const delay = 1000;

  // Locale states
  const [isLocalDropdownOpen, setIsLocalDropdownOpen] = React.useState(false);
  const [localDropdownTimeoutId, setLocalDropdownTimeoutId] = React.useState<any>(null);
  const [selectedLocal, setSelectedLocal] = React.useState<Selection>(new Set([currentLocale]));

  // New Project Modal
  const { 
    isOpen: isNewProjectModalOpen, 
    onOpen: onNewProjectModalOpen, 
    onClose: onNewProjectModalClose 
  } = useDisclosure();

  // Rename project modal
  const { 
    isOpen: isRenameProjectModalOpen, 
    onOpen: onRenameProjectModalOpen, 
    onClose: onRenameProjectModalClose 
  } = useDisclosure();

  const routerToMainPage = () => {
    console.log("Hello?")
    router.push("/");
  };

  const switchLanguage = (selectedLocalSet: any) => {
    setSelectedLocal(selectedLocalSet);
    const selectedLocal = [...selectedLocalSet][0];
    setUserLocale(selectedLocal);
  };

  // Save project
  const saveProjectAsJson = () => {
    const jsonStr = JSON.stringify(projectState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = projectState.projectName;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Navbar {...props}>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Dropdown
            isOpen={isProjectDropdownOpen}>
            <DropdownTrigger>
              <Button 
                className="min-w-44 max-w-44"
                variant="bordered"
                onMouseEnter={() => {
                  clearTimeout(projectDropdownTimeoutId);
                  setIsProjectDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  const id = setTimeout(() => setIsProjectDropdownOpen(false), delay);
                  setProjectDropdownTimeoutId(id);
                }}
                // Use onClick here as onPress will be overwrite by DropdownTrigger
                onClick={routerToMainPage}
              >
                {projectState.editingMode
                  ? projectState.projectName
                  : t("noProject")
                }
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              variant="faded"
              onMouseEnter={() => {
                clearTimeout(projectDropdownTimeoutId);
                setIsProjectDropdownOpen(true);
              }}
              onMouseLeave={() => {
                setIsProjectDropdownOpen(false);
              }}
            >
              <DropdownItem
                key="new"
                startContent={<NewProjectIcon className={iconClasses} />}
                onPress={onNewProjectModalOpen}
              >
                {t("newProject")}
              </DropdownItem>
              <DropdownItem
                key="open"
                startContent={<LoadProjectIcon className={iconClasses} />}
              >
                {t("openProject")}
              </DropdownItem>
              <DropdownItem
                key="rename"
                startContent={<RenameProjectIcon className={iconClasses} />}
                onPress={onRenameProjectModalOpen}
                className={projectState.editingMode
                  ? ""
                  : "hidden"
                }
              >
                {t("renameProject")}
              </DropdownItem>
              <DropdownItem
                key="save"
                startContent={<SaveProjectIcon className={iconClasses} />}
                onPress={saveProjectAsJson}
                className={projectState.editingMode
                  ? ""
                  : "hidden"
                }
              >
                {t("saveProject")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        <NavbarItem>
          <Link 
            color="foreground"
            href="/entities"
            isDisabled={!projectState.editingMode}
          >
            {t("entityPageLink")}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            color="foreground"
            href="/events"
            isDisabled={!projectState.editingMode}
          >
            {t("eventPageLink")}
          </Link>
        </NavbarItem>
      </NavbarContent>
      {/* Locale switch */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown
            isOpen={isLocalDropdownOpen}>
            <DropdownTrigger>
              <LanguageIcon
                color="ffffff"
                width={36}
                height={36}
                onMouseEnter={() => {
                  clearTimeout(localDropdownTimeoutId);
                  setIsLocalDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  const id = setTimeout(() => setIsLocalDropdownOpen(false), delay);
                  setLocalDropdownTimeoutId(id);
                }}
              />
            </DropdownTrigger>
            <DropdownMenu 
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedLocal}
              onSelectionChange={switchLanguage}
              onMouseEnter={() => {
                clearTimeout(localDropdownTimeoutId);
                setIsLocalDropdownOpen(true);
              }}
              onMouseLeave={() => {
                setIsLocalDropdownOpen(false);
              }}
            >
              {locales.map((local)=>(
                <DropdownItem 
                  key={local}
                >{localNames[local]}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
      {/* Modals */}
      <NewProjectModal isOpen={isNewProjectModalOpen} onOpenChange={onNewProjectModalClose}>
        <></>
      </NewProjectModal>
      <RenameProjectModal isOpen={isRenameProjectModalOpen} onOpenChange={onRenameProjectModalClose}>
        <></>
      </RenameProjectModal>
    </Navbar>
  );
}

export default TimelineNav;