# Quick Start Guide - Paystack Integration

## 🚀 3-Step Setup

### Step 1: Update Your Paystack URL
Open [`main.html`](file:///home/cncjosh/Downloads/elitexneat.hustlesasa.shop/elitexneat.hustlesasa.shop/main.html) and find line 18:

```javascript
const PAYSTACK_URL = 'https://your-paystack-checkout-url.com';
```

Change it to your actual Paystack checkout URL.

---

### Step 2: Test Locally
1. Open `main.html` in your browser
2. Press `F12` to open Developer Console
3. Look for these messages:
   ```
   [Paystack Hijacker] 🚀 Initializing...
   [Paystack Hijacker] ✅ Paystack Checkout Hijacker is active!
   ```

---

### Step 3: Test Checkout Button
1. Browse the site and add items to cart
2. Click "Checkout" button
3. Console should show:
   ```
   [Paystack Hijacker] 🚫 Intercepted checkout click!
   [Paystack Hijacker] ✅ Redirecting to Paystack...
   ```
4. You should be redirected to your Paystack URL (NOT the old checkout)

---

## 📁 Files Created

1. **[paystack-hijacker.js](file:///home/cncjosh/Downloads/elitexneat.hustlesasa.shop/paystack-hijacker.js)** - Standalone script file (can be included via `<script src="">`)

2. **[main.html](file:///home/cncjosh/Downloads/elitexneat.hustlesasa.shop/elitexneat.hustlesasa.shop/main.html)** - Ready-to-use HTML with embedded hijacker script

3. **[Implementation Plan](file:///home/cncjosh/.gemini/antigravity/brain/55ea4162-9a3b-486b-9b34-ad9be610013c/implementation_plan.md)** - Detailed guide with troubleshooting

---

## ✅ What to Verify

- [ ] Paystack URL is configured (not the default placeholder)
- [ ] Console shows "Hijacker is active"
- [ ] Clicking checkout redirects to Paystack
- [ ] No JavaScript errors in console

---

## 🔧 Quick Commands (Browser Console)

```javascript
// Update Paystack URL on-the-fly
PaystackHijacker.setURL('https://new-url.com');

// Manually scan for buttons
PaystackHijacker.scan();

// Disable debug logging
PaystackHijacker.disableDebug();
```

---

## ❓ Troubleshooting

**Button not hijacked?**
1. Check console for "Found and hijacked X button(s)"
2. Inspect the button → Note its text
3. Add text to `buttonTextPatterns` array in script

**Still redirects to old checkout?**
- Clear browser cache
- Hard refresh (Ctrl + Shift + R)
- Check for JavaScript errors

**Need more help?**
See the full [Implementation Plan](file:///home/cncjosh/.gemini/antigravity/brain/55ea4162-9a3b-486b-9b34-ad9be610013c/implementation_plan.md)
