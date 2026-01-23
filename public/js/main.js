    // ========== INITIALIZATION ==========
    let currentUser = null;
    const ADMIN_PASSWORD = '123456';
    const FREE_SEARCH_LIMIT = 3;

    // Initialize on load
    window.addEventListener('load', function() {
        loadUserFromStorage();
        updateSearchLimitDisplay();
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            loadAdminData();
        }
    });

    // ========== TAB SWITCHING ==========
    function switchTab(tab) {
        // Hide all tabs
        document.querySelectorAll('.tab-pane').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
        
        // Show selected tab
        document.getElementById(tab).style.display = 'block';
        event.target.classList.add('active');
    }

    // ========== GOOGLE AUTHENTICATION ==========
    function openGoogleAuth() {
        document.getElementById('googleAuthModal').classList.add('active');
    }

    function closeGoogleAuth() {
        document.getElementById('googleAuthModal').classList.remove('active');
        document.getElementById('googleEmail').value = '';
        document.getElementById('googleName').value = '';
    }

    function completeGoogleAuth() {
        const email = document.getElementById('googleEmail').value.trim();
        const name = document.getElementById('googleName').value.trim();

        if (!email || !name) {
            showMessage('googleAuthMsg', 'Please fill in all fields', 'error');
            return;
        }

        currentUser = {
            email: email,
            name: name,
            avatar: name.charAt(0).toUpperCase(),
            premium: false,
            searchesUsed: 0,
            loginDate: new Date().toLocaleString()
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserDisplay();
        closeGoogleAuth();
        showMessage('scrapeMsg', `✅ Welcome ${name}! You have ${FREE_SEARCH_LIMIT} free searches.`, 'success');
    }

    // ========== USER MANAGEMENT ==========
    function loadUserFromStorage() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
            updateUserDisplay();
        }
    }

    function updateUserDisplay() {
        if (currentUser) {
            document.getElementById('userInitial').textContent = currentUser.avatar;
            document.getElementById('userName').textContent = currentUser.name.split(' ')[0];
            if (currentUser.premium) {
                document.getElementById('userName').innerHTML += ' <span class="premium-badge">PREMIUM</span>';
            }
        }
    }

    function toggleUserMenu() {
        alert(`User: ${currentUser ? currentUser.name : 'Not logged in'}\nStatus: ${currentUser && currentUser.premium ? 'Premium' : 'Free'}`);
    }

    function scrollToContent() {
        document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
    }

    // ========== SEARCH LIMIT MANAGEMENT ==========
    function updateSearchLimitDisplay() {
        if (!currentUser) {
            document.getElementById('limitIndicator').style.display = 'none';
            return;
        }

        document.getElementById('limitIndicator').style.display = 'block';
        const used = currentUser.searchesUsed || 0;
        const percentage = (used / FREE_SEARCH_LIMIT) * 100;
        document.getElementById('limitText').textContent = `${used}/${FREE_SEARCH_LIMIT}`;
        document.getElementById('limitFill').style.width = percentage + '%';
    }

    function checkSearchLimit() {
        if (!currentUser) {
            showMessage('scrapeMsg', 'Please sign in with Google first', 'error');
            return false;
        }

        if (!currentUser.premium && currentUser.searchesUsed >= FREE_SEARCH_LIMIT) {
            showMessage('scrapeMsg', `Free limit reached (${FREE_SEARCH_LIMIT}). Upgrade to Premium for unlimited searches.`, 'error');
            return false;
        }

        return true;
    }

    function incrementSearchCount() {
        if (currentUser && !currentUser.premium) {
            currentUser.searchesUsed = (currentUser.searchesUsed || 0) + 1;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateSearchLimitDisplay();
        }
    }

    // ========== EMAIL SCRAPING ==========
    async function scrapeEmails() {
        if (!checkSearchLimit()) return;

        const url = document.getElementById('urlInput').value.trim();
        if (!url) {
            showMessage('scrapeMsg', 'Please enter a valid URL', 'error');
            return;
        }

        showMessage('scrapeMsg', 'Scraping emails...', 'info');

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            incrementSearchCount();
            showMessage('scrapeMsg', `✅ Found ${data.count} emails!`, 'success');
            
            // Display results
            const html = `
                <div style="margin-top: 1.5rem;">
                    <h3 style="margin-bottom: 1rem;">Found ${data.count} Emails:</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
                        ${data.emails.map(email => `
                            <div style="background: var(--light); padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                                <span>${email}</span>
                                <button onclick="navigator.clipboard.writeText('${email}')" class="btn btn-secondary" style="min-width: auto; padding: 0.5rem;">📋</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            document.getElementById('scrapeResults').innerHTML = html;
        } catch (error) {
            showMessage('scrapeMsg', 'Error: ' + error.message, 'error');
        }
    }

    // ========== EMAIL TEMPLATES ==========
    const emailTemplates = {
        principal: "Dear Dr. [NAME],\n\nI hope this message finds you well. I am writing to express my interest in [PURPOSE] at your esteemed institution.\n\nWith my background and passion for education, I believe I can contribute significantly to your school's mission and help students achieve their potential.\n\nI would appreciate the opportunity to discuss this further. Would you have time for a brief conversation?\n\nThank you for considering my request.\n\nBest regards,\n[Your Name]",
        
        professor: "Dear Prof. [NAME],\n\nI hope you are well. I am writing regarding [PURPOSE].\n\nYour groundbreaking work in this field has deeply inspired my academic and professional journey. I greatly admire your contributions and would be honored to discuss potential collaboration or mentorship opportunities.\n\nWould you be available for a discussion at your convenience?\n\nThank you for considering my request.\n\nBest regards,\n[Your Name]",
        
        university: "Dear Admissions Team,\n\nI am writing to express my strong interest in [PURPOSE] with your institution.\n\nYour university's commitment to excellence and innovation aligns perfectly with my academic goals and values. I am confident that I can make meaningful contributions to your academic community.\n\nI would welcome the opportunity to discuss how I can support your institution's mission.\n\nThank you for your consideration.\n\nBest regards,\n[Your Name]",
        
        hr: "Dear [NAME],\n\nI hope this email finds you in good health. I am writing to express my interest in [PURPOSE] at your esteemed organization.\n\nWith [NUMBER] years of experience in my field, I have developed strong skills in leadership, problem-solving, and team collaboration. I am confident that these skills will enable me to make significant contributions to your team.\n\nI would appreciate the opportunity to discuss how my background aligns with your needs.\n\nBest regards,\n[Your Name]",
        
        cto: "Dear [NAME],\n\nI hope you're having a great day. I'm reaching out regarding [PURPOSE].\n\nI have extensive experience with cutting-edge technologies and have successfully led teams to deliver innovative solutions. I believe my technical expertise and strategic vision could add significant value to your organization.\n\nWould you be open to a conversation about potential opportunities?\n\nBest regards,\n[Your Name]",
        
        investor: "Dear [NAME],\n\nI am reaching out regarding an exciting opportunity for [PURPOSE].\n\nOur business model has demonstrated strong market potential with [KEY METRICS]. We are seeking investors who share our vision for growth and innovation.\n\nI would love to schedule a brief call to discuss how this opportunity aligns with your investment portfolio.\n\nBest regards,\n[Your Name]",
        
        client: "Dear [NAME],\n\nI hope you're doing well. I am writing to propose [PURPOSE] that I believe could benefit your organization.\n\nBased on my understanding of your business, I have identified several opportunities where our solutions can drive measurable value. I would be delighted to discuss how we can partner for mutual success.\n\nWould you have time for a brief meeting?\n\nBest regards,\n[Your Name]",
        
        vendor: "Dear [NAME],\n\nI am reaching out regarding [PURPOSE] between our companies.\n\nWe specialize in providing high-quality [PRODUCT/SERVICE] that has consistently delivered excellent results for our partners. I believe our offerings could be mutually beneficial for our organizations.\n\nI would welcome the opportunity to discuss potential collaboration.\n\nBest regards,\n[Your Name]",
        
        media: "Dear [NAME],\n\nI am writing to share an exciting story about [PURPOSE] that I believe would be of great interest to your readers/audience.\n\nThis initiative showcases innovation and positive impact in our industry. I would be delighted to provide more details, schedule an interview, or facilitate a site visit.\n\nPlease let me know if you would like to explore this further.\n\nBest regards,\n[Your Name]"
    };

    function loadCategoryTemplate() {
        const category = document.getElementById('emailCategory').value;
        if (category && emailTemplates[category]) {
            showMessage('composeMsg', `✅ Template loaded for ${category}. Fill in the details to customize.`, 'success');
        }
    }

    function generateCategoryEmail() {
        const category = document.getElementById('emailCategory').value;
        const recipientName = document.getElementById('recipientName').value.trim();
        const purpose = document.getElementById('composePurpose').value.trim();

        if (!category) {
            showMessage('composeMsg', 'Please select a category', 'error');
            return;
        }

        if (!recipientName || !purpose) {
            showMessage('composeMsg', 'Please fill in all fields', 'error');
            return;
        }

        let template = emailTemplates[category];
        let subject = '';

        // Generate subject based on category and purpose
        switch(category) {
            case 'principal':
                subject = `Inquiry Regarding ${purpose} - Professional Request`;
                break;
            case 'professor':
                subject = `${purpose} Opportunity - Academic Discussion`;
                break;
            case 'university':
                subject = `Application for ${purpose}`;
                break;
            case 'hr':
                subject = `Application for ${purpose}`;
                break;
            case 'cto':
                subject = `${purpose} - Technical Opportunity`;
                break;
            case 'investor':
                subject = `Investment Opportunity: ${purpose}`;
                break;
            case 'client':
                subject = `Proposal for ${purpose}`;
                break;
            case 'vendor':
                subject = `Partnership Opportunity: ${purpose}`;
                break;
            case 'media':
                subject = `Story Pitch: ${purpose}`;
                break;
            default:
                subject = `Regarding ${purpose}`;
        }

        // Replace placeholders
        let emailBody = template
            .replace(/\[NAME\]/g, recipientName)
            .replace(/\[PURPOSE\]/g, purpose)
            .replace(/\[NUMBER\]/g, '5+')
            .replace(/\[KEY METRICS\]/g, 'strong growth metrics')
            .replace(/\[PRODUCT\/SERVICE\]/g, 'premium solutions');

        const html = `
            <div style="background: var(--light); padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>Generated Email</h3>
                    <button onclick="copyCEmail('${btoa(emailBody)}')" class="btn btn-secondary" style="min-width: auto;">📋 Copy</button>
                </div>
                <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong style="color: var(--dark);">Subject:</strong> ${subject}
                </div>
                <div style="background: white; padding: 1rem; border-radius: 8px; white-space: pre-wrap; line-height: 1.6; color: var(--dark); max-height: 300px; overflow-y: auto; border: 1px solid var(--light);">
                    ${emailBody}
                </div>
                <div class="btn-group" style="margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="copyToSend('${subject}', '${btoa(emailBody)}')">Use in Campaign</button>
                    <button class="btn btn-secondary" onclick="saveEmailDraft('${subject}', '${btoa(emailBody)}')">Save Draft</button>
                </div>
            </div>
        `;

        document.getElementById('composedEmail').innerHTML = html;
        showMessage('composeMsg', '✅ Email generated successfully!', 'success');
    }

    function copyCEmail(encodedEmail) {
        const email = atob(encodedEmail);
        navigator.clipboard.writeText(email);
        showMessage('composeMsg', '✅ Email copied to clipboard!', 'success');
    }

    function copyToSend(subject, encodedBody) {
        document.getElementById('sendSubject').value = subject;
        document.getElementById('sendBody').value = atob(encodedBody);
        switchTab('campaign');
        showMessage('sendMsg', '✅ Email copied to campaign. Ready to send!', 'success');
    }

    function saveEmailDraft(subject, encodedBody) {
        const drafts = JSON.parse(localStorage.getItem('emailDrafts') || '[]');
        const draft = {
            id: Date.now(),
            subject: subject,
            body: atob(encodedBody),
            saved: new Date().toLocaleString()
        };
        drafts.push(draft);
        localStorage.setItem('emailDrafts', JSON.stringify(drafts));
        showMessage('composeMsg', '✅ Draft saved! Check Saved tab to view.', 'success');
        loadSavedEmails();
    }

    function loadSavedEmails() {
        const drafts = JSON.parse(localStorage.getItem('emailDrafts') || '[]');
        const savedDiv = document.getElementById('savedEmailsList');

        if (drafts.length === 0) {
            savedDiv.innerHTML = '<p style="text-align: center; color: #999;">No saved drafts yet</p>';
            return;
        }

        const html = `
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Saved Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${drafts.map(draft => `
                            <tr>
                                <td>${draft.subject}</td>
                                <td>${draft.saved}</td>
                                <td>
                                    <button onclick="useSavedDraft(${draft.id})" class="btn btn-primary" style="padding: 0.5rem; min-width: auto;">Use</button>
                                    <button onclick="deleteSavedDraft(${draft.id})" class="btn btn-danger" style="padding: 0.5rem; min-width: auto;">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        savedDiv.innerHTML = html;
    }

    function useSavedDraft(id) {
        const drafts = JSON.parse(localStorage.getItem('emailDrafts') || '[]');
        const draft = drafts.find(d => d.id === id);
        if (draft) {
            document.getElementById('sendSubject').value = draft.subject;
            document.getElementById('sendBody').value = draft.body;
            switchTab('campaign');
        }
    }

    function deleteSavedDraft(id) {
        if (confirm('Delete this draft?')) {
            let drafts = JSON.parse(localStorage.getItem('emailDrafts') || '[]');
            drafts = drafts.filter(d => d.id !== id);
            localStorage.setItem('emailDrafts', JSON.stringify(drafts));
            loadSavedEmails();
        }
    }

    // ========== EMAIL SENDING ==========
    async function sendEmails() {
        const emails = document.getElementById('emailAddresses').value.trim();
        const subject = document.getElementById('sendSubject').value.trim();
        const body = document.getElementById('sendBody').value.trim();
        const senderEmail = document.getElementById('senderEmail').value.trim();
        const senderPassword = document.getElementById('senderPassword').value.trim();

        if (!emails || !subject || !body || !senderEmail || !senderPassword) {
            showMessage('sendMsg', 'Please fill in all fields', 'error');
            return;
        }

        showMessage('sendMsg', 'Sending emails...', 'info');

        try {
            const emailList = emails.split(',').map(e => e.trim()).filter(e => e);
            
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailAddresses: emailList,
                    subject: subject,
                    emailBody: body,
                    senderEmail: senderEmail,
                    senderPassword: senderPassword
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            showMessage('sendMsg', `✅ Campaign sent! ${data.totalSent} sent, ${data.totalFailed} failed.`, 'success');
        } catch (error) {
            showMessage('sendMsg', 'Error: ' + error.message, 'error');
        }
    }

    // ========== PAYMENT SYSTEM ==========
    function openPaymentModal() {
        document.getElementById('paymentModal').classList.add('active');
    }

    function closePaymentModal() {
        document.getElementById('paymentModal').classList.remove('active');
    }

    function submitPayment() {
        const transactionId = document.getElementById('transactionId').value.trim();
        const email = document.getElementById('paymentEmail').value.trim();

        if (!transactionId || !email) {
            showMessage('paymentMsg', 'Please fill in all fields', 'error');
            return;
        }

        const payment = {
            id: Date.now(),
            email: email,
            transactionId: transactionId,
            amount: 499,
            status: 'pending',
            date: new Date().toLocaleString(),
            currency: 'PKR'
        };

        let payments = JSON.parse(localStorage.getItem('payments') || '[]');
        payments.push(payment);
        localStorage.setItem('payments', JSON.stringify(payments));

        if (currentUser && currentUser.email === email) {
            currentUser.premium = false; // Will be true after approval
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        showMessage('paymentMsg', '✅ Payment submitted! Waiting for approval...', 'success');
        setTimeout(() => {
            closePaymentModal();
            alert('Payment recorded. Admin will confirm within 24 hours.');
            document.getElementById('transactionId').value = '';
            document.getElementById('paymentEmail').value = '';
        }, 1500);
    }

    // ========== ADMIN SYSTEM ==========
    function openAdminPanel() {
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            document.getElementById('adminDashboard').style.display = 'block';
            loadAdminData();
        } else {
            document.getElementById('adminLoginModal').classList.add('active');
        }
    }

    function closeAdminModal() {
        document.getElementById('adminLoginModal').classList.remove('active');
    }

    function verifyAdminPassword() {
        const password = document.getElementById('adminPassword').value;
        
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('adminLoggedIn', 'true');
            document.getElementById('adminLoginModal').classList.remove('active');
            document.getElementById('adminDashboard').style.display = 'block';
            loadAdminData();
            document.getElementById('adminPassword').value = '';
        } else {
            showMessage('adminLoginMsg', '❌ Incorrect password', 'error');
        }
    }

    function logoutAdmin() {
        localStorage.setItem('adminLoggedIn', 'false');
        document.getElementById('adminDashboard').style.display = 'none';
        alert('Logged out');
    }

    function loadAdminData() {
        let payments = JSON.parse(localStorage.getItem('payments') || '[]');
        let users = new Set(payments.map(p => p.email)).size;
        let pending = payments.filter(p => p.status === 'pending').length;
        let approved = payments.filter(p => p.status === 'approved').length;
        let revenue = payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);

        document.getElementById('totalUsers').textContent = users;
        document.getElementById('pendingPayments').textContent = pending;
        document.getElementById('approvedPayments').textContent = approved;
        document.getElementById('totalRevenue').textContent = 'Rs. ' + revenue.toLocaleString();

        const paymentsList = document.getElementById('paymentsList');
        paymentsList.innerHTML = '';

        if (payments.length === 0) {
            document.getElementById('noPayments').style.display = 'block';
            return;
        }

        document.getElementById('noPayments').style.display = 'none';

        payments.forEach(p => {
            const statusColor = p.status === 'pending' ? '#ff9800' : p.status === 'approved' ? '#43e97b' : '#f5576c';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.email}</td>
                <td>${p.transactionId}</td>
                <td>Rs. ${p.amount}</td>
                <td>${p.date}</td>
                <td style="color: ${statusColor}; font-weight: bold;">${p.status.toUpperCase()}</td>
                <td>
                    ${p.status === 'pending' ? `
                        <button onclick="approvePayment(${p.id})" class="btn btn-success" style="padding: 0.5rem;">✓</button>
                        <button onclick="rejectPayment(${p.id})" class="btn btn-danger" style="padding: 0.5rem;">✕</button>
                    ` : 'Processed'}
                </td>
            `;
            paymentsList.appendChild(row);
        });
    }

    function approvePayment(id) {
        let payments = JSON.parse(localStorage.getItem('payments') || '[]');
        payments = payments.map(p => {
            if (p.id === id) p.status = 'approved';
            return p;
        });
        localStorage.setItem('payments', JSON.stringify(payments));

        // Mark user as premium if logged in
        if (currentUser && payments.find(p => p.id === id && p.email === currentUser.email)) {
            currentUser.premium = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserDisplay();
        }

        loadAdminData();
        alert('✅ Payment approved!');
    }

    function rejectPayment(id) {
        let payments = JSON.parse(localStorage.getItem('payments') || '[]');
        payments = payments.map(p => {
            if (p.id === id) p.status = 'rejected';
            return p;
        });
        localStorage.setItem('payments', JSON.stringify(payments));
        loadAdminData();
        alert('❌ Payment rejected!');
    }

    // ========== UTILITY FUNCTIONS ==========
    function showMessage(elementId, message, type) {
        const msg = document.getElementById(elementId);
        msg.textContent = message;
        msg.classList.add('active', type);
        setTimeout(() => msg.classList.remove('active'), 3000);
    }
