# Database Normalization Analysis - 3NF Compliance Check
## Blood Inventory Management System

### Third Normal Form (3NF) Requirements:
1. ✓ Must be in 1NF (atomic values)
2. ✓ Must be in 2NF (no partial dependencies)
3. ✓ Must be in 3NF (no transitive dependencies)

---

## Table-by-Table Analysis

### 1. ✅ REQUESTERS - **COMPLIANT**
```
requester_id (PK) → email, full_name, phone, created_at
```
- **1NF:** ✓ All atomic values
- **2NF:** ✓ Single column PK, no partial dependencies
- **3NF:** ✓ All attributes depend directly on requester_id
- **Status:** **PASS**

---

### 2. ⚠️ HOSPITALS - **VIOLATION**
```
hospital_id (PK) → name, address, city, state, postal_code, phone, email, created_at, updated_at
```
- **1NF:** ✓ All atomic values
- **2NF:** ✓ Single column PK
- **3NF:** ❌ **VIOLATION**
  
**Problem:** Transitive Dependency
```
hospital_id → postal_code → city, state
```
- Postal code determines city and state
- This creates a transitive dependency: hospital_id → postal_code → (city, state)

**Impact:** Medium - Can cause data inconsistency if postal_code doesn't match city/state

**Recommendation:**
- Create separate `postal_codes` table:
  ```sql
  CREATE TABLE postal_codes (
      postal_code VARCHAR(10) PRIMARY KEY,
      city NVARCHAR(100),
      state VARCHAR(50)
  );
  ```
- Remove city and state from hospitals table
- Keep postal_code as FK in hospitals

---

### 3. ✅ BLOOD_REQUESTS - **COMPLIANT**
```
request_id (PK) → requester_id, patient_name, patient_age, blood_type, urgency, 
                  units_needed, contact_number, address, medical_notes, status, created_at
```
- **1NF:** ✓ All atomic values
- **2NF:** ✓ Single column PK
- **3NF:** ✓ All attributes depend directly on request_id
- **Status:** **PASS**

---

### 4. ⚠️ REQUEST_HOSPITALS - **VIOLATION (Intentional Denormalization)**
```
id (PK) → request_id, hospital_id, hospital_name, status, responded_at, notes, created_at, updated_at
```
- **1NF:** ✓ All atomic values
- **2NF:** ✓ Single column PK
- **3NF:** ❌ **VIOLATION**

**Problem:** Transitive Dependency
```
id → hospital_id → hospital_name
```
- hospital_name can be derived from hospital_id via hospitals table
- This is **intentional denormalization** for query performance

**Impact:** Low - Trade-off for performance (caching hospital name)

**Recommendation:**
- **Keep as is** if read performance is critical
- OR remove hospital_name and use JOIN to hospitals table
- Ensure application updates hospital_name if hospital name changes

---

### 5. ⚠️ DONORS - **VIOLATION**
```
donor_id (PK) → hospital_id, first_name, last_name, date_of_birth, gender, phone, email, 
                address, city, state, postal_code, created_at, updated_at
```
- **1NF:** ✓ All atomic values
- **2NF:** ✓ Single column PK
- **3NF:** ❌ **VIOLATION**

**Problem:** Transitive Dependency
```
donor_id → postal_code → city, state
```
- Same issue as hospitals table

**Impact:** Medium - Data inconsistency risk

**Recommendation:**
- Use shared `postal_codes` table (same as hospitals)
- Remove city and state from donors table

---

### 6. ✅ DONATIONS - **COMPLIANT**
```
blood_id (PK) → donor_id, hospital_id, blood_type, rh_factor, component_type, volume_ml,
                collection_date, expiry_date, status, storage_location, test_result_hiv,
                test_result_hbsag, test_result_hcv, test_result_syphilis, created_at, updated_at
```
- **1NF:** ✓ All atomic values
- **2NF:** ✓ Single column PK
- **3NF:** ✓ All attributes depend directly on blood_id
- **Status:** **PASS**

---

### 7. ❌ TRANSFERS - **MAJOR VIOLATION**
```
transfer_id (PK) → blood_id, request_id, hospital_id, donor_id, blood_type, rh_factor,
                   component_type, volume_ml, recipient_name, recipient_contact,
                   transfer_date, notes, created_at
```
- **1NF:** ✓ All atomic values
- **2NF:** ✓ Single column PK
- **3NF:** ❌ **MAJOR VIOLATION**

