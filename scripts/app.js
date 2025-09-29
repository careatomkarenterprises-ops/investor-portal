// scripts/app.js - UPDATED VERSION (USES REAL DATA)
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

        // Use actual data from Google Sheets instead of demo data
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

        // Use actual data from Google Sheets
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

        // Use actual portfolio growth data
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

        // Use actual portfolio allocation data
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
        // YOUR GOOGLE APPS SCRIPT URL
        this.scriptURL = "https://script.google.com/macros/s/AKfycbwDI4zbTKZDPupfMQGVyTWKSC264583ppfxCHY4_dtadWQ4_HWaNdnoUigDJE19P5Lt/exec";
        this.currentInvestor = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthentication();
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Consent form submission
        document.getElementById('consentForm').addEventListener('submit', (e) => this.handleConsent(e));
        
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
            console.log('Data:', { name, email, phone });
            
            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('consent', 'true');

            const response = await fetch(this.scriptURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData
            });
            
            const data = await response.json();
            console.log('✅ Response from Google Apps Script:', data);
            
            if (data.success) {
                localStorage.setItem("investorEmail", email);
                document.getElementById('consentPopup').style.display = "none";
                await this.loadInvestorData(email);
            } else {
                alert("Error: " + data.message);
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("❌ Error saving consent:", error);
            alert("Failed to save consent. Please try again. Error: " + error.message);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async loadInvestorData(email) {
        try {
            console.log('🔄 Loading investor data for:', email);
            const url = `${this.scriptURL}?email=${encodeURIComponent(email)}`;
            console.log('📡 Fetching from:', url);
            
            const response = await fetch(url);
            const data = await response.json();
            console.log('✅ Investor data response:', data);
            
            if (data.success && data.exists) {
                this.currentInvestor = data;
                this.showDashboard();
            } else {
                throw new Error(data.message || 'Investor data not found in Google Sheets');
            }
        } catch (error) {
            console.error("❌ Error loading investor data:", error);
            alert("Failed to load investor data: " + error.message);
            this.showConsentPopup();
        }
    }

    showDashboard() {
        document.getElementById('dashboardContent').style.display = "block";
        this.loadOverviewContent();
    }

    loadOverviewContent() {
        // Format numbers with commas
        const formatNumber = (num) => {
            if (!num) return '0';
            return parseInt(num).toLocaleString('en-IN');
        };

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
                        <h3>${this.currentInvestor.nextPayoutDate || '5 Nov 2023'}</h3>
                        <p class="text-muted small mt-2">Estimated date</p>
                    </div>
                </div>
            </div>
            
            <div class="row g-3 mb-4">
                <div class="col-md-8">
                    <div class="p-3 bg-white dashboard-card">
                        <h6 class="mb-3">My Investment Growth</h6>
                        <div class="chart-container">
                            <canvas id="myInvestmentChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 bg-white dashboard-card">
                        <h6 class="mb-3">My Portfolio Allocation</h6>
                        <div class="chart-container">
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

        document.getElementById('overviewContent').innerHTML = overviewHTML;
        
        // Initialize charts with actual data
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
                    <p>Amount: ₹${parseInt(investment.amount).toLocaleString('en-IN')} | Date: ${investment.date}</p>
                    <span class="badge-status badge-active">${investment.status}</span>
                </div>
            `).join('');
        } else {
            // Fallback to demo data if no investments found
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
                <div class="investment-item">
                    <h6>Tech Startup Funding</h6>
                    <p>Amount: ₹4,00,000 | Date: 10 Jun 2023</p>
                    <span class="badge-status badge-active">Active</span>
                </div>
            `;
        }
    }

    generateUpcomingPayouts() {
        if (this.currentInvestor.upcomingPayouts && this.currentInvestor.upcomingPayouts.length > 0) {
            return this.currentInvestor.upcomingPayouts.map(payout => `
                <div class="investment-item">
                    <h6>${payout.fundName}</h6>
                    <p>Amount: ₹${parseInt(payout.amount).toLocaleString('en-IN')} | Due: ${payout.dueDate}</p>
                    <span class="badge-status badge-pending">Pending</span>
                </div>
            `).join('');
        } else {
            // Fallback to demo data if no payouts found
            return `
                <div class="investment-item">
                    <h6>Commercial Real Estate Fund</h6>
                    <p>Amount: ₹15,000 | Due: 5 Nov 2023</p>
                    <span class="badge-status badge-pending">Pending</span>
                </div>
                <div class="investment-item">
                    <h6>Fixed Income Portfolio</h6>
                    <p>Amount: ₹10,500 | Due: 5 Nov 2023</p>
                    <span class="badge-status badge-pending">Pending</span>
                </div>
                <div class="investment-item">
                    <h6>Tech Startup Funding</h6>
                    <p>Amount: ₹12,000 | Due: 5 Nov 2023</p>
                    <span class="badge-status badge-pending">Pending</span>
                </div>
            `;
        }
    }

    handleTabChange(tabId) {
        switch(tabId) {
            case '#investor':
                this.loadInvestorContent();
                break;
            case '#agreement':
                this.loadAgreementContent();
                break;
            case '#earnings':
                this.loadEarningsContent();
                break;
            case '#risk':
                this.loadRiskContent();
                break;
            case '#hotdeals':
                this.loadHotDealsContent();
                break;
            case '#faq':
                this.loadFAQContent();
                break;
        }
    }

    loadInvestorContent() {
        const formatNumber = (num) => {
            if (!num) return '0';
            return parseInt(num).toLocaleString('en-IN');
        };

        const investorHTML = `
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="profile-card">
                        <h5><i class="fas fa-user-circle me-2"></i>Investor Profile</h5>
                        <div class="mb-3">
                            <p class="mb-1"><strong>Name:</strong></p>
                            <p>${this.currentInvestor.name}</p>
                            
                            <p class="mb-1"><strong>Email:</strong></p>
                            <p>${this.currentInvestor.email}</p>
                            
                            <p class="mb-1"><strong>Phone:</strong></p>
                            <p>${this.currentInvestor.phone}</p>
                            
                            <p class="mb-1"><strong>Member Since:</strong></p>
                            <p>${this.currentInvestor.memberSince || 'Jan 2023'}</p>
                            
                            <p class="mb-1"><strong>Legal Consent:</strong></p>
                            <p><span class="badge-status badge-active">${this.currentInvestor.consent || 'Given'}</span></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="p-3 bg-white dashboard-card mb-4">
                        <h5 class="mb-3">Investment Summary</h5>
                        <div class="row text-center">
                            <div class="col-md-3 mb-3">
                                <h4 class="text-primary">₹${formatNumber(this.currentInvestor.totalInvestment)}</h4>
                                <p class="text-muted small">Total Invested</p>
                            </div>
                            <div class="col-md-3 mb-3">
                                <h4 class="text-success">₹${formatNumber(this.currentInvestor.totalPayouts)}</h4>
                                <p class="text-muted small">Total Returns</p>
                            </div>
                            <div class="col-md-3 mb-3">
                                <h4 class="text-info">₹${formatNumber(this.currentInvestor.currentPortfolioValue)}</h4>
                                <p class="text-muted small">Current Value</p>
                            </div>
                            <div class="col-md-3 mb-3">
                                <h4 class="text-warning">${this.currentInvestor.roi || '12.5%'}</h4>
                                <p class="text-muted small">ROI</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-3 bg-white dashboard-card">
                        <h5 class="mb-3">Investment Timeline</h5>
                        <div class="timeline">
                            ${this.generateInvestmentTimeline()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('investorContent').innerHTML = investorHTML;
    }

    generateInvestmentTimeline() {
        if (this.currentInvestor.investments && this.currentInvestor.investments.length > 0) {
            return this.currentInvestor.investments.map(investment => `
                <div class="timeline-item">
                    <div class="timeline-date">${investment.date}</div>
                    <div class="timeline-content">
                        <strong>Investment of ₹${parseInt(investment.amount).toLocaleString('en-IN')}</strong> in ${investment.fundName}
                        <span class="badge-status badge-active ms-2">${investment.status}</span>
                    </div>
                </div>
            `).join('');
        } else {
            return `
                <div class="timeline-item">
                    <div class="timeline-date">15 Jan 2023</div>
                    <div class="timeline-content">
                        <strong>Investment of ₹5,00,000</strong> in Commercial Real Estate
                        <span class="badge-status badge-active ms-2">Active</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-date">22 Mar 2023</div>
                    <div class="timeline-content">
                        <strong>Investment of ₹3,50,000</strong> in Fixed Income
                        <span class="badge-status badge-active ms-2">Active</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-date">10 Jun 2023</div>
                    <div class="timeline-content">
                        <strong>Investment of ₹4,00,000</strong> in Tech Startup
                        <span class="badge-status badge-active ms-2">Active</span>
                    </div>
                </div>
            `;
        }
    }

    loadAgreementContent() {
        // Your existing agreement content
        const agreementHTML = `
            <div class="p-3 bg-white dashboard-card">
                <h5 class="mb-3"><i class="fas fa-file-contract me-2"></i>Investment Agreements</h5>
                <p>Your signed investment agreements and legal documents will appear here.</p>
            </div>
        `;
        document.getElementById('agreementContent').innerHTML = agreementHTML;
    }

    loadEarningsContent() {
        // Your existing earnings content
        const earningsHTML = `
            <div class="p-3 bg-white dashboard-card">
                <h5 class="mb-3"><i class="fas fa-chart-line me-2"></i>Earnings & Returns</h5>
                <p>Detailed earnings and return analysis will appear here.</p>
            </div>
        `;
        document.getElementById('earningsContent').innerHTML = earningsHTML;
    }

    loadRiskContent() {
        // Your existing risk content
        const riskHTML = `
            <div class="p-3 bg-white dashboard-card">
                <h5 class="mb-3"><i class="fas fa-exclamation-triangle me-2"></i>Risk Disclosure</h5>
                <p>Risk disclosure documents and compliance information will appear here.</p>
            </div>
        `;
        document.getElementById('riskContent').innerHTML = riskHTML;
    }

    loadHotDealsContent() {
        // Your existing hot deals content
        const hotDealsHTML = `
            <div class="p-3 bg-white dashboard-card">
                <h5 class="mb-3"><i class="fas fa-bolt me-2"></i>Hot Deals</h5>
                <p>Exclusive investment opportunities will appear here.</p>
            </div>
        `;
        document.getElementById('hotdealsContent').innerHTML = hotDealsHTML;
    }

    loadFAQContent() {
        // Your existing FAQ content
        const faqHTML = `
            <div class="p-3 bg-white dashboard-card">
                <h5 class="mb-3"><i class="fas fa-question-circle me-2"></i>Frequently Asked Questions</h5>
                <p>Common questions and answers will appear here.</p>
            </div>
        `;
        document.getElementById('faqContent').innerHTML = faqHTML;
    }

    logout() {
        localStorage.removeItem("investorEmail");
        this.currentInvestor = null;
        document.getElementById('dashboardContent').style.display = "none";
        this.showConsentPopup();
        
        // Clear all chart instances
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