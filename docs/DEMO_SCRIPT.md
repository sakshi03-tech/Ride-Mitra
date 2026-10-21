# Ride Mitra — Final Year Project Demo Script
*(लावेल ↔ जीआयटी कॉलेज रिक्षा मित्र सादरीकरण पटकथा)*

Use this 5-minute script to demonstrate the project live to external examiners, faculty, or auto rickshaw union representatives.

---

### Step 1: Open Application & Show Role Switcher (30s)
1. Open `http://localhost:5173/` or deployed URL.
2. Note the branding: **Ride Mitra (रिक्षा मित्र)**, designed with rickshaw-yellow palette, high-contrast, and Marathi-first typography (Mukta font).
3. Demonstrate language toggle (English ↔ मराठी) in the top-right corner.
4. Click **Login** to see the unified portal with the **1-Click Demo Switcher**.

---

### Step 2: Student Books a Ride (1 min)
1. Click **🎓 विद्यार्थी (Rahul)** on the demo switcher.
2. The Student Booking page opens.
3. Select:
   - **पिकअप:** लावेल हायवे थांबा (Lavel Highway Stop)
   - **ड्रॉप:** जीआयटी मुख्य प्रवेशद्वार (GIT College Main Gate)
   - **पर्याय:** फुल रिक्षा (₹60) किंवा शेअरिंग (₹20/सीट).
4. Point out the Leaflet OpenStreetMap showing the route and fixed fare badge.
5. Click **"रिक्षा बुक करा (₹60) →"**.
6. The screen enters **"Searching for driver"** with live pulsing animation.

---

### Step 3: Driver Receives Sound Alert & Accepts (1.5 min)
1. Open a second browser tab (or window) and click **🛺 चालक १ (Santosh)**.
2. Santosh is online and #1 in line in the **Fair Turn Queue**.
3. **Audible alert sounds!** Full-screen incoming request pops up with:
   - 30-second countdown timer
   - Pickup: Lavel Stop
   - Drop: GIT Main Gate
   - Upfront Fare: ₹60 (0% commission)
4. Click **"स्वीकारा (Accept) ✓"**.
5. Switch back to the Student tab: status instantly updates to **"चालक मिळाला!"** with Santosh's name, auto number (`MH 08 AG 4521`), phone call button, and live map!

---

### Step 4: Trip Progression & Safety SOS (1 min)
1. On Driver tab:
   - Click **"मी पोहोचलो (I Have Arrived)"**.
   - Click **"प्रवास सुरू करा (Start Trip)"**.
2. On Student tab:
   - Show status is now **"प्रवास सुरू आहे 🛺"**.
   - Demonstrate the **SOS button**: Click SOS → shows emergency numbers (Police 112, GIT Security 02356-262795) and triggers real-time admin alert.
3. On Driver tab:
   - Click **"✓ प्रवास पूर्ण झाला (Complete Trip)"**.
   - Notice earnings dashboard updates instantly to ₹60 today.

---

### Step 5: Student Ratings & Admin Overview (1 min)
1. On Student tab: 5-Star rating modal appears with tag pills:
   - Tap 5 Stars, select **"नम्र वागणूक"** & **"सुरक्षित ड्रायव्हिंग"**, and submit.
2. Switch to **🛡️ प्रशासक (Admin)** tab:
   - Shows live analytics: Online Drivers, Active Rides, Peak Hours Heatmap, and Completion Rate.
   - Shows the SOS alert and allows 1-click resolution.
   - Shows Driver Verification Queue with 1-click Approve/Reject.
   - Shows Stops & Fare Matrix and CSV Export.

---

**Conclusion Statement for Examiners:**
> *"Ride Mitra successfully eliminates bargaining, waiting times, and fuel waste on the Lavel-GIT corridor using a fair turn rotation queue, transparent fixed pricing, zero commission for drivers, and emergency passenger safety."*
