# Procedure to Normalize Database to 3NF

## Step-by-Step Implementation Guide

---

## STEP 1: Create Postal Codes Reference Table

```sql
-- Create the postal codes lookup table
CREATE TABLE postal_codes (
    postal_code VARCHAR(10) PRIMARY KEY,
    city NVARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) DEFAULT 'USA',
    created_at DATETIME DEFAULT GETDATE()
);

-- Populate with existing data from hospitals
INSERT INTO postal_codes (postal_code, city, state)
SELECT DISTINCT postal_code, city, state
FROM hospitals
WHERE postal_code IS NOT NULL;

-- Add data from donors (if different)
INSERT INTO postal_codes (postal_code, city, state)
SELECT DISTINCT d.postal_code, d.city, d.state
FROM donors d
WHERE d.postal_code IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM postal_codes pc 
    WHERE pc.postal_code = d.postal_code
);
```

---

## STEP 2: Backup Your Tables

```sql
-- Create backup tables
SELECT * INTO hospitals_backup FROM hospitals;
SELECT * INTO donors_backup FROM donors;
SELECT * INTO transfers_backup FROM transfers;
```

---

## STEP 3: Fix HOSPITALS Table

```sql
-- Add foreign key to postal_codes (if not already exists)
ALTER TABLE hospitals
ADD CONSTRAINT FK_hospitals_postal_codes
FOREIGN KEY (postal_code) REFERENCES postal_codes(postal_code);

-- Remove redundant columns
ALTER TABLE hospitals
DROP COLUMN city;

ALTER TABLE hospitals
DROP COLUMN state;
```

---

## STEP 4: Fix DONORS Table

```sql
-- Add foreign key to postal_codes
ALTER TABLE donors
ADD CONSTRAINT FK_donors_postal_codes
FOREIGN KEY (postal_code) REFERENCES postal_codes(postal_code);

-- Remove redundant columns
ALTER TABLE donors
DROP COLUMN city;

ALTER TABLE donors
DROP COLUMN state;
```

---

## STEP 5: Fix TRANSFERS Table (CRITICAL)

```sql
-- Remove redundant blood-related columns
ALTER TABLE transfers
DROP COLUMN blood_type;

ALTER TABLE transfers
DROP COLUMN rh_factor;

ALTER TABLE transfers
DROP COLUMN component_type;

ALTER TABLE transfers
DROP COLUMN volume_ml;

ALTER TABLE transfers
DROP COLUMN donor_id;

-- Note: Keep blood_id to retrieve this data via JOIN with donations table
```

---

## STEP 6: Update Application Queries

### Before (Current Queries):
```sql
-- Old query for transfers
SELECT * FROM transfers WHERE transfer_id = @id;
```

### After (New Queries):
```sql
-- New query with JOIN
SELECT 
    t.transfer_id,
    t.blood_id,
    t.request_id,
    t.hospital_id,
    t.recipient_name,
    t.recipient_contact,
    t.transfer_date,
    t.notes,
    t.created_at,
    -- Get blood details from donations
    d.blood_type,
    d.rh_factor,
    d.component_type,
    d.volume_ml,
    d.donor_id
FROM transfers t
JOIN donations d ON t.blood_id = d.blood_id
WHERE t.transfer_id = @id;

-- Hospitals query with postal info
SELECT 
    h.hospital_id,
    h.name,
    h.address,
    h.postal_code,
    h.phone,
    h.email,
    -- Get city and state from postal_codes
    pc.city,
    pc.state
FROM hospitals h
LEFT JOIN postal_codes pc ON h.postal_code = pc.postal_code
WHERE h.hospital_id = @id;

-- Donors query with postal info
SELECT 
    d.donor_id,
    d.hospital_id,
    d.first_name,
    d.last_name,
    d.date_of_birth,
    d.gender,
    d.phone,
    d.email,
    d.address,
    d.postal_code,
    -- Get city and state from postal_codes
    pc.city,
    pc.state
FROM donors d
LEFT JOIN postal_codes pc ON d.postal_code = pc.postal_code
WHERE d.donor_id = @id;
```

---

## STEP 7: Update Application Code

### Files to Update:

#### A. Server Routes
Update any routes that handle:
- Hospital creation/updates
- Donor creation/updates
- Transfer creation/queries

#### B. Frontend Forms
Update forms that display:
- Hospital information (city/state now from JOIN)
- Donor information (city/state now from JOIN)
- Transfer information (blood details now from JOIN)

#### C. API Responses
Ensure API responses include JOINed data:
```javascript
// Example: server/routes/transfers.js
router.get('/:id', async (req, res) => {
    const query = `
        SELECT 
            t.*,
            d.blood_type,
            d.rh_factor,
            d.component_type,
            d.volume_ml,
            d.donor_id
        FROM transfers t
        JOIN donations d ON t.blood_id = d.blood_id
        WHERE t.transfer_id = @id
    `;
    // Execute query...
});
```

