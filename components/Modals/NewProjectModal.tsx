"use client"

import * as React from "react";
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

const NewProjectModal = ( props:  ModalProps ) => {
  // States
  const { setProjectName, setEditingMode } = useProjectState();

  const [newProjectInput, setNewProjectInput] = React.useState("New Project");

  // Functions
  const createNewProject = () => {
    // Prepare Data
    // Use the name from input as the project name
    setProjectName(newProjectInput);
    // Enable editing mode
    setEditingMode(true);
    // Use everything in default
  }

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">New Project</ModalHeader>
            <ModalBody>
              <Input
                label="Project Name"
                type="text"
                variant="underlined"
                value={newProjectInput}
                onChange={(e)=>{setNewProjectInput(e.target.value)}}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={()=>{createNewProject();onClose();}}>
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default NewProjectModal;