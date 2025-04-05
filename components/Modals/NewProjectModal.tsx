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
  ModalProps,
  Textarea
} from "@heroui/react";
import { useProjectState } from "@/utils/ProjectState";

const NewProjectModal = ( props:  ModalProps ) => {
  // States
  const { setProjectName, setEditingMode } = useProjectState();
  const [projectNameInvalid, setProjectNameInvalid] = React.useState(false);
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

  const onProjectNameInputChange = (e: any) => {
    setNewProjectInput(e.target.value);
    if (e.target.value == "") {
      setProjectNameInvalid(true);
    } else {
      setProjectNameInvalid(false);
    }
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
                onChange={onProjectNameInputChange}
                isInvalid={projectNameInvalid}
                errorMessage="Please enter a project name"
              />
              <p className="text-small text-default-400">You may lose the current project by creating a new project.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button 
                color="primary" 
                isDisabled={projectNameInvalid}
                onPress={()=>{createNewProject();onClose();}}
              >
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