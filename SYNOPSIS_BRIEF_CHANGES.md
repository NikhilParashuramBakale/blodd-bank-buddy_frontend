# Synopsis Update - Key Changes Only (2-Page Format)

## 1. DATABASE STRUCTURE UPDATES

### New Tables (Add These)
1. **REQUEST_HOSPITALS** (Junction Table)
   - Links blood requests to multiple hospitals
   - Columns: request_id, hospital_id, status, notified_at, responded_at

2. **POSTAL_CODES** (Reference Table)
   - Normalizes location data
   - Columns: postal_code (PK), city, state, country

### Modified Tables (Update Descriptions)

**HOSPITALS Table:**
- Replace: city, state → postal_code (FK to POSTAL_CODES)

**DONORS Table:**
- Replace: city, state → postal_code (FK to POSTAL_CODES)

**BLOOD_REQUESTS Table:**
- Remove: selected_hospitals (JSON array)
- Remove: hospital_id
- Note: Now uses REQUEST_HOSPITALS junction table for M:N relationship

**TRANSFERS Table:**
- Simplified: Only contains transfer metadata (transfer_id, donation_id, request_id, transferred_at, status, notes)
- Removed: 7 redundant columns (donor_id, blood_type, rh_factor, component_type, volume_ml, recipient_name, recipient_contact)
- Blood details retrieved via JOINs to DONATIONS table

---

## 2. NORMALIZATION STATUS
Add: **Database is in Third Normal Form (3NF)** - eliminates data redundancy and ensures data integrity through proper foreign key relationships.

---

## 3. NEW FEATURES (Optional Section)

### AI-Powered Chatbot
- Integrated Google Gemini API for intelligent blood donation queries
- Pattern-matching fallback for offline operation

### Real-Time Dashboard
- Live blood inventory visualization
- Interactive charts using Recharts library
- Hospital-wise inventory tracking

### Multi-Hospital Notification System
- Blood requests notify multiple hospitals simultaneously
- Track response status per hospital

---

## 4. ER DIAGRAM UPDATES

### Entities (8 Total)
Same as before: HOSPITALS, DONORS, DONATIONS, TRANSFERS, REQUESTERS, BLOOD_REQUESTS
**Add**: POSTAL_CODES, REQUEST_HOSPITALS

### Key Relationship Changes
- **NOTIFIES**: BLOOD_REQUESTS ↔ HOSPITALS (Many-to-Many via REQUEST_HOSPITALS)
- **LOCATED_AT**: HOSPITALS → POSTAL_CODES (Many-to-One)
- **RESIDES_AT**: DONORS → POSTAL_CODES (Many-to-One)

---

## 5. TECHNOLOGY STACK (Update If Listed)
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + Azure SQL Database
- AI: Google Gemini API (optional)
- Visualization: Recharts

---

## QUICK SYNOPSIS UPDATE CHECKLIST

**Database Section:**
- [ ] Add REQUEST_HOSPITALS and POSTAL_CODES tables
- [ ] Update HOSPITALS and DONORS (postal_code instead of city/state)
- [ ] Update BLOOD_REQUESTS (remove selected_hospitals)
- [ ] Update TRANSFERS (mention simplified structure)
- [ ] Add "3NF compliant" statement

**ER Diagram:**
- [ ] Add 2 new entities (POSTAL_CODES, REQUEST_HOSPITALS)
- [ ] Update relationships (NOTIFIES is now M:N, add LOCATED_AT, RESIDES_AT)

**Features (Optional):**
- [ ] Mention AI chatbot
- [ ] Mention real-time dashboard

---

**Note:** Focus on database normalization changes - this is the most significant update from your old synopsis.
