# Blood Inventory System - Quick Viva Reference Sheet

## 🎯 1-Minute Project Summary
"A cloud-based blood inventory management system using **hybrid database architecture** (Azure SQL + Cosmos DB) with **real-time updates** via Socket.IO. Hospitals manage donors and blood inventory, while requesters can submit urgent blood requirements that automatically broadcast to multiple hospitals based on blood type availability."

---

## 🔑 Key Numbers to Remember

| Metric | Value |
|--------|-------|
| Total Tables (SQL) | 8 |
| Total Columns | 75+ |
| Foreign Keys | 7 |
| Normalization | 3NF |
| Blood Components | 5 types |
| Whole Blood Expiry | 35 days |
| Platelet Expiry | 5 days |
| Dashboard Load Time | <200ms (cached) |
| Auth Response Time | <10ms (Cosmos DB) |
| OTP Validity | 10 minutes |
| JWT Token Expiry | 24 hours |

---

## 💡 5 Innovative Features (Must Mention!)

1. **Hybrid Database Architecture** - SQL for relational data + Cosmos DB for auth = best of both worlds
2. **Real-Time Inventory Sync** - Socket.IO broadcasts blood availability instantly across hospitals
3. **Smart Expiry Tracking** - Proactive alerts prevent blood wastage (saves thousands of dollars)
4. **Multi-Hospital Request Broadcasting** - Emergency requests sent to multiple hospitals simultaneously
5. **Firebase Cache Layer** - 22x faster dashboard loading (4.5s → 0.2s)

---

## 🗂️ Database Tables (Azure SQL)

### Core Tables
1. **hospitals** (10 cols) - Hospital master data
2. **donors** (12 cols) - Donor information
3. **donations** (18 cols) - Blood units with expiry tracking
4. **blood_requests** (12 cols) - Emergency blood requirements
5. **requesters** (5 cols) - People requesting blood
6. **transfers** (7 cols) - Blood movement audit trail
7. **postal_codes** (5 cols) - Location normalization (3NF)
8. **request_hospitals** (7 cols) - Many-to-many junction table

### Key Relationships
```
hospitals → donors (1:N)
hospitals → donations (1:N)
donors → donations (1:N)
requesters → blood_requests (1:N)
blood_requests ←M:N→ hospitals (via request_hospitals)
```

---

## 🎲 Why Hybrid Architecture?

### Azure SQL (Relational)
**Use When:**
- ✅ Need complex JOINs
- ✅ ACID transactions required
- ✅ Foreign key constraints
- ✅ Reports and analytics

**In Our System:**
- Blood inventory tracking
- Donor-hospital relationships
- Transfer records
- Request fulfillment tracking

### Cosmos DB (NoSQL)
**Use When:**
- ✅ Fast read/write needed (<10ms)
- ✅ Schema flexibility
- ✅ Global distribution
- ✅ No complex relationships

**In Our System:**
- User authentication
- Session management
- OTP verification

### Result
- **Best Performance:** Right tool for each job
- **Cost Optimized:** Expensive Cosmos DB only for auth
- **Highly Scalable:** Both databases scale independently

---

## 🔐 Security Implementation

```
┌─────────────────────────────────────┐
│  Registration → OTP Email            │
│       ↓                              │
│  Email Verification (10 min OTP)    │
│       ↓                              │
│  Bcrypt Password Hash (10 rounds)   │
│       ↓                              │
│  JWT Token (24 hour expiry)         │
│       ↓                              │
│  Parameterized SQL Queries          │
│       ↓                              │
│  CORS Whitelist (Vercel domain)     │
└─────────────────────────────────────┘
```

**Key Points:**
- No passwords stored in plain text
- SQL injection prevented via parameterized queries
- Email verification ensures real hospitals only
- CORS prevents unauthorized origins

---

## 📝 Sample SQL Queries to Know

### 1. Get Available Blood
```sql
SELECT blood_type, COUNT(*) AS units
FROM donations
WHERE status = 'Available' 
  AND expiry_date > GETDATE()
GROUP BY blood_type;
```

