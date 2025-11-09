'use client';

import Link from 'next/link';

export default function Employees() {
  const employees = [
    {
      id: 1,
      name: '김철수',
      position: '개발팀장',
      department: '개발부',
      email: 'kim@company.com',
      phone: '010-1234-5678',
      joinDate: '2020-03-15',
      status: '재직',
    },
    {
      id: 2,
      name: '이영희',
      position: '선임 개발자',
      department: '개발부',
      email: 'lee@company.com',
      phone: '010-2345-6789',
      joinDate: '2021-06-01',
      status: '재직',
    },
    {
      id: 3,
      name: '박민수',
      position: '디자이너',
      department: '디자인부',
      email: 'park@company.com',
      phone: '010-3456-7890',
      joinDate: '2022-01-10',
      status: '재직',
    },
    {
      id: 4,
      name: '정수진',
      position: '마케팅 매니저',
      department: '마케팅부',
      email: 'jung@company.com',
      phone: '010-4567-8901',
      joinDate: '2021-09-20',
      status: '재직',
    },
    {
      id: 5,
      name: '최동현',
      position: 'HR 담당자',
      department: '인사부',
      email: 'choi@company.com',
      phone: '010-5678-9012',
      joinDate: '2019-11-05',
      status: '재직',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">직원 목록</h1>
          <p className="text-gray-600 mt-2">전체 직원 정보를 관리합니다</p>
        </div>
        <Link
          href="/employees/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          + 직원 등록
        </Link>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="이름으로 검색"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">전체 부서</option>
            <option value="개발부">개발부</option>
            <option value="디자인부">디자인부</option>
            <option value="마케팅부">마케팅부</option>
            <option value="인사부">인사부</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">전체 상태</option>
            <option value="재직">재직</option>
            <option value="휴직">휴직</option>
            <option value="퇴사">퇴사</option>
          </select>
        </div>
      </div>

      {/* 직원 테이블 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">이름</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">직책</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">부서</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">이메일</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">연락처</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">입사일</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">상태</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{employee.name}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.position}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.department}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.email}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.phone}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.joinDate}</td>
                  <td className="py-4 px-6">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        상세
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 font-medium">
                        수정
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
