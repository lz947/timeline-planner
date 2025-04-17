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
  Tooltip,
  Textarea
} from "@heroui/react";
import { Entity, useProjectState } from "@/utils/ProjectState";
import { DeleteIcon } from "@/public/icons/DeleteIcon";
import { getRandomColor } from "@/utils/misc";

const NewEventModal = ( props:  ModalProps ) => {
  const t = useTranslations("NewEntityModal");
  // States
  const { projectState, addEntity, addEntityType } = useProjectState();
  const [newEventNameInvalid, setNewEntityNameInvalid] = React.useState(false);
  const [newEventName, setNewEntityName] = React.useState("New Event");
  const [newEntityTypeInvalid, setNewEntityTypeInvalid] = React.useState(false);
  const [newEventSummary, setNewEventSummary] = React.useState("New Event");
  const [involvedEntities, setInvolvedEntities] = React.useState<number[]>([]);
  const [involvedEntityStatusKey, setInvolvedEntityStatusKey] = React.useState<string[]>([]);
  const [involvedEntityStatusValue, setInvolvedEntityStatusValue] = React.useState<string[]>([]);

  const addNewInvolvedEntity = () => {
    setInvolvedEntities([...involvedEntities, -1]);
    setInvolvedEntityStatusKey([...involvedEntityStatusKey, ""]);
    setInvolvedEntityStatusKeyDisabled([...involvedEntityStatusKeyDisabed, true]);
    setInvolvedEntityStatusValue([...involvedEntityStatusValue, ""]);
  };

  const removeAllInvolvedEntities = () => {
    setInvolvedEntities([]);
    setInvolvedEntityStatusKey([]);
    setInvolvedEntityStatusValue([]);
  };

  const onInvolvedEntitySelectionChange = (indexToChange: number, selectedEntityId: number) => {
    var newInvolvedEntities = [...involvedEntities];
    newInvolvedEntities[indexToChange] = selectedEntityId;
    setInvolvedEntities(newInvolvedEntities);
  };



  const [newEntityType, setNewEntityType] = React.useState(t("defaultEntityType"));
  const [newEventColor, setNewEventColor] = React.useState(getRandomColor());
  const [newEntityStatusKeys, setNewEntityStatusKeys] = React.useState<string[]>([]);
  const [newEntityStatusValues, setNewEntityStatusValues] = React.useState<string[]>([]);
  const [newEntityStatusInvalidKeys, setNewEntityStatusInvalidKeys] = React.useState<boolean[]>([]);
  const [newEntityStatusInvalidValues, setNewEntityStatusInvalidValues] = React.useState<boolean[]>([]);
  const [duplicatedStatusKeys, setDuplicatedStatusKeys] = React.useState<boolean[]>([]);

  // Functions
  // Create the new entity
  const createNewEntity = () => {
    // Check if it's a new entity type:
    // if (!projectState.entityTypes.includes(newEntityType)) {
    //   addEntityType(newEntityType);
    // }
    // // create the new entity
    // const newEntity = {
    //   id: projectState.entityTrackingId,
    //   type: newEntityType,
    //   name: newEventName,
    //   color: newEventColor,
    //   status: {},
    // } as Entity;
    // // Add the status attributes use -1 as initial status
    // newEntityStatusKeys.map((statusKey, index)=>{
    //   newEntity.status[statusKey] = {};
    //   newEntity.status[statusKey][-1] = ["INITIAL", newEntityStatusValues[index]];
    // });
    // addEntity(newEntity);
    console.log(involvedEntities);
  };

  // Entity Name, type, and color
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

  const onNewEventSummaryChange = (e: any) => {
    setNewEventSummary(e.target.value);
  };

  const onNewEventColorChange = (e: any) => {
    setNewEventColor(e.target.value);
  };

  // Entity status
  // Give a input array, return a array with same size where:
  // each element is true/false depend if that element is duplicated on input array
  const findDuplicates = (inputArray: Array<any>) => {
    const valueIndex = new Map();
    const duplicats = [];

    for (let i = 0; i < inputArray.length; i++) {
      if (valueIndex.has(inputArray[i])) {
        if(valueIndex.get(inputArray[i]) !== -1){
          duplicats[valueIndex.get(inputArray[i])] = true;
          valueIndex.set(inputArray[i], -1);
        }
        duplicats.push(true);
      } else {
        valueIndex.set(inputArray[i], i);
        duplicats.push(false);
      }
    }
    return duplicats;
  };

  const addNewStatusInputs = () => {
    const newKey = `${t("defaultEntityStatusKey")} ${newEntityStatusKeys.length + 1}`;
    const newValue = `${t("defaultEntitystatusValue")} ${newEntityStatusValues.length + 1}`;
    const newKeys = [...newEntityStatusKeys, newKey];
    setNewEntityStatusKeys(newKeys);
    setNewEntityStatusValues([...newEntityStatusValues, newValue]);
    setNewEntityStatusInvalidKeys([...newEntityStatusInvalidKeys, false]);
    setNewEntityStatusInvalidValues([...newEntityStatusInvalidValues, false]);
    setDuplicatedStatusKeys(findDuplicates(newKeys));
  };

  const removeAllStatusInputs = () => {
    setNewEntityStatusKeys([]);
    setNewEntityStatusValues([]);
    setNewEntityStatusInvalidKeys([]);
    setNewEntityStatusInvalidValues([]);
    setDuplicatedStatusKeys([]);
  }

  const removeOneStatusInputsByIndex = (indexToRemove: number) => {
    const newKeys = newEntityStatusKeys.filter((_, index) => index !== indexToRemove);
    setNewEntityStatusKeys(newKeys);
    setNewEntityStatusValues(newEntityStatusValues.filter((_, index) => index !== indexToRemove));
    setNewEntityStatusInvalidKeys(newEntityStatusInvalidKeys.filter((_, index) => index !== indexToRemove));
    setNewEntityStatusInvalidValues(newEntityStatusInvalidValues.filter((_, index) => index !== indexToRemove));
    setDuplicatedStatusKeys(findDuplicates(newKeys));
  }

  // Actual value change
  const onNewEntityStatusKeyChange = (e: any, indexToEdit: number) => {
    const newKeys = newEntityStatusKeys.map((item, idx) => (idx === indexToEdit ? e.target.value : item));
    if (e.target.value == "") {
      setNewEntityStatusInvalidKeys(newEntityStatusInvalidKeys.map((item, idx) => (idx === indexToEdit ? true : item)));
    } else {
      setNewEntityStatusInvalidKeys(newEntityStatusInvalidKeys.map((item, idx) => (idx === indexToEdit ? false : item)));
    }
    setNewEntityStatusKeys(newKeys);
    setDuplicatedStatusKeys(findDuplicates(newKeys));
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
    <Modal 
      size="xl"
      {...props}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">New Event</ModalHeader>
            <ModalBody>
              <div 
                className="flex gap-4 items-center"
              >
                <Input
                  isRequired
                  label={"Event Name"}
                  type="text"
                  variant="underlined"
                  value={newEventName}
                  onChange={onNewEntityNameChange}
                  isInvalid={newEventNameInvalid}
                  errorMessage={"Event name is required"}
                />
                <Input
                  type="color"
                  onChange={onNewEventColorChange}
                  value={newEventColor}
                  className="h-14 w-14 cursor-pointer"
                  classNames={{
                    input: "h-12 w-12 cursor-pointer",
                    innerWrapper: "ml-1 cursor-pointer",
                    inputWrapper: "h-14 w-14 p-0 cursor-pointer"
                  }}
                  radius="full"
                />
              </div>
              <Textarea
                variant="underlined"
                label="Summary"
                minRows={1}
                value={newEventSummary}
                onChange={onNewEventSummaryChange}
              />
              <div 
                className="flex gap-4 items-center"
              >
                <Tooltip 
                  showArrow={true}
                  content={"Click to add a entity that is involved in this event."}
                >
                  <Button
                    variant="bordered"
                    size="sm"
                    className="max-w-32"
                    onPress={addNewInvolvedEntity}
                  >Add involved entity</Button>
                </Tooltip>
                <Tooltip
                  color="danger"
                  showArrow={true}
                  content={"Click to remove all involved entities."}
                >
                  <Button
                    variant="bordered"
                    size="sm"
                    className="max-w-32"
                    color="danger"
                    onPress={removeAllInvolvedEntities}
                  >Remove all entities</Button>
                </Tooltip>
              </div>
              <div>
                {involvedEntities.map((_, index)=>(
                  <div 
                    className="flex gap-4 items-center"
                    key={index}
                  >
                    <Autocomplete
                      isRequired
                      label={"Involved entity"}
                      variant="underlined"
                      onSelectionChange={(selectedKey)=>{
                        onInvolvedEntitySelectionChange(index, Number(selectedKey));
                      }}
                      isInvalid={newEntityTypeInvalid}
                      errorMessage={"Please choose a entity"}
                    >
                      {
                        Object.keys(projectState.entities).map(Number).map(
                          (entityId) => (
                            <AutocompleteItem key={entityId}>{projectState.entities[entityId].name}</AutocompleteItem>
                          )
                        )
                      }
                    </Autocomplete>
                    <Autocomplete
                      label={"Entity status key"}
                      variant="underlined"
                      disabled={involvedEntityStatusKeyDisabed[index]}
                    >
                      {
                        Object.keys(projectState.entities[involvedEntities[index]].status).map(
                          (statusKey) => (
                            <AutocompleteItem key={statusKey}>{statusKey}</AutocompleteItem>
                          )
                        )
                      }
                    </Autocomplete>
                  
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
              
              <div>
                {newEntityStatusKeys.map((statusKey, index)=>(
                  <div 
                    className="flex gap-4 items-center"
                    key={index}
                  >
                    <Input
                      isRequired
                      label={t("statusKeyLabel")}
                      type="text"
                      variant="underlined"
                      value={statusKey}
                      onChange={(e)=>{onNewEntityStatusKeyChange(e,index)}}
                      isInvalid={newEntityStatusInvalidKeys[index] || duplicatedStatusKeys[index]}
                      errorMessage={t("statusKeyError")}
                    />
                    <Input
                      isRequired
                      label={t("statusValueLabel")}
                      type="text"
                      variant="underlined"
                      value={newEntityStatusValues[index]}
                      onChange={(e)=>{onNewEntityStatusValueChange(e,index)}}
                      isInvalid={newEntityStatusInvalidValues[index]}
                      errorMessage={t("statusValueError")}
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
                  newEventNameInvalid || newEntityTypeInvalid || 
                  newEntityStatusInvalidKeys.some(val => val === true) ||
                  newEntityStatusInvalidValues.some(val => val === true) ||
                  duplicatedStatusKeys.some(val => val === true)
                }
                onPress={()=>{createNewEntity();}}
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

export default NewEventModal;