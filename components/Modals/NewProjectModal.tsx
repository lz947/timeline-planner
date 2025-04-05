"use client"

import * as React from "react";
import { useTranslations } from "next-intl";
import { 
  Button,
  Input,
  Modal, 
  ModalBody, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalProps
} from "@heroui/react";
import { useProjectState } from "@/utils/ProjectState";

const NewProjectModal = ( props:  ModalProps ) => {
  // States
  const { setProjectName, setEditingMode } = useProjectState();
  const [projectNameInvalid, setProjectNameInvalid] = React.useState(false);
  const [newProjectInput, setNewProjectInput] = React.useState("New Project");

  // Functions
  const createNewProject = () => {
    // Prepare Data
    // Use the name from input as the project name
    setProjectName(newProjectInput);
    // Enable editing mode
    setEditingMode(true);
    // Use everything in default
  }

  const onProjectNameInputChange = (e: any) => {
    setNewProjectInput(e.target.value);
    if (e.target.value == "") {
      setProjectNameInvalid(true);
    } else {
      setProjectNameInvalid(false);
    }
  }

  const t = useTranslations("NewProjectModal");

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{t("header")}</ModalHeader>
            <ModalBody>
              <Input
                label={t("inputLabel")}
                type="text"
                variant="underlined"
                value={newProjectInput}
                onChange={onProjectNameInputChange}
                isInvalid={projectNameInvalid}
                errorMessage={t("inputError")}
              />
              <p className="text-small text-default-400">{t("newProjectWarning")}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {t("closeButton")}
              </Button>
              <Button 
                color="primary" 
                isDisabled={projectNameInvalid}
                onPress={()=>{createNewProject();onClose();}}
              >
                {t("createButton")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default NewProjectModal;