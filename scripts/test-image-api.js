#!/usr/bin/env node

// 測試圖片管理 API
require('dotenv').config({ path: '.env.local' });

async function testImageAPI() {
  try {
    console.log('🔄 Testing image database functions...');
    
    // 動態導入資料庫函數
    const { getAllImagesFromDB, addImageToDB, updateImageInDB, deleteImageFromDB } = await import('../app/lib/database.js');
    
    // 測試讀取所有圖片
    console.log('\n1. Testing getAllImagesFromDB...');
    const images = await getAllImagesFromDB();
    console.log(`✅ Found ${images.length} images`);
    images.forEach(img => {
      console.log(`  - ${img.id}: ${img.name} (${img.category})`);
    });
    
    // 測試新增圖片
    console.log('\n2. Testing addImageToDB...');
    const testImage = {
      id: 'test-image-' + Date.now(),
      name: '測試圖片',
      description: '這是一張測試圖片',
      url: '/test-image.jpg',
      category: 'general',
      alt: '測試圖片',
      order: 99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const addedImage = await addImageToDB(testImage);
    if (addedImage) {
      console.log(`✅ Added image: ${addedImage.name}`);
    } else {
      console.log('❌ Failed to add image');
    }
    
    // 測試更新圖片
    if (addedImage) {
      console.log('\n3. Testing updateImageInDB...');
      const updateSuccess = await updateImageInDB(addedImage.id, {
        name: '更新後的測試圖片',
        description: '這是更新後的描述',
      });
      console.log(`${updateSuccess ? '✅' : '❌'} Update result: ${updateSuccess}`);
    }
    
    // 測試刪除圖片
    if (addedImage) {
      console.log('\n4. Testing deleteImageFromDB...');
      const deleteSuccess = await deleteImageFromDB(addedImage.id);
      console.log(`${deleteSuccess ? '✅' : '❌'} Delete result: ${deleteSuccess}`);
    }
    
    // 最終檢查
    console.log('\n5. Final check...');
    const finalImages = await getAllImagesFromDB();
    console.log(`✅ Final image count: ${finalImages.length}`);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// 執行測試
testImageAPI();