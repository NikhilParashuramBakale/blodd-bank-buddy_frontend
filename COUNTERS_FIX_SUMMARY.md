# Fixed: Pending Requests and Pending Transfers Counter Logic

## Issues Resolved

### 1. Pending Transfers Going Negative (-1, -2, etc.)
**Root Cause**: The system was decrementing `pendingTransfers` when completing a transfer, but never incrementing it when approving a request.

**Fix**: Now correctly increments `pendingTransfers` when a request is approved (transitioning from pending → approved).

### 2. Pending Requests Not Reducing After Approval
**Root Cause**: When approving a request, the Firebase cache was not being updated to decrement the `pendingRequests` counter.

**Fix**: Now correctly decrements `pendingRequests` when a request is approved.

## Complete Request Lifecycle with Cache Updates

```
┌─────────────────────────────────────────────────────────────────┐
│                    REQUEST LIFECYCLE                             │
└─────────────────────────────────────────────────────────────────┘

1. REQUEST CREATED (by requester)
   ├─ Webhook: /api/webhook/request-created
   ├─ Action: Insert into request_hospitals table
   └─ Cache Update: pendingRequests += 1 (for each hospital)
   
2a. REQUEST APPROVED (by hospital)
    ├─ Endpoint: PUT /api/hospital/requests/:id/status
    ├─ Status: pending → approved
    ├─ Cache Updates:
    │  ├─ pendingRequests -= 1 (request handled)
    │  └─ pendingTransfers += 1 (awaiting physical transfer)
    └─ Side Effect: Auto-remove from other hospitals
       └─ Cache Update: pendingRequests -= 1 (for each other hospital)

2b. REQUEST REJECTED (by hospital)
    ├─ Endpoint: PUT /api/hospital/requests/:id/status
    ├─ Status: pending → rejected
    └─ Cache Update: pendingRequests -= 1

3. TRANSFER COMPLETED (approved → fulfilled)
   ├─ Endpoint: POST /api/hospital/transfers
   ├─ Action: Move donation to transfers table
   ├─ Status: approved → fulfilled
   └─ Cache Updates:
      ├─ pendingTransfers -= 1 (transfer completed)
      ├─ totalBloodUnits -= 1
      └─ bloodInventory[type] -= volume_ml

4. REQUEST DELETED (by requester)
   ├─ Webhook: /api/webhook/request-deleted
   └─ Cache Update: None (already handled by approve/reject)
```

## Cache Counter Balance

### pendingRequests
```
INCREMENT (+1): When request is created
DECREMENT (-1): When request is approved, rejected, or auto-removed
```

### pendingTransfers
```
INCREMENT (+1): When request is approved
DECREMENT (-1): When transfer is completed (fulfilled)
```

## Files Modified

1. **server.js** - Line ~555-558: Added cache updates on approval
   ```javascript
   if (status === 'approved') {
     await incrementCounter(hospital_id, 'pendingRequests', -1);
     await incrementCounter(hospital_id, 'pendingTransfers', 1);
   }
   ```

2. **server.js** - Line ~530-533: Added cache updates for auto-removed requests
   ```javascript
   for (const hid of otherHospitals) {
     await incrementCounter(hid, 'pendingRequests', -1);
   }
   ```

3. **server.js** - Line ~582: Added cache update on rejection
   ```javascript
   await incrementCounter(hospital_id, 'pendingRequests', -1);
   ```

4. **server.js** - Line ~795: Kept cache update on transfer completion
   ```javascript
   await incrementCounter(hospital_id, 'pendingTransfers', -1);
   ```

## Testing

### Fix Existing Incorrect Counters
Run this script to correct any existing incorrect cache values:

```bash
cd "G:\Blood Inventory management\blood-bank-buddy\server"
node fix-cache-values.js
```

This script will:
- Query SQL for actual counts of pending requests and transfers
- Compare with Firebase cache values
- Update any mismatches automatically

### Verify New Requests Work Correctly
1. Create a new blood request in blood-connect
2. Approve it in blood-bank-buddy
3. Complete the transfer
4. Check dashboard counts remain accurate

## Expected Behavior

✅ **pendingRequests** should never go negative
✅ **pendingTransfers** should never go negative
✅ Approving a request decrements pending requests
✅ Approving a request increments pending transfers
✅ Completing a transfer decrements pending transfers
✅ Rejecting a request decrements pending requests
✅ Auto-removed requests decrement pending requests for affected hospitals