---

## STEP 8: Handle REQUEST_HOSPITALS (Optional)

```sql
-- This denormalization is acceptable for performance
-- But if you want strict 3NF, remove hospital_name:

ALTER TABLE request_hospitals
DROP COLUMN hospital_name;

-- Then always JOIN to get hospital name:
SELECT 
    rh.id,
    rh.request_id,
    rh.hospital_id,
    h.name AS hospital_name,  -- Get from hospitals table
    rh.status,
    rh.responded_at,
    rh.notes
FROM request_hospitals rh
JOIN hospitals h ON rh.hospital_id = h.hospital_id;
```

**Recommendation:** Keep hospital_name for performance unless strict normalization is required.

---

## STEP 9: Create Views for Common Queries (Optional)

```sql
-- View for transfers with blood details
CREATE VIEW vw_transfers_detailed AS
SELECT 
    t.transfer_id,
    t.blood_id,
    t.request_id,
    t.hospital_id,
    t.recipient_name,
    t.recipient_contact,
    t.transfer_date,
    t.notes,
    t.created_at,
    d.blood_type,
    d.rh_factor,
    d.component_type,
    d.volume_ml,
    d.donor_id
FROM transfers t
JOIN donations d ON t.blood_id = d.blood_id;

-- View for hospitals with location
CREATE VIEW vw_hospitals_full AS
SELECT 
    h.hospital_id,
    h.name,
    h.address,
    h.postal_code,
    h.phone,
    h.email,
    h.created_at,
    h.updated_at,
    pc.city,
    pc.state,
    pc.country
FROM hospitals h
LEFT JOIN postal_codes pc ON h.postal_code = pc.postal_code;

-- View for donors with location
CREATE VIEW vw_donors_full AS
SELECT 
    d.donor_id,
    d.hospital_id,
    d.first_name,
    d.last_name,
    d.date_of_birth,
    d.gender,
    d.phone,
    d.email,
    d.address,
    d.postal_code,
    d.created_at,
    d.updated_at,
    pc.city,
    pc.state,
    pc.country
FROM donors d
LEFT JOIN postal_codes pc ON d.postal_code = pc.postal_code;
```

---

## STEP 10: Test and Verify

```sql
-- Test 1: Verify transfers work with JOIN
SELECT * FROM vw_transfers_detailed WHERE transfer_id = 1;

-- Test 2: Verify hospitals have city/state
SELECT * FROM vw_hospitals_full;

-- Test 3: Verify donors have city/state
SELECT * FROM vw_donors_full;

-- Test 4: Check data integrity
SELECT COUNT(*) FROM transfers t
LEFT JOIN donations d ON t.blood_id = d.blood_id
WHERE d.blood_id IS NULL;  -- Should be 0

-- Test 5: Check postal codes
SELECT COUNT(*) FROM hospitals h
LEFT JOIN postal_codes pc ON h.postal_code = pc.postal_code
WHERE pc.postal_code IS NULL AND h.postal_code IS NOT NULL;  -- Should be 0
```

---

## STEP 11: Update Indexes for Performance

```sql
-- Add indexes for JOIN performance
CREATE INDEX idx_transfers_blood_id ON transfers(blood_id);
CREATE INDEX idx_hospitals_postal ON hospitals(postal_code);
CREATE INDEX idx_donors_postal ON donors(postal_code);
```

---

## Execution Order Summary

1. ✅ Create postal_codes table and populate it
2. ✅ Create backup tables
3. ✅ Add foreign keys to hospitals and donors
4. ✅ Drop city/state columns from hospitals and donors
5. ✅ Drop redundant columns from transfers
6. ✅ Create views for common queries
7. ✅ Update application code (routes, services, frontend)
8. ✅ Add indexes for performance
9. ✅ Test all queries
10. ✅ Deploy to production

---

## Rollback Plan (If Issues Occur)

```sql
-- Restore from backups
DROP TABLE hospitals;
DROP TABLE donors;
DROP TABLE transfers;

SELECT * INTO hospitals FROM hospitals_backup;
SELECT * INTO donors FROM donors_backup;
SELECT * INTO transfers FROM transfers_backup;

-- Recreate foreign keys and constraints
```

---

## Expected Benefits

✅ **Data Integrity:** No redundant data, single source of truth  
✅ **Storage Efficiency:** Reduced data duplication  
✅ **Update Safety:** No update anomalies  
✅ **Maintainability:** Cleaner, more logical structure  

## Performance Considerations

⚠️ **More JOINs Required:** Queries will need JOINs  
✅ **Use Views:** Create views to simplify complex queries  
✅ **Add Indexes:** Ensure JOIN columns are indexed  
✅ **Monitor Performance:** Test query performance after changes
