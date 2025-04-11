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
  AutocompleteItem,
  Tooltip
} from "@heroui/react";
import { Entity, useProjectState } from "@/utils/ProjectState";
import { DeleteIcon } from "@/public/icons/DeleteIcon";

const NewEntityModal = ( props:  ModalProps ) => {
  const t = useTranslations("NewEntityModal");
  // States
  const { projectState, addEntity, addEntityType } = useProjectState();
  const [newEntityTypeInvalid, setNewEntityTypeInvalid] = React.useState(false);
  const [newEntityType, setNewEntityType] = React.useState(t("defaultEntityType"));
  const [newEntityNameInvalid, setNewEntityNameInvalid] = React.useState(false);
  const [newEntityName, setNewEntityName] = React.useState(t("defaultEntityName"));
  const [newEntityStatusKeys, setNewEntityStatusKeys] = React.useState<string[]>([]);
  const [newEntityStatusValues, setNewEntityStatusValues] = React.useState<string[]>([]);
  const [newEntityStatusInvalidKeys, setNewEntityStatusInvalidKeys] = React.useState<boolean[]>([]);
  const [newEntityStatusInvalidValues, setNewEntityStatusInvalidValues] = React.useState<boolean[]>([]);

  // Functions
  // Create the new entity
  const createNewEntity = () => {
    // Check if it's a new entity type:
    if (!projectState.entityTypes.includes(newEntityType)) {
      addEntityType(newEntityType);
    }
    // create the new entity
    const newEntity = {
      id: projectState.entityTrackingId,
      type: newEntityType,
      name: newEntityName,
      status: {},
    } as Entity;
    // Add the status attributes use -1 as initial status
    newEntityStatusKeys.map((statusKey, index)=>{
      newEntity.status[statusKey] = {};
      newEntity.status[statusKey][-1] = ["INITIAL", newEntityStatusValues[index]];
    });
    addEntity(newEntity);
  };

  // Entity Name and type
  const onNewEntityNameChange = (e: any) => {
    setNewEntityName(e.target.value);
    if (e.target.value == "") {
      setNewEntityNameInvalid(true);
    } else {
      setNewEntityNameInvalid(false);
    }
  };

  const onNewEntityTypeChange = (e: any) => {
    setNewEntityType(e);
    if (e == "") {
      setNewEntityTypeInvalid(true);
    } else {
      setNewEntityTypeInvalid(false);
    }
  };

  // Entity status
  const addNewStatusInputs = () => {
    const newKey = `Key ${newEntityStatusKeys.length + 1}`;
    const newValue = `Value ${newEntityStatusValues.length + 1}`;
    setNewEntityStatusKeys([...newEntityStatusKeys, newKey]);
    setNewEntityStatusValues([...newEntityStatusValues, newValue]);
    setNewEntityStatusInvalidKeys([...newEntityStatusInvalidKeys, false]);
    setNewEntityStatusInvalidValues([...newEntityStatusInvalidValues, false]);
  }

  const removeAllStatusInputs = () => {
    setNewEntityStatusKeys([]);
    setNewEntityStatusValues([]);
    setNewEntityStatusInvalidKeys([]);
    setNewEntityStatusInvalidValues([]);
  }

  const removeOneStatusInputsByIndex = (indexToRemove: number) => {
    setNewEntityStatusKeys(newEntityStatusKeys.filter((_, index) => index !== indexToRemove));
    setNewEntityStatusValues(newEntityStatusValues.filter((_, index) => index !== indexToRemove));
    setNewEntityStatusInvalidKeys(newEntityStatusInvalidKeys.filter((_, index) => index !== indexToRemove));
    setNewEntityStatusInvalidValues(newEntityStatusInvalidValues.filter((_, index) => index !== indexToRemove));
  }

  // Actual value change
  const onNewEntityStatusKeyChange = (e: any, indexToEdit: number) => {
    setNewEntityStatusKeys(newEntityStatusKeys.map((item, idx) => (idx === indexToEdit ? e.target.value : item)));
    if (e.target.value == "") {
      setNewEntityStatusInvalidKeys(newEntityStatusInvalidKeys.map((item, idx) => (idx === indexToEdit ? true : item)));
    } else {
      setNewEntityStatusInvalidKeys(newEntityStatusInvalidKeys.map((item, idx) => (idx === indexToEdit ? false : item)));
    }
    // TODO: Show error on duplicated key:
  };

  const onNewEntityStatusValueChange = (e: any, indexToEdit: number) => {
    setNewEntityStatusValues(newEntityStatusValues.map((item, idx) => (idx === indexToEdit ? e.target.value : item)));
    if (e.target.value == "") {
      setNewEntityStatusInvalidValues(newEntityStatusInvalidValues.map((item, idx) => (idx === indexToEdit ? true : item)));
    } else {
      setNewEntityStatusInvalidValues(newEntityStatusInvalidValues.map((item, idx) => (idx === indexToEdit ? false : item)));
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
              <div 
                className="flex gap-4 items-center"
              >
                <Tooltip 
                  showArrow={true}
                  content="Click to add initial status (key-value) of the entity, eg: birthday - 2000-01-01, status can be modified by events."
                >
                  <Button
                    variant="bordered"
                    size="sm"
                    className="max-w-32"
                    onPress={addNewStatusInputs}
                  >Add Initial Status</Button>
                </Tooltip>
                <Tooltip
                  color="danger"
                  showArrow={true}
                  content="Click to remove ALL initial Status for this entity."
                >
                  <Button
                    variant="bordered"
                    size="sm"
                    className="max-w-32"
                    color="danger"
                    onPress={removeAllStatusInputs}
                  >Remove All</Button>
                </Tooltip>
              </div>
              <div>
                {newEntityStatusKeys.map((statusKey, index)=>(
                  <div 
                    className="flex gap-4 items-center"
                    key={index}
                  >
                    <Input
                      isRequired
                      label={"Status Key"}
                      type="text"
                      variant="underlined"
                      value={statusKey}
                      onChange={(e)=>{onNewEntityStatusKeyChange(e,index)}}
                      isInvalid={newEntityStatusInvalidKeys[index]}
                      errorMessage={t("entityNameInputError")}
                    />
                    <Input
                      isRequired
                      label={"Status Value"}
                      type="text"
                      variant="underlined"
                      value={newEntityStatusValues[index]}
                      onChange={(e)=>{onNewEntityStatusValueChange(e,index)}}
                      isInvalid={newEntityStatusInvalidValues[index]}
                      errorMessage={t("entityNameInputError")}
                    />
                    <Button 
                      isIconOnly
                      variant="light"
                      color="danger"
                      className="min-w-6 min-h-6 w-6 h-6"
                      onPress={()=>{removeOneStatusInputsByIndex(index);}}
                    >
                      <DeleteIcon 
                        width={20}
                        height={20}
                      />
                    </Button>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {t("closeButton")}
              </Button>
              <Button 
                color="primary" 
                isDisabled={
                  newEntityNameInvalid || newEntityTypeInvalid || 
                  newEntityStatusInvalidKeys.some(val => val === true) ||
                  newEntityStatusInvalidValues.some(val => val === true)
                }
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