'use client';

import Link from 'next/link';
import Sidebar from './components/Sidebar';

export default function Home() {
  const quickStats = [
    { title: '전체 직원', value: '128', icon: '👥', color: 'from-blue-500 to-blue-600', link: '/employees' },
    { title: '금일 출근', value: '115', icon: '✅', color: 'from-emerald-500 to-emerald-600', link: '/attendance' },
    { title: '휴가 중', value: '8', icon: '🏖️', color: 'from-amber-500 to-amber-600', link: '/leave' },
    { title: '평가 대기', value: '12', icon: '⭐', color: 'from-violet-500 to-violet-600', link: '/evaluations' },
  ];

  const quickActions = [
    { title: '대시보드', description: '전체 현황을 한눈에 확인', icon: '📊', link: '/dashboard' },
    { title: '직원 관리', description: '직원 정보 조회 및 관리', icon: '👥', link: '/employees' },
    { title: '데이터 맵', description: '조직 관계 시각화', icon: '🕸️', link: '/graph' },
    { title: '노트', description: '메모 및 기록 관리', icon: '📝', link: '/notes' },
  ];

  const recentNotices = [
    { title: '2026년 연차 정책 안내', date: '2026-01-18', type: '공지' },
    { title: '설 연휴 근무 안내', date: '2026-01-15', type: '공지' },
    { title: '신규 복리후생 프로그램 도입', date: '2026-01-10', type: '안내' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      
      {/* 메인 컨텐츠 */}
      <main className="flex-1 ml-64">
        {/* 헤더 */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">안녕하세요! 👋</h1>
                <p className="text-slate-500 mt-1">오늘도 좋은 하루 되세요</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">관리자</p>
                  <p className="text-xs text-slate-500">admin@company.com</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* 퀵 통계 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">오늘의 현황</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {quickStats.map((stat, index) => (
                <Link
                  key={index}
                  href={stat.link}
                  className="group bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 빠른 액션 */}
            <section className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">바로가기</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.link}
                    className="group bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 hover:bg-blue-50/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-2xl transition-colors">
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                      </div>
                      <svg 
                        className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 최근 공지 */}
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">최근 공지</h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {recentNotices.map((notice, index) => (
                    <div 
                      key={index} 
                      className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{notice.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{notice.date}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                          notice.type === '공지' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {notice.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <button className="w-full text-sm text-slate-500 hover:text-blue-600 transition-colors">
                    전체 공지 보기 →
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* 시스템 정보 */}
          <section className="mt-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">인사 관리 시스템</h3>
                  <p className="text-slate-400 text-sm mt-1">효율적인 인사 관리를 위한 통합 솔루션</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">v1.0</p>
                    <p className="text-xs text-slate-400">버전</p>
                  </div>
                  <div className="h-10 w-px bg-slate-700"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">99.9%</p>
                    <p className="text-xs text-slate-400">가동률</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
