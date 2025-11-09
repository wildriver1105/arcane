'use client';

import { useState } from 'react';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
}

interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
}

interface Evaluation {
  employeeId: number;
  criteriaId: string;
  score: number;
  comment: string;
  date: string;
}

export default function Evaluations() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [evaluations, setEvaluations] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [evaluationHistory, setEvaluationHistory] = useState<Evaluation[]>([]);

  const employees: Employee[] = [
    { id: 1, name: '김철수', position: '개발팀장', department: '개발부' },
    { id: 2, name: '이영희', position: '선임 개발자', department: '개발부' },
    { id: 3, name: '박민수', position: '디자이너', department: '디자인부' },
    { id: 4, name: '정수진', position: '마케팅 매니저', department: '마케팅부' },
    { id: 5, name: '최동현', position: 'HR 담당자', department: '인사부' },
  ];

  const criteria: EvaluationCriteria[] = [
    { id: 'technical', name: '기술 역량', description: '전문 기술 및 업무 수행 능력' },
    { id: 'communication', name: '의사소통', description: '팀원 및 이해관계자와의 소통 능력' },
    { id: 'problem-solving', name: '문제 해결', description: '복잡한 문제를 분석하고 해결하는 능력' },
    { id: 'leadership', name: '리더십', description: '팀을 이끌고 동기를 부여하는 능력' },
    { id: 'teamwork', name: '협업 능력', description: '팀과의 협력 및 협업 능력' },
    { id: 'creativity', name: '창의성', description: '새로운 아이디어와 혁신적 사고' },
    { id: 'responsibility', name: '책임감', description: '업무에 대한 책임감과 성실성' },
    { id: 'adaptability', name: '적응력', description: '변화에 대한 적응 및 학습 능력' },
  ];

  const handleScoreChange = (criteriaId: string, score: number) => {
    setEvaluations((prev) => ({
      ...prev,
      [criteriaId]: score,
    }));
  };

  const handleCommentChange = (criteriaId: string, comment: string) => {
    setComments((prev) => ({
      ...prev,
      [criteriaId]: comment,
    }));
  };

  const handleSubmit = () => {
    if (!selectedEmployee) return;

    const newEvaluations: Evaluation[] = Object.keys(evaluations).map((criteriaId) => ({
      employeeId: selectedEmployee.id,
      criteriaId,
      score: evaluations[criteriaId],
      comment: comments[criteriaId] || '',
      date: new Date().toISOString().split('T')[0],
    }));

    setEvaluationHistory((prev) => [...prev, ...newEvaluations]);
    setEvaluations({});
    setComments({});
    alert('평가가 저장되었습니다.');
  };

  const getScoreLabel = (score: number) => {
    const labels: Record<number, string> = {
      1: '매우 낮음',
      2: '낮음',
      3: '보통',
      4: '높음',
      5: '매우 높음',
    };
    return labels[score] || '';
  };

  const getScoreColor = (score: number) => {
    const colors: Record<number, string> = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-blue-100 text-blue-800',
      5: 'bg-green-100 text-green-800',
    };
    return colors[score] || 'bg-gray-100 text-gray-800';
  };

  const getEmployeeAverageScore = (employeeId: number) => {
    const employeeEvaluations = evaluationHistory.filter((e) => e.employeeId === employeeId);
    if (employeeEvaluations.length === 0) return 0;
    const sum = employeeEvaluations.reduce((acc, e) => acc + e.score, 0);
    return (sum / employeeEvaluations.length).toFixed(1);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">역량 평가</h1>
        <p className="text-gray-600 mt-2">개인별 역량을 평가하고 관리합니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 직원 선택 영역 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">직원 선택</h2>
            <div className="space-y-2">
              {employees.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedEmployee?.id === employee.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium">{employee.name}</div>
                  <div className={`text-sm ${selectedEmployee?.id === employee.id ? 'text-blue-100' : 'text-gray-600'}`}>
                    {employee.position} · {employee.department}
                  </div>
                  {evaluationHistory.some((e) => e.employeeId === employee.id) && (
                    <div className={`text-xs mt-1 ${selectedEmployee?.id === employee.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      평균 점수: {getEmployeeAverageScore(employee.id)}점
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 평가 요약 */}
          {selectedEmployee && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">평가 요약</h2>
              <div className="space-y-3">
                {criteria.map((criterion) => {
                  const score = evaluations[criterion.id] || 0;
                  const historyScore = evaluationHistory
                    .filter((e) => e.employeeId === selectedEmployee.id && e.criteriaId === criterion.id)
                    .map((e) => e.score)
                    .reduce((a, b) => a + b, 0) / evaluationHistory.filter((e) => e.employeeId === selectedEmployee.id && e.criteriaId === criterion.id).length || 0;

                  return (
                    <div key={criterion.id} className="border-b pb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{criterion.name}</span>
                        {score > 0 && (
                          <span className={`text-xs px-2 py-1 rounded ${getScoreColor(score)}`}>
                            {score}점 - {getScoreLabel(score)}
                          </span>
                        )}
                        {historyScore > 0 && score === 0 && (
                          <span className="text-xs text-gray-500">이전: {historyScore.toFixed(1)}점</span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-yellow-500' : score > 0 ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                          style={{ width: `${(score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 평가 입력 영역 */}
        <div className="lg:col-span-2">
          {selectedEmployee ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedEmployee.name} 역량 평가
                </h2>
                <p className="text-gray-600">
                  {selectedEmployee.position} · {selectedEmployee.department}
                </p>
              </div>

              <div className="space-y-6 mb-6">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="border border-gray-200 rounded-lg p-5">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{criterion.name}</h3>
                      <p className="text-sm text-gray-600">{criterion.description}</p>
                    </div>

                    {/* 점수 선택 */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">점수 선택 (1-5점)</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            onClick={() => handleScoreChange(criterion.id, score)}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                              evaluations[criterion.id] === score
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {score}점
                            <div className="text-xs mt-1 opacity-75">{getScoreLabel(score)}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 코멘트 입력 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">상세 코멘트</label>
                      <textarea
                        value={comments[criterion.id] || ''}
                        onChange={(e) => handleCommentChange(criterion.id, e.target.value)}
                        placeholder="평가에 대한 상세한 코멘트를 입력하세요..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEvaluations({});
                    setComments({});
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  초기화
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  평가 저장
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">평가할 직원을 선택하세요</h3>
              <p className="text-gray-600">왼쪽에서 평가할 직원을 선택하면 평가를 시작할 수 있습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 평가 이력 */}
      {evaluationHistory.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">평가 이력</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">직원</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">평가 항목</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">점수</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">코멘트</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">평가일</th>
                </tr>
              </thead>
              <tbody>
                {evaluationHistory.map((eval, index) => {
                  const employee = employees.find((e) => e.id === eval.employeeId);
                  const criterion = criteria.find((c) => c.id === eval.criteriaId);
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{employee?.name}</td>
                      <td className="py-3 px-4 text-gray-600">{criterion?.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${getScoreColor(eval.score)}`}>
                          {eval.score}점
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{eval.comment || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{eval.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

