# FitOps AI – Smart Gym Progress Tracking and Workout Recommendation Platform

FitOps AI is a state-of-the-art, premium full-stack fitness tracking and AI-powered recommendation platform integrated with professional DevOps automation pipelines, Docker multi-service orchestration, and Prometheus-Grafana telemetry monitoring.

---

## Key Core Features

- **Futuristic Dark-Neon UI/UX**: Sleek, beautiful cyberpunk design featuring custom glassmorphism components, responsive navigation menus, active gym stats indicators, and animated metric highlights.
- **Biometric Dashboard**: Integrated Line charts tracking body weights chronologically, Doughnut charts visualizing training muscle group splits, and a dynamic biometric dial displaying Body Mass Index (BMI).
- **Gym workout logs (CRUD)**: Log exercises, sets, reps, duration, and weights with muscle split categorizations and sorting filters.
- **Automated Streak Engine**: Calculates consecutive active days, maintaining user streaks automatically inside the database.
- **Biometric Target Goals**: Create measurable deadlines and goals with progress percentages and instant inline updates.
- **AI Personal Coach**: An intelligent engine that scans training volume over the last 14 days, highlights muscular imbalances, checks weight stalls, and prescribes exact training volumes, complete with a simulated coach chat console.
- **Ingress Proxy Gateway**: Root Nginx reverse-proxy resolving CORS limitations and routing API, web app, and scraper ingress traffic cleanly.
- **Continuous Integration Pipeline**: Jenkins declarative pipeline automating Git checkout, dependency installations, ESLint quality gates, assertive server testing, Docker compilation, and remote deployment.
- **Resource Monitoring & Alerts**: Pre-provisioned Grafana dashboards pulling Express runtime counters (RAM, request volumes, ingress speeds, uptime states) from a Prometheus scraping target.

---

## Tech Stack Overview

- **Frontend**: React.js with Vite, custom Vanilla CSS, Lucide React, Chart.js / React-Chartjs-2.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, prom-client.
- **Database**: MongoDB (Mongoose ODM) with named persistence storage volumes.
- **Orchestration**: Docker, Docker Compose, Nginx Reverse Proxy.
- **Pipeline**: Declarative Jenkinsfile.
- **Monitoring**: Prometheus Collector, Grafana Panels.

---

## Deployment & Startup Procedures

Ensure you are located inside the root project directory `c:\PROJECTS\Devops_Project\`.

### Option A: Standard Docker Compose Deployment (Recommended)

To compile and boot the entire 6-container platform (Nginx, React, Express, MongoDB, Prometheus, Grafana) automatically:

1. **Launch Containers**:
   ```bash
   docker compose up -d --build
   ```
2. **Seed High-Fidelity Demo Metrics**:
   ```bash
   docker compose exec backend npm run seed
   ```
3. **Access Services**:
   - **FitOps AI Web App**: [http://localhost/](http://localhost/)
     - Log in with email: `coach_demo@fitops.ai` and password: `fitops123` to immediately view a fully loaded dashboard!
   - **Prometheus Collector**: [http://localhost:9090](http://localhost:9090)
   - **Grafana Dashboards**: [http://localhost:3000](http://localhost:3000) (Anonymous admin access enabled, navigate straight to Dashboards -> **FitOps AI Service Telemetry Board**)

---

### Option B: Local Node.js Development Startup

1. **Start MongoDB**: Ensure MongoDB is running locally on port `27017` or run via Docker:
   ```bash
   docker run -d -p 27017:27017 --name local-mongo mongo
   ```
2. **Setup & Seed Backend**:
   ```bash
   cd backend
   npm install
   npm run seed
   npm run dev
   ```
3. **Setup & Start Frontend**:
   ```bash
   cd ../frontend
   npm install --legacy-peer-deps
   npm run dev
   ```
   Open your browser at `http://localhost:5173`. Select "Sign In" and log in using `coach_demo@fitops.ai` / `fitops123`.

---

## Verification & Checks

### 1. Ingress Scrape Target
- Navigate to [http://localhost/metrics](http://localhost/metrics). Verify that the prom-client registers raw Node metrics, and check `http_request_duration_seconds_count`.

### 2. Custom AI Coach Recommendations
- Log in as the demo user (`coach_demo@fitops.ai`). Select the **AI Coach** tab. Under "Target Training Splits", verify that the system caught the **zero leg training volume** in the demo data and prescribed a **Targeted Lower-Body & Strength Focus** routine.
- Add a leg workout under the **Workout Tracker** tab (e.g. Squats, muscle: legs, 3 sets, 10 reps). Return to **AI Coach** and click "Generate Customized Routine" to verify that the coach dynamically updates to a balanced plan.
