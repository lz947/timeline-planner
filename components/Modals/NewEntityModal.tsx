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
import { Entity, useProjectState } from "@/utils/ProjectState";

const NewEntityModal = ( props:  ModalProps ) => {
  const t = useTranslations("NewEntityModal");
  // States
  const { projectState, addEntity } = useProjectState();
  const [newEntityTypeInvalid, setNewEntityTypeInvalid] = React.useState(false);
  const [newEntityType, setNewEntityType] = React.useState(t("defaultEntityType"));
  const [newEntityNameInvalid, setNewEntityNameInvalid] = React.useState(false);
  const [newEntityName, setNewEntityName] = React.useState(t("defaultEntityName"));

  // Functions
  const createNewEntity = () => {
    // Prepare newProjectState
    // Set everything to default
    const newEntity = {
      id: projectState.entityTrackingId,
      type: newEntityType,
      name: newEntityName
    } as Entity;
    addEntity(newEntity);
  };

  const onNewEntityTypeChange = (e: any) => {
    setNewEntityType(e.target.value);
    if (e.target.value == "") {
      setNewEntityTypeInvalid(true);
    } else {
      setNewEntityTypeInvalid(false);
    }
  };


  const onNewEntityNameChange = (e: any) => {
    setNewEntityName(e.target.value);
    if (e.target.value == "") {
      setNewEntityNameInvalid(true);
    } else {
      setNewEntityNameInvalid(false);
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
                isRequired
                label={t("entityTypeInputLabel")}
                type="text"
                variant="underlined"
                value={newEntityType}
                onChange={onNewEntityTypeChange}
                isInvalid={newEntityTypeInvalid}
                errorMessage={t("entityTypeInputError")}
              />
              <Input
                isRequired
                label={t("entityNameInputLabel")}
                type="text"
                variant="underlined"
                value={newEntityName}
                onChange={onNewEntityNameChange}
                isInvalid={newEntityNameInvalid}
                errorMessage={t("entityNameInputError")}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {t("closeButton")}
              </Button>
              <Button 
                color="primary" 
                isDisabled={newEntityNameInvalid || newEntityTypeInvalid}
                onPress={()=>{createNewEntity();onClose();}}
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

export default NewEntityModal;