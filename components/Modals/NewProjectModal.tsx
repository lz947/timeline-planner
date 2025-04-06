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
import { ProjectState, useProjectState } from "@/utils/ProjectState";

const NewProjectModal = ( props:  ModalProps ) => {
  // States
  const { setProjectState } = useProjectState();
  const [projectNameInvalid, setProjectNameInvalid] = React.useState(false);
  const [newProjectInput, setNewProjectInput] = React.useState("New Project");

  // Functions
  const createNewProject = () => {
    // Prepare newProjectState
    // Set everything to default
    const newProjectState = {
      // Use the name from input as the project name
      projectName: newProjectInput,
      // Enable editing mode
      editingMode: true,
      entityTrackingId: 0,
      entities: {}
    } as ProjectState;
    setProjectState(newProjectState);
  };

  const onProjectNameInputChange = (e: any) => {
    setNewProjectInput(e.target.value);
    if (e.target.value == "") {
      setProjectNameInvalid(true);
    } else {
      setProjectNameInvalid(false);
    }
  };

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