"use client";
import { LoggingClient } from "@/app/clients/logging-client/logging-client";
import { BasicRoundedButton } from "@/components/buttons/basic-rounded-button/Basic-rounded-button";
import TemplateCard from "@/components/cards/TemplateCard";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import EditTemplateModal from "@/components/modals/EditTemplateModal";
import { useAuthSession } from "@/lib/contexts/auth-context/auth-context";
import { ExerciseActivity } from "@/models/exercise-activity.model";
import { Log } from "@/models/log.model";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface MyTemplatesProps {}

const MyTemplates: React.FC<MyTemplatesProps> = ({}) => {
  const { status } = useAuthSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.replace("/signin");
    return null;
  }

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
  const [filteredTemplates, setFilteredTemplates] = useState<Log[]>([]);
  const [templateDataToDelete, setTemplateDataDelete] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updateTemplateErrorMessage, setUpdateTemplateErrorMessage] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, templates]);

  const fetchTemplates = async () => {
    try {
      setIsBusy(true);
      const fetchedTemplates = await LoggingClient.getTemplates();
      setTemplates(fetchedTemplates);
      setFilteredTemplates(fetchedTemplates);
    } catch (error: any) {
      setErrorMessage("Error fetching templates");
      console.log("Error fetching templates: ", error.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleTemplateClick = (template: Log) => {
    setSelectedTemplate(template.exercises);
    setSelectedTemplateName(template.name!);
    setSelectedTemplateId(template._id!);
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
      setFilteredTemplates(
        filteredTemplates.filter((template) => template._id !== templateId)
      );
    } catch (error: any) {
      setErrorMessage("Error deleting template");
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
      setIsEditModalOpen(false);
      setIsConfirmDeleteTemplateModalOpen(false);
      setTemplateDataDelete(null);
      setUpdateTemplateErrorMessage(null);
    } catch (error: any) {
      setUpdateTemplateErrorMessage(error.message);
      console.log("Error updating template: ", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = templates.filter((template) =>
      template.name?.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredTemplates(filtered);
  };

  const handleUseTemplate = (exerciseData: ExerciseActivity[]) => {
    if (localStorage.getItem("draft")) {
      localStorage.removeItem("draft");
    }
    localStorage.setItem("selectedTemplate", JSON.stringify(exerciseData));
    router.push("/user/createlog");
  };

  if (isBusy) {
    return (
      <div className="flex justify-center" style={{ marginTop: "40%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-8"
        >
          <div className="self-center cursor-pointer">
            <Link href={"/user/home"}>
              <Image
                src="/images/buttons/back-button-left.svg"
                height={48}
                width={48}
                alt="Back button"
              />
            </Link>
          </div>
          <div>
            <h1
              className={`text-xl leading-7 openSansFont font-bold uppercase py-6`}
            >
              My Templates
            </h1>
          </div>
        </motion.div>

        {/* Secondary Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredTemplates.length > 0 ? (
            <h1 className="openSansFont font-medium text-md py-2 leading-7">
              Please review or edit your templates:
            </h1>
          ) : (
            <h1 className="openSansFont font-medium text-2xl py-2 leading-7">
              There are currently no templates. Create one below.
            </h1>
          )}
          <div>
            {errorMessage && (
              <div className="text-red-500 text-center verdanaFont">
                {errorMessage}
              </div>
            )}
          </div>
        </motion.div>

        {/* Search Filter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative flex items-center mt-4 mb-4"
        >
          <FiSearch className="absolute left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a template"
            className="border rounded-xl pl-10 pr-10 p-2 w-full bg-gray-50"
          />
          {searchQuery && (
            <FiX
              className="absolute right-3 cursor-pointer"
              onClick={() => setSearchQuery("")}
            />
          )}
        </motion.div>

        {/* Templates */}
        <motion.div
          className="flex flex-wrap -mx-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delay: 0.7 }}
        >
          {filteredTemplates.map((template, idx) => (
            <motion.div
              key={idx}
              className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <TemplateCard
                onClick={() => handleTemplateClick(template)}
                onDelete={() =>
                  handleConfirmDeleteTemplate(template._id!, template.name!)
                }
                onEdit={() => handleEditTemplate(template._id!)}
                data={template}
                isSelected={template._id === selectedTemplateId}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col justify-center items-center gap-4 mt-10"
        >
          <Link
            href="/user/createtemplate"
            onClick={() => setIsPageLoading(true)}
          >
            <BasicRoundedButton
              label="Create New Template"
              buttonClassNames="defaultButtonColor !justify-evenly"
              disabled={isPageLoading}
            >
              {isPageLoading && (
                <CircularProgress size={30} sx={{ color: "white" }} />
              )}
            </BasicRoundedButton>
          </Link>
          <BasicRoundedButton
            onClick={() => handleUseTemplate(selectedTemplate!)}
            label="Use Template"
            disabled={!selectedTemplate}
          />
        </motion.div>
      </div>

      {/* Popup Modals */}
      <EditTemplateModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        templateData={selectedTemplate}
        onUpdateTemplate={handleUpdateTemplate}
        templateNameData={selectedTemplateName}
        templateId={selectedTemplateId}
        updateTemplateError={updateTemplateErrorMessage}
      />
      <ConfirmDeleteModal
        title={`Are you sure you want to delete '${templateDataToDelete?.name}'?`}
        message={`This action is permanent and can't be undone.`}
        onClose={() => {
          setIsConfirmDeleteTemplateModalOpen(false);
          setTemplateDataDelete(null);
        }}
        open={isConfirmDeleteTemplateModalOpen}
        onDelete={() => {
          templateDataToDelete?.id &&
            handleDeleteTemplate(templateDataToDelete.id);
          setIsConfirmDeleteTemplateModalOpen(false);
        }}
      />
    </div>
  );
};

export default MyTemplates;
