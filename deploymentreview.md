# Deployment — Option B (Vercel + Bluehost Domain)

1. Push your code to GitHub (already done)
2. Go to vercel.com → sign in with GitHub
3. Click **"Add New Project"** → import the `quickquote` repo
4. Set the **Root Directory** to `frontend`
5. Add your environment variable: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
6. Click **Deploy** — done, live in ~2 minutes
7. You can then point your Bluehost domain to Vercel using a CNAME record in Bluehost's DNS settings
