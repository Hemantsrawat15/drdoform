import React, { useEffect, useState } from 'react';
import { GroupCard } from './GroupCard';
import { mapGroups } from '../utils/mapGroups';

export const GroupsList = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch("http://localhost/backend/groups/list.php")
      .then((res) => res.json())
      .then((data) => setGroups(mapGroups(data)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} onClick={() => console.log("Clicked:", group.name)} />
      ))}
    </div>
  );
};
