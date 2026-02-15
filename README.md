# DadLedger

A modern, AI-powered family expense tracker designed to help you manage shared finances, track personal spending, and keep a ledger of family loans (specifically "Dad Loans"). Built with React, Supabase, and Gemini AI.

## 🚀 Features

- **Transaction Tracking**: Log expenses, income, loans, and repayments.
- **Family Ledger**: Specialized tracking for "Dad Loans" to keep clear records of what is owed.
- **Smart Insights**: AI-powered categorization and financial insights using Google Gemini.
- **Interactive Dashboard**: View monthly spending, remaining budget, and debt summaries at a glance.
- **Modern UI**: Fully responsive design with Dark Mode support, built with Tailwind CSS and Framer Motion.
- **Real-time Data**: Powered by Supabase for reliable and fast data synchronization.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI Integration**: [Google Gemini](https://ai.google.dev/) via `@google/genai`

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm, yarn, or pnpm

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/dadledger.git
    cd dadledger
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` or `.env.local` file in the root directory and add the following variables:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

4.  **Database Setup**
    Run the SQL migrations found in the `sql/` directory in your Supabase SQL Editor to set up the tables:
    - `supabase_schema.sql`: Sets up the core `transactions` and `settings` tables.
    - `sql/02_add_budget_limit.sql`: Adds budget constraints (if applicable).
    - `supabase_migration_auth.sql`: Configures authentication settings.

5.  **Run the Applicaton**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🗄️ Database Schema

The project uses a simple yet effective schema:

- **transactions**: Stores all financial records.
    - Types: `expense`, `income`, `dad_loan`, `dad_repayment`
    - Fields: `amount`, `description`, `category`, `borrower`, `is_dad_related`
- **settings**: Stores global app configuration like `ledger_name` and `family_members`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
