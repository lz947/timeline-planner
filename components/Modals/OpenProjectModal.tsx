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
import { instanceOfProjectState, useProjectState } from "@/utils/ProjectState";

const OpenProjectModal = ( props:  ModalProps ) => {
  const t = useTranslations("OpenProjectModal");
  // States
  const { setProjectState } = useProjectState();
  const [projectInvalid, setProjectInvalid] = React.useState(false);
  const [emptyProjectInput, setEmptyProjectInput] = React.useState(true);
  const [projectJsonText, setProjectJsonText] = React.useState("");

  // Functions
  const openProject = (onClose : any) => {
    try {
      const openedProjectState = JSON.parse(projectJsonText);
      if (instanceOfProjectState(openedProjectState)) {
        setProjectState(openedProjectState);
        onClose();
      } else {
        setProjectInvalid(true);
      }
    } catch (err) {
      setProjectInvalid(true);
    } finally {
      setEmptyProjectInput(true);
    }
  };

  const onOpenProjectInputChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) {
      setEmptyProjectInput(true);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setProjectJsonText(event.target?.result as string);
      } catch (err) {
        alert("Fail to upload the file, please try again!");
      }
    };
    reader.readAsText(file);
    setProjectInvalid(false);
    setEmptyProjectInput(false);
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
                type="file"
                accept="application/json"
                variant="underlined"
                isInvalid={projectInvalid}
                errorMessage={t("inputError")}
                onChange={onOpenProjectInputChange}
                id="openProjectFileInput"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {t("closeButton")}
              </Button>
              <Button 
                color="primary" 
                isDisabled={projectInvalid || emptyProjectInput}
                onPress={()=>{openProject(onClose);}}
              >
                {t("openButton")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default OpenProjectModal;