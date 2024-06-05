"use client";
import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import TemplateCard from "@/components/cards/TemplateCard";
import EditTemplateModal from "@/components/modals/EditTemplateModal";
import TemplateDataModal from "@/components/modals/TemplateDataModal";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Log } from "@/models/log.model";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface MyTemplatesProps {}

const MyTemplates: React.FC<MyTemplatesProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    ExerciseActivity[] | null
  >(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState<
    string | null
  >(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const handleEditTemplate = async (templateId: string) => {
    const template = templates.find((template) => template._id === templateId);
    if (template) {
      setSelectedTemplate(template.exercises);
      setSelectedTemplateName(template.name);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateTemplate = async (updatedTemplateData: any) => {
    console.log(updatedTemplateData);
  };

  const [templates, setTemplates] = useState<Log[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const fetchedTemplates = await LoggingClient.getTemplates();
      setTemplates(fetchedTemplates);
    } catch (error: any) {
      console.log("Error fetching templates: ", error.message);
    }
  };

  const handleTemplateClick = (template: Log) => {
    setSelectedTemplate(template.exercises);
    setSelectedTemplateName(template.name);
    setIsModalOpen(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await LoggingClient.deleteTemplate(templateId);
      setTemplates(templates.filter((template) => template._id !== templateId));
    } catch (error: any) {
      console.log("Error deleting template: ", error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-evenly items-center text-center min-h-screen">
        <h1 className="text-4xl font-bold text-center">
          Choose From Templates
        </h1>
        {templates.length > 0 ? (
          <h1>Please choose one template to start:</h1>
        ) : (
          <h1> There are currently no templates. Create one below</h1>
        )}

        <div className="flex flex-wrap -mx-2">
          {templates &&
            templates.map((template, idx) => (
              <div key={idx} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                <TemplateCard
                  onClick={() => handleTemplateClick(template)}
                  onDelete={() => handleDeleteTemplate(template._id!)}
                  onEdit={() => handleEditTemplate(template._id)}
                  data={template}
                />
              </div>
            ))}
        </div>
        <div className="flex flex-col justify-between h-28">
          <Link href="/user/createtemplate">
            <BasicRoundedButton label="Create New Template" />
          </Link>
        </div>
      </div>
      <TemplateDataModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        exerciseData={selectedTemplate}
      />
      <EditTemplateModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        templateData={selectedTemplate ? selectedTemplate : null}
        onUpdateTemplate={handleUpdateTemplate}
        templateNameData={selectedTemplateName ? selectedTemplateName : null}
      />
    </div>
  );
};

export default MyTemplates;
