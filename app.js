import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js';

/**
 * Asynchronously hash a password using the Web Crypto API.
 * This function returns a hex string of the SHA‑256 hash.
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Convert bytes to a hexadecimal string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Initialize the Vue application instance
const app = createApp({
    data() {
        return {
            loggedIn: false,
            token: '',
            showRegister: false // Determines whether to show the registration form
        };
    },
    methods: {
        handleLogin(token) {
            this.token = token;
            this.loggedIn = true;
        },
        toggleRegister() {
            // Toggle between login and registration views
            this.showRegister = !this.showRegister;
        },
        handleRegistrationSuccess(token) {
            // Auto-login the user upon successful registration
            this.token = token;
            this.loggedIn = true;
        }
    }
});

// Login Component: handles user login
app.component('login-component', {
    data() {
        return {
            email: '',
            password: '',
            errorMsg: ''
        };
    },
    template: `
      <div class="container">
        <h2>Login to VetConnect</h2>
        <form @submit.prevent="login">
          <div>
            <label>Email:</label>
            <input type="email" v-model="email" required>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" v-model="password" required>
          </div>
          <button type="submit">Login</button>
          <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
        </form>
        <p>
          Don't have an account?
          <a href="#" @click.prevent="$emit('show-register')">Register here</a>.
        </p>
      </div>
    `,
    methods: {
        login() {
            axios.post('http://localhost:3000/api/auth/login', {
                email: this.email,
                password: this.password
            })
                .then(response => {
                    const token = response.data.token;
                    this.$emit('login-success', token);
                })
                .catch(() => {
                    this.errorMsg = "Login failed. Check your credentials.";
                });
        }
    }
});

// Create User Component: handles new account registration with password hashing
app.component('create-user-component', {
    data() {
        return {
            email: '',
            password: '',
            confirmPassword: '',
            errorMsg: ''
        };
    },
    template: `
      <div class="container">
        <h2>Create a New Account</h2>
        <form @submit.prevent="createUser">
          <div>
            <label>Email:</label>
            <input type="email" v-model="email" required>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" v-model="password" required>
          </div>
          <div>
            <label>Confirm Password:</label>
            <input type="password" v-model="confirmPassword" required>
          </div>
          <button type="submit">Create Account</button>
          <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
        </form>
        <p>
          Already have an account?
          <a href="#" @click.prevent="$emit('show-login')">Login here</a>.
        </p>
      </div>
    `,
    methods: {
        async createUser() {
            // Validate that the two password inputs match
            if (this.password !== this.confirmPassword) {
                this.errorMsg = "Passwords do not match.";
                return;
            }

            try {
                // Hash the password using the Web Crypto API
                const hashedPassword = await hashPassword(this.password);

                // Post the registration data with the hashed password
                const response = await axios.post('http://localhost:3000/api/auth/register', {
                    email: this.email,
                    password: hashedPassword
                });

                const token = response.data.token;
                this.$emit('registration-success', token);
            } catch (error) {
                this.errorMsg = "Registration failed. Please try again.";
            }
        }
    }
});

// Dashboard Component: displays a simple dashboard with appointments
app.component('dashboard-component', {
    data() {
        return {
            appointments: []
        };
    },
    template: `
      <div class="container">
        <div class="header">
          <h1>VetConnect Dashboard</h1>
        </div>
        <nav>
          <a href="#" @click.prevent="fetchAppointments">Appointments</a>
        </nav>
        <div>
          <h3>Appointments</h3>
          <ul>
            <li v-for="appt in appointments" :key="appt._id">
              {{ appt.message }}
            </li>
          </ul>
        </div>
        <div class="footer">
          <p>&copy; 2025 VetConnect</p>
        </div>
      </div>
    `,
    methods: {
        fetchAppointments() {
            axios.get('http://localhost:3000/api/appointments')
                .then(response => {
                    this.appointments = response.data;
                })
                .catch(error => {
                    console.error("Error fetching appointments:", error);
                });
        }
    }
});

// Finally, mount the application instance to the DOM element with id="app"
app.mount('#app');
