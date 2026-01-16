# Carta Proposta Gogroup

Application for generating and managing job offer proposals (Carta Proposta) for Gogroup.

## Features
- **3-Step Form**: Basic Data, Modality (CLT, PJ, Internship), and Final Review.
- **Validation**: Rules for mandatory fields, URLs, and consistent data.
- **Business Logic**: Automatic calculation of benefits (VR) and payload cleanup based on selected modality.
- **Integration**: Submits data to an n8n webhook for PDF generation and automation.

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd carta-proposta-gogroup
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory (based on `.env.local` if available) and add your webhook URL:
    ```
    VITE_WEBHOOK_URL=https://n8n-study.gogroupgl.com/webhook/carta-propostaV3-gente-&-gestao
    ```

4.  **Run locally**:
    ```bash
    npm run dev
    ```

## Functionality Code (`process.js`)
The `process.js` file in the root directory contains the logic used in the **n8n Function Node**. It processes the JSON payload received from the React app, formats dates/currencies, and prepares the data for the document generation template.

> **Tip**: Check `n8n_examples.md` (if available in documentation artifacts) for sample JSON inputs/outputs to test your n8n flow.

## Deployment (Vercel)

This project is optimized for deployment on Vercel. Since the project is in a subdirectory and on a specific branch, follow these steps:

1.  **Import Project**:
    -   Go to Vercel Dashboard > Add New > Project.
    -   Import the `rpa-gocase` repository.

2.  **Configure Project**:
    -   **Framework Preset**: Vite.
    -   **Root Directory**: Click `Edit` and select `Carta Proposta`. **(Important!)**
    -   **Environment Variables**: Add `VITE_WEBHOOK_URL` with your n8n URL.

3.  **Deploy Branch**:
    -   Vercel will automatically deploy the `feat/carta-proposta` branch as a "Preview" deployment.
    -   To make it your production deployment, you can either merge to `main` or specifically configure the "Production Branch" in Vercel settings to be `feat/carta-proposta`.
