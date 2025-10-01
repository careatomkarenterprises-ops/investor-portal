// charts.js - COMPLETE VERSION WITH NULL CHECKS
class ChartManager {
    constructor() {
        this.charts = {};
        this.defaultColors = {
            primary: 'rgba(10, 37, 64, 0.8)',
            secondary: 'rgba(201, 162, 39, 0.8)',
            success: 'rgba(40, 167, 69, 0.8)',
            warning: 'rgba(255, 193, 7, 0.8)',
            danger: 'rgba(220, 53, 69, 0.8)',
            gray: 'rgba(108, 117, 125, 0.8)'
        };
    }

    // ✅ INITIALIZE ALL CHARTS WITH NULL CHECKS
    initAllCharts(investorData = null) {
        console.log('🔄 Initializing charts with data:', investorData);
        
        try {
            this.initInvestmentChart(investorData);
            this.initTenureChart(investorData);
            this.initMyInvestmentChart(investorData);
            this.initPortfolioChart(investorData);
            this.initPerformanceChart(investorData);
            
            console.log('✅ All charts initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing charts:', error);
        }
    }

    // ✅ INVESTMENT VS PAYOUTS CHART
    initInvestmentChart(investorData) {
        const ctx = document.getElementById('investmentChart');
        if (!ctx) {
            console.warn('❌ investmentChart canvas not found');
            return;
        }

        // ✅ NULL CHECK: Safe data access with fallbacks
        const investmentHistory = Array.isArray(investorData?.investmentHistory) 
            ? investorData.investmentHistory 
            : [0.8, 1.2, 0.9, 1.5, 1.8, 1.2, 1.6, 1.4, 1.7, 1.3];
            
        const payoutHistory = Array.isArray(investorData?.payoutHistory)
            ? investorData.payoutHistory
            : [0.15, 0.18, 0.22, 0.25, 0.28, 0.24, 0.26, 0.29, 0.31, 0.27];

        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

        // Destroy existing chart if it exists
        if (this.charts.investment) {
            this.charts.investment.destroy();
        }

        this.charts.investment = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Investments (₹ Cr)',
                        data: investmentHistory,
                        backgroundColor: this.defaultColors.primary,
                        borderColor: 'rgba(10, 37, 64, 1)',
                        borderWidth: 1,
                        borderRadius: 4
                    },
                    {
                        label: 'Payouts (₹ Cr)',
                        data: payoutHistory,
                        backgroundColor: this.defaultColors.secondary,
                        borderColor: 'rgba(201, 162, 39, 1)',
                        borderWidth: 1,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ₹${context.parsed.y} Cr`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount (₹ Crores)',
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // ✅ TENURE DISTRIBUTION CHART
    initTenureChart(investorData) {
        const ctx = document.getElementById('tenureChart');
        if (!ctx) {
            console.warn('❌ tenureChart canvas not found');
            return;
        }

        // ✅ NULL CHECK: Safe data access with fallbacks
        const tenureData = Array.isArray(investorData?.tenureDistribution)
            ? investorData.tenureDistribution
            : [15, 25, 45, 15];

        const labels = ['3 Months', '6 Months', '12 Months', '24 Months'];
        const backgroundColors = [
            this.defaultColors.primary,
            this.defaultColors.secondary,
            this.defaultColors.success,
            this.defaultColors.gray
        ];

        // Destroy existing chart if it exists
        if (this.charts.tenure) {
            this.charts.tenure.destroy();
        }

        this.charts.tenure = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: tenureData,
                    backgroundColor: backgroundColors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.parsed / total) * 100);
                                return `${context.label}: ${context.parsed}% (${percentage}% of total)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ✅ MY INVESTMENT GROWTH CHART
    initMyInvestmentChart(investorData) {
        const ctx = document.getElementById('myInvestmentChart');
        if (!ctx) {
            console.warn('❌ myInvestmentChart canvas not found');
            return;
        }

        // ✅ NULL CHECK: Safe data access with fallbacks
        const portfolioGrowth = Array.isArray(investorData?.portfolioGrowth)
            ? investorData.portfolioGrowth
            : [500000, 650000, 800000, 950000, 1100000, 1250000, 1300000, 1350000, 1375000, 1400000];

        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

        // Calculate growth percentage
        const initialValue = portfolioGrowth[0] || 1;
        const growthPercentage = portfolioGrowth.map(value => 
            (((value - initialValue) / initialValue) * 100).toFixed(1)
        );

        // Destroy existing chart if it exists
        if (this.charts.myInvestment) {
            this.charts.myInvestment.destroy();
        }

        this.charts.myInvestment = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Portfolio Value (₹)',
                    data: portfolioGrowth,
                    backgroundColor: 'rgba(201, 162, 39, 0.1)',
                    borderColor: 'rgba(201, 162, 39, 1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: 'rgba(201, 162, 39, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const growth = growthPercentage[context.dataIndex];
                                return `Portfolio Value: ₹${value.toLocaleString('en-IN')} (${growth}% growth)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Portfolio Value (₹)',
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return '₹' + (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return '₹' + (value / 1000).toFixed(0) + 'K';
                                }
                                return '₹' + value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // ✅ PORTFOLIO ALLOCATION CHART
    initPortfolioChart(investorData) {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) {
            console.warn('❌ portfolioChart canvas not found');
            return;
        }

        // ✅ NULL CHECK: Safe data access with fallbacks
        const portfolioAllocation = Array.isArray(investorData?.portfolioAllocation)
            ? investorData.portfolioAllocation
            : [40, 28, 32];

        const labels = ['Commercial Real Estate', 'Fixed Income', 'Tech Startup'];
        const backgroundColors = [
            this.defaultColors.primary,
            this.defaultColors.secondary,
            this.defaultColors.success
        ];

        // Destroy existing chart if it exists
        if (this.charts.portfolio) {
            this.charts.portfolio.destroy();
        }

        this.charts.portfolio = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: portfolioAllocation,
                    backgroundColor: backgroundColors,
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ✅ PERFORMANCE COMPARISON CHART (Additional Chart)
    initPerformanceChart(investorData) {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return; // This chart might not exist on all pages

        // Demo performance data
        const performanceData = {
            omkar: [12, 13, 11, 14, 15, 13, 16, 14, 17, 15, 16, 18],
            mutualFunds: [8, 9, 7, 10, 8, 9, 11, 10, 9, 8, 10, 11],
            fixedDeposits: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
        };

        const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Omkar Enterprises',
                        data: performanceData.omkar,
                        borderColor: this.defaultColors.secondary,
                        backgroundColor: 'rgba(201, 162, 39, 0.1)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Mutual Funds',
                        data: performanceData.mutualFunds,
                        borderColor: this.defaultColors.primary,
                        backgroundColor: 'rgba(10, 37, 64, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: false,
                        borderDash: [5, 5]
                    },
                    {
                        label: 'Fixed Deposits',
                        data: performanceData.fixedDeposits,
                        borderColor: this.defaultColors.gray,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Annual Returns (%)'
                        }
                    }
                }
            }
        });
    }

    // ✅ UPDATE CHART DATA SAFELY
    updateChart(chartName, newData) {
        if (!this.charts[chartName]) {
            console.warn(`Chart ${chartName} not found`);
            return;
        }

        try {
            this.charts[chartName].data = newData;
            this.charts[chartName].update('active');
            console.log(`✅ Chart ${chartName} updated successfully`);
        } catch (error) {
            console.error(`❌ Error updating chart ${chartName}:`, error);
        }
    }

    // ✅ DESTROY ALL CHARTS (for cleanup)
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
        console.log('✅ All charts destroyed');
    }

    // ✅ RESPONSIVE CHART RESIZE
    handleResize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
}

// ✅ INITIALIZE CHART MANAGER GLOBALLY
const chartManager = new ChartManager();

// ✅ EXPOSE TO GLOBAL SCOPE FOR DEBUGGING
window.chartManager = chartManager;

// ✅ RESPONSIVE HANDLING
window.addEventListener('resize', () => {
    chartManager.handleResize();
});

console.log('📊 Chart Manager loaded successfully');
