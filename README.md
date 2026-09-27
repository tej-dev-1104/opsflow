# OpsFlow

### Small Business Workflow & Task Management Platform

OpsFlow is a lightweight workflow management platform designed for small businesses that manage daily work across WhatsApp, spreadsheets, phone calls, notebooks, and verbal communication.

It provides one organized place to **create, assign, prioritize, schedule, and track tasks**, while giving business owners visibility into pending, completed, due-today, and overdue work.

---

## Project Overview

### Problem

Small businesses often lack a centralized way to manage daily work.

Tasks can be lost across:

* WhatsApp messages
* Spreadsheets
* Phone calls
* Notes and notebooks
* Verbal instructions

This makes it difficult to answer simple operational questions:

* What needs to be done?
* Who is responsible?
* When is it due?
* What is overdue?
* What has been completed?

### Solution

OpsFlow turns scattered work into a structured workflow:

```text
Create Task
    ↓
Assign Employee
    ↓
Set Priority
    ↓
Set Deadline
    ↓
Track Status
    ↓
Monitor Work
    ↓
Identify Overdue Tasks
```

The dashboard provides an at-a-glance view of the team's current workload and work requiring attention.

### Core Features

* Task creation, editing, and deletion
* Employee assignment
* Priority management: Low / Medium / High
* Deadlines and due-date tracking
* Status management: To Do / In Progress / Completed
* Automatic overdue-task identification
* Dashboard with task statistics
* Due-today and overdue work views
* Employee workload visibility
* My Work view for individual employees
* Task search and filtering
* Persistent data storage with Supabase
* Responsive interface

---

## Technologies Used

### Frontend

* **React** — UI development
* **TypeScript** — Type-safe application code
* **Vite** — Frontend tooling and build system
* **Tailwind CSS** — Styling
* **React Router** — Client-side routing
* **Lucide React** — Interface icons
* **date-fns** — Date and deadline handling

### Backend / Database

* **Supabase** — Backend services
* **PostgreSQL** — Persistent relational database
* **Supabase JavaScript Client** — Database access from the application

### Deployment

* **Vercel**

---

## Application Structure

The application is organized around four main views:

```text
Dashboard
│
├── Task statistics
├── Needs Attention
├── Due Today
└── Team Workload

Tasks
│
├── Create / Edit / Delete
├── Search
└── Status / Priority / Overdue filters

My Work
│
├── Overdue
├── Today
├── Upcoming
└── Completed

Team
│
├── Employees
├── Workload
└── Add Employee
```

---

## Data Model

The MVP uses two primary database tables:

### `employees`

```text
id
name
role
created_at
```

### `tasks`

```text
id
title
description
assigned_to
priority
status
due_date
created_at
updated_at
```

Tasks reference employees through `assigned_to`.

---

## Getting Started

### Prerequisites

Make sure you have:

* Node.js 18+
* npm
* A Supabase project

---

## 1. Clone the repository

```bash
git clone https://github.com/tej-dev-1104/opsflow.git
cd opsflow
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Do not commit `.env` to GitHub.

A `.env.example` file is provided as a template.

---

## 4. Set up the database

Run the SQL in:

```text
supabase/schema.sql
```

in the Supabase SQL Editor.

This creates the required tables and database configuration.

---

## 5. Seed demo data

Run:

```text
supabase/seed.sql
```

in the Supabase SQL Editor.

The seed creates:

* 4 employees
* 20 tasks
* overdue tasks
* tasks due today
* upcoming tasks
* completed tasks
* all three priority levels

### Demo date note

The seed data uses dates relative to the database date so that overdue and due-today tasks remain meaningful during the demonstration.

For a fresh demo state, re-run `supabase/seed.sql` before judging.

---

## 6. Run locally

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 7. Build for production

```bash
npm run build
```

The production build should complete successfully before deployment.

---

## Deployment

OpsFlow is deployed as a static production build on **Vercel**.

The production deployment uses:

```text
React + Vite
      ↓
Production Build
      ↓
Vercel
      ↓
Public Application URL
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel project settings (Project → Settings → Environment Variables), matching `.env.example`.

---

## Demo Data

The repository includes seeded demo data for a fictional small business:

**Sunrise Traders**

Employees:

```text
Ravi Kumar       — Sales
Ananya Sharma    — Operations
Arjun Reddy      — Inventory
Priya Singh      — Finance
```

The demo dataset intentionally covers different task states so the dashboard can immediately demonstrate the workflow.

---

## Project Goal

OpsFlow focuses on one simple goal:

> **Give small businesses one place to know what needs to get done, who owns it, when it is due, and what requires attention.**

---

## Hackathon Submission

**Live Application:**
[https://opsflow-murex.vercel.app](https://opsflow-murex.vercel.app)

**GitHub Repository:**
`https://github.com/tej-dev-1104/opsflow`
