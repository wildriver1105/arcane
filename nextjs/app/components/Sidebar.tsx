'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    title: '대시보드',
    icon: '📊',
    path: '/dashboard',
  },
  {
    title: '직원 관리',
    icon: '👥',
    submenu: [
      { title: '직원 목록', path: '/employees' },
      { title: '직원 등록', path: '/employees/new' },
    ],
  },
  {
    title: '근태 관리',
    icon: '⏰',
    path: '/attendance',
  },
  {
    title: '급여 관리',
    icon: '💰',
    path: '/payroll',
  },
  {
    title: '휴가 관리',
    icon: '🏖️',
    path: '/leave',
  },
  {
    title: '역량 평가',
    icon: '⭐',
    path: '/evaluations',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">인사 관리</h1>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <div>
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-300">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.path}
                            className={`block px-4 py-2 rounded-lg transition-colors ${
                              pathname === subItem.path
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
