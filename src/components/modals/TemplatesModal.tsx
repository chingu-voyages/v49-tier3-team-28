import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Log } from "@/models/log.model";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { IconButton, Modal } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
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
      <Modal open={open} onClose={onClose}>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: "-100vh" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100vh" }}
              transition={{ duration: 0.3 }}
              className="flex flex-col bg-white p-8 relative h-fill-available"
            >
              <div className="flex justify-between">
                <h1 className="text-xl font-bold openSansFont uppercase text-nowrap self-center">
                  Choose From Templates
                </h1>
                <button
                  onClick={() => {
                    setActiveTemplateIdx(null);
                    setSelectedTemplate(null);
                    onClose();
                  }}
                >
                  <FiX className="size-12 text-white blueGray rounded-full p-2 hover:bg-stone-500" />
                </button>
              </div>
              <h1 className="openSansFont text-xl font-medium mt-10 mb-4">
                Please choose one template to start:
              </h1>

              {/* Templates to Choose From */}
              <div className="min-h-24 overflow-y-auto w-96 max-h-58 w-full">
                {templates?.map((template, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between cursor-pointer p-2 border-b lightTanOrange mt-5 ${
                      activeTemplateIdx === idx
                        ? "defaultButtonColor colorWhite"
                        : ""
                    }`}
                    onClick={() => handleTemplateClick(template.exercises, idx)} // this should send a whole log instead of exercises
                  >
                    <div
                      className={`text-base font-light leading-6 verdanaFont self-center ${
                        activeTemplateIdx === idx && "font-bold"
                      } `}
                    >
                      {template.name}
                    </div>
                    <IconButton
                      className="mr-2 transition-transform duration-300 hover:scale-125"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <FormatListBulletedIcon className="blueGray rounded-full text-white p-1 !size-8" />
                    </IconButton>
                  </div>
                ))}
              </div>

              {/* Start logging Button */}
              <div className="flex justify-center mt-4">
                <BasicRoundedButton
                  onClick={onGenerate}
                  label="Start Logging"
                  disabled={!selectedTemplate}
                  buttonClassNames="secondaryButtonColor"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
