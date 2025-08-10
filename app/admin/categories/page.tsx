'use client';

import { useLocalDb } from '@/components/providers/localdb-provider';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';

export default function AdminCategoriesPage() {
  const {
    categories,
    subcategories,
    addCategory,
    addSubcategory,
    updateCategory,
    updateSubcategory,
    deleteCategory,
    deleteSubcategory,
    events,
  } = useLocalDb() as any;
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#7C3AED');
  const [parentId, setParentId] = useState('');
  const [subName, setSubName] = useState('');
  const [colorTarget, setColorTarget] = useState(
    null as null | { id: string; current: string; kind: 'category' | 'subcategory' },
  );

  const sortedCats = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const usageCount = (catId: string) => events.filter((e: any) => e.categoryId === catId).length;

  return (
    <div className="card-panel p-4">
      <h2 className="mb-2 text-xl font-semibold">카테고리 관리</h2>
      <div className="mb-6 grid grid-cols-1 gap-2 md:grid-cols-5">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="카테고리명" />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-full rounded-lg border"
        />
        <Button
          onClick={() => {
            if (!name) return;
            addCategory({ name, colorHex: color, isActive: true, sortOrder: categories.length });
            setName('');
            showToast('카테고리가 추가되었습니다', 'success');
          }}
        >
          <span className="inline-flex items-center gap-1">
            <Plus size={16} /> 추가
          </span>
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-2 md:grid-cols-5">
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="h-10 w-full rounded-lg border bg-white/60 px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">상위 카테고리 선택</option>
          {sortedCats.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Input
          value={subName}
          onChange={(e) => setSubName(e.target.value)}
          placeholder="하위 카테고리명"
        />
        <Button
          className="bg-secondary"
          onClick={() => {
            if (!parentId || !subName) return;
            addSubcategory({
              categoryId: parentId,
              name: subName,
              colorHex: null,
              isActive: true,
              sortOrder: 0,
            });
            setSubName('');
            showToast('하위 카테고리가 추가되었습니다', 'success');
          }}
        >
          <span className="inline-flex items-center gap-1">
            <Plus size={16} /> 하위 추가
          </span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sortedCats.map((c: any) => (
          <div key={c.id} className="rounded-xl border bg-white/80 p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  title="색상 변경"
                  onClick={() =>
                    setColorTarget({ id: c.id, current: c.colorHex, kind: 'category' })
                  }
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 ring-slate-200 hover:ring-2 hover:ring-slate-300"
                  style={{ backgroundColor: c.colorHex }}
                />
                <input
                  className="rounded border bg-white/60 px-2 py-1 text-sm shadow-sm"
                  value={c.name}
                  onChange={(e) => updateCategory(c.id, { name: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>사용: {usageCount(c.id)}</span>
                <button
                  title="삭제"
                  className="rounded bg-red-500/90 p-1 text-white hover:bg-red-500"
                  onClick={() => {
                    const res = deleteCategory(c.id);
                    if (!res.ok) alert(res.reason);
                    else showToast('카테고리가 삭제되었습니다', 'success');
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-slate-700">
              {subcategories
                .filter((s: any) => s.categoryId === c.id)
                .map((s: any) => (
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <input
                      className="w-full rounded border bg-white/60 px-2 py-1 shadow-sm"
                      value={s.name}
                      onChange={(e) => updateSubcategory(s.id, { name: e.target.value })}
                    />
                    <button
                      title="삭제"
                      className="rounded bg-slate-200 p-1 hover:bg-slate-300"
                      onClick={() => deleteSubcategory(s.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      {colorTarget && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setColorTarget(null)}>
          <div
            className="absolute left-1/2 top-1/2 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">색상 선택</h3>
              <button
                className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
                onClick={() => setColorTarget(null)}
              >
                닫기
              </button>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {PALETTE.map((hex) => (
                <button
                  key={hex}
                  title={hex}
                  className="h-8 w-8 rounded-full ring-1 ring-slate-200 hover:ring-2 hover:ring-slate-300"
                  style={{ backgroundColor: hex }}
                  onClick={() => {
                    const t = colorTarget as any;
                    if (t.kind === 'category') updateCategory(t.id, { colorHex: hex });
                    else updateSubcategory(t.id, { colorHex: hex });
                    setColorTarget(null);
                    showToast('색상이 변경되었습니다', 'success');
                  }}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="color"
                defaultValue={(colorTarget as any).current}
                onChange={(e) => {
                  const t = colorTarget as any;
                  if (t.kind === 'category') updateCategory(t.id, { colorHex: e.target.value });
                  else updateSubcategory(t.id, { colorHex: e.target.value });
                }}
                className="h-10 w-16 cursor-pointer rounded-md border border-slate-200 bg-white/70"
              />
              <span className="text-xs text-slate-500">직접 선택</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PALETTE: string[] = [
  '#7C3AED',
  '#6D28D9',
  '#4F46E5',
  '#2563EB',
  '#0EA5E9',
  '#06B6D4',
  '#14B8A6',
  '#10B981',
  '#22C55E',
  '#84CC16',
  '#EAB308',
  '#F59E0B',
  '#F97316',
  '#EF4444',
  '#E11D48',
  '#DB2777',
];
