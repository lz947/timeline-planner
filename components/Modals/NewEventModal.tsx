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
  DatePicker,
  Avatar
} from "@heroui/react";
import { Event, StatusChange, useProjectState } from "@/utils/ProjectState";
import { DeleteIcon } from "@/public/icons/DeleteIcon";
import { getRandomColor } from "@/utils/misc";
import { parseAbsolute } from "@internationalized/date";
import { getProjectTime } from "@/utils/projectTime";

const NewEventModal = ( props:  ModalProps ) => {
  const t = useTranslations("NewEventModal");
  // States
  const { projectState, setProjectEntites, addEvent, addStatusChange } = useProjectState();
  // Event 
  const [newEventName, setNewEntityName] = React.useState(t("defaultNewEventName"));
  const [newEventColor, setNewEventColor] = React.useState(getRandomColor());
  const [newEventStartTime, setNewEventStartTime] = React.useState<DateValue | null>(parseAbsolute("2025-01-01T00:00:00.000Z", 'UTC'));
  const [newEventEndTime, setNewEventEndTime] = React.useState<DateValue | null>(parseAbsolute("2025-01-01T12:00:00.000Z", 'UTC'));
  const [newEventSummary, setNewEventSummary] = React.useState(t("defaultNewEventSummary"));
  const [newEventNameInvalid, setNewEntityNameInvalid] = React.useState(false);
  const [startDateInvalid, setStartDateInvalid] = React.useState(false);
  const [endDateInvalid, setEndDateInvalid] = React.useState(false);

  // Entity Name, type, and color
  const onNewEntityNameChange = (e: any) => {
    setNewEntityName(e.target.value);
    if (e.target.value == "") {
      setNewEntityNameInvalid(true);
    } else {
      setNewEntityNameInvalid(false);
    }
  };

  const onNewEventColorChange = (e: any) => {
    setNewEventColor(e.target.value);
  };

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

  const onNewEventSummaryChange = (e: any) => {
    setNewEventSummary(e.target.value);
  };

  // Status Changes
  // Values
  const [involvedEntities, setInvolvedEntities] = React.useState<number[]>([]);
  const [statusChangeKeys, setStatusChangeKeys] = React.useState<string[]>([]);
  const [statusChangeValues, setStatusChangeValues] = React.useState<string[]>([]);
  const [availableStatusChangeKeys,setAvailableStatusChangeKeys] = React.useState<string[][]>([]);
  const [statusChangeTime, setStatusChangeTime] = React.useState<(DateValue | null)[]>([]);
  const [statusChangeDescriptions, setStatusChangeDescriptions] = React.useState<string[]>([]);
  // Disabled fields
  const [statusChangeKeysDisabled, setStatusChangeKeysDisabled] = React.useState<boolean[]>([]);
  const [statusChangeValuesDisabled, setStatusChangeValuesDisabled] = React.useState<boolean[]>([]);
  // Invalid fields
  const [statusChangeKeysInvalid, setStatusChangeKeysInvalid] = React.useState<boolean[]>([]);
  const [statusChangeValuesInvalid, setStatusChangeValuesInvalid] = React.useState<boolean[]>([]);
  const [statusChangeTimeInvalid, setStatusChangeTimeInvalid] = React.useState<boolean[]>([]);

  const addNewInvolvedEntity = () => {
    // Values
    setInvolvedEntities([...involvedEntities, -1]);
    setStatusChangeKeys([...statusChangeKeys, ""]);
    setStatusChangeValues([...statusChangeValues, ""]);
    setAvailableStatusChangeKeys([...availableStatusChangeKeys, []]);
    setStatusChangeTime([...statusChangeTime, parseAbsolute("2025-01-01T00:00:00.000Z", 'UTC')]);
    setStatusChangeDescriptions([...statusChangeDescriptions, ""]);
    // Disabled fields
    setStatusChangeKeysDisabled([...statusChangeKeysDisabled, true]);
    setStatusChangeValuesDisabled([...statusChangeValuesDisabled, true]);
    // Invalid fields
    setStatusChangeKeysInvalid([...statusChangeKeysInvalid, false]);
    setStatusChangeValuesInvalid([...statusChangeValuesDisabled, false]);
    setStatusChangeTimeInvalid([...statusChangeTimeInvalid, false]);
  };

  const removeAllInvolvedEntities = () => {
    // Values
    setInvolvedEntities([]);
    setStatusChangeKeys([]);
    setStatusChangeValues([]);
    setAvailableStatusChangeKeys([]);
    setStatusChangeTime([]);
    setStatusChangeDescriptions([]);
    // Disabled fields
    setStatusChangeKeysDisabled([]);
    setStatusChangeValuesDisabled([]);
    // Invalid fields
    setStatusChangeKeysInvalid([]);
    setStatusChangeValuesInvalid([]);
    setStatusChangeTimeInvalid([]);
  };

  const removeOneStatusChangeByIndex = (indexToRemove: number) => {
    // Values
    setInvolvedEntities(involvedEntities.filter((_, index) => index !== indexToRemove));
    setStatusChangeKeys(statusChangeKeys.filter((_, index) => index !== indexToRemove));
    setStatusChangeValues(statusChangeValues.filter((_, index) => index !== indexToRemove));
    setAvailableStatusChangeKeys(availableStatusChangeKeys.filter((_, index) => index !== indexToRemove));
    setStatusChangeTime(statusChangeTime.filter((_, index) => index !== indexToRemove));
    setStatusChangeDescriptions(statusChangeDescriptions.filter((_, index) => index !== indexToRemove));
    // Disabled fields
    setStatusChangeKeysDisabled(statusChangeKeysDisabled.filter((_, index) => index !== indexToRemove));
    setStatusChangeValuesDisabled(statusChangeValuesDisabled.filter((_, index) => index !== indexToRemove));
    // Invalid fields
    setStatusChangeKeysInvalid(statusChangeKeysInvalid.filter((_, index) => index !== indexToRemove));
    setStatusChangeValuesInvalid(statusChangeValuesDisabled.filter((_, index) => index !== indexToRemove));
    setStatusChangeTimeInvalid(statusChangeTimeInvalid.filter((_, index) => index !== indexToRemove));
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

  const onStatusChangeKeysChange = (e: string, indexToChange: number) => {
    // Set selected entity's status key
    var newStatusChangeKeys = [...statusChangeKeys];
    newStatusChangeKeys[indexToChange] = e;
    setStatusChangeKeys(newStatusChangeKeys);
    // Enable the status value input
    var newStatusChangeValuesDisabled = [...statusChangeValuesDisabled];
    newStatusChangeValuesDisabled[indexToChange] = false;
    setStatusChangeValuesDisabled(newStatusChangeValuesDisabled);
    // Set the new value to default text if it's empty string
    if (statusChangeValues[indexToChange] == "") {
      var newStatusChangeValues = [...statusChangeValues];
      newStatusChangeValues[indexToChange] = t("defaultNewStatusValue");
      setStatusChangeValues(newStatusChangeValues);
      var newStatusChangeValuesInvalid = [...statusChangeValuesInvalid];
      newStatusChangeValuesInvalid[indexToChange] = false;
      setStatusChangeValuesInvalid(newStatusChangeValuesInvalid);
    }
    // Check if inputEntityStatusKey is empty
    var newStatusChangeKeysInvalid = [...statusChangeKeysInvalid]; 
    if (e == "") {
      newStatusChangeKeysInvalid[indexToChange] = true;
    } else {
      newStatusChangeKeysInvalid[indexToChange] = false;
    }
    setStatusChangeKeysInvalid(newStatusChangeKeysInvalid);
  };

  const onStatusChangeValuesChange = (e: any, indexToChange: number) => {
    // Handle the value
    var newStatusChangeValues = [...statusChangeValues];
    newStatusChangeValues[indexToChange] = e.target.value;
    setStatusChangeValues(newStatusChangeValues);
    // Check if valid
    var newStatusChangeValuesInvalid = [...statusChangeValuesInvalid];
    if (e.target.value == "") {
      newStatusChangeValuesInvalid[indexToChange] = true;
    } else {
      newStatusChangeValuesInvalid[indexToChange] = false;
    }
    setStatusChangeValuesInvalid(newStatusChangeValuesInvalid);
  };

  const onStatusChangeTimeChange = (e: any, indexToChange: number) => {
    // Handle the time
    var newStatusChangeTime = [...statusChangeTime];
    newStatusChangeTime[indexToChange] = e;
    setStatusChangeTime(newStatusChangeTime);
    var newStatusChangeTimeInvalid = [...statusChangeTimeInvalid];
    if (e == null) {
      newStatusChangeTimeInvalid[indexToChange] = true;
    } else {
      newStatusChangeTimeInvalid[indexToChange] = false;
    }
    setStatusChangeTimeInvalid(newStatusChangeTimeInvalid);
  }

  const onStatusChangeDescriptionsChange = (e: any, indexToChange: number) => {
    // Handle the value
    var newStatusChangeDescriptions = [...statusChangeDescriptions];
    newStatusChangeDescriptions[indexToChange] = e.target.value;
    setStatusChangeDescriptions(newStatusChangeDescriptions);
  };

  // Actual Creation
  const createNewEventWithStatusChange = () => {
    const newEvent = {
      id: projectState.eventTrackingId,
      name: newEventName,
      color: newEventColor,
      startTime: getProjectTime(newEventStartTime),
      endTime: getProjectTime(newEventEndTime),
      summary: newEventSummary,
      statusChanges: []
    } as Event;

    const currentStatusChangeTrackingId = projectState.statusChangeTrackingId;

    var updateEntityStatusKeys: Record<number,Set<string>> = {};
    
    involvedEntities.map((involvedEntityId, index)=>{
      // Check if we added new statusKey for entity
      // Collect all of them and process once and only use one state hook per entity
      if (!projectState.entities[involvedEntityId].statusKeys.includes(statusChangeKeys[index])) {
        if (involvedEntityId in updateEntityStatusKeys) {
          updateEntityStatusKeys[involvedEntityId].add(statusChangeKeys[index]);
        } else {
          updateEntityStatusKeys[involvedEntityId] = new Set();
        }
      }
      newEvent.statusChanges.push(currentStatusChangeTrackingId+index);
      const newStatusChange = {
        id: currentStatusChangeTrackingId+index,
        eventId: involvedEntityId,
        entityId: projectState.entityTrackingId,
        time: getProjectTime(statusChangeTime[index]),
        statusKey: statusChangeKeys[index],
        statusValue: statusChangeValues[index],
        description: statusChangeDescriptions[index],
      } as StatusChange;
      addStatusChange(newStatusChange);
    });

    var newProjectStateEntities = structuredClone(projectState.entities);

    for (const entityIdToUpdateStatusKey in updateEntityStatusKeys) {
      updateEntityStatusKeys[entityIdToUpdateStatusKey].forEach(newStatusKey => {
        newProjectStateEntities[entityIdToUpdateStatusKey].statusKeys.push(newStatusKey);
      });
    }
    setProjectEntites(newProjectStateEntities);

    // Finally add the new event
    addEvent(newEvent);
  };

  return (
    <Modal 
      size="3xl"
      {...props}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{t("header")}</ModalHeader>
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
                      label={t("eventNameInputLabel")}
                      type="text"
                      variant="underlined"
                      value={newEventName}
                      onChange={onNewEntityNameChange}
                      isInvalid={newEventNameInvalid}
                      errorMessage={t("eventNameInputError")}
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
                    label={t("eventStartTimeLabel")}
                    variant="underlined"
                    granularity="second"
                    hourCycle={24}
                    value={newEventStartTime}
                    onChange={onStartTimeChange}
                    isInvalid={startDateInvalid}
                    errorMessage={t("eventStartTimeError")}
                  />
                  <DatePicker
                    isRequired
                    hideTimeZone
                    showMonthAndYearPickers
                    label={t("eventEndTimeLabel")}
                    variant="underlined"
                    granularity="second"
                    hourCycle={24}
                    value={newEventEndTime}
                    onChange={onEndTimeChange}
                    isInvalid={endDateInvalid}
                    errorMessage={t("eventEndTimeError")}
                  />
                </div>
                <Textarea
                  variant="underlined"
                  label={t("eventSummaryLabel")}
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
                  content={t("addInvolvedEntityTooltip")}
                >
                  <Button
                    variant="bordered"
                    size="sm"
                    className="max-w-32"
                    onPress={addNewInvolvedEntity}
                  >{t("addInvolvedEntityButton")}</Button>
                </Tooltip>
                <Tooltip
                  color="danger"
                  showArrow={true}
                  content={t("removeAllInvolvedEntityTooltip")}
                >
                  <Button
                    variant="bordered"
                    size="sm"
                    className="max-w-32"
                    color="danger"
                    onPress={removeAllInvolvedEntities}
                  >{t("removeAllInvolvedEntityButton")}</Button>
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
                          label={t("involvedEntityLabel")}
                          variant="underlined"
                          onSelectionChange={(selectedKey)=>{
                            onInvolvedEntitySelectionChange(Number(selectedKey), index);
                          }}
                        >
                          {
                            Object.keys(projectState.entities).map(Number).map(
                              (entityId) => (
                                <AutocompleteItem key={entityId} textValue={`${projectState.entities[entityId].type} - ${projectState.entities[entityId].name}`}>
                                  <div className="flex gap-2 items-center">
                                    <Avatar 
                                      className="w-2 h-2"
                                      style={{
                                        backgroundColor:projectState.entities[entityId].color
                                      }}
                                      icon=""
                                    />
                                    <span>{projectState.entities[entityId].type} - {projectState.entities[entityId].name}</span>
                                  </div>
                                </AutocompleteItem>
                              )
                            )
                          }
                        </Autocomplete>
                        <Tooltip 
                          showArrow={true}
                          content={t("involvedEntityStatusKeyTooltip")}
                        >
                          <Autocomplete
                            isRequired
                            allowsCustomValue
                            label={t("involvedEntityStatusKeyLabel")}
                            variant="underlined"
                            isDisabled={statusChangeKeysDisabled[index]}
                            // Only show invalid when this filed is invalid and not disabled
                            isInvalid={statusChangeKeysInvalid[index] && !statusChangeKeysDisabled[index]}
                            onInputChange={(e)=>{
                              onStatusChangeKeysChange(e, index)
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
                        </Tooltip>
                        <Input
                          isRequired
                          label={t("involvedEntityNewStatusValueLabel")}
                          type="text"
                          variant="underlined"
                          isDisabled={statusChangeValuesDisabled[index]}
                          value={statusChangeValues[index]}
                          onChange={(e)=>{onStatusChangeValuesChange(e,index)}}
                          // Only show invalid when this filed is invalid and not disabled
                          isInvalid={statusChangeValuesInvalid[index] && !statusChangeValuesDisabled[index]}
                        />
                        <Button 
                          isIconOnly
                          variant="light"
                          color="danger"
                          className="min-w-6 min-h-6 w-6 h-6"
                          onPress={()=>{removeOneStatusChangeByIndex(index);}}
                        >
                          <DeleteIcon 
                            width={20}
                            height={20}
                          />
                        </Button>
                      </div>
                      <div className="flex gap-4 items-center">
                        <DatePicker
                          classNames={{
                            base: "h-14 w-[13.5rem]",
                            inputWrapper: "pb-0 h-14",
                            helperWrapper: "p-0"
                          }}
                          isRequired
                          hideTimeZone
                          showMonthAndYearPickers
                          label={t("involvedEntityTimeLabel")}
                          variant="underlined"
                          granularity="second"
                          hourCycle={24}
                          value={statusChangeTime[index]}
                          isInvalid={statusChangeTimeInvalid[index]}
                          onChange={(e)=>{onStatusChangeTimeChange(e, index)}}
                        />
                        <Input
                          className="w-[30rem]"
                          label={t("involvedEntityDescription")}
                          variant="underlined"
                          value={statusChangeDescriptions[index]}
                          onChange={(e)=>{onStatusChangeDescriptionsChange(e,index)}}
                        />
                      </div>
                    </div>
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
                // Disable button if we have any invalid fields or any disabled fields
                isDisabled={
                  newEventNameInvalid || startDateInvalid || endDateInvalid ||
                  statusChangeKeysInvalid.some(val => val === true) ||
                  statusChangeValuesInvalid.some(val => val === true) ||
                  statusChangeTimeInvalid.some(val => val === true) ||
                  statusChangeKeysDisabled.some(val => val === true) ||
                  statusChangeValuesDisabled.some(val => val === true)
                }
                onPress={()=>{createNewEventWithStatusChange();onClose()}}
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