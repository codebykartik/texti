document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const goToSignup = document.getElementById('go-to-signup');
    const goToLogin = document.getElementById('go-to-login');
    const logoutBtn = document.getElementById('logout-btn');
    const userInitials = document.getElementById('user-initials');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const transformBtn = document.getElementById('transform-btn');
    const quickInput = document.getElementById('quick-input');
    const transformType = document.getElementById('transform-type');
    const outputContainer = document.getElementById('output-container');
    const transformedOutput = document.getElementById('transformed-output');
    const copyBtn = document.getElementById('copy-btn');

    // Check if user is logged in
    checkAuthStatus();

    // Event listeners for auth navigation
    goToSignup.addEventListener('click', function (e) {
        e.preventDefault();
        loginContainer.classList.add('hidden');
        signupContainer.classList.remove('hidden');
    });

    goToLogin.addEventListener('click', function (e) {
        e.preventDefault();
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });

    // Login form submit
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email, password);
    });

    // Signup form submit
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        register(name, email, password);
    });

    // Logout button
    logoutBtn.addEventListener('click', function () {
        logout();
    });

    // Transform button
    transformBtn.addEventListener('click', function () {
        const text = quickInput.value.trim();
        const type = transformType.value;

        if (!text) return;

        transformText(text, type);
    });

    // Copy button
    copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(transformedOutput.textContent).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy to Clipboard';
            }, 2000);
        });
    });

    // Authentication functions
    async function checkAuthStatus() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getToken' });
            const token = response.token;

            if (!token) {
                showLoginView();
                return;
            }

            // Get user data from storage
            chrome.storage.local.get(['user'], (result) => {
                if (result.user) {
                    setUserData(result.user);
                    showDashboardView();
                } else {
                    // If token exists but no user data, fetch it from API
                    fetchUserData(token);
                }
            });
        } catch (error) {
            console.error('Auth check failed:', error);
            showLoginView();
        }
    }

    async function fetchUserData(token) {
        try {
            // In a real implementation, this would call your API
            // const response = await fetch('https://api.textcraft.ai/api/auth/me', {
            //   headers: { 'Authorization': `Bearer ${token}` }
            // });
            // const data = await response.json();

            // If we can't reach the API, use mock data
            const mockUser = {
                name: 'Demo User',
                email: 'demo@textcraft.ai',
                preferences: {
                    theme: 'light',
                    defaultTransformation: 'formal'
                }
            };

            // Save user data
            chrome.storage.local.set({ user: mockUser });

            setUserData(mockUser);
            showDashboardView();
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            logout(); // Clear token if we can't fetch user data
        }
    }

    async function login(email, password) {
        try {
            // In a real implementation, this would call your API
            // const response = await fetch('https://api.textcraft.ai/api/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email, password })
            // });
            // const data = await response.json();

            // Mock successful login
            const mockToken = 'mock_token_' + Date.now();
            const mockUser = {
                name: email.split('@')[0],
                email: email,
                preferences: {
                    theme: 'light',
                    defaultTransformation: 'formal'
                }
            };

            // Save token and user data
            await chrome.runtime.sendMessage({ action: 'setToken', token: mockToken });
            chrome.storage.local.set({ user: mockUser });

            setUserData(mockUser);
            showDashboardView();
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    }

    async function register(name, email, password) {
        try {
            // In a real implementation, this would call your API
            // const response = await fetch('https://api.textcraft.ai/api/auth/register', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ name, email, password })
            // });
            // const data = await response.json();

            // Mock successful registration
            const mockToken = 'mock_token_' + Date.now();
            const mockUser = {
                name: name,
                email: email,
                preferences: {
                    theme: 'light',
                    defaultTransformation: 'formal'
                }
            };

            // Save token and user data
            await chrome.runtime.sendMessage({ action: 'setToken', token: mockToken });
            chrome.storage.local.set({ user: mockUser });

            setUserData(mockUser);
            showDashboardView();
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    }

    async function logout() {
        await chrome.runtime.sendMessage({ action: 'clearToken' });
        showLoginView();
    }

    // Text transformation
    async function transformText(text, type) {
        try {
            // Show loading indicator
            transformedOutput.textContent = 'Transforming...';
            outputContainer.classList.remove('hidden');

            // Get token from storage
            const response = await chrome.runtime.sendMessage({ action: 'getToken' });
            const token = response.token;

            if (!token) {
                throw new Error('Authentication required');
            }

            // In a real implementation, this would call your API
            // const apiResponse = await fetch('https://api.textcraft.ai/api/transform/text', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${token}`
            //   },
            //   body: JSON.stringify({ text, type, audience: 'general' })
            // });
            // const data = await apiResponse.json();
            // const transformedText = data.data.transformedText;

            // Mock transformation for demo
            let transformedText = '';

            // Wait for a short time to simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            switch (type) {
                case 'formal':
                    transformedText = text
                        .replace(/can't/gi, 'cannot')
                        .replace(/won't/gi, 'will not')
                        .replace(/hey/gi, 'Hello')
                        .replace(/boss/gi, 'Sir/Madam')
                        .replace(/lol/gi, '')
                        .replace(/hi/gi, 'Hello');

                    if (text.includes("can't come to work")) {
                        transformedText = "Dear Sir/Madam, I regret to inform you I'll be absent from work today.";
                    }
                    break;
                case 'casual':
                    transformedText = text
                        .replace(/Hello/gi, 'Hey')
                        .replace(/Good morning/gi, 'Morning')
                        .replace(/I regret to inform you/gi, "Just letting you know");
                    break;
                case 'joke':
                    if (text.includes("work")) {
                        transformedText = "Can't come to work today. My bed and I are having separation anxiety issues!";
                    } else {
                        transformedText = text + " 😂 (Imagine this being much funnier with proper AI!)";
                    }
                    break;
                case 'shakespearean':
                    if (text.includes("work")) {
                        transformedText = "Alas, good sir! I must declare mine absence from today's labours, for reasons most grave and unfortunate.";
                    } else {
                        transformedText = "Hark! " + text + " (but in a more Shakespeare-y way, forsooth!)";
                    }
                    break;
                case 'emoji':
                    if (text.includes("work")) {
                        transformedText = "I can't come to work today 😷 🛌 🤒";
                    } else {
                        transformedText = text + " 👍 ✨ 🙌";
                    }
                    break;
                case 'grammar':
                    transformedText = text
                        .replace(/cant/g, "can't")
                        .replace(/wont/g, "won't")
                        .replace(/im/g, "I'm")
                        .replace(/\si\s/g, " I ");
                    break;
                case 'concise':
                    transformedText = text
                        .replace(/due to the fact that/gi, "because")
                        .replace(/in order to/gi, "to")
                        .replace(/at this point in time/gi, "now")
                        .replace(/for the purpose of/gi, "for");
                    break;
                default:
                    transformedText = text;
            }

            // Update the output
            transformedOutput.textContent = transformedText;
        } catch (error) {
            console.error('Transformation failed:', error);
            transformedOutput.textContent = 'Error: Failed to transform text. ' + error.message;
        }
    }

    // UI helpers
    function showLoginView() {
        loginContainer.classList.remove('hidden');
        signupContainer.classList.add('hidden');
        dashboardContainer.classList.add('hidden');
    }

    function showDashboardView() {
        loginContainer.classList.add('hidden');
        signupContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
    }

    function setUserData(user) {
        if (!user) return;

        // Set user name and email
        userName.textContent = user.name || 'User';
        userEmail.textContent = user.email || '';

        // Set initials
        if (user.name) {
            const names = user.name.split(' ');
            if (names.length > 1) {
                userInitials.textContent = (names[0][0] + names[1][0]).toUpperCase();
            } else {
                userInitials.textContent = names[0][0].toUpperCase();
            }
        } else {
            userInitials.textContent = 'U';
        }

        // Set any preferences if available
        if (user.preferences && user.preferences.defaultTransformation) {
            transformType.value = user.preferences.defaultTransformation;
        }
    }
});