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

const RenameProjectModal = ( props:  ModalProps ) => {
  const t = useTranslations("RenameProjectModal");
  // States
  const { projectState, setProjectName } = useProjectState();
  const [projectNameInvalid, setProjectNameInvalid] = React.useState(false);
  const [newProjectNameInput, setNewProjectNameInput] = React.useState(projectState.projectName);

  // Functions
  const renameProject = () => {
    // Rename
    setProjectName(newProjectNameInput);
  };

  const onProjectNameInputChange = (e: any) => {
    setNewProjectNameInput(e.target.value);
    if (e.target.value == "") {
      setProjectNameInvalid(true);
    } else {
      setProjectNameInvalid(false);
    }
  };

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
                value={newProjectNameInput}
                onChange={onProjectNameInputChange}
                isInvalid={projectNameInvalid}
                errorMessage={t("inputError")}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {t("closeButton")}
              </Button>
              <Button 
                color="primary" 
                isDisabled={projectNameInvalid}
                onPress={()=>{renameProject();onClose();}}
              >
                {t("renameButton")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default RenameProjectModal;