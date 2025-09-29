// Charts initialization and management
class ChartManager {
    constructor() {
        this.charts = {};
    }

    initCharts() {
        this.initInvestmentChart();
        this.initTenureChart();
        this.initMyInvestmentChart();
        this.initPortfolioChart();
    }

    initInvestmentChart() {
        const ctx = document.getElementById('investmentChart');
        if (!ctx) return;

        this.charts.investment = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [
                    {
                        label: 'Investments (₹ Cr)',
                        data: [0.8, 1.2, 0.9, 1.5, 1.8, 1.2, 1.6, 1.4, 1.7, 1.3],
                        backgroundColor: 'rgba(10, 37, 64, 0.7)',
                        borderColor: 'rgba(10, 37, 64, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Payouts (₹ Cr)',
                        data: [0.15, 0.18, 0.22, 0.25, 0.28, 0.24, 0.26, 0.29, 0.31, 0.27],
                        backgroundColor: 'rgba(201, 162, 39, 0.7)',
                        borderColor: 'rgba(201, 162, 39, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount (₹ Cr)'
                        }
                    }
                }
            }
        });
    }

    initTenureChart() {
        const ctx = document.getElementById('tenureChart');
        if (!ctx) return;

        this.charts.tenure = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['3 Months', '6 Months', '12 Months', '24 Months'],
                datasets: [{
                    data: [15, 25, 45, 15],
                    backgroundColor: [
                        'rgba(10, 37, 64, 0.8)',
                        'rgba(201, 162, 39, 0.8)',
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(108, 117, 125, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initMyInvestmentChart() {
        const ctx = document.getElementById('myInvestmentChart');
        if (!ctx) return;

        this.charts.myInvestment = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Portfolio Value (₹)',
                    data: [500000, 650000, 800000, 950000, 1100000, 1250000, 1300000, 1350000, 1375000, 1400000],
                    backgroundColor: 'rgba(201, 162, 39, 0.1)',
                    borderColor: 'rgba(201, 162, 39, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Portfolio Value (₹)'
                        }
                    }
                }
            }
        });
    }

    initPortfolioChart() {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) return;

        this.charts.portfolio = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Commercial Real Estate', 'Fixed Income', 'Tech Startup'],
                datasets: [{
                    data: [40, 28, 32],
                    backgroundColor: [
                        'rgba(10, 37, 64, 0.8)',
                        'rgba(201, 162, 39, 0.8)',
                        'rgba(40, 167, 69, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateChart(chartName, data) {
        if (this.charts[chartName]) {
            this.charts[chartName].data = data;
            this.charts[chartName].update();
        }
    }
}

// Initialize chart manager
const chartManager = new ChartManager();
