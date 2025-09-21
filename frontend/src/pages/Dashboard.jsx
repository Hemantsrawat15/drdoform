import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { GroupCard } from "../components/GroupCard";
import { FormsList } from "../components/FormsList";
import { Plus, FolderPlus } from "lucide-react";
import { mapGroups } from "../utils/mapGroups";

export const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    fetch("http://localhost/backend/groups/list.php")
      .then((res) => res.json())
      .then((data) => setGroups(mapGroups(data)))
      .catch((err) => console.error("Error fetching groups:", err))
      .finally(() => setLoading(false));
  }, []);

  // Handler to submit new group
  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup = {
      group_name: newGroupName,
      group_template: {}, // empty template per your example
    };

    try {
      const res = await fetch("http://localhost/backend/groups/add.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGroup),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      // Optionally fetch updated list again OR append group locally
      const updatedGroups = await fetch(
        "http://localhost/backend/groups/list.php"
      )
        .then((res) => res.json())
        .then(mapGroups);

      setGroups(updatedGroups);
      setShowAddForm(false);
      setNewGroupName("");
    } catch (err) {
      console.error("Failed to add group", err);
    }
  };

  if (selectedGroup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <FormsList
            group={selectedGroup}
            onBack={() => setSelectedGroup(null)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your Form Groups
            </h2>
            <p className="text-gray-600 mt-1">
              Organize your forms into groups for better management
            </p>
          </div>

          {/* Add Group Button */}
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Groups</span>
          </button>
        </div>

        {/* Add Group Form */}
        {showAddForm && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
              <h2 className="text-xl font-semibold mb-4">Add New Group</h2>
              <form onSubmit={handleAddGroup}>
                <label className="block text-gray-700 mb-2" htmlFor="groupName">
                  Group Name
                </label>
                <input
                  id="groupName"
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  placeholder="Enter group name"
                  autoFocus
                  required
                />
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12">
            <FolderPlus className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              No groups yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              Create your first group to start organizing your forms. Groups
              help you categorize and manage related forms together.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onClick={() => setSelectedGroup(group)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
