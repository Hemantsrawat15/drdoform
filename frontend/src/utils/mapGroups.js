export function mapGroups(apiGroups) {
  return apiGroups.map(g => ({
    id: g.id,
    name: g.group_name,
    description: 'No description',
    form_count: Number(g.form_count) || 0,
    color: 'bg-blue-500',
  }));
}
