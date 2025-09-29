// scripts/app.js - COMPLETE WORKING VERSION
class ChartManager {
    constructor() {
        this.charts = {};
    }

    initAllCharts() {
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
                maintainAspectRatio: false,
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
        // REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT URL AFTER DEPLOYMENT
        this.scriptURL = "https://script.google.com/macros/s/AKfycbwDI4zbTKZDPupfMQGVyTWKSC264583ppfxCHY4_dtadWQ4_HWaNdnoUigDJE19P5Lt/exec";
        this.currentInvestor = null;
        this.isDemoMode = false;
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
            // Try to save to Google Sheets
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
            console.log('Response from server:', data);
            
            if (data.success) {
                localStorage.setItem("investorEmail", email);
                document.getElementById('consentPopup').style.display = "none";
                this.loadInvestorData(email);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("Error saving consent:", error);
            // Fallback to demo mode
            this.isDemoMode = true;
            localStorage.setItem("investorEmail", email);
            document.getElementById('consentPopup').style.display = "none";
            this.useDemoData(name, email, phone);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    useDemoData(name, email, phone) {
        this.currentInvestor = {
            name: name,
            email: email,
            phone: phone,
            consent: "LEGAL_CONSENT_ACCEPTED",
            totalInvestment: "12,50,000",
            lastPayout: "45,000",
            currentValue: "13,75,000",
            roi: "12.5%",
            memberSince: new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            exists: true,
            investments: [
                { id: "INV001", date: "2023-01-15", amount: "5,00,000", type: "Commercial Real Estate", status: "Active" },
                { id: "INV002", date: "2023-03-22", amount: "3,50,000", type: "Fixed Income", status: "Active" },
                { id: "INV003", date: "2023-06-10", amount: "4,00,000", type: "Tech Startup", status: "Active" }
            ]
        };
        
        this.showDashboard();
    }

    async loadInvestorData(email) {
        try {
            const response = await fetch(`${this.scriptURL}?email=${encodeURIComponent(email)}`);
            const data = await response.json();
            
            if (data.success && data.exists) {
                this.currentInvestor = data;
                this.showDashboard();
            } else {
                // Use demo data if real data not available
                this.isDemoMode = true;
                this.useDemoData("Demo User", email, "+91 XXXXX XXXXX");
            }
        } catch (error) {
            console.error("Error loading investor data:", error);
            // Use demo data on error
            this.isDemoMode = true;
            this.useDemoData("Demo User", email, "+91 XXXXX XXXXX");
        }
    }

    showDashboard() {
        document.getElementById('dashboardContent').style.display = "block";
        this.loadOverviewContent();
        
        // Show demo mode notice if applicable
        if (this.isDemoMode) {
            setTimeout(() => {
                this.showDemoNotice();
            }, 1000);
        }
    }

    showDemoNotice() {
        const alertHTML = `
            <div class="alert alert-info alert-dismissible fade show" role="alert">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Demo Mode:</strong> Currently showing sample data. Real data will appear when backend connection is fully configured.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        document.getElementById('overviewContent').insertAdjacentHTML('afterbegin', alertHTML);
    }

    loadOverviewContent() {
        const overviewHTML = `
            <div class="alert alert-warning alert-custom mb-4">
                <h6><i class="fas fa-exclamation-triangle me-2"></i>Important Notice</h6>
                <p class="mb-0">This is a private investor portal. All investments are subject to signed agreements and carry risks. Please read the Risk Disclosure tab before proceeding.</p>
            </div>
            
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <div class="stat-card">
                        <h5>My Investments</h5>
                        <h3>₹${this.currentInvestor.totalInvestment || '0'}</h3>
                        <p class="text-muted small mt-2">All time</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <h5>My Payouts</h5>
                        <h3>₹${this.currentInvestor.lastPayout || '0'}</h3>
                        <p class="text-muted small mt-2">All time</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <h5>Current Value</h5>
                        <h3>₹${this.currentInvestor.currentValue || '0'}</h3>
                        <p class="text-muted small mt-2">Portfolio value</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <h5>Next Payout</h5>
                        <h3>5 Nov 2023</h3>
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
                        <h6 class="mb-3">Recent Investments</h6>
                        ${this.generateInvestmentsList()}
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="p-3 bg-white dashboard-card">
                        <h6 class="mb-3">Upcoming Payouts</h6>
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
                    </div>
                </div>
            </div>
        `;

        document.getElementById('overviewContent').innerHTML = overviewHTML;
        
        // Initialize charts
        setTimeout(() => {
            if (typeof chartManager !== 'undefined') {
                chartManager.initMyInvestmentChart();
                chartManager.initPortfolioChart();
            }
        }, 100);
    }

    generateInvestmentsList() {
        if (!this.currentInvestor.investments) {
            return '<p class="text-muted">No investments found.</p>';
        }

        return this.currentInvestor.investments.map(inv => `
            <div class="investment-item">
                <h6>${inv.type}</h6>
                <p>Amount: ₹${inv.amount} | Date: ${this.formatDate(inv.date)}</p>
                <span class="badge-status badge-active">${inv.status}</span>
            </div>
        `).join('');
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
                            <p>${this.currentInvestor.memberSince}</p>
                            
                            <p class="mb-1"><strong>Legal Consent:</strong></p>
                            <p><span class="badge-status badge-active">${this.currentInvestor.consent}</span></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="p-3 bg-white dashboard-card mb-4">
                        <h5 class="mb-3">Investment Summary</h5>
                        <div class="row text-center">
                            <div class="col-md-3 mb-3">
                                <h4 class="text-primary">₹${this.currentInvestor.totalInvestment || '0'}</h4>
                                <p class="text-muted small">Total Invested</p>
                            </div>
                            <div class="col-md-3 mb-3">
                                <h4 class="text-success">₹${this.currentInvestor.lastPayout || '0'}</h4>
                                <p class="text-muted small">Total Returns</p>
                            </div>
                            <div class="col-md-3 mb-3">
                                <h4 class="text-info">₹${this.currentInvestor.currentValue || '0'}</h4>
                                <p class="text-muted small">Current Value</p>
                            </div>
                            <div class="col-md-3 mb-3">
                                <h4 class="text-warning">${this.currentInvestor.roi || '0%'}</h4>
                                <p class="text-muted small">ROI</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-3 bg-white dashboard-card">
                        <h5 class="mb-3">Investment Timeline</h5>
                        <div class="timeline">
                            ${this.generateTimeline()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('investorContent').innerHTML = investorHTML;
    }

    generateTimeline() {
        if (!this.currentInvestor.investments) {
            return '<p class="text-muted">No investment history.</p>';
        }

        return this.currentInvestor.investments.map(inv => `
            <div class="timeline-item">
                <div class="timeline-date">${this.formatDate(inv.date)}</div>
                <div class="timeline-content">
                    <strong>Investment of ₹${inv.amount}</strong> in ${inv.type}
                    <span class="badge-status badge-active ms-2">${inv.status}</span>
                </div>
            </div>
        `).join('');
    }

    loadAgreementContent() {
        const agreementHTML = `
            <div class="p-3 bg-white dashboard-card">
                <h5 class="mb-3"><i class="fas fa-file-contract me-2"></i>Your Agreements</h5>
                <p class="text-muted mb-4">All your signed agreements are securely stored here. You can download them anytime for your records.</p>
                
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Agreement ID</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.generateAgreementsTable()}
                        </tbody>
                    </table>
                </div>
                
                <div class="mt-4">
                    <button class="btn btn-primary me-2" onclick="alert('This feature will be available soon')">
                        <i class="fas fa-download me-1"></i>Download All Agreements
                    </button>
                    <button class="btn btn-outline-primary" onclick="alert('Sample agreement will open in new tab')">
                        <i class="fas fa-eye me-1"></i>View Sample Agreement
                    </button>
                </div>
            </div>
        `;

        document.getElementById('agreementContent').innerHTML = agreementHTML;
    }

    generateAgreementsTable() {
        if (!this.currentInvestor.investments) {
            return '<tr><td colspan="6" class="text-center text-muted">No agreements found</td></tr>';
        }

        return this.currentInvestor.investments.map(inv => `
            <tr>
                <td>${inv.id}</td>
                <td>${this.formatDate(inv.date)}</td>
                <td>${inv.type}</td>
                <td>₹${inv.amount}</td>
                <td><span class="badge-status badge-active">${inv.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="alert('Download feature coming soon')">
                        <i class="fas fa-download me-1"></i>Download
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadEarningsContent() {
        const earningsHTML = `
            <div class="row g-3">
                <div class="col-md-8">
                    <div class="p-3 bg-white dashboard-card">
                        <h5 class="mb-3"><i class="fas fa-money-bill-wave me-2"></i>How You Earn</h5>
                        <p class="mb-4">At Omkar Enterprises, we provide structured investment opportunities with consistent returns. Our model ensures your investments work efficiently while maintaining security and transparency.</p>
                        
                        <div class="mb-4">
                            <h6><i class="fas fa-chart-line text-success me-2"></i>Fixed Monthly Returns</h6>
                            <p class="text-muted">Earn predictable monthly returns based on your investment amount and tenure. Returns are credited directly to your registered bank account.</p>
                        </div>
                        
                        <div class="mb-4">
                            <h6><i class="fas fa-shield-alt text-primary me-2"></i>Secured Investments</h6>
                            <p class="text-muted">All investments are backed by legally binding agreements and collateral, ensuring the safety of your capital.</p>
                        </div>
                        
                        <div class="mb-4">
                            <h6><i class="fas fa-sync-alt text-warning me-2"></i>Flexible Tenures</h6>
                            <p class="text-muted">Choose from various investment tenures (3, 6, 12 months) that suit your financial goals and liquidity needs.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="p-3 bg-white dashboard-card mb-4">
                        <h6 class="mb-3"><i class="fas fa-calculator me-2"></i>Return Calculator</h6>
                        <div class="mb-3">
                            <label class="form-label">Investment Amount (₹)</label>
                            <input type="number" class="form-control" id="calcAmount" value="100000">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Tenure (Months)</label>
                            <select class="form-select" id="calcTenure">
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="12" selected>12 Months</option>
                                <option value="24">24 Months</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Return Rate (%)</label>
                            <input type="number" class="form-control" id="calcRate" value="12" step="0.1">
                        </div>
                        <button class="btn btn-primary w-100 mb-3" onclick="calculateReturns()">
                            <i class="fas fa-calculator me-1"></i>Calculate Returns
                        </button>
                        <div class="p-3 bg-light rounded">
                            <p class="mb-1">Estimated Returns: <strong id="estimatedReturns">₹12,000</strong></p>
                            <p class="mb-0">Total Value: <strong id="totalValue">₹112,000</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('earningsContent').innerHTML = earningsHTML;
    }

    loadRiskContent() {
        const riskHTML = `
            <div class="p-3 bg-white dashboard-card">
                <h5 class="mb-4"><i class="fas fa-exclamation-triangle me-2 text-warning"></i>Investment Risk Disclosure</h5>
                
                <div class="alert alert-warning risk-warning mb-4">
                    <strong><i class="fas fa-exclamation-circle me-2"></i>Important:</strong> Please read this risk disclosure carefully before making any investment decisions.
                </div>
                
                <div class="legal-text mb-4">
                    <h6 class="mb-3">1. Capital Risk</h6>
                    <p>Your invested capital is at risk. There is no guarantee of return of principal amount. Investments are subject to business performance and market conditions.</p>
                    
                    <h6 class="mb-3">2. Return Risk</h6>
                    <p>Returns are not guaranteed and depend on business performance. Projected returns are estimates only and actual returns may vary. Delays in returns may occur due to business conditions.</p>
                    
                    <h6 class="mb-3">3. Liquidity Risk</h6>
                    <p>Investments may have lock-in periods. Early withdrawal may not be possible or may involve penalties. There is no secondary market for these investments.</p>
                    
                    <h6 class="mb-3">4. Business Risk</h6>
                    <p>Investments are subject to market conditions, economic factors, and business performance. External factors beyond our control may affect investment outcomes.</p>
                    
                    <h6 class="mb-3">5. Regulatory Risk</h6>
                    <p>Changes in government policies, laws, or regulations may affect investments and returns.</p>
                </div>
                
                <div class="p-3 bg-light rounded">
                    <h6 class="mb-3">Your Acknowledgement</h6>
                    <p class="mb-2">By using this dashboard and making investments, you acknowledge that:</p>
                    <ul>
                        <li>You have read and understood all risks involved</li>
                        <li>You are investing capital you can afford to risk</li>
                        <li>You understand Omkar Enterprises is not a bank or NBFC</li>
                        <li>All investments are private contractual arrangements</li>
                    </ul>
                </div>
            </div>
        `;

        document.getElementById('riskContent').innerHTML = riskHTML;
    }

    loadHotDealsContent() {
        const hotdealsHTML = `
            <div class="p-3 bg-white dashboard-card mb-4">
                <h5 class="mb-3"><i class="fas fa-fire me-2"></i>Hot Investment Opportunities</h5>
                <p class="text-muted">Exclusive investment opportunities with enhanced returns for a limited time. Act fast as these deals have limited availability.</p>
                <div class="alert alert-warning risk-warning mt-3">
                    <strong>Note:</strong> All investments carry risks. Please read the Risk Disclosure before investing.
                </div>
            </div>
            
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="hot-deal-card p-0 position-relative">
                        <div class="hot-deal-badge">Limited Time</div>
                        <div class="p-4">
                            <h5>Commercial Real Estate Fund</h5>
                            <p class="text-muted">Invest in premium commercial properties with guaranteed rental yields.</p>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Minimum Investment</span>
                                <strong>₹5,00,000</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Expected Returns</span>
                                <strong class="text-success">14.5% p.a.</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span>Tenure</span>
                                <strong>24 Months</strong>
                            </div>
                            <button class="btn btn-primary w-100" onclick="alert('Interest registered successfully! Our team will contact you shortly.')">Express Interest</button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="hot-deal-card p-0 position-relative">
                        <div class="hot-deal-badge">Filling Fast</div>
                        <div class="p-4">
                            <h5>Tech Startup Funding</h5>
                            <p class="text-muted">Early-stage investment in promising tech startups with high growth potential.</p>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Minimum Investment</span>
                                <strong>₹2,50,000</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Expected Returns</span>
                                <strong class="text-success">18-25% p.a.</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span>Tenure</span>
                                <strong>36 Months</strong>
                            </div>
                            <button class="btn btn-primary w-100" onclick="alert('Interest registered successfully! Our team will contact you shortly.')">Express Interest</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('hotdealsContent').innerHTML = hotdealsHTML;
    }

    loadFAQContent() {
        const faqHTML = `
            <div class="p-3 bg-white dashboard-card">
                <h5 class="mb-4"><i class="fas fa-question-circle me-2"></i>Frequently Asked Questions</h5>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <span>What is the minimum investment amount?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>The minimum investment amount is ₹50,000. However, certain exclusive opportunities may have higher minimums as specified in the deal details.</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <span>How are returns paid out?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>Returns are typically paid out monthly directly to your registered bank account. The exact payout schedule is specified in your investment agreement.</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <span>Can I withdraw my investment early?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>Early withdrawal options are available but may be subject to terms and conditions specified in your agreement, including potential early withdrawal fees. Please contact our support team for specific cases.</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <span>How secure is my investment?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>All investments are backed by legally binding agreements and appropriate collateral. We conduct thorough due diligence on all opportunities before presenting them to our investors.</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h6>Still have questions?</h6>
                    <p class="text-muted">Contact our support team at <a href="mailto:support@omkarenterprises.com">support@omkarenterprises.com</a> or call us at +91-XXXXX-XXXXX during business hours.</p>
                </div>
            </div>
        `;

        document.getElementById('faqContent').innerHTML = faqHTML;
        this.initFAQ();
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'Not Provided';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Not Provided';
        }
    }

    logout() {
        localStorage.removeItem("investorEmail");
        window.location.reload();
    }
}

// Global function for return calculator
function calculateReturns() {
    const amount = parseFloat(document.getElementById('calcAmount').value) || 0;
    const tenure = parseInt(document.getElementById('calcTenure').value) || 12;
    const rate = parseFloat(document.getElementById('calcRate').value) || 12;
    
    const returns = (amount * rate * tenure) / 1200;
    const totalValue = amount + returns;
    
    document.getElementById('estimatedReturns').textContent = `₹${returns.toLocaleString('en-IN')}`;
    document.getElementById('totalValue').textContent = `₹${totalValue.toLocaleString('en-IN')}`;
}

// Global function to show risk tab
function showRiskTab() {
    const riskTab = document.querySelector('a[href="#risk"]');
    if (riskTab) {
        riskTab.click();
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InvestorDashboard();
});
