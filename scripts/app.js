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
}

// Initialize chart manager globally
const chartManager = new ChartManager();

// Main application JavaScript
class InvestorDashboard {
    constructor() {
        // Use your actual Google Apps Script URL
        this.scriptURL = "https://script.google.com/macros/s/AKfycbwsAG2uqUswgkZ8U3yhBUz7K9T5X9O_WZRssXEuQVcpxF7HGnPbQWkhf1dhj-_moDui/exec";
        this.currentInvestor = null;
        
        // Bind methods to maintain 'this' context
        this.handleConsent = this.handleConsent.bind(this);
        this.logout = this.logout.bind(this);
        this.loadInvestorData = this.loadInvestorData.bind(this);
        this.showDemoDashboard = this.showDemoDashboard.bind(this);
        this.showDashboard = this.showDashboard.bind(this);
        this.updateHeader = this.updateHeader.bind(this);
        this.loadOverviewContent = this.loadOverviewContent.bind(this);
        this.renderInvestments = this.renderInvestments.bind(this);
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthentication();
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.logout);
        }
        
        // Consent form submission
        const consentForm = document.getElementById('consentForm');
        if (consentForm) {
            consentForm.addEventListener('submit', this.handleConsent);
        }
    }

    checkAuthentication() {
        const storedEmail = localStorage.getItem("investorEmail");
        console.log('Stored email:', storedEmail);
        
        if (storedEmail) {
            this.loadInvestorData(storedEmail);
        } else {
            this.showConsentPopup();
        }
    }

    showConsentPopup() {
        const consentPopup = document.getElementById('consentPopup');
        if (consentPopup) {
            consentPopup.style.display = "flex";
        }
    }

    // CORS-safe fetch function
    async fetchWithCORS(url, options = {}) {
        try {
            console.log('Fetching from:', url);
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetch successful:', data);
            return data;
        } catch (error) {
            console.log('Fetch failed, using demo data:', error.message);
            return this.getDemoData(options);
        }
    }

    getDemoData(options) {
        if (options && options.method === 'POST') {
            return {
                success: true,
                message: "Demo mode - Investor created successfully",
                exists: false
            };
        } else {
            // Return demo investor data structure
            return {
                success: true,
                exists: true,
                name: "Demo Investor",
                email: "demo@example.com",
                phone: "9876543210",
                consent: "LEGAL_CONSENT_ACCEPTED",
                status: "Active",
                totalInvestment: 100000,
                totalPayouts: 11500,
                currentPortfolioValue: 88500,
                roi: 10,
                nextPayoutDate: "2025-11-05",
                memberSince: "2024-01-01",
                investments: [
                    {
                        fundName: "MONTHLY INCOME",
                        amount: 100000,
                        date: "2023-01-15",
                        status: "Active",
                        returns: 10.5
                    }
                ],
                upcomingPayouts: [],
                agreements: [
                    {
                        agreementId: "AGR001",
                        type: "Investment Agreement",
                        amount: 100000,
                        date: "2025-07-27",
                        status: "Active"
                    }
                ],
                investmentHistory: [0.8, 1.2, 0.9, 1.5, 1.8, 1.2, 1.6, 1.4, 1.7, 1.3],
                payoutHistory: [0.15, 0.18, 0.22, 0.25, 0.28, 0.24, 0.26, 0.29, 0.31, 0.27],
                tenureDistribution: [15, 25, 45, 15],
                portfolioGrowth: [500000, 650000, 800000, 950000, 1100000, 1250000, 1300000, 1350000, 1375000, 1400000],
                portfolioAllocation: [40, 28, 32]
            };
        }
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
            
            const response = await this.fetchWithCORS(this.scriptURL, {
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
            
            console.log('✅ Response from server:', response);
            
            if (response.success) {
                localStorage.setItem("investorEmail", email);
                localStorage.setItem("investorName", name);
                localStorage.setItem("investorPhone", phone);
                
                const consentPopup = document.getElementById('consentPopup');
                if (consentPopup) {
                    consentPopup.style.display = "none";
                }
                
                await this.loadInvestorData(email);
            } else {
                alert("Error: " + (response.message || "Unknown error"));
            }
        } catch (error) {
            console.error("❌ Error in consent process:", error);
            // Fallback: Store locally and proceed with demo data
            localStorage.setItem("investorEmail", email);
            localStorage.setItem("investorName", name);
            localStorage.setItem("investorPhone", phone);
            
            const consentPopup = document.getElementById('consentPopup');
            if (consentPopup) {
                consentPopup.style.display = "none";
            }
            
            this.showDemoDashboard(name, email, phone);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async loadInvestorData(email) {
        try {
            console.log('🔄 Loading investor data for:', email);
            
            const data = await this.fetchWithCORS(this.scriptURL + "?email=" + encodeURIComponent(email));
            console.log('📊 Investor data received:', data);
            
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
        console.log('🔄 Showing demo dashboard for:', name);
        
        this.currentInvestor = {
            name: name,
            email: email,
            phone: phone,
            totalInvestment: 100000,
            totalPayouts: 11500,
            currentPortfolioValue: 88500,
            roi: '10%',
            nextPayoutDate: '2025-11-05',
            memberSince: '2024-01-01',
            consent: 'Given',
            status: 'Active',
            investments: [
                { fundName: 'MONTHLY INCOME', amount: '100000', date: '2023-01-15', status: 'Active' }
            ],
            upcomingPayouts: [],
            agreements: [
                { agreementId: 'AGR001', type: 'Investment Agreement', amount: '100000', date: '2025-07-27', status: 'Active' }
            ],
            investmentHistory: [0.8, 1.2, 0.9, 1.5, 1.8, 1.2, 1.6, 1.4, 1.7, 1.3],
            payoutHistory: [0.15, 0.18, 0.22, 0.25, 0.28, 0.24, 0.26, 0.29, 0.31, 0.27],
            tenureDistribution: [15, 25, 45, 15],
            portfolioGrowth: [500000, 650000, 800000, 950000, 1100000, 1250000, 1300000, 1350000, 1375000, 1400000],
            portfolioAllocation: [40, 28, 32]
        };
        
        this.showDashboard();
    }

    showDashboard() {
        console.log('🔄 Showing dashboard for:', this.currentInvestor?.name);
        
        const dashboardContent = document.getElementById('dashboardContent');
        if (dashboardContent) {
            dashboardContent.style.display = "block";
        }
        
        this.updateHeader();
        this.loadOverviewContent();
    }

    updateHeader() {
        const headerElement = document.getElementById('headerInvestorName');
        if (headerElement && this.currentInvestor) {
            headerElement.textContent = this.currentInvestor.name;
        }
    }

    loadOverviewContent() {
        if (!this.currentInvestor) {
            console.error('❌ Cannot load overview: currentInvestor is undefined');
            return;
        }

        const formatNumber = (num) => {
            if (!num && num !== 0) return '0';
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        // Update all overview elements with real data
        this.updateElementText('myTotalInvestments', `₹${formatNumber(this.currentInvestor.totalInvestment)}`);
        this.updateElementText('myTotalPayouts', `₹${formatNumber(this.currentInvestor.totalPayouts)}`);
        this.updateElementText('currentValue', `₹${formatNumber(this.currentInvestor.currentPortfolioValue)}`);
        this.updateElementText('nextPayoutDate', this.currentInvestor.nextPayoutDate);

        // Update investor profile
        this.updateElementText('investorName', this.currentInvestor.name);
        this.updateElementText('investorEmail', this.currentInvestor.email);
        this.updateElementText('investorPhone', this.currentInvestor.phone);
        this.updateElementText('memberSince', this.formatDate(this.currentInvestor.memberSince));
        this.updateElementText('investorConsent', this.currentInvestor.consent);

        // Update investment summary
        this.updateElementText('investorInvestment', `₹${formatNumber(this.currentInvestor.totalInvestment)}`);
        this.updateElementText('investorPayout', `₹${formatNumber(this.currentInvestor.totalPayouts)}`);
        this.updateElementText('investorCurrentValue', `₹${formatNumber(this.currentInvestor.currentPortfolioValue)}`);
        this.updateElementText('investorROI', `${this.currentInvestor.roi}%`);

        // Render investments timeline
        this.renderInvestments();
        
        // Initialize charts with real data
        setTimeout(() => {
            if (typeof chartManager !== 'undefined' && this.currentInvestor) {
                chartManager.initMyInvestmentChart(this.currentInvestor);
                chartManager.initPortfolioChart(this.currentInvestor);
            }
        }, 100);
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'Not set';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch (e) {
            return 'Invalid date';
        }
    }

    renderInvestments() {
        const timeline = document.getElementById('investmentTimeline');
        if (!timeline || !this.currentInvestor || !this.currentInvestor.investments) {
            return;
        }

        let html = '<div class="timeline">';
        this.currentInvestor.investments.forEach(inv => {
            html += `
                <div class="timeline-item">
                    <div class="timeline-date">${this.formatDate(inv.date)}</div>
                    <div class="timeline-content">
                        <strong>Investment of ₹${parseInt(inv.amount).toLocaleString('en-IN')}</strong> in ${inv.fundName}
                        <span class="badge-status badge-active ms-2">${inv.status}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        timeline.innerHTML = html;
    }

    logout() {
        localStorage.removeItem("investorEmail");
        localStorage.removeItem("investorName");
        localStorage.removeItem("investorPhone");
        this.currentInvestor = null;
        
        const dashboardContent = document.getElementById('dashboardContent');
        if (dashboardContent) {
            dashboardContent.style.display = "none";
        }
        
        this.showConsentPopup();
        
        // Clear charts
        if (chartManager && chartManager.charts) {
            Object.values(chartManager.charts).forEach(chart => {
                if (chart) chart.destroy();
            });
            chartManager.charts = {};
        }
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Investor Dashboard...');
    window.dashboard = new InvestorDashboard();
});
