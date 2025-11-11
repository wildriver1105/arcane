'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  label: string;
  type: 'employee' | 'department' | 'project' | 'skill';
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface Link {
  source: string;
  target: string;
  type: 'works_in' | 'manages' | 'collaborates' | 'has_skill' | 'in_project';
}

export default function GraphView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const isDraggingRef = useRef(false);
  const dragNodeRef = useRef<Node | null>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // 데이터 정의
  const nodes: Node[] = [
    // 부서
    { id: 'dept-dev', label: '개발부', type: 'department' },
    { id: 'dept-design', label: '디자인부', type: 'department' },
    { id: 'dept-marketing', label: '마케팅부', type: 'department' },
    { id: 'dept-hr', label: '인사부', type: 'department' },
    
    // 직원
    { id: 'emp-1', label: '김철수', type: 'employee' },
    { id: 'emp-2', label: '이영희', type: 'employee' },
    { id: 'emp-3', label: '박민수', type: 'employee' },
    { id: 'emp-4', label: '정수진', type: 'employee' },
    { id: 'emp-5', label: '최동현', type: 'employee' },
    
    // 프로젝트
    { id: 'proj-1', label: '웹사이트 리뉴얼', type: 'project' },
    { id: 'proj-2', label: '모바일 앱 개발', type: 'project' },
    
    // 역량
    { id: 'skill-react', label: 'React', type: 'skill' },
    { id: 'skill-node', label: 'Node.js', type: 'skill' },
    { id: 'skill-design', label: 'UI/UX 디자인', type: 'skill' },
    { id: 'skill-marketing', label: '디지털 마케팅', type: 'skill' },
  ];

  const links: Link[] = [
    // 직원-부서 관계
    { source: 'emp-1', target: 'dept-dev', type: 'works_in' },
    { source: 'emp-2', target: 'dept-dev', type: 'works_in' },
    { source: 'emp-3', target: 'dept-design', type: 'works_in' },
    { source: 'emp-4', target: 'dept-marketing', type: 'works_in' },
    { source: 'emp-5', target: 'dept-hr', type: 'works_in' },
    
    // 관리 관계
    { source: 'emp-1', target: 'emp-2', type: 'manages' },
    
    // 프로젝트 참여
    { source: 'emp-1', target: 'proj-1', type: 'in_project' },
    { source: 'emp-2', target: 'proj-1', type: 'in_project' },
    { source: 'emp-3', target: 'proj-1', type: 'in_project' },
    { source: 'emp-1', target: 'proj-2', type: 'in_project' },
    { source: 'emp-2', target: 'proj-2', type: 'in_project' },
    
    // 협업 관계
    { source: 'emp-1', target: 'emp-3', type: 'collaborates' },
    { source: 'emp-2', target: 'emp-3', type: 'collaborates' },
    
    // 역량
    { source: 'emp-1', target: 'skill-react', type: 'has_skill' },
    { source: 'emp-1', target: 'skill-node', type: 'has_skill' },
    { source: 'emp-2', target: 'skill-react', type: 'has_skill' },
    { source: 'emp-3', target: 'skill-design', type: 'has_skill' },
    { source: 'emp-4', target: 'skill-marketing', type: 'has_skill' },
  ];

  // Force-directed graph 시뮬레이션
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 노드 초기 위치 설정
    const width = canvas.width;
    const height = canvas.height;
    nodes.forEach((node, i) => {
      node.x = width / 2 + (Math.random() - 0.5) * 200;
      node.y = height / 2 + (Math.random() - 0.5) * 200;
      node.vx = 0;
      node.vy = 0;
    });

    // Force simulation parameters
    const chargeStrength = -300;
    const linkDistance = 150;
    const linkStrength = 0.1;
    const alpha = 0.3;
    const alphaDecay = 0.02;

    const tick = () => {
      // 링크 힘 적용
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source);
        const target = nodes.find((n) => n.id === link.target);
        if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (distance - linkDistance) * linkStrength;

        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        if (source.vx !== undefined && source.vy !== undefined) {
          source.vx += fx;
          source.vy += fy;
        }
        if (target.vx !== undefined && target.vy !== undefined) {
          target.vx -= fx;
          target.vy -= fy;
        }
      });

      // 전하 힘 적용
      nodes.forEach((nodeA, i) => {
        nodes.slice(i + 1).forEach((nodeB) => {
          if (!nodeA.x || !nodeA.y || !nodeB.x || !nodeB.y) return;
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = chargeStrength / (distance * distance);

          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;

          if (nodeA.vx !== undefined && nodeA.vy !== undefined) {
            nodeA.vx -= fx;
            nodeA.vy -= fy;
          }
          if (nodeB.vx !== undefined && nodeB.vy !== undefined) {
            nodeB.vx += fx;
            nodeB.vy += fy;
          }
        });
      });

      // 속도 적용 및 감쇠
      nodes.forEach((node) => {
        if (node.vx !== undefined && node.vy !== undefined && node.x !== undefined && node.y !== undefined) {
          node.vx *= 0.9;
          node.vy *= 0.9;
          node.x += node.vx * alpha;
          node.y += node.vy * alpha;

          // 경계 처리
          const padding = 50;
          if (node.x < padding) {
            node.x = padding;
            node.vx = 0;
          }
          if (node.x > width - padding) {
            node.x = width - padding;
            node.vx = 0;
          }
          if (node.y < padding) {
            node.y = padding;
            node.vy = 0;
          }
          if (node.y > height - padding) {
            node.y = height - padding;
            node.vy = 0;
          }
        }
      });

      // 그리기
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // 링크 그리기
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source);
        const target = nodes.find((n) => n.id === link.target);
        if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        
        const colors: Record<string, string> = {
          works_in: '#94a3b8',
          manages: '#3b82f6',
          collaborates: '#10b981',
          has_skill: '#f59e0b',
          in_project: '#8b5cf6',
        };
        ctx.strokeStyle = colors[link.type] || '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // 노드 그리기
      nodes.forEach((node) => {
        if (!node.x || !node.y) return;

        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        const colors: Record<string, { bg: string; border: string }> = {
          employee: { bg: '#3b82f6', border: '#1e40af' },
          department: { bg: '#10b981', border: '#047857' },
          project: { bg: '#8b5cf6', border: '#6d28d9' },
          skill: { bg: '#f59e0b', border: '#d97706' },
        };

        const color = colors[node.type] || { bg: '#64748b', border: '#475569' };
        const radius = isSelected ? 12 : isHovered ? 10 : 8;

        // 그림자
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // 노드 원
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#ef4444' : color.bg;
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#dc2626' : color.border;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        // 레이블
        if (isHovered || isSelected) {
          ctx.fillStyle = '#1f2937';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.label, node.x, node.y - radius - 15);
        }
      });

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes, links, selectedNode, hoveredNode, zoom, pan]);

  // 마우스 이벤트 처리
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (isDraggingRef.current && dragNodeRef.current) {
      // 노드 드래그
      if (dragNodeRef.current.x !== undefined && dragNodeRef.current.y !== undefined) {
        dragNodeRef.current.x = x;
        dragNodeRef.current.y = y;
        dragNodeRef.current.vx = 0;
        dragNodeRef.current.vy = 0;
      }
    } else {
      // 호버 감지
      let found = false;
      for (const node of nodes) {
        if (!node.x || !node.y) continue;
        const dx = x - node.x;
        const dy = y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 15) {
          setHoveredNode(node);
          canvas.style.cursor = 'pointer';
          found = true;
          break;
        }
      }
      if (!found) {
        setHoveredNode(null);
        canvas.style.cursor = 'default';
      }
    }

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    for (const node of nodes) {
      if (!node.x || !node.y) continue;
      const dx = x - node.x;
      const dy = y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 15) {
        isDraggingRef.current = true;
        dragNodeRef.current = node;
        setSelectedNode(node);
        break;
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    dragNodeRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.5, Math.min(2, prev * delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const getNodeInfo = (node: Node | null) => {
    if (!node) return null;

    const relatedLinks = links.filter(
      (l) => l.source === node.id || l.target === node.id
    );
    const relatedNodes = relatedLinks.map((l) => {
      const otherId = l.source === node.id ? l.target : l.source;
      return nodes.find((n) => n.id === otherId);
    }).filter(Boolean) as Node[];

    return { node, relatedLinks, relatedNodes };
  };

  const nodeInfo = getNodeInfo(selectedNode || hoveredNode);

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">데이터 맵</h1>
          <p className="text-gray-600 mt-2">직원, 부서, 프로젝트, 역량 간의 관계를 시각화합니다</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetView}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            초기화
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="text-gray-700 hover:text-gray-900"
            >
              −
            </button>
            <span className="text-sm text-gray-700 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              className="text-gray-700 hover:text-gray-900"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 범례 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">범례</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-700">직원</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">부서</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-700">프로젝트</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span className="text-sm text-gray-700">역량</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">연결 타입</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-slate-400"></div>
                  <span className="text-gray-600">소속</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-blue-500"></div>
                  <span className="text-gray-600">관리</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-green-500"></div>
                  <span className="text-gray-600">협업</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-amber-500"></div>
                  <span className="text-gray-600">보유 역량</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-purple-500"></div>
                  <span className="text-gray-600">프로젝트 참여</span>
                </div>
              </div>
            </div>
          </div>

          {/* 노드 정보 */}
          {nodeInfo && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">상세 정보</h2>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">이름</div>
                <div className="font-semibold text-gray-900">{nodeInfo.node.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {nodeInfo.node.type === 'employee' && '직원'}
                  {nodeInfo.node.type === 'department' && '부서'}
                  {nodeInfo.node.type === 'project' && '프로젝트'}
                  {nodeInfo.node.type === 'skill' && '역량'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">연결된 항목 ({nodeInfo.relatedNodes.length})</div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {nodeInfo.relatedNodes.map((n) => (
                    <div
                      key={n.id}
                      className="text-xs px-2 py-1 bg-gray-50 rounded text-gray-700"
                    >
                      {n.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 그래프 캔버스 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="bg-gray-50 rounded-lg overflow-hidden" style={{ height: '700px' }}>
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-move"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              />
            </div>
            <div className="mt-4 text-xs text-gray-500">
              💡 팁: 노드를 클릭하여 선택하고, 드래그하여 이동할 수 있습니다. 마우스 휠로 확대/축소할 수 있습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

