import React, { useState, useEffect } from 'react';

export const FormFillModal = ({ form, onClose, onSubmit }) => {
  const [values, setValues] = useState({});

  useEffect(() => {
    const initialValues = {};
    if (form.pages && Array.isArray(form.pages)) {
      form.pages.forEach(page => {
        page.fields.forEach(field => {
          if (field.type === 'checkbox') {
            initialValues[field.name] = false;
          } else {
            initialValues[field.name] = '';
          }
        });
      });
    }
    setValues(initialValues);
  }, [form]);

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 mx-4 overflow-auto max-h-[80vh]">
        <h2 className="text-xl font-semibold mb-4">{form.form_name}</h2>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {form.pages && Array.isArray(form.pages) ? (
            form.pages.map((page, pi) => (
              <div key={pi} className="border border-gray-300 p-4 rounded">
                <h3 className="font-semibold mb-3">{page.title || `Page ${pi + 1}`}</h3>
                {page.fields.map(field => (
                  <div key={field.name} className="mb-3 flex flex-col">
                    <label className="mb-1 font-medium">{field.label}</label>
                    {field.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={values[field.name] || false}
                        onChange={e => handleChange(field.name, e.target.checked)}
                        className="h-5 w-5"
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={values[field.name] || ''}
                        onChange={e => handleChange(field.name, e.target.value)}
                        className="border border-gray-300 p-2 rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div>No pages to fill.</div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
};
