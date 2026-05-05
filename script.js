// ========================================
// 全局變數 - 儲存模型和攝影機相關資訊
// ========================================
let model; // Teachable Machine 模型
let webcam; // 攝影機實例
let maxPredictions; // 分類數量
let modelLoaded = false; // 模型是否已載入

// ========================================
// 初始化 - 頁面載入時執行
// ========================================
async function init() {
    console.log('開始載入模型...');
    
    // 顯示載入狀態
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    
    try {
        // 模型資料的 URL 路徑
        // 這些檔案需要放在 models/ 資料夾中
        const modelURL = 'models/model.json';
        const metadataURL = 'models/metadata.json';
        
        // 使用 Teachable Machine Library 載入模型
        model = await tmImage.load(modelURL, metadataURL);
        
        // 獲取模型的分類數量
        maxPredictions = model.getTotalClasses();
        
        console.log(`模型載入完成！共有 ${maxPredictions} 個分類`);
        modelLoaded = true;
        loading.style.display = 'none';
        
        // 顯示成功提示
        console.log('✓ 模型準備就緒，可以開啟攝影機了');
        
    } catch (error) {
        console.error('❌ 模型載入失敗:', error);
        loading.innerHTML = '<p style="color: red;">❌ 模型載入失敗，請確認檔案路徑</p>';
    }
}

// ========================================
// 開啟攝影機
// ========================================
async function startCamera() {
    console.log('開啟攝影機...');

    if (!modelLoaded) {
        alert('❌ 模型還未載入');
        return;
    }

    try {
        const video = document.getElementById('webcam');

        // ✅ 正確用法（只用 Teachable Machine）
        webcam = new tmImage.Webcam(224, 224, true);
        await webcam.setup({ facingMode: "environment" });
        await webcam.play();

        // 把畫面顯示在 <video>
        video.srcObject = webcam.webcam.srcObject;

        // 更新按鈕狀態
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('captureBtn').disabled = false;

        startPrediction();

        console.log('✓ 攝影機已開啟');

    } catch (error) {
        console.error('❌ 攝影機開啟失敗:', error);
        alert('❌ 無法開啟攝影機，請確認權限');
    }
}
        



// ========================================
// 關閉攝影機
// ========================================
async function stopCamera() {
    console.log('關閉攝影機...');
    
    // 停止攝影機
    if (webcam) {
        webcam.stop();
    }
    
    // 清除 video 標籤的串流
    const video = document.getElementById('webcam');
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
    
    // 更新按鈕狀態
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('captureBtn').disabled = true;
    
    console.log('✓ 攝影機已關閉');
}

// ========================================
// 實時預測 - 不斷更新攝影機中的辨識結果
// ========================================
async function startPrediction() {
    // 只在攝影機開啟時執行預測
    if (webcam && webcam.canvas) {
        // 更新攝影機畫面
        await webcam.update();
        
        // 執行預測
        const prediction = await model.predict(webcam.canvas);
        
        // 顯示預測結果
        displayPredictions(prediction);
        
        // 使用 requestAnimationFrame 實現流暢的實時更新
        requestAnimationFrame(startPrediction);
    }
}

// ========================================
// 拍照並進行辨識
// ========================================
async function capturePhoto() {
    console.log('拍照中...');
    
    if (!webcam || !webcam.canvas) {
        alert('❌ 攝影機未就緒');
        return;
    }
    
    // 獲取 canvas 並進行預測
    const canvas = webcam.canvas;
    const prediction = await model.predict(canvas);
    
    // 在結果區域顯示拍攝的照片
    const resultImage = document.getElementById('resultImage');
    resultImage.src = canvas.toDataURL();
    resultImage.style.display = 'block';
    
    // 隱藏"請拍照"的提示文字
    document.getElementById('noImageText').style.display = 'none';
    
    // 顯示完整的預測結果
    displayPredictions(prediction);
    
    console.log('✓ 拍照完成，辨識結果已更新');
}

// ========================================
// 顯示預測結果
// ========================================
function displayPredictions(prediction) {
    const resultsDiv = document.getElementById('results');
    const topResultDiv = document.getElementById('topResult');
    
    // 清空之前的結果
    resultsDiv.innerHTML = '';
    
    // 找出信心分數最高的分類
    let maxConfidence = 0;
    let topLabel = '';
    
    // 遍歷所有分類，生成結果項目
    for (let i = 0; i < maxPredictions; i++) {
        // 獲取分類標籤和信心分數
        const label = prediction[i].className;
        const confidence = (prediction[i].probability * 100).toFixed(2); // 轉換為百分比
        
        // 追蹤最高信心分數
        if (prediction[i].probability > maxConfidence) {
            maxConfidence = prediction[i].probability;
            topLabel = label;
        }
        
        // 建立結果項目 HTML
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        // 根據信心分數調整進度條顏色
        let barColor = '#667eea'; // 預設紫色
        if (confidence < 30) {
            barColor = '#dc3545'; // 紅色（低信心）
        } else if (confidence < 60) {
            barColor = '#ffc107'; // 黃色（中等信心）
        } else {
            barColor = '#28a745'; // 綠色（高信心）
        }
        
        resultItem.innerHTML = `
            <div class="result-item-label">${label}</div>
            <div class="result-item-bar">
                <div class="result-item-fill" style="width: ${confidence}%; background: ${barColor};">
                    ${confidence}%
                </div>
            </div>
        `;
        
        resultsDiv.appendChild(resultItem);
    }
    
    // 顯示最高信心分數的分類
    if (topLabel) {
        topResultDiv.innerHTML = `
            <div class="result-label">🎯 ${topLabel}</div>
            <div class="result-confidence">信心分數: ${(maxConfidence * 100).toFixed(2)}%</div>
        `;
        topResultDiv.style.display = 'block';
    }
    
    resultsDiv.style.display = 'block';
}

// ========================================
// 頁面載入時執行初始化
// ========================================
window.addEventListener('load', init);
