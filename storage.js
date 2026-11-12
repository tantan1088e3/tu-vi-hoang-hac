const ChartStorage = {
    STORAGE_KEY: 'hoanghac_bazi_saved_charts',
    MAX_CHARTS: 50,

    getAll: function() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            return [];
        }
    },

    // Hàm save bây giờ CHỈ nhận 1 tham số là userInput
    save: function(userInput) {
        let charts = this.getAll();
        
        const newChart = {
            id: 'bazi_' + Date.now(),
            name: userInput.name || "Vô Danh Khách",
            gender: userInput.gender, 
            dob_string: `${userInput.day}/${userInput.month}/${userInput.year} ${userInput.hour}:${userInput.minute}`,
            // Lưu lại chính xác thông số để sau này bơm lại vào Form
            request_payload: {
                year: userInput.year, 
                month: userInput.month, 
                day: userInput.day, 
                hour: userInput.hour, 
                minute: userInput.minute, 
                gender: userInput.gender
            },
            saved_at: new Date().getTime()
        };

        const existingIndex = charts.findIndex(
            c => c.name === newChart.name && c.dob_string === newChart.dob_string
        );

        if (existingIndex !== -1) { 
            charts[existingIndex] = newChart; 
        } else { 
            charts.unshift(newChart); 
        }

        if (charts.length > this.MAX_CHARTS) { charts.pop(); }
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(charts));
        return newChart;
    },

    remove: function(chartId) {
        let charts = this.getAll();
        charts = charts.filter(c => c.id !== chartId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(charts));
    },

    clearAll: function() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
};
