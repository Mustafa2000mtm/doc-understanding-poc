# 🚀 Render Deployment Guide

## 📋 **Prerequisites**
- GitHub account with your repository
- Render account (free)

## 🌐 **Step 1: Create Render Account**
1. **Go to:** https://render.com
2. **Click "Get Started"**
3. **Sign up** with GitHub (recommended)
4. **Verify your email**

## 🔗 **Step 2: Connect GitHub Repository**
1. **In Render dashboard, click "New +"**
2. **Select "Web Service"**
3. **Connect your GitHub account**
4. **Choose repository:** `Mustafa2000mtm/doc-understanding-poc`

## ⚙️ **Step 3: Configure Service**
1. **Name:** `document-processing-system` (or any name you prefer)
2. **Environment:** `Python 3`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`

## 🔧 **Step 4: Set Environment Variables**
1. **Click "Environment" tab**
2. **Add these variables:**
   - **Key:** `API_ENDPOINT`
   - **Value:** `http://document-understanding.rased.io/v1/document-verification`
   - **Click "Save"**
3. **Add API key if you have one:**
   - **Key:** `API_KEY`
   - **Value:** `your_api_key_here`

## 🚀 **Step 5: Deploy**
1. **Click "Create Web Service"**
2. **Wait for build** (usually 2-5 minutes)
3. **Your app will be live!**

## 🌟 **Benefits of Render:**
- ✅ **Free tier:** 750 hours/month (enough for 24/7)
- ✅ **Auto-deploy:** Updates on every Git push
- ✅ **Custom domains:** Free SSL certificates
- ✅ **Very reliable:** Great uptime
- ✅ **Easy setup:** No complex configuration

## 🔄 **Auto-Deploy Setup:**
- **Every time you push to GitHub**, Render will automatically redeploy
- **No manual intervention needed**
- **Instant updates**

## 📱 **Your App URL:**
After deployment, you'll get a URL like:
`https://document-processing-system.onrender.com`

## 🆘 **Troubleshooting:**
- **Build fails:** Check the build logs
- **App doesn't start:** Check the deploy logs
- **Environment variables:** Make sure they're set correctly

## 🎯 **Success Indicators:**
✅ **Build completes successfully**  
✅ **Service shows "Live" status**  
✅ **Health check passes**  
✅ **Your app URL is accessible**  

---

**Render is much more reliable than Railway for Python apps. Your deployment should work perfectly!**
