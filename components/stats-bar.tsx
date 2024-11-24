export function StatsBar() {
  const stats = [
    { id: 'trucks', title: 'ASSIGNED TRUCKS', value: '5/10' },
    { id: 'technicians', title: 'ASSIGNED TECHNICIANS', value: '5/10' },
    { id: 'today', title: 'HOURS WORKED TODAY', value: '50' },
    { id: 'month', title: 'HOURS WORKED THIS MONTH', value: '150' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 border-t bg-gray-800 p-4 text-white">
      {stats.map((stat) => (
        <div key={stat.id} className="flex items-center justify-between rounded-lg bg-gray-700 p-4">
          <div>
            <h3 className="text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}