# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Enquiries and appointments

The enquiry form opens when the site loads, and visitors can also use the
**Book appointment** button in the header. Successful submissions are emailed
to the booking contact through the Vercel serverless endpoint and Resend. The
form API key is stored only in Vercel environment variables, never in the
browser bundle.

### Enable email delivery

1. Create a Resend account and an API key. For initial testing, Resend's
   `onboarding@resend.dev` sender can only send to the email address registered
   with that Resend account. Verify a domain in Resend before using a
   different sender or recipient.
2. Import this repository into Vercel. Keep the project root as the repository
   root and use the Vite framework preset.
3. In the Vercel project settings, add these environment variables for
   Production:
   - `RESEND_API_KEY`: the API key from Resend
   - `EMAIL_TO`: the destination inbox for form submissions
   - `EMAIL_FROM` (optional): a verified sender, for example
     `Skyva Studio <bookings@your-verified-domain.example>`
4. Deploy the Vercel project and copy its base URL, for example
   `https://your-project.vercel.app`. On Vercel, the forms use the same-origin
   `/api/submit` endpoint automatically.
5. To send submissions from GitHub Pages to Vercel, open the GitHub repository
   **Settings → Secrets and variables → Actions → Variables** and add
   `VITE_SUBMISSION_API_URL` with the full endpoint URL,
   `https://your-project.vercel.app/api/submit`. This is a URL, not a secret.
6. Push a commit to `main` (or rerun the Pages workflow) to rebuild GitHub
   Pages with the endpoint configured.

The API accepts requests from the published GitHub Pages origin and local Vite
development. Submitted names, phone numbers, and appointment details are sent
to Vercel and Resend so the email can be delivered. Do not use real customer
details for testing unless you are comfortable with those providers processing
them. Do not put the Resend API key in GitHub Pages variables or client code.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
