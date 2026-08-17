# Supabase Schema Map

The first Supabase migration preserves legacy domain names where practical, but replaces legacy password storage with Supabase Auth.

## Auth Mapping

Legacy:

- `account_information.username`
- `account_information.password`
- PHP sessions in `$_SESSION`

Target:

- Supabase Auth stores credentials.
- `account_information.auth_user_id` links an auth user to the legacy username/domain profile.
- Application roles are derived from `account_information.default_dashboard`, `garage_owners`, `dual_user`, and admin policy.

Plaintext passwords from the legacy dump should not be imported.

## Table Mapping

| Legacy MySQL table | Supabase table | Notes |
| --- | --- | --- |
| `account_information` | `account_information` | Add `auth_user_id`; remove plaintext password. |
| `personal_information` | `personal_information` | Profile details by username/email. |
| `vehicle_information` | `vehicle_information` | Vehicle ownership by username. |
| `garagelocation` | `garagelocation` | Coordinates by garage id. |
| `garage_information` | `garage_information` | Main garage record. |
| `garage_owners` | `garage_owners` | Professional owner records. |
| `dual_user` | `dual_user` | Regular users who also own garages. |
| `garage_operating_schedule` | `garage_operating_schedule` | Opening/closing rules. |
| `garage_real_time_status` | `garage_real_time_status` | Live garage status and overrides. |
| `garage_status_log` | `garage_status_log` | Status audit trail. |
| `bookings` | `bookings` | Booking and payment status. |
| `payments` | `payments` | Payment records. |
| `profit_tracking` | `profit_tracking` | Platform/owner profit split. |
| `owner_commissions` | `owner_commissions` | Commission rates. |
| `points_transactions` | `points_transactions` | Points ledger. |
| `ratings` | `ratings` | User reviews. |
| `garage_ratings_summary` | `garage_ratings_summary` | Cached ratings summary. |
| `verification_requests` | `verification_requests` | Verification workflow state. |
| `verification_documents` | `verification_documents` | Metadata only; files belong in Supabase Storage. |
| `user_login_history` | `user_login_history` | Audit log. |
| `user_notification_checks` | `user_notification_checks` | Notification read marker. |

## Trigger Mapping

MySQL trigger behavior should be reviewed case by case:

- Points awards on booking/payment changes.
- Profit calculation after payment.
- Profit adjustment on refunds.
- Ratings summary refresh.
- Garage status logging/protection.
- Account last-login updates.

For Supabase, this can be implemented as Postgres triggers, RPC functions, or API service logic. The recommended approach is to keep financial and points ledger changes server-side and transactional.
