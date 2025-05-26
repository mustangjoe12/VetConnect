// app.js - Main Vue application

const { createApp } = Vue;

createApp({
  data() {
    return {
      loggedIn: false,
      token: ''
    };
  },
  methods: {
    doLogin(token) {
      this.loggedIn = true;
      this.token = token;
    }
  }
})
  // Login Component
  .component('login-component', {
    data() {
      return {
        email: '',
        password: '',
        error: ''
      };
    },
    template: `
      <div class="container">
        <h2>VetConnect Login</h2>
        <form @submit.prevent="login">
          <div>
            <label>Email:</label>
            <input type="email" v-model="email" required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" v-model="password" required />
          </div>
          <button type="submit">Login</button>
          <p v-if="error" style="color: red;">{{ error }}</p>
        </form>
      </div>
    `,
    methods: {
      login() {
        // Replace the URL with your backend endpoint as needed.
        axios
          .post('http://localhost:3000/api/auth/login', {
            email: this.email,
            password: this.password
          })
          .then((response) => {
            const token = response.data.token;
            // Emit the token upward on successful login
            this.$emit('login-success', token);
          })
          .catch((error) => {
            this.error = 'Invalid login credentials.';
          });
      }
    }
  })
  // Dashboard Component
  .component('dashboard-component', {
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
          <a href="#" @click.prevent="getAppointments">Appointments</a>
          <!-- Additional navigation links can be added here -->
        </nav>
        <div>
          <h3>Appointments</h3>
          <ul>
            <li v-for="appointment in appointments" :key="appointment.id">
              {{ appointment.message }}
            </li>
          </ul>
        </div>
        <div class="footer">
          <p>&copy; 2025 VetConnect</p>
        </div>
      </div>
    `,
    methods: {
      getAppointments() {
        // Call the API to fetch appointments. Adjust the endpoint as needed.
        axios
          .get('http://localhost:3000/api/appointments', {
            headers: {
              Authorization: 'Bearer ' + this.$root.token
            }
          })
          .then((response) => {
            // Expect the API to return an array of appointments.
            this.appointments = response.data;
          })
          .catch((error) => {
            console.error('Error fetching appointments:', error);
          });
      }
    }
  })
  .mount('#app');