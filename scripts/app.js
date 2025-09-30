// scripts/app.js - FIXED VERSION
class ChartManager {
    constructor() {
        this.charts = {};
    }

    initAllCharts(investorData) {
        this.initInvestmentChart(investorData);
        this.initTenureChart(investorData);
        this.initMyInvestmentChart(investorData);
        this.initPortfolioChart(investorData);
    }

    initInvestmentChart(investorData) {
        const ctx = document.getElementById('investmentChart');
        if (!ctx) return;

        const investmentData = investorData.investmentHistory || [0.8, 1.2, 0.9, 1.5, 1.8, 1.2, 1.6, 1.4, 1.7, 1.3];
        const payoutData = investorData.payoutHistory || [0.15, 0.18, 0.22, 0.25, 0.28, 0.24, 0.26, 0.29, 0.31, 0.27];

        this.charts.investment = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [
                    {
                        label: 'Investments (₹ Cr)',
                        data: investmentData,
                        backgroundColor: 'rgba(10, 37, 64, 0.7)',
                        borderColor: 'rgba(10, 37, 64, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Payouts (₹ Cr)',
                        data: payoutData,
                        backgroundColor: 'rgba(201, 162, 39, 0.7)',
                        borderColor: 'rgba(201, 162, 39, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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

    initTenureChart(investorData) {
        const ctx = document.getElementById('tenureChart');
        if (!ctx) return;

        const tenureData = investorData.tenureDistribution || [15, 25, 45, 15];

        this.charts.tenure = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['3 Months', '6 Months', '12 Months', '24 Months'],
                datasets: [{
                    data: tenureData,
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
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initMyInvestmentChart(investorData) {
        const ctx = document.getElementById('myInvestmentChart');
        if (!ctx) return;

        const portfolioGrowth = investorData.portfolioGrowth || [500000, 650000, 800000, 950000, 1100000, 1250000, 1300000, 1350000, 1375000, 1400000];

        this.charts.myInvestment = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Portfolio Value (₹)',
                    data: portfolioGrowth,
                    backgroundColor: 'rgba(201, 162, 39, 0.1)',
                    borderColor: 'rgba(201, 162, 39, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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

    initPortfolioChart(investorData) {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) return;

        const portfolioAllocation = investorData.portfolioAllocation || [40, 28, 32];

        this.charts.portfolio = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Commercial Real Estate', 'Fixed Income', 'Tech Startup'],
                datasets: [{
                    data: portfolioAllocation,
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
                maintainAspectRatio: false,
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

// Initialize chart manager globally
const chartManager = new ChartManager();

// Main application JavaScript
class InvestorDashboard {
    constructor() {
        // USE YOUR ACTUAL GOOGLE APPS SCRIPT URL
        this.scriptURL = "https://script.google.com/macros/s/AKfycbwsAG2uqUswgkZ8U3yhBUz7K9T5X9O_WZRssXEuQVcpxF7HGnPbQWkhf1dhj-_moDui/exec";
        this.currentInvestor = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthentication();
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
        
        // Consent form submission
        document.getElementById('consentForm')?.addEventListener('submit', (e) => this.handleConsent(e));
        
        // Tab click events
        document.querySelectorAll('#dashboardTabs .nav-link').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleTabChange(e.target.getAttribute('href')));
        });
    }

    checkAuthentication() {
        const storedEmail = localStorage.getItem("investorEmail");
        if (storedEmail) {
            this.loadInvestorData(storedEmail);
        } else {
            this.showConsentPopup();
        }
    }

    showConsentPopup() {
        document.getElementById('consentPopup').style.display = "flex";
    }

    async handleConsent(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        submitBtn.disabled = true;

        try {
            console.log('=== STARTING CONSENT PROCESS ===');
            console.log('Sending data to:', this.scriptURL);
            
            const response = await fetch(this.scriptURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    consent: 'true'
                })
            });
            
            const data = await response.json();
            console.log('✅ Response from Google Apps Script:', data);
            
            if (data.success) {
                localStorage.setItem("investorEmail", email);
                localStorage.setItem("investorName", name);
                document.getElementById('consentPopup').style.display = "none";
                await this.loadInvestorData(email);
            } else {
                alert("Error: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error("❌ Error saving consent:", error);
            // Fallback: Store locally and proceed with demo data
            localStorage.setItem("investorEmail", email);
            localStorage.setItem("investorName", name);
            document.getElementById('consentPopup').style.display = "none";
            this.showDemoDashboard(name, email, phone);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async loadInvestorData(email) {
        try {
            console.log('🔄 Loading investor data for:', email);
            const url = `${this.scriptURL}?email=${encodeURIComponent(email)}`;
            
            const response = await fetch(url);
            const data = await response.json();
            console.log('✅ Investor data response:', data);
            
            if (data.success && data.exists) {
                this.currentInvestor = data;
                this.showDashboard();
            } else {
                throw new Error(data.message || 'Investor data not found');
            }
        } catch (error) {
            console.error("❌ Error loading investor data:", error);
            // Fallback to demo data
            this.showDemoDashboard(
                localStorage.getItem("investorName") || "Investor",
                email,
                localStorage.getItem("investorPhone") || "Not provided"
            );
        }
    }

    showDemoDashboard(name, email, phone) {
        this.currentInvestor = {
            name: name,
            email: email,
            phone: phone,
            totalInvestment: '12,50,000',
            totalPayouts: '1,25,000',
            currentPortfolioValue: '13,75,000',
            roi: '12.5%',
            nextPayoutDate: '15 Dec 2024',
            memberSince: 'Jan 2023',
            consent: 'Given',
            status: 'Active',
            investments: [
                { fundName: 'Commercial Real Estate Fund', amount: '500000', date: '15 Jan 2023', status: 'Active' },
                { fundName: 'Fixed Income Portfolio', amount: '350000', date: '22 Mar 2023', status: 'Active' },
                { fundName: 'Tech Startup Funding', amount: '400000', date: '10 Jun 2023', status: 'Active' }
            ],
            upcomingPayouts: [
                { fundName: 'Commercial Real Estate Fund', amount: '15000', dueDate: '5 Nov 2024' },
                { fundName: 'Fixed Income Portfolio', amount: '10500', dueDate: '5 Nov 2024' },
                { fundName: 'Tech Startup Funding', amount: '12000', dueDate: '5 Nov 2024' }
            ]
        };
        this.showDashboard();
    }

    showDashboard() {
        document.getElementById('dashboardContent').style.display = "block";
        this.loadOverviewContent();
    }

    loadOverviewContent() {
        const formatNumber = (num) => {
            if (!num) return '0';
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        // Update header with investor name
        document.getElementById('headerInvestorName').textContent = this.currentInvestor.name;

        const overviewHTML = `
            <div class="alert alert-warning alert-custom mb-4">
                <h6><i class="fas fa-exclamation-triangle me-2"></i>Important Notice</h6>
                <p class="mb-0">This is a private investor portal. All investments are subject to signed agreements and carry risks. Please read the Risk Disclosure tab before proceeding.</p>
            </div>
            
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="stat-card">
                        <h5>My Investments</h5>
                        <h3>₹${formatNumber(this.currentInvestor.totalInvestment)}</h3>
                        <p class="text-muted small mt-2">All time</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <h5>My Payouts</h5>
                        <h3>₹${formatNumber(this.currentInvestor.totalPayouts)}</h3>
                        <p class="text-muted small mt-2">All time</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <h5>Current Value</h5>
                        <h3>₹${formatNumber(this.currentInvestor.currentPortfolioValue)}</h3>
                        <p class="text-muted small mt-2">Portfolio value</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <h5>Next Payout</h5>
                        <h3>${this.currentInvestor.nextPayoutDate || '15 Dec 2024'}</h3>
                        <p class="text-muted small mt-2">Estimated date</p>
                    </div>
                </div>
            </div>
            
            <div class="row g-3 mb-4">
                <div class="col-md-8">
                    <div class="p-3 bg-white dashboard-card">
                        <h6 class="mb-3">My Investment Growth</h6>
                        <div style="height: 250px;">
                            <canvas id="myInvestmentChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 bg-white dashboard-card">
                        <h6 class="mb-3">My Portfolio Allocation</h6>
                        <div style="height: 250px;">
                            <canvas id="portfolioChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="p-3 bg-white dashboard-card">
                        <h6 class="mb-3">Investment History</h6>
                        ${this.generateInvestmentHistory()}
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="p-3 bg-white dashboard-card">
                        <h6 class="mb-3">Upcoming Payouts</h6>
                        ${this.generateUpcomingPayouts()}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('overview').innerHTML = overviewHTML;
        
        // Initialize charts
        setTimeout(() => {
            if (typeof chartManager !== 'undefined') {
                chartManager.initMyInvestmentChart(this.currentInvestor);
                chartManager.initPortfolioChart(this.currentInvestor);
            }
        }, 100);
    }

    generateInvestmentHistory() {
        if (this.currentInvestor.investments && this.currentInvestor.investments.length > 0) {
            return this.currentInvestor.investments.map(investment => `
                <div class="investment-item">
                    <h6>${investment.fundName}</h6>
                    <p>Amount: ₹${investment.amount} | Date: ${investment.date}</p>
                    <span class="badge-status badge-active">${investment.status}</span>
                </div>
            `).join('');
        } else {
            return `
                <div class="investment-item">
                    <h6>Commercial Real Estate Fund</h6>
                    <p>Amount: ₹5,00,000 | Date: 15 Jan 2023</p>
                    <span class="badge-status badge-active">Active</span>
                </div>
                <div class="investment-item">
                    <h6>Fixed Income Portfolio</h6>
                    <p>Amount: ₹3,50,000 | Date: 22 Mar 2023</p>
                    <span class="badge-status badge-active">Active</span>
                </div>
            `;
        }
    }

    generateUpcomingPayouts() {
        if (this.currentInvestor.upcomingPayouts && this.currentInvestor.upcomingPayouts.length > 0) {
            return this.currentInvestor.upcomingPayouts.map(payout => `
                <div class="payout-item mb-2 p-2 bg-light rounded">
                    <strong>${payout.dueDate}</strong>: ₹${payout.amount} 
                    <span class="text-muted">(${payout.fundName})</span>
                </div>
            `).join('');
        } else {
            return `
                <div class="payout-item mb-2 p-2 bg-light rounded">
                    <strong>15 Dec 2024</strong>: ₹15,000 
                    <span class="text-muted">(Commercial Real Estate)</span>
                </div>
                <div class="payout-item mb-2 p-2 bg-light rounded">
                    <strong>15 Dec 2024</strong>: ₹10,500 
                    <span class="text-muted">(Fixed Income)</span>
                </div>
            `;
        }
    }

    handleTabChange(tabId) {
        console.log('Tab changed to:', tabId);
        // Your tab change logic here
    }

    logout() {
        localStorage.removeItem("investorEmail");
        localStorage.removeItem("investorName");
        this.currentInvestor = null;
        document.getElementById('dashboardContent').style.display = "none";
        this.showConsentPopup();
        
        // Clear charts
        Object.values(chartManager.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        chartManager.charts = {};
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new InvestorDashboard();
});
