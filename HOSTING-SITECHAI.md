# SiteChai deployment: classicaldecorid.com

Deployment is pending hosting capability confirmation. **Setup Node.js App / Application Manager is currently not visible in the account.** Uploading this project into `public_html` alone will not run its Next.js frontend and Express API.

## 1. Confirm Node hosting with SiteChai

Send this message through your SiteChai support account:

> Please confirm whether my hosting package for classicaldecorid.com supports a production Next.js + Express application. I cannot find Setup Node.js App or Application Manager in cPanel. Please enable CloudLinux Node.js Selector or the supported Passenger application feature, with Node.js 22 or 24, environment variables, application restart controls, and Terminal/SSH access for npm ci and npm run build. The application root will be ~/dst-deco, the URL will be https://classicaldecorid.com/, and the startup file will be app.cjs. Please confirm build memory limits and outbound access to MongoDB Atlas, Cloudinary, and Google Apps Script. If this package cannot support it, please identify the required hosting option before any upgrade.

cPanel's Application Manager requires the hosting provider to enable the feature and install its runtime dependencies. CloudLinux offers a separate Node.js Selector interface. Availability on this particular SiteChai account is unconfirmed. See [cPanel requirements](https://docs.cpanel.net/cpanel/software/application-manager/) and [CloudLinux Node.js Selector](https://docs.cloudlinux.com/cloudlinuxos/cloudlinux_os_components/#node-js-selector).

## 2. Upload and register the application

1. Create `dst-deco` inside the hosting account's home directory, **outside `public_html`**.
2. Upload and extract the source package there. Keep `app/`, `src/`, `server/`, `data/`, `client/public/`, `scripts/`, package files, configuration files, and `app.cjs` together at the application root.
3. The source package excludes secret environment files, `.git`, `node_modules`, `.next`, other build outputs, scratch files, and downloaded-image archives. `.env.example` contains variable names and examples only. Install dependencies and build on the Linux host; do not upload Windows dependencies.
4. Register the application with the following settings. If the interface has no startup-file field, ask SiteChai to configure `app.cjs` for Passenger.

| Setting | Value |
| --- | --- |
| Node.js | 22 or 24, as confirmed by SiteChai |
| Application mode | Production |
| Application root | `dst-deco` relative to the hosting home directory |
| Domain / application URL | `classicaldecorid.com` / `/` |
| Application startup file | `app.cjs` |

The startup adapter runs Next.js and Express in one process. It routes `/api/*` and `/sitemap.xml` to Express, preserving the existing admin authentication and upload handling. `DST_EMBEDDED_API` is set internally to prevent Express from starting a second listener. Existing Vercel deployment configuration remains separate. This follows the [Next.js custom-server model](https://nextjs.org/docs/app/guides/custom-server).

## 3. Configure production values

Set these in the hosting application's environment settings before building. Make them available in the build terminal too; panel variables do not necessarily propagate to Terminal/SSH.

```text
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://classicaldecorid.com
CLIENT_URL=https://classicaldecorid.com
NEXT_PUBLIC_API_BASE_URL=/api
```

`/api` is already the same-origin default. Use the real values for these private settings from your own service accounts, using `.env.example` as the reference:

- Database and admin: `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- Image uploads: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Inquiry submissions: `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_SECRET_TOKEN`.

Other `NEXT_PUBLIC_*` branding/contact variables are optional and become public browser configuration. Keep private keys out of them. If using a private `.env` file instead, create it inside `dst-deco`, outside `public_html`; the source archive does not include secret values. Let the host provide the listening port; do not copy a local development `PORT` value blindly.

## 4. Install, build, and restart

Activate the Node environment using the exact command shown by the hosting panel, then run from `~/dst-deco`:

```bash
npm ci
npm run build
```

The build automatically copies `client/public/` assets into `public/`. If dependency installation or the build fails, resolve its error before starting the application. Do not run database seeding without reviewing its data-replacement behavior.

For Passenger, use the panel's **Restart** control after the build. For a host configured to run an npm start command, the production command is:

```bash
npm run start:hosting
```

Use only the host's selected process-management method. Rebuild when source or `NEXT_PUBLIC_*` values change, then restart. Confirm the domain resolves to this hosting account and its HTTPS certificate is active before declaring the deployment live.

## 5. Verify the deployed application

- Open `https://classicaldecorid.com/`, `/gallery`, a category, a product, and `/admin`; confirm images and navigation work.
- Check `/api/health`, `/api/products`, `/api/categories`, and `/sitemap.xml` return their expected content.
- Confirm unauthenticated product/category/hero edits are rejected. Test admin login with the configured account; an existing MongoDB deployment needs its own admin user.
- The public catalog can use bundled JSON without MongoDB. Persistent admin edits require a working MongoDB connection; image uploads also require Cloudinary configuration. Check the admin storage status before saving.
- Verify the lead form only after Google Apps Script and its shared secret are configured; a successful test creates a real inquiry.
- Admin sessions require a new sign-in after this update. Verify logout prevents reuse of the old token; production sessions are stored in MongoDB and expire within one hour. Environment-password bootstrap mode is only for one process with no database configured.
- Ask the host for its trusted reverse-proxy hop count before setting `TRUST_PROXY_HOPS`, so IP rate limiting identifies visitors correctly.
- Inspect the hosting application's logs for runtime or integration failures. Local build success does not verify the hosting account, DNS, database, or external integrations.
