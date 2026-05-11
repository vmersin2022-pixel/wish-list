# Security Specification: Birthday Wishlist

## Data Invariants
1. A gift can only be created, updated, or deleted by an Admin.
2. An Admin is defined by the existence of a document in the `admins/{uid}` path.
3. Any authenticated user can reserve an "available" gift.
4. When reserving a gift, only the `status`, `reservedByUid`, `reservedByName`, and `updatedAt` fields can change. `status` must become "reserved".
5. A user can un-reserve a gift they previously reserved (change `status` back to "available" and clear `reservedByUid`/`reservedByName`).
6. A guest cannot edit the title, url, or imageUrl of a gift.

## The "Dirty Dozen" Payloads

1. **Spoofed Admin Check**: A standard user attempting to create a gift.
2. **Ghost Field Update**: A user trying to set `isVerified: true` while reserving a gift.
3. **Admin Lockout**: A user trying to delete a gift.
4. **Id Poisoning**: A user trying to update a gift with an ID length of 1500 chars.
5. **Type Poisoning**: A user reserving a gift but passing a number for `reservedByName`.
6. **Denial of Wallet**: A user sending an array of 5000 items in a ghost field.
7. **Identity Spoofing**: A user trying to reserve a gift with someone else's UID in `reservedByUid`.
8. **Overwriting Existing Reservation**: A user trying to reserve a gift that is already `status == 'reserved'`.
9. **Skipping State**: A user trying to set `status` to "completed" or some random string instead of "reserved" or "available".
10. **Timestamp Forgery**: A user updating a reservation with an old `updatedAt` value.
11. **Malicious Delete**: A user calling delete on the `admins` collection piece.
12. **Scraping**: A user trying to list users or list gifts without being authenticated.

## The Test Runner
It will be implemented in `firestore.rules.test.ts`.