### 2. Expiring Blood (Critical Query!)
```sql
SELECT blood_id, blood_type, expiry_date,
  DATEDIFF(day, GETDATE(), expiry_date) AS days_left
FROM donations
WHERE status = 'Available'
  AND expiry_date <= DATEADD(day, 7, GETDATE())
ORDER BY expiry_date;
```

### 3. Dashboard Stats (Complex JOIN)
```sql
SELECT 
  h.name,
  COUNT(DISTINCT d.donor_id) AS donors,
  COUNT(DISTINCT don.blood_id) AS donations,
  COUNT(DISTINCT br.request_id) AS requests
FROM hospitals h
LEFT JOIN donors d ON h.hospital_id = d.hospital_id
LEFT JOIN donations don ON h.hospital_id = don.hospital_id
LEFT JOIN blood_requests br ON br.status = 'Pending'
GROUP BY h.hospital_id, h.name;
```

---

## 🏗️ Normalization (3NF)

### Why 3NF?

**1NF:** Atomic values only (no arrays/lists in columns) ✅  
**2NF:** No partial dependencies (all columns depend on full PK) ✅  
**3NF:** No transitive dependencies ✅

### Example - postal_codes Table

**Before (Not 3NF):**
```
hospitals: hospital_id, name, city, state, country
                              ↑ Redundant if same city appears multiple times
```

**After 3NF:**
```
postal_codes: postal_code, city, state, country
hospitals: hospital_id, name, postal_code (FK)
```

**Benefits:**
- ✅ Data consistency (update city in one place)
- ✅ Less storage (no duplication)
- ✅ Easier maintenance

---

## ⚡ Real-Time Features

### Socket.IO Events

| Event | When | Purpose |
|-------|------|---------|
| `inventory-updated` | Blood added/used | Update dashboard live |
| `request-received` | New blood request | Alert hospitals |
| `request-fulfilled` | Hospital accepts | Notify requester |
| `expiry-alert` | Blood expiring soon | Prevent wastage |

### Code Example
```javascript
// Server broadcasts to all hospitals
io.emit('inventory-updated', {
  hospital_id: '0011',
  blood_type: 'A+',
  units: 25
});

// Client receives and updates UI
socket.on('inventory-updated', (data) => {
  setInventory(data);  // React state update
  toast.success('Inventory updated!');
});
```

---

## 🚀 Deployment Architecture

```
Users
  ↓
Vercel CDN (Frontend - React)
  ↓ HTTPS
Azure App Service (Backend - Node.js)
  ↓
┌─────────┬──────────┬──────────┐
│ Azure   │ Cosmos   │ Firebase │
│ SQL     │ DB       │ Cache    │
└─────────┴──────────┴──────────┘
```

**Frontend:** Vercel (Automatic deployment from GitHub)  
**Backend:** Azure App Service (Node.js 18 LTS)  
**Databases:** Azure SQL + Cosmos DB + Firebase

---

## 🎯 Expected Viva Questions - Quick Answers

### Q: "Why hybrid database?"
**A:** "Leverage strengths of both - SQL for complex joins and ACID, NoSQL for fast auth and scalability."

### Q: "What is your normalization level?"
**A:** "3NF - eliminated transitive dependencies by extracting postal_codes table."

### Q: "How do you prevent SQL injection?"
**A:** "Parameterized queries with input sanitization - never concatenate user input."

### Q: "What are the indexes?"
**A:** "idx_donations_blood_type, idx_donations_expiry, idx_blood_requests_status, plus Cosmos DB indexes on email and hospital_id."

### Q: "How does real-time work?"
**A:** "Socket.IO bidirectional communication - server pushes updates to all connected clients instantly."

### Q: "What's your largest table?"
**A:** "Donations table with 18 columns including safety tests (HIV, HBsAg, HCV, Syphilis)."

### Q: "How do you handle blood expiry?"
**A:** "Calculated at donation time based on component type, tracked via daily queries, alerted 7 days before expiry."

### Q: "Foreign key relationships?"
**A:** "7 FKs: donors→hospitals, donations→donors, donations→hospitals, blood_requests→requesters, request_hospitals→both, transfers→requests and hospitals."

