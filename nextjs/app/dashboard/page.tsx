export default function Dashboard() {
  const stats = [
    { title: '전체 직원', value: '128', icon: '👥', color: 'bg-blue-500' },
    { title: '금일 출근', value: '115', icon: '✅', color: 'bg-green-500' },
    { title: '휴가 중', value: '8', icon: '🏖️', color: 'bg-yellow-500' },
    { title: '신규 입사', value: '5', icon: '🎉', color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { name: '김철수', action: '출근', time: '09:00', date: '2024-11-08' },
    { name: '이영희', action: '휴가 신청', time: '08:45', date: '2024-11-08' },
    { name: '박민수', action: '퇴근', time: '18:30', date: '2024-11-07' },
    { name: '정수진', action: '출근', time: '08:55', date: '2024-11-08' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">인사 관리 시스템 현황</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">최근 활동</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">이름</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">활동</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">시간</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">날짜</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{activity.name}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {activity.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{activity.time}</td>
                  <td className="py-3 px-4 text-gray-600">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
