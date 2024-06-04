import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Log } from "@/models/log.model";
import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiEye, FiX } from "react-icons/fi";
import { BasicRoundedButton } from "../buttons/basic-rounded-button/Basic-rounded-button";
import TemplateDataModal from "./TemplateDataModal";

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: () => void;
  onTemplateSelect: (template: ExerciseActivity[] | null) => void;
}

const TemplatesModal: React.FC<TemplateModalProps> = ({
  open,
  onClose,
  onGenerate,
  onTemplateSelect,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    ExerciseActivity[] | null
  >(null);
  const [activeTemplateIdx, setActiveTemplateIdx] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Log[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const fetchedTemplates = await LoggingClient.getTemplates();
      setTemplates(fetchedTemplates);
    } catch (error: any) {
      // TODO: Error handling
      console.log("Error fetching templates: ", error.message);
    }
  };

  const handleTemplateClick = (template: ExerciseActivity[], idx: number) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
    setActiveTemplateIdx(idx);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        className="flex justify-center items-center"
      >
        <div className="flex flex-col w-1/2 h-3/4 bg-white p-10 rounded-xl relative justify-evenly items-center text-center">
          <h1 className="text-4xl font-bold text-center">
            Choose From Templates
          </h1>
          <button className="absolute top-2 right-2" onClick={onClose}>
            <FiX />
          </button>
          <h1>Please choose one template to start:</h1>
          {/* Templates to Choose From */}
          <div className="min-h-24 overflow-y-auto w-96 max-h-56">
            {templates?.map((template, idx) => (
              <div
                key={idx}
                className={`flex justify-between cursor-pointer p-2 border-b ${
                  activeTemplateIdx === idx
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 hover:bg-orange-500 hover:text-white"
                }`}
                onClick={() => handleTemplateClick(template.exercises, idx)}
              >
                <div className="text-xl">{template.name}</div>
                <button className="mr-2 transition-transform duration-300 hover:scale-125">
                  <FiEye onClick={() => setIsModalOpen(true)} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-between h-28">
            <BasicRoundedButton
              onClick={onGenerate}
              label="Generate Log"
              disabled={!selectedTemplate}
            />
          </div>
        </div>
      </Modal>
      <TemplateDataModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        exerciseData={selectedTemplate}
      />
    </div>
  );
};

export default TemplatesModal;