**Problem:** Multiple Transitive Dependencies
```
transfer_id → blood_id → blood_type, rh_factor, component_type, volume_ml, donor_id
```
- All blood-related attributes can be derived from blood_id via donations table
- This creates redundancy and update anomalies

**Impact:** HIGH - Data inconsistency, update anomalies

**Recommendation:**
```sql
-- REMOVE these columns from transfers:
-- - blood_type
-- - rh_factor
-- - component_type
-- - volume_ml
-- - donor_id (debatable)

-- Keep only:
transfer_id (PK)
blood_id (reference to donations)
request_id
hospital_id
recipient_name
recipient_contact
transfer_date
notes
created_at

-- Get blood details via JOIN:
SELECT t.*, d.blood_type, d.rh_factor, d.component_type, d.volume_ml, d.donor_id
FROM transfers t
JOIN donations d ON t.blood_id = d.blood_id;
```

---

## Summary of 3NF Compliance

| Table | Status | Severity | Violations |
|-------|--------|----------|------------|
| REQUESTERS | ✅ PASS | - | None |
| HOSPITALS | ⚠️ FAIL | Medium | postal_code → city, state |
| BLOOD_REQUESTS | ✅ PASS | - | None |
| REQUEST_HOSPITALS | ⚠️ FAIL | Low | hospital_id → hospital_name (intentional) |
| DONORS | ⚠️ FAIL | Medium | postal_code → city, state |
| DONATIONS | ✅ PASS | - | None |
| TRANSFERS | ❌ FAIL | **HIGH** | blood_id → blood_type, rh_factor, component_type, volume_ml, donor_id |

---

## Overall Assessment: **NOT IN 3NF**

Your database has **4 out of 7 tables** with 3NF violations.

### Critical Issues (Fix Recommended):
1. **TRANSFERS** - Major redundancy with blood-related attributes
2. **HOSPITALS & DONORS** - postal_code determines city and state

### Acceptable Trade-offs:
1. **REQUEST_HOSPITALS.hospital_name** - Performance optimization (denormalization)

---

## Recommended Actions

### Priority 1 (Critical): Fix TRANSFERS Table
```sql
-- Remove redundant columns
ALTER TABLE transfers
DROP COLUMN blood_type, rh_factor, component_type, volume_ml, donor_id;

-- These can be retrieved via JOIN with donations table
```

### Priority 2 (Medium): Create Postal Codes Table
```sql
CREATE TABLE postal_codes (
    postal_code VARCHAR(10) PRIMARY KEY,
    city NVARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) DEFAULT 'USA'
);

-- Then modify hospitals and donors tables
ALTER TABLE hospitals
DROP COLUMN city, state;

ALTER TABLE donors
DROP COLUMN city, state;

-- Add foreign key constraints
ALTER TABLE hospitals
ADD CONSTRAINT FK_hospitals_postal 
FOREIGN KEY (postal_code) REFERENCES postal_codes(postal_code);

ALTER TABLE donors
ADD CONSTRAINT FK_donors_postal
FOREIGN KEY (postal_code) REFERENCES postal_codes(postal_code);
```

### Priority 3 (Optional): Keep REQUEST_HOSPITALS as is
- The hospital_name denormalization is acceptable for performance
- Document this as intentional denormalization
- Ensure application logic updates cached hospital_name when hospital name changes

---

## Performance vs. Normalization Trade-offs

### When Denormalization is Acceptable:
- ✓ Read-heavy operations (REQUEST_HOSPITALS.hospital_name)
- ✓ Frequently accessed data
- ✓ Infrequently updated data
- ✓ Documented and controlled

### When to Maintain 3NF:
- ✓ Frequently updated data (TRANSFERS blood info)
- ✓ Data integrity is critical
- ✓ Storage efficiency matters
- ✓ Reducing update anomalies

---

## Conclusion

**Your database is NOT in 3NF**, but some violations may be acceptable trade-offs:

- ✅ **3 tables are fully compliant** (REQUESTERS, BLOOD_REQUESTS, DONATIONS)
- ⚠️ **3 tables have medium issues** (HOSPITALS, DONORS, REQUEST_HOSPITALS)
- ❌ **1 table has critical issues** (TRANSFERS)

**Recommendation:** Fix the TRANSFERS table immediately to prevent data inconsistencies. Consider creating a postal_codes table for better data integrity. Keep REQUEST_HOSPITALS denormalization if query performance is critical.
