import React, { useState } from 'react';

export const AddFormModal = ({ groupId, onClose, onSave }) => {
  const [formName, setFormName] = useState('');
  const [formHeader, setFormHeader] = useState('');
  const [pages, setPages] = useState([
    { title: '', fields: [{ name: '', type: 'text', label: '' }] },
  ]);

  // Add a new empty page
  const handleAddPage = () => {
    setPages([...pages, { title: '', fields: [{ name: '', type: 'text', label: '' }] }]);
  };

  // Change page title
  const handlePageChange = (index, value) => {
    const updated = [...pages];
    updated[index].title = value;
    setPages(updated);
  };

  // Add a new field to page
  const handleAddField = (pageIndex) => {
    const updated = [...pages];
    updated[pageIndex].fields.push({ name: '', type: 'text', label: '' });
    setPages(updated);
  };

  // Change field values in a page
  const handleFieldChange = (pageIndex, fieldIndex, key, value) => {
    const updated = [...pages];
    updated[pageIndex].fields[fieldIndex][key] = value;
    setPages(updated);
  };

  // Prepare and submit form data
  const handleSave = () => {
    if (!formName.trim()) {
      alert('Form name is required');
      return;
    }
    const data = {
      group_id: groupId,
      form_name: formName,
      form_template: { header: formHeader },
      pages,
    };
    onSave(data);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 mx-4 overflow-auto max-h-[80vh]">
        <h2 className="text-xl font-semibold mb-4">Add New Form</h2>

        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Form Name</label>
            <input
              className="w-full border border-gray-300 p-2 rounded"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter form name"
              type="text"
              autoFocus
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Form Header</label>
            <input
              className="w-full border border-gray-300 p-2 rounded"
              value={formHeader}
              onChange={(e) => setFormHeader(e.target.value)}
              placeholder="Enter form header"
              type="text"
            />
          </div>

          {pages.map((page, pi) => (
            <div key={pi} className="border border-gray-300 p-4 rounded">
              <label className="block font-medium mb-1">Page Title</label>
              <input
                className="w-full border border-gray-300 p-2 rounded mb-2"
                value={page.title}
                onChange={(e) => handlePageChange(pi, e.target.value)}
                placeholder="Page title"
                type="text"
              />
              <label className="block font-medium mb-1">Fields</label>
              {page.fields.map((field, fi) => (
                <div key={fi} className="mb-2 flex space-x-2">
                  <input
                    className="flex-1 border border-gray-300 p-2 rounded"
                    value={field.name}
                    onChange={(e) => handleFieldChange(pi, fi, 'name', e.target.value)}
                    placeholder="Field name"
                    type="text"
                  />
                  <input
                    className="flex-1 border border-gray-300 p-2 rounded"
                    value={field.label}
                    onChange={(e) => handleFieldChange(pi, fi, 'label', e.target.value)}
                    placeholder="Field label"
                    type="text"
                  />
                </div>
              ))}
              <button
                className="text-blue-600 hover:underline mt-1"
                type="button"
                onClick={() => handleAddField(pi)}
              >
                + Add Field
              </button>
            </div>
          ))}

          <button className="text-green-600 hover:underline" onClick={handleAddPage} type="button">
            + Add Page
          </button>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSave}
            >
              Save Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
