"use client";
import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import TemplateCard from "@/components/cards/TemplateCard";
import ConfirmDeleteDialog from "@/components/dialogs/Confirmation-dialog";
import EditTemplateModal from "@/components/modals/EditTemplateModal";
import TemplateDataModal from "@/components/modals/TemplateDataModal";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Log } from "@/models/log.model";
import { Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
interface MyTemplatesProps {}

const MyTemplates: React.FC<MyTemplatesProps> = ({}) => {
  const { status } = useAuthSession(); // status, session and update are available, see auth-context.tsx
  const router = useRouter();

  if (status === "unauthenticated") {
    router.replace("/signin");
    return null; // Ensure the component does not render until redirection
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [
    isConfirmDeleteTemplateModalOpen,
    setIsConfirmDeleteTemplateModalOpen,
  ] = useState<boolean>(false);

  const [selectedTemplate, setSelectedTemplate] = useState<
    ExerciseActivity[] | null
  >(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState<
    string | null
  >(null);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Log[]>([]);

  const [templateDataToDelete, setTemplateDataDelete] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsBusy(true);
      const fetchedTemplates = await LoggingClient.getTemplates();
      setTemplates(fetchedTemplates);
    } catch (error: any) {
      console.log("Error fetching templates: ", error.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleTemplateClick = (template: Log) => {
    setSelectedTemplate(template.exercises);
    setSelectedTemplateName(template.name!);
    setIsModalOpen(true);
  };

  const handleConfirmDeleteTemplate = (
    templateId: string,
    templateName: string
  ) => {
    setTemplateDataDelete({ name: templateName, id: templateId });
    setIsConfirmDeleteTemplateModalOpen(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      setIsBusy(true);
      await LoggingClient.deleteTemplate(templateId);
      setTemplates(templates.filter((template) => template._id !== templateId));
    } catch (error: any) {
      console.log("Error deleting template: ", error.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleEditTemplate = async (templateId: string) => {
    const template = templates.find((template) => template._id === templateId);
    if (template) {
      setSelectedTemplate(template.exercises);
      setSelectedTemplateName(template.name!);
      setSelectedTemplateId(template._id!);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateTemplate = async (updatedTemplateData: Partial<Log>) => {
    try {
      setIsBusy(true);
      await LoggingClient.updateTemplate(updatedTemplateData);
      fetchTemplates();
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setIsConfirmDeleteTemplateModalOpen(false);
      setTemplateDataDelete(null);
    } catch (error: any) {
      console.log("Error updating template: ", error.message);
    } finally {
      setIsBusy(false);
    }
  };

  if (isBusy) {
    return (
      <div className="flex justify-center" style={{ marginTop: "40%" }}>
        <CircularProgress />;
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-evenly min-h-screen p-4">
        <div className="flex justify-between">
          <h1 className="futuraFont text-xl font-bold uppercase">
            Choose From Templates
          </h1>
          <FiX className="size-8 text-white blueGray rounded-full ml-2 p-2 hover:bg-stone-500" />
        </div>
        {templates.length > 0 ? (
          <h1 className="futuraFont font-medium text-xl py-2">
            Please choose one template to start
          </h1>
        ) : (
          <h1 className="futuraFont font-medium text-xl py-2">
            There are currently no templates. Create one below
          </h1>
        )}
        <div>
          {errorMessage && (
            <div className="text-red-500 text-center verdanaFont">
              {errorMessage}
            </div>
          )}
        </div>
        <div className="flex flex-wrap -mx-2">
          {templates.map((template, idx) => (
            <div key={idx} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
              <TemplateCard
                onClick={() => handleTemplateClick(template)}
                onDelete={() =>
                  handleConfirmDeleteTemplate(template._id!, template.name!)
                }
                onEdit={() => handleEditTemplate(template._id!)}
                data={template}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center h-28">
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
        templateData={selectedTemplate}
        onUpdateTemplate={handleUpdateTemplate}
        templateNameData={selectedTemplateName}
        templateId={selectedTemplateId}
      />
      <ConfirmDeleteDialog
        title={`Delete '${templateDataToDelete?.name}'`}
        message={`Please confirm the deletion of this template.`}
        onClose={() => {
          setIsConfirmDeleteTemplateModalOpen(false);
          setTemplateDataDelete(null);
        }}
        open={isConfirmDeleteTemplateModalOpen}
        actionButtons={[
          <Button
            color="primary"
            sx={{ textTransform: "none" }}
            onClick={() => {
              setIsConfirmDeleteTemplateModalOpen(false);
              setTemplateDataDelete(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            color="error"
            sx={{ fontWeight: "bold", textTransform: "none" }}
            onClick={() => {
              templateDataToDelete?.id &&
                handleDeleteTemplate(templateDataToDelete.id);
            }}
          >
            Delete
          </Button>,
        ]}
      />
    </div>
  );
};

export default MyTemplates;
