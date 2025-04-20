"use client"

import * as React from "react";
import type { DateValue } from "@react-types/datepicker";
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
  Textarea,
  DatePicker
} from "@heroui/react";
import { Entity, useProjectState } from "@/utils/ProjectState";
import { DeleteIcon } from "@/public/icons/DeleteIcon";
import { getRandomColor } from "@/utils/misc";
import { parseAbsolute } from "@internationalized/date";

const NewEventModal = ( props:  ModalProps ) => {
  const t = useTranslations("NewEntityModal");
  // States
  const { projectState, addEntity, addEntityType } = useProjectState();
  // Event 
  const [newEventNameInvalid, setNewEntityNameInvalid] = React.useState(false);
  const [newEventName, setNewEntityName] = React.useState("New Event");
  const [newEventSummary, setNewEventSummary] = React.useState("New Event");
  const [newEventStartTime, setNewEventStartTime] = React.useState<DateValue | null>(
    parseAbsolute("2025-01-01T00:00:00.000Z", 'UTC')
  );
  const [newEventEndTime, setNewEventEndTime] = React.useState<DateValue | null>(
    parseAbsolute("2025-01-01T12:00:00.000Z", 'UTC')
  );

  const onStartTimeChange = (e: any) => {
    console.log(e);
    setNewEventStartTime(e);
  };

  const onEndTimeChange = (e: any) => {
    setNewEventEndTime(e);
  };

  // Status Changes
  const [involvedEntities, setInvolvedEntities] = React.useState<number[]>([]);
  const [involvedEntityStatusKey, setInvolvedEntityStatusKey] = React.useState<string[]>([]);
  const [involvedEntityStatusValue, setInvolvedEntityStatusValue] = React.useState<string[]>([]);
  const [availableInvolvedEntityStatusKey,setAvailableInvolvedEntityStatusKey] = React.useState<string[][]>([]);
  const [involvedEntityStatusKeyDisabled, setInvolvedEntityStatusKeyDisabled] = React.useState<boolean[]>([]);
  const [involvedEntityStatusValueDisabled, setInvolvedEntityStatusValueDisabled] = React.useState<boolean[]>([]);
  const [involvedEntityStatusValueInvalid, setInvolvedEntityStatusValueInvalid] = React.useState<boolean[]>([]);

  const addNewInvolvedEntity = () => {
    setInvolvedEntities([...involvedEntities, -1]);
    setInvolvedEntityStatusKey([...involvedEntityStatusKey, ""]);
    setInvolvedEntityStatusValue([...involvedEntityStatusValue, ""]);
    setAvailableInvolvedEntityStatusKey([...availableInvolvedEntityStatusKey, []]);
    setInvolvedEntityStatusKeyDisabled([...involvedEntityStatusKeyDisabled, true]);
    setInvolvedEntityStatusValueDisabled([...involvedEntityStatusValueDisabled, true]);
    setInvolvedEntityStatusValueInvalid([...involvedEntityStatusValueDisabled, false]);
  };

  const removeAllInvolvedEntities = () => {
    setInvolvedEntities([]);
    setInvolvedEntityStatusKey([]);
    setInvolvedEntityStatusValue([]);
    setAvailableInvolvedEntityStatusKey([]);
    setInvolvedEntityStatusKeyDisabled([]);
    setInvolvedEntityStatusValueDisabled([]);
    setInvolvedEntityStatusValueInvalid([]);
  };

  const onInvolvedEntitySelectionChange = (selectedEntityId: number, indexToChange: number) => {
    // Set selected entity
    var newInvolvedEntities = [...involvedEntities];
    newInvolvedEntities[indexToChange] = selectedEntityId;
    setInvolvedEntities(newInvolvedEntities);
    // Prepare the auto complete for entity's status key
    var newAvailableInvolvedEntityStatusKey = [...availableInvolvedEntityStatusKey];
    newAvailableInvolvedEntityStatusKey[indexToChange] = projectState.entities[selectedEntityId].statusKeys;
    setAvailableInvolvedEntityStatusKey(newAvailableInvolvedEntityStatusKey);
    // Enable the status key autocomplete
    var newInvolvedEntityStatusKeyDisabled = [...involvedEntityStatusKeyDisabled];
    newInvolvedEntityStatusKeyDisabled[indexToChange] = false;
    setInvolvedEntityStatusKeyDisabled(newInvolvedEntityStatusKeyDisabled);
  };

  const onInvolvedEntityStatusKeyChange = (selectedEntityStatusKey: string, indexToChange: number) => {
    // Set selected entity's status key
    var newInvolvedEntityStatusKey = [...involvedEntityStatusKey];
    newInvolvedEntityStatusKey[indexToChange] = selectedEntityStatusKey;
    setInvolvedEntityStatusKey(newInvolvedEntityStatusKey);
    // Enable the status value input
    var newInvolvedEntityStatusValueDisabled = [...involvedEntityStatusValueDisabled];
    newInvolvedEntityStatusValueDisabled[indexToChange] = false;
    setInvolvedEntityStatusValueDisabled(newInvolvedEntityStatusValueDisabled);
    // Set the new value to default text if it's empty string
    if (involvedEntityStatusValue[indexToChange] == "") {
      var newInvolvedEntityStatusValue = [...involvedEntityStatusValue];
      newInvolvedEntityStatusValue[indexToChange] = "New status value"
      setInvolvedEntityStatusValue(newInvolvedEntityStatusValue);
    }
  };

  const onInvolvedEntityStatusValueChange = (e: any, indexToChange: number) => {
    var newInvolvedEntityStatusValue = [...involvedEntityStatusValue];
    newInvolvedEntityStatusValue[indexToChange] = e.target.value;
    setInvolvedEntityStatusValue(newInvolvedEntityStatusValue);
    var newInvolvedEntityStatusValueInvalid = [...involvedEntityStatusValueInvalid];
    if (e.target.value == "") {
      newInvolvedEntityStatusValueInvalid[indexToChange] = true;
    } else {
      newInvolvedEntityStatusValueInvalid[indexToChange] = false;
    }
    setInvolvedEntityStatusValueInvalid(newInvolvedEntityStatusValueInvalid);
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
      size="3xl"
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
                <div className="w-2/3">
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
                  <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    label="Event Start Date"
                    variant="underlined"
                    granularity="second"
                    hourCycle={24}
                    value={newEventStartTime}
                    onChange={onStartTimeChange}
                  />
                  <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    label="Event End Date"
                    variant="underlined"
                    granularity="second"
                    hourCycle={24}
                    value={newEventEndTime}
                    onChange={onEndTimeChange}
                  />
                </div>
               
              <Textarea
                variant="underlined"
                label="Summary"
                minRows={3}
                maxRows={6}
                value={newEventSummary}
                onChange={onNewEventSummaryChange}
              />
                
              </div>
             
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
                        onInvolvedEntitySelectionChange(Number(selectedKey), index);
                      }}
                      // isInvalid={newEntityTypeInvalid}
                      // errorMessage={"Please choose a entity"}
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
                      isDisabled={involvedEntityStatusKeyDisabled[index]}
                      onSelectionChange={(selectedKey)=>{
                        onInvolvedEntityStatusKeyChange(String(selectedKey), index);
                      }}
                    >
                      {
                        availableInvolvedEntityStatusKey[index].map(
                          (statusKey) => (
                            <AutocompleteItem key={statusKey}>{statusKey}</AutocompleteItem>
                          )
                        )
                      }
                    </Autocomplete>
                    <Input
                      label={t("statusValueLabel")}
                      type="text"
                      variant="underlined"
                      isDisabled={involvedEntityStatusValueDisabled[index]}
                      value={involvedEntityStatusValue[index]}
                      onChange={(e)=>{onInvolvedEntityStatusValueChange(e,index)}}
                      isInvalid={involvedEntityStatusValueInvalid[index]}
                      errorMessage="Please enter the updated status value."
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
                  newEventNameInvalid ||
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