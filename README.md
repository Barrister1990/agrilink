
# 🌾 Agrlink – Agriculture eCommerce Platform

Agrlink is a powerful agriculture-focused eCommerce web application that connects farmers directly to a ready market. Built to empower local producers and improve the agriculture supply chain, Agrlink offers robust functionality similar to Amazon and eBay, including secure payments, order tracking, and multi-role access.

## 🛠️ Demo Link
- **Live Link:** [Agrilink](https://agrilink-taupe.vercel.app/)

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Database & Auth:** [Supabase](https://supabase.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Payments:** [Paystack](https://paystack.com)
- **Deployment:** [Vercel](https://vercel.com)

---

## 🚀 Features

### 🧑‍🌾 Public User Side
- Browse and search for agricultural products
- Add items to cart and checkout via Paystack
- Order history and order tracking
- User authentication and profile management

### 🧑‍🌾 Farmer/Admin Side
- Login to manage your farm store
- Add, update, or remove products
- Monitor orders and deliveries
- Analytics for sales and product performance

### 🛡️ Super Admin Side (Agrlink)
- Manage all platform users and roles
- Moderate farmer registrations and product listings
- View full platform analytics and reports
- Handle disputes and support

---

## 📦 Getting Started

To run the project locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Optional

```bash
# with yarn
yarn dev

# with pnpm
pnpm dev

# with bun
bun dev
```

---

## 📂 Project Structure

```bash
/pages           # Next.js pages (routes)
/components      # Reusable UI components
/store           # Global state management (e.g. Zustand)
/lib             # Supabase client & utilities
/styles          # Tailwind CSS configs
/public          # Static assets (images, icons)
/api             # API routes (e.g. for orders, auth)
```

---

## 🔐 Environment Variables

Create a `.env.local` file with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

---

## 📦 Deployment

This project is ready for deployment on **Vercel**:

- Push to GitHub
- Connect the repo to Vercel
- Set environment variables in Vercel dashboard
- Deploy and you're live!

Read more: [Next.js Deployment Docs](https://nextjs.org/docs/pages/building-your-application/deploying)

---

## 📈 Roadmap

- ✅ Role-based access (User, Farmer, Super Admin)
- ✅ Secure checkout with Paystack
- ✅ Order tracking & status updates
- 🚧 Mobile app (planned)
- 🚧 Chat support between users and sellers
- 🚧 Delivery agent dashboard

---

## 🙌 Contributing

Contributions are welcome! Fork the repository, create a feature branch, and submit a PR.

```bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT License

---

## 👨🏽‍💻 Author

**Agrlink by Charles Awuku**  
Made with ❤️ to support African farmers and promote sustainable agriculture.
