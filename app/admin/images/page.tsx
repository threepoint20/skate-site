'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllImages, updateImage, deleteImage, addImage, SiteImage, imageCategories } from '../../lib/imageManager';
import ProtectedRoute from '../../components/ProtectedRoute';
import ImageUpload from '../../components/ImageUpload';

export default function ImageManagement() {
  return (
    <ProtectedRoute requiredPermission="access_admin">
      <ImageManagementContent />
    </ProtectedRoute>
  );
}

function ImageManagementContent() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingImage, setEditingImage] = useState<SiteImage | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const allImages = await getAllImages();
      setImages(allImages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const handleUpdateImage = async (id: string, updates: Partial<SiteImage>) => {
    const success = await updateImage(id, updates);
    if (success) {
      await loadImages();
      setEditingImage(null);
      alert('圖片已更新！');
    } else {
      alert('更新失敗，請稍後再試');
    }
  };

  const handleDeleteImage = async (id: string, name: string) => {
    if (confirm(`確定要刪除圖片「${name}」嗎？`)) {
      const success = await deleteImage(id);
      if (success) {
        await loadImages();
        alert('圖片已刪除！');
      } else {
        alert('刪除失敗，請稍後再試');
      }
    }
  };

  const handleAddImage = async (imageData: Omit<SiteImage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newImage = await addImage(imageData);
    if (newImage) {
      await loadImages();
      setShowAddForm(false);
      alert('圖片已新增！');
    } else {
      alert('新增失敗，請稍後再試');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black">圖片管理</h1>
              <p className="text-gray-600 mt-2">管理網站中的所有圖片</p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/admin"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                返回控制台
              </Link>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                + 新增圖片
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{images.length}</div>
              <div className="text-sm text-gray-600">總圖片數</div>
            </div>
            {Object.entries(imageCategories).map(([key, label]) => (
              <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {images.filter(img => img.category === key).length}
                </div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部 ({images.length})
            </button>
            {Object.entries(imageCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({images.filter(img => img.category === key).length})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Images Grid */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {filteredImages.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {imageCategories[image.category as keyof typeof imageCategories]}
                      </span>
                      {image.order && (
                        <span className="text-xs text-gray-500">順序: {image.order}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{image.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingImage(image)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.id, image.name)}
                        className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold mb-2">
                {selectedCategory === 'all' ? '還沒有圖片' : `${imageCategories[selectedCategory as keyof typeof imageCategories]} 分類中還沒有圖片`}
              </h3>
              <p className="text-gray-500 mb-6">開始上傳你的第一張圖片吧！</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                + 新增圖片
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      {editingImage && (
        <EditImageModal
          image={editingImage}
          onSave={handleUpdateImage}
          onCancel={() => setEditingImage(null)}
        />
      )}

      {/* Add Modal */}
      {showAddForm && (
        <AddImageModal
          onSave={handleAddImage}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </main>
  );
}

// 編輯圖片模態框
function EditImageModal({ 
  image, 
  onSave, 
  onCancel 
}: { 
  image: SiteImage; 
  onSave: (id: string, updates: Partial<SiteImage>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: image.name,
    description: image.description,
    url: image.url,
    category: image.category,
    alt: image.alt,
    order: image.order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(image.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">編輯圖片</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                圖片預覽
              </label>
              <img
                src={formData.url}
                alt={formData.alt}
                className="w-full max-h-48 object-cover rounded-lg border"
              />
            </div>

            <ImageUpload
              currentImage={formData.url}
              onImageUploaded={(imageUrl) => {
                setFormData(prev => ({ ...prev, url: imageUrl }));
              }}
              onImageRemoved={() => {
                setFormData(prev => ({ ...prev, url: '' }));
              }}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                圖片名稱
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分類
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {Object.entries(imageCategories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  排序 (可選)
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt 文字 (無障礙)
              </label>
              <input
                type="text"
                value={formData.alt}
                onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                儲存變更
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 新增圖片模態框
function AddImageModal({ 
  onSave, 
  onCancel 
}: { 
  onSave: (imageData: Omit<SiteImage, 'id' | 'createdAt' | 'updatedAt'>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    category: 'general' as const,
    alt: '',
    order: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) {
      alert('請上傳圖片');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">新增圖片</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload
              currentImage={formData.url}
              onImageUploaded={(imageUrl) => {
                setFormData(prev => ({ ...prev, url: imageUrl }));
              }}
              onImageRemoved={() => {
                setFormData(prev => ({ ...prev, url: '' }));
              }}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                圖片名稱 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分類 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {Object.entries(imageCategories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  排序 (可選)
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt 文字 (無障礙) *
              </label>
              <input
                type="text"
                value={formData.alt}
                onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                新增圖片
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}