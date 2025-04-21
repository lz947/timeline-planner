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
  const [newEventName, setNewEntityName] = React.useState("New Event");
  const [newEventSummary, setNewEventSummary] = React.useState("New Event");
  const [newEventStartTime, setNewEventStartTime] = React.useState<DateValue | null>(parseAbsolute("2025-01-01T00:00:00.000Z", 'UTC'));
  const [newEventEndTime, setNewEventEndTime] = React.useState<DateValue | null>(parseAbsolute("2025-01-01T12:00:00.000Z", 'UTC'));
  const [newEventNameInvalid, setNewEntityNameInvalid] = React.useState(false);
  const [startDateInvalid, setStartDateInvalid] = React.useState(false);
  const [endDateInvalid, setEndDateInvalid] = React.useState(false);

  const onStartTimeChange = (e: any) => {
    setNewEventStartTime(e);
    if (e == null) {
      setStartDateInvalid(true);
    } else {
      setStartDateInvalid(false);
    }
  };

  const onEndTimeChange = (e: any) => {
    setNewEventEndTime(e);
    if (e == null) {
      setEndDateInvalid(true);
    } else {
      setEndDateInvalid(false);
    }
  };

  // Status Changes
  const [involvedEntities, setInvolvedEntities] = React.useState<number[]>([]);
  const [statusChangeKeys, setStatusChangeKeys] = React.useState<string[]>([]);
  const [statusChangeValues, setStatusChangeValues] = React.useState<string[]>([]);
  const [availableStatusChangeKeys,setAvailableStatusChangeKeys] = React.useState<string[][]>([]);
  const [statusChangeKeysDisabled, setStatusChangeKeysDisabled] = React.useState<boolean[]>([]);
  const [statusChangeValuesDisabled, setStatusChangeValuesDisabled] = React.useState<boolean[]>([]);
  const [statusChangeKeysInvalid, setStatusChangeKeysInvalid] = React.useState<boolean[]>([]);
  const [statusChangeValuesInvalid, setStatusChangeValuesInvalid] = React.useState<boolean[]>([]);

  const addNewInvolvedEntity = () => {
    setInvolvedEntities([...involvedEntities, -1]);
    setStatusChangeKeys([...statusChangeKeys, ""]);
    setStatusChangeValues([...statusChangeValues, ""]);
    setAvailableStatusChangeKeys([...availableStatusChangeKeys, []]);
    setStatusChangeKeysDisabled([...statusChangeKeysDisabled, true]);
    setStatusChangeValuesDisabled([...statusChangeValuesDisabled, true]);
    setStatusChangeKeysInvalid([...statusChangeKeysInvalid, false]);
    setStatusChangeValuesInvalid([...statusChangeValuesDisabled, false]);
  };

  const removeAllInvolvedEntities = () => {
    setInvolvedEntities([]);
    setStatusChangeKeys([]);
    setStatusChangeValues([]);
    setAvailableStatusChangeKeys([]);
    setStatusChangeKeysDisabled([]);
    setStatusChangeValuesDisabled([]);
    setStatusChangeKeysInvalid([]);
    setStatusChangeValuesInvalid([]);
  };

  const onInvolvedEntitySelectionChange = (selectedEntityId: number, indexToChange: number) => {
    // Set selected entity
    var newInvolvedEntities = [...involvedEntities];
    newInvolvedEntities[indexToChange] = selectedEntityId;
    setInvolvedEntities(newInvolvedEntities);
    // Prepare the auto complete for entity's status key
    var newAvailableStatusChangeKeys = [...availableStatusChangeKeys];
    newAvailableStatusChangeKeys[indexToChange] = projectState.entities[selectedEntityId].statusKeys;
    setAvailableStatusChangeKeys(newAvailableStatusChangeKeys);
    // Enable the status key autocomplete
    var newStatusChangeKeysDisabled = [...statusChangeKeysDisabled];
    newStatusChangeKeysDisabled[indexToChange] = false;
    setStatusChangeKeysDisabled(newStatusChangeKeysDisabled);
  };

  const onStatusChangeKeysChange = (selectedEntityStatusKey: string, indexToChange: number) => {
    // Set selected entity's status key
    var newStatusChangeKeys = [...statusChangeKeys];
    newStatusChangeKeys[indexToChange] = selectedEntityStatusKey;
    setStatusChangeKeys(newStatusChangeKeys);
    // Enable the status value input
    var newStatusChangeValuesDisabled = [...statusChangeValuesDisabled];
    newStatusChangeValuesDisabled[indexToChange] = false;
    setStatusChangeValuesDisabled(newStatusChangeValuesDisabled);
    // Set the new value to default text if it's empty string
    if (statusChangeValues[indexToChange] == "") {
      var newStatusChangeValues = [...statusChangeValues];
      newStatusChangeValues[indexToChange] = "New status value"
      setStatusChangeValues(newStatusChangeValues);
    }
  };

  const onStatusChangeValuesChange = (e: any, indexToChange: number) => {
    var newStatusChangeValues = [...statusChangeValues];
    newStatusChangeValues[indexToChange] = e.target.value;
    setStatusChangeValues(newStatusChangeValues);
    var newStatusChangeValuesInvalid = [...statusChangeValuesInvalid];
    if (e.target.value == "") {
      newStatusChangeValuesInvalid[indexToChange] = true;
    } else {
      newStatusChangeValuesInvalid[indexToChange] = false;
    }
    setStatusChangeValuesInvalid(newStatusChangeValuesInvalid);
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
                <div className="w-full">
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
                    isRequired
                    hideTimeZone
                    showMonthAndYearPickers
                    label="Event Start Date"
                    variant="underlined"
                    granularity="second"
                    hourCycle={24}
                    value={newEventStartTime}
                    onChange={onStartTimeChange}
                    isInvalid={startDateInvalid}
                    errorMessage={"Start date is required"}
                  />
                  <DatePicker
                    isRequired
                    hideTimeZone
                    showMonthAndYearPickers
                    label="Event End Date"
                    variant="underlined"
                    granularity="second"
                    hourCycle={24}
                    value={newEventEndTime}
                    onChange={onEndTimeChange}
                    isInvalid={endDateInvalid}
                    errorMessage={"End date is required"}
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
                    <div>
                      <div className="flex gap-4 items-center">
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
                          isDisabled={statusChangeKeysDisabled[index]}
                          onSelectionChange={(selectedKey)=>{
                            onStatusChangeKeysChange(String(selectedKey), index);
                          }}
                        >
                          {
                            availableStatusChangeKeys[index].map(
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
                          isDisabled={statusChangeValuesDisabled[index]}
                          value={statusChangeValues[index]}
                          onChange={(e)=>{onStatusChangeValuesChange(e,index)}}
                          isInvalid={statusChangeValuesInvalid[index]}
                          errorMessage="Please enter the updated status value."
                        />
                      </div>
                      <div className="flex gap-4 items-center">
                        <DatePicker
                          className=""
                          isRequired
                          hideTimeZone
                          showMonthAndYearPickers
                          label="Event End Date"
                          variant="underlined"
                          granularity="second"
                          hourCycle={24}
                          onChange={onEndTimeChange}
                          isInvalid={endDateInvalid}
                          errorMessage={"End date is required"}
                        />
                      </div>
                    </div>
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