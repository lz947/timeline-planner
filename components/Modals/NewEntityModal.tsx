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
  ModalProps,
  Autocomplete,
  AutocompleteItem
} from "@heroui/react";
import { Entity, useProjectState } from "@/utils/ProjectState";

const NewEntityModal = ( props:  ModalProps ) => {
  const t = useTranslations("NewEntityModal");
  // States
  const { projectState, addEntity, addEntityType } = useProjectState();
  const [newEntityTypeInvalid, setNewEntityTypeInvalid] = React.useState(false);
  const [newEntityType, setNewEntityType] = React.useState(t("defaultEntityType"));
  const [newEntityNameInvalid, setNewEntityNameInvalid] = React.useState(false);
  const [newEntityName, setNewEntityName] = React.useState(t("defaultEntityName"));

  // Functions
  const createNewEntity = () => {
    // Check if it's a new entity type:
    if (!projectState.entityTypes.includes(newEntityType)) {
      addEntityType(newEntityType);
    }
    // create the new entity
    const newEntity = {
      id: projectState.entityTrackingId,
      type: newEntityType,
      name: newEntityName
    } as Entity;
    addEntity(newEntity);
  };

  const onNewEntityTypeChange = (e: any) => {
    setNewEntityType(e);
    if (e == "") {
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
                label={t("entityNameInputLabel")}
                type="text"
                variant="underlined"
                value={newEntityName}
                onChange={onNewEntityNameChange}
                isInvalid={newEntityNameInvalid}
                errorMessage={t("entityNameInputError")}
              />
              <Input
                isRequired
                label={t("entityTypeInputLabel")}
                type="text"
                variant="underlined"
                value={newEntityType}
                // onChange={onNewEntityTypeChange}
                isInvalid={newEntityTypeInvalid}
                errorMessage={t("entityTypeInputError")}
              />
              <Autocomplete
                isRequired
                label={t("entityTypeInputLabel")}
                variant="underlined"
                inputValue={newEntityType}
                onInputChange={onNewEntityTypeChange}
                isInvalid={newEntityTypeInvalid}
                errorMessage={t("entityTypeInputError")}
                allowsCustomValue
              >
                {
                  projectState.entityTypes.map(
                    (entityType, index) => (
                      <AutocompleteItem key={index}>{entityType}</AutocompleteItem>
                    )
                  )
                }
                
              </Autocomplete>
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