'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { CONTENT_FIELDS, getSiteContent, updateSiteContent } from '../../lib/siteContent';

export default function ContentManagement() {
  return (
    <ProtectedRoute requiredPermission="access_admin">
      <ContentManagementContent />
    </ProtectedRoute>
  );
}

function ContentManagementContent() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [savedValues, setSavedValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const content = await getSiteContent({ fresh: true });
      setValues(content);
      setSavedValues(content);
      setLoading(false);
    };
    load();
  }, []);

  // 依頁面分組
  const pageGroups = CONTENT_FIELDS.reduce<Record<string, typeof CONTENT_FIELDS>>((acc, field) => {
    (acc[field.page] ||= []).push(field);
    return acc;
  }, {});

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = (key: string, defaultValue: string) => {
    setValues(prev => ({ ...prev, [key]: defaultValue }));
  };

  const handleSave = async () => {
    // 只送出有變更的欄位
    const updates: Record<string, string> = {};
    for (const field of CONTENT_FIELDS) {
      if (values[field.key] !== savedValues[field.key]) {
        updates[field.key] = values[field.key] ?? '';
      }
    }
    if (Object.keys(updates).length === 0) {
      alert('沒有變更內容');
      return;
    }

    setSaving(true);
    const success = await updateSiteContent(updates);
    setSaving(false);

    if (success) {
      setSavedValues({ ...values });
      alert('內容已儲存！重新整理前台頁面即可看到變更。');
    } else {
      alert('儲存失敗，請稍後再試');
    }
  };

  const changedCount = CONTENT_FIELDS.filter(f => values[f.key] !== savedValues[f.key]).length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="px-6 py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← 返回控制台
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">頁面內容管理</h1>
          <p className="mt-4 text-lg text-blue-100">
            編輯各頁面的文字內容，儲存後前台即時生效
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">載入中...</p>
            </div>
          ) : (
            <>
              {/* 固定儲存列 */}
              <div className="sticky top-0 z-10 bg-white border-b py-4 mb-8 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {changedCount > 0 ? `${changedCount} 個欄位已修改` : '沒有未儲存的變更'}
                </p>
                <button
                  onClick={handleSave}
                  disabled={saving || changedCount === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {saving ? '儲存中...' : '儲存全部變更'}
                </button>
              </div>

              {Object.entries(pageGroups).map(([page, fields]) => (
                <div key={page} className="mb-10">
                  <h2 className="text-2xl font-bold mb-4 text-black border-b pb-2">{page}</h2>
                  <div className="space-y-4">
                    {fields.map(field => (
                      <div key={field.key} className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                            {field.label}
                            <span className="ml-2 text-xs text-gray-400 font-mono">{field.key}</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleReset(field.key, field.default)}
                            className="text-xs text-gray-500 hover:text-blue-600"
                          >
                            還原預設
                          </button>
                        </div>
                        {field.multiline ? (
                          <textarea
                            id={field.key}
                            value={values[field.key] ?? ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <input
                            type="text"
                            id={field.key}
                            value={values[field.key] ?? ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
