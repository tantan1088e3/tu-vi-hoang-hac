// ==========================================
// THƯ VIỆN QUẢN LÝ LƯU TRỮ LÁ SỐ BÁT TỰ (LOCAL STORAGE)
// Hỗ trợ: Trình duyệt Web, Web Mobile, PWA, WebView
// ==========================================

const ChartStorage = {
    STORAGE_KEY: 'hoanghac_bazi_saved_charts',
    MAX_CHARTS: 50, // Giới hạn lưu 50 lá số để tránh tràn bộ nhớ

    // 1. Lấy toàn bộ danh sách lá số đã lưu
    getAll: function() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Lỗi khi đọc LocalStorage:", error);
            return [];
        }
    },

    // 2. Lưu một lá số mới
    save: function(profileInput, apiResponseData) {
        let charts = this.getAll();
        
        // Tạo object chứa thông tin cần lưu
        const newChart = {
            id: 'bazi_' + Date.now(), // ID duy nhất
            name: profileInput.name || "Vô Danh Khách",
            gender: profileInput.gender, // 1: Nam, 0: Nữ
            dob_string: `${profileInput.day}/${profileInput.month}/${profileInput.year} ${profileInput.hour}:${profileInput.minute}`,
            
            // Tham số thực tế để sau này gọi lại API
            request_payload: {
                year: profileInput.year,
                month: profileInput.month,
                day: profileInput.day,
                hour: profileInput.hour,
                minute: profileInput.minute,
                gender: profileInput.gender
            },
            
            // Trích xuất tóm tắt từ API để hiển thị danh sách (không cần gọi lại API)
            summary: {
                nhat_chu: apiResponseData.nhat_chu || "Chưa rõ",
                trang_thai: apiResponseData.phan_tich_vuong_suy?.hien_thi_ui?.tong_quan?.trang_thai || "Đang cập nhật"
            },
            
            saved_at: new Date().getTime()
        };

        // Kiểm tra trùng lặp (Cùng tên và cùng giờ sinh thì ghi đè)
        const existingIndex = charts.findIndex(
            c => c.name === newChart.name && c.dob_string === newChart.dob_string
        );

        if (existingIndex !== -1) {
            charts[existingIndex] = newChart; // Cập nhật lá số cũ
        } else {
            // Thêm mới lên đầu danh sách
            charts.unshift(newChart);
        }

        // Xóa bớt nếu vượt quá giới hạn MAX_CHARTS
        if (charts.length > this.MAX_CHARTS) {
            charts.pop(); 
        }

        // Lưu ngược lại vào LocalStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(charts));
        return newChart;
    },

    // 3. Xóa 1 lá số theo ID
    remove: function(chartId) {
        let charts = this.getAll();
        charts = charts.filter(c => c.id !== chartId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(charts));
    },

    // 4. Xóa toàn bộ danh sách
    clearAll: function() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
};
