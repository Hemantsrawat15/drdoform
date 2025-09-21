import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, FileText, Calendar, Edit } from "lucide-react";
import { AddFormModal } from "./AddFormModal";
import { FormFillModal } from "./FormFillModal";

export const FormsList = ({ group, onBack }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFormModal, setShowAddFormModal] = useState(false);
  const [fillFormModalVisible, setFillFormModalVisible] = useState(false);
  const [formToFill, setFormToFill] = useState(null);

  // Fetch forms summary list
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost/backend/forms/list.php?group_id=${group.id}`)
      .then((res) => res.json())
      .then(setForms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [group.id]);

  // Fetch full form detail including parsed pages
  const fetchFormDetail = async (form_id) => {
    try {
      const res = await fetch(
        `http://localhost/backend/forms/detail.php?form_id=${form_id}`
      );
      const data = await res.json();

      if (data.pages && typeof data.pages === "string") {
        data.pages = JSON.parse(data.pages);
      }
      if (data.form_template && typeof data.form_template === "string") {
        data.form_template = JSON.parse(data.form_template);
      }
      return data;
    } catch (err) {
      console.error("Error fetching form detail:", err);
      return null;
    }
  };

  // Open modal with fetched form details
  const openFormFilling = async (form) => {
    const fullForm = await fetchFormDetail(form.id);
    if (fullForm) {
      setFormToFill(fullForm);
      setFillFormModalVisible(true);
    } else {
      alert("Failed to load form details");
    }
  };

  // Add new form handler from AddFormModal
  const handleSaveNewForm = async (formData) => {
    try {
      const res = await fetch("http://localhost/backend/forms/add.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([formData]),
      });
      const results = await res.json();
      if (results[0] && results[0].success) {
        // Append new form with returned ID
        const newForm = { ...formData, id: results[0].form_id };
        setForms((prev) => [newForm, ...prev]);
        setShowAddFormModal(false);
      } else {
        alert("Failed to create form. " + (results[0]?.error ?? ""));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create form, please try again.");
    }
  };

  // Submit filled form data to backend
  const handleFormSubmit = async (submissionData) => {
    const payload = {
      form_id: formToFill.id,
      user_id: 1, // Replace with actual user id
      submission_data: submissionData,
    };
    try {
      const res = await fetch("http://localhost/backend/forms/submit.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert("Form submitted successfully! Downloading PDF...");
        setFillFormModalVisible(false);
        // Trigger PDF download/open
        const pdfUrl = `http://localhost/backend/pdf/generate.php?submission_id=${data.submission_id}`;
        window.open(pdfUrl, "_blank");
      } else {
        alert("Form submission failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting form.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to groups</span>
        </button>
        <button
          onClick={() => setShowAddFormModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>New Form</span>
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddFormModal && (
        <AddFormModal
          groupId={group.id}
          onClose={() => setShowAddFormModal(false)}
          onSave={handleSaveNewForm}
        />
      )}

      {/* Fill Form Modal */}
      {fillFormModalVisible && formToFill && (
        <FormFillModal
          form={formToFill}
          onClose={() => setFillFormModalVisible(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Group Info and Forms List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-lg bg-blue-500">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {group.group_name}
            </h2>
            <p className="text-gray-600">
              {JSON.stringify(group.group_template)}
            </p>
          </div>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No forms yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first form in this group.
            </p>
            <button
              onClick={() => setShowAddFormModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Create First Form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
                onClick={() => openFormFilling(form)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {form.form_name || form.title}
                  </h4>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {form.description || JSON.stringify(form.form_template)}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {form.created_at
                        ? new Date(form.created_at).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <span>
                    {form.pages
                      ? form.pages.reduce(
                          (acc, page) => acc + (page.fields?.length || 0),
                          0
                        )
                      : 0}{" "}
                    fields
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
