# Infinity Arthvishva HRMS 💼

Welcome to the official repository for the **Infinity Arthvishva HRMS** mobile application. Built using **Expo** and **React Native**, this enterprise-grade solution streamlines workforce management, attendance tracking, and HR administrative operations.

---

## 🏢 About the Company

**[Infinity Arthvishva](https://www.infinityarthvishva.com/)** is a leading premium financial advisory group headquartered in Shivajinagar, Pune. Operating as a comprehensive, one-stop financial ecosystem, the firm delivers tailored end-to-end solutions across diverse sectors including retail and commercial loans, wealth management, insurance brokerage, and strategic investments.

### Key Highlights:

- **Corporate Scale:** Comprised of dedicated corporate entities including _Infinity Arthvishva Advisory_, _Insurance Broker_, _Mutual Fund Distributor_, and _Wealth Private Limited_.
- **Pan-India Footprint:** Strong nationwide presence across **143+ cities** supported by **30+ branches** and a thriving network of over **3,200+ Active DSA Partners**.
- **Industry Recognition:** Proud winner of the prestigious **ET Business Awards 2025 – Pune** for excellence in financial intelligence and strategic wealth advisory.
- **Mission:** To seamlessly integrate advanced financial strategies into daily operations, empowering individuals and growing businesses across India to achieve sustainable stability and security.

The **IAHRMS** mobile app serves as the core operational bridge, standardizing attendance, payroll processing, compliance trackers, and employee self-service pipelines across this rapidly expanding organizational ecosystem.

---

## 🚀 Key Features & Architecture

Engineered for cross-platform performance, the application leverages the following capabilities from our core technical stack:

- **File-Based Routing:** Powered by `expo-router` for clean, modular screen transitions and robust internal deep-linking paths.
- **Push Notifications:** Built via `@react-native-firebase/app` and `messaging` paired with native `expo-notifications` for real-time corporate announcements, system broadcasts, and transactional alerts.
- **Geofenced Verification:** Implements `react-native-geolocation-service` to secure automated check-ins and field workforce attendance tracking.
- **Hardware Integrations:** Employs `expo-camera` to handle secure profiling, image captures, or touchless dynamic QR code check-ins.
- **Secure Storage Modules:** Protects sensitive operational data, session states, and authentication tokens via `expo-secure-store`.
- **State Architecture:** Fast, highly scalable, and lightweight global state management configured through `zustand`.

---

## 🛠️ Getting Started

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Install Dependencies

Install all required packages from the `package.json` file using `npm`:

```bash
npm install
```
