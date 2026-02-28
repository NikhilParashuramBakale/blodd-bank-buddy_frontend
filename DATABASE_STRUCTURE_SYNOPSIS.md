# Relational Database Structure

## 1. HOSPITALS
Stores information about blood banks and hospitals in the network.
- **hospital_id** (PK) - Unique identifier
- hospital_name - Name of the hospital
- contact_number - Contact information
- email - Email address
- postal_code (FK) - References POSTAL_CODES
- license_number - Medical license number
- created_at - Registration timestamp

## 2. DONORS
Maintains donor information and medical history.
- **donor_id** (PK) - Unique identifier
- hospital_id (FK) - References HOSPITALS
- full_name - Donor's full name
- date_of_birth - Date of birth
- gender - Gender (Male/Female/Other)
- blood_type - Blood group (A/B/AB/O)
- rh_factor - Rh factor (+/-)
- contact_number - Contact information
- email - Email address
- postal_code (FK) - References POSTAL_CODES
- medical_conditions - Pre-existing conditions
- last_donation_date - Date of last donation
- is_eligible - Current eligibility status
- created_at - Registration timestamp

## 3. DONATIONS
Records all blood donation transactions.
- **donation_id** (PK) - Unique identifier
- donor_id (FK) - References DONORS
- hospital_id (FK) - References HOSPITALS
- donation_date - Date of donation
- blood_type - Blood group donated
- rh_factor - Rh factor
- component_type - Component (Whole Blood/Plasma/Platelets/RBC)
- volume_ml - Volume in milliliters
- hemoglobin_level - Hemoglobin reading
- blood_pressure - Blood pressure reading
- expiry_date - Expiration date of blood unit
- status - Current status (Available/Reserved/Expired/Used)
- created_at - Record creation timestamp

## 4. REQUESTERS
Stores information about individuals requesting blood.
- **requester_id** (PK) - Unique identifier
- full_name - Patient's full name
- contact_number - Contact information
- email - Email address
- date_of_birth - Date of birth
- blood_type - Required blood group
- rh_factor - Required Rh factor
- created_at - Registration timestamp

## 5. BLOOD_REQUESTS
Tracks blood requirement requests from patients.
- **request_id** (PK) - Unique identifier
- requester_id (FK) - References REQUESTERS
- blood_type - Required blood group
- rh_factor - Required Rh factor
- component_type - Required component
- volume_ml - Required volume
- urgency_level - Priority (Low/Medium/High/Critical)
- medical_reason - Reason for requirement
- required_by_date - Deadline date
- status - Request status (Pending/Fulfilled/Cancelled)
- created_at - Request creation timestamp

## 6. TRANSFERS
Records blood transfer transactions from hospital to requester.
- **transfer_id** (PK) - Unique identifier
- donation_id (FK) - References DONATIONS
- request_id (FK) - References BLOOD_REQUESTS
- transferred_at - Transfer timestamp
- status - Transfer status (Pending/Completed/Cancelled)
- notes - Additional notes
- created_at - Record creation timestamp

## 7. REQUEST_HOSPITALS (Junction Table)
Manages many-to-many relationship between blood requests and hospitals.
- **request_id** (PK, FK) - References BLOOD_REQUESTS
- **hospital_id** (PK, FK) - References HOSPITALS
- status - Hospital response status (Notified/Accepted/Rejected)
- notified_at - Notification timestamp
- responded_at - Response timestamp

## 8. POSTAL_CODES (Reference Table)
Normalizes geographic location data.
- **postal_code** (PK) - Postal/ZIP code
- city - City name
- state - State/Province
- country - Country name

---

## Database Relationships

### One-to-Many Relationships
- HOSPITALS → DONORS (One hospital registers many donors)
- HOSPITALS → DONATIONS (One hospital collects many donations)
- DONORS → DONATIONS (One donor makes many donations)
- REQUESTERS → BLOOD_REQUESTS (One requester creates many requests)
- BLOOD_REQUESTS → TRANSFERS (One request may have multiple transfers)
- DONATIONS → TRANSFERS (One donation unit transferred to one request)
- POSTAL_CODES → HOSPITALS (One postal code shared by many hospitals)
- POSTAL_CODES → DONORS (One postal code shared by many donors)

### Many-to-Many Relationships
- BLOOD_REQUESTS ↔ HOSPITALS (via REQUEST_HOSPITALS junction table)
  - One blood request notifies multiple hospitals
  - One hospital receives multiple blood requests

---

## Normalization Status
The database follows **Third Normal Form (3NF)** to eliminate redundancy and maintain data integrity:
- All tables have single-valued attributes (1NF)
- All non-key attributes depend on the entire primary key (2NF)
- No transitive dependencies exist between non-key attributes (3NF)

Geographic data is normalized through POSTAL_CODES reference table, and the many-to-many relationship between requests and hospitals is properly modeled using the REQUEST_HOSPITALS junction table.