### Q: "Why Cosmos DB for auth?"
**A:** "Sub-10ms latency, 99.999% availability, no complex joins needed, schema flexibility for adding auth fields."

### Q: "How would you scale to 1000 hospitals?"
**A:** "Cosmos DB auto-scales globally, Azure SQL read replicas, horizontal scaling of App Service, Firebase cache reduces DB load 70%."

---

## 🔬 Technical Specifications

### Database Constraints
```sql
-- Primary Key
hospital_id VARCHAR(10) PRIMARY KEY

-- Foreign Key
CONSTRAINT FK_donations_hospitals 
  FOREIGN KEY (hospital_id) 
  REFERENCES hospitals(hospital_id)
  ON DELETE CASCADE

-- Check Constraint
CHECK (volume_ml > 0 AND volume_ml <= 500)

-- Default Value
created_at DATETIME DEFAULT GETDATE()
```

### Transaction Example (ACID)
```javascript
const transaction = await pool.transaction();
await transaction.begin();
try {
  // Update blood status
  await transaction.request()
    .query("UPDATE donations SET status='Reserved'");
  // Create transfer record
  await transaction.request()
    .query("INSERT INTO transfers...");
  await transaction.commit();  // All or nothing!
} catch (err) {
  await transaction.rollback();
}
```

---

## 📊 Blood Component Expiry Rules

| Component | Expiry (Days) | Storage Temp |
|-----------|--------------|--------------|
| Whole Blood | 35 | 2-6°C |
| Packed RBC | 42 | 2-6°C |
| Plasma | 365 | -18°C or below |
| Platelets | 5 | 20-24°C (room temp) |
| Cryoprecipitate | 365 | -18°C or below |

**Why Critical:** Different components have vastly different lifespans - system must track individually!

---

## 🎓 Top 10 Power Phrases for Viva

1. "We implemented a **hybrid database architecture** to leverage the strengths of both relational and NoSQL databases."

2. "Our system uses **3NF normalization** to eliminate data redundancy while maintaining referential integrity."

3. "**Socket.IO** enables real-time bidirectional communication for critical emergency blood requests."

4. "We achieved a **22x performance improvement** by implementing a Firebase cache layer."

5. "The system uses **parameterized SQL queries** to prevent injection attacks."

6. "**OTP-based email verification** ensures only legitimate hospitals can register."

7. "Smart expiry tracking **prevents blood wastage** worth thousands of dollars annually."

8. "Our **multi-hospital request broadcasting** algorithm matches blood type and location."

9. "The architecture is **horizontally scalable** to support 1000+ hospitals."

10. "We use **ACID transactions** to ensure data consistency during blood transfers."

---

## ✅ Pre-Viva Checklist

- [ ] Know all 8 table names by heart
- [ ] Can draw ER diagram from memory
- [ ] Explain normalization with postal_codes example
- [ ] Demonstrate one SQL query (expiring blood)
- [ ] Explain Socket.IO flow with diagram
- [ ] Know exact column count per table (donations: 18!)
- [ ] Remember blood expiry: Whole=35, Platelets=5
- [ ] Know JWT expiry (24h) and OTP expiry (10min)
- [ ] Can explain hybrid architecture in 30 seconds
- [ ] Ready to discuss future improvements

---

## 📱 Demo Flow (If Asked to Show)

1. **Register Hospital** → Show OTP email → Verify → Login
2. **Add Donor** → Show donor list with search
3. **Record Donation** → Show blood inventory update in real-time
4. **Dashboard** → Point out expiring blood alert
5. **Create Request** (different tab) → Show notification on hospital dashboard
6. **Accept Request** → Show transfer record created

---

**Last Tip:** If you don't know an answer, say:
> "That's an excellent question. Based on the requirements we had, we chose [X] approach, but I'd be interested to explore [Y] in future iterations."

This shows humility and eagerness to learn!

---

## 🎉 YOU GOT THIS! 

Remember: **You built a production-ready system with advanced DBMS concepts. Be confident!**

**Final Words:**
- Speak slowly and clearly
- Draw diagrams liberally
- Connect answers back to project decisions
- Show enthusiasm about your work

**Good Luck! 🍀**
