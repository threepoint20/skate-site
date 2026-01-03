#!/usr/bin/env node

// 測試圖片上傳並診斷 413 錯誤
const fs = require('fs');
const path = require('path');

async function testUploadDebug() {
  try {
    console.log('🔍 Testing upload debug...');
    
    // 檢查是否有測試圖片
    const testImagePath = path.join(process.cwd(), 'public', 'activity1.png');
    if (!fs.existsSync(testImagePath)) {
      console.error('❌ Test image not found:', testImagePath);
      return;
    }
    
    const imageStats = fs.statSync(testImagePath);
    console.log('📊 Test image info:', {
      path: testImagePath,
      size: imageStats.size,
      sizeInMB: (imageStats.size / 1024 / 1024).toFixed(2) + ' MB',
    });
    
    // 檢查檔案大小是否超過限制
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (imageStats.size > MAX_SIZE) {
      console.warn('⚠️ Test image is larger than 5MB limit');
    }
    
    // 創建 FormData
    const FormData = (await import('formdata-node')).FormData;
    const { fileFromPath } = await import('formdata-node/file-from-path');
    
    const formData = new FormData();
    const file = await fileFromPath(testImagePath, 'activity1.png', 'image/png');
    formData.append('image', file);
    
    console.log('📤 Attempting upload to debug endpoint...');
    
    // 測試上傳到 debug endpoint (不需要認證)
    const debugResponse = await fetch('http://localhost:3000/api/debug/upload-test', {
      method: 'POST',
      body: formData,
      // 不要手動設定 Content-Type，讓 fetch 自動設定 multipart/form-data
    });
    
    console.log('Debug GET response:', {
      status: debugResponse.status,
      statusText: debugResponse.statusText,
      headers: Object.fromEntries(debugResponse.headers.entries()),
    });
    
    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      console.log('Debug data:', JSON.stringify(debugData, null, 2));
    } else {
      const errorText = await debugResponse.text();
      console.error('Debug error:', errorText);
    }
    
    // 測試實際上傳 endpoint
    console.log('\n📤 Testing actual upload endpoint...');
    
    const uploadResponse = await fetch('http://localhost:3000/api/upload/image', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Upload response:', {
      status: uploadResponse.status,
      statusText: uploadResponse.statusText,
      headers: Object.fromEntries(uploadResponse.headers.entries()),
    });
    
    if (uploadResponse.ok) {
      const uploadData = await uploadResponse.json();
      console.log('✅ Upload successful:', uploadData);
    } else {
      const errorText = await uploadResponse.text();
      console.error('❌ Upload failed:', errorText);
      
      // 分析錯誤類型
      if (uploadResponse.status === 413) {
        console.error('\n🔍 413 Error Analysis:');
        console.error('- Request Entity Too Large');
        console.error('- This usually means the file is too big or the server has a size limit');
        console.error('- File size:', (imageStats.size / 1024 / 1024).toFixed(2), 'MB');
        console.error('- Server limit: 5 MB');
        
        if (imageStats.size <= MAX_SIZE) {
          console.error('- File is within limit, this might be a server configuration issue');
          console.error('- Check Next.js body parser limits');
          console.error('- Check Vercel function limits');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// 執行測試
testUploadDebug();