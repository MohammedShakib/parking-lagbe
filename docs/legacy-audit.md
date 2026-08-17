# Legacy Project Audit

## Project Shape

The current application is a flat PHP/MySQL application. Most pages mix PHP request handling, SQL queries, HTML, CSS, and browser JavaScript in the same file.

Large monolithic files:

- `admin.php`: about 13,625 lines.
- `business_desh.php`: about 6,426 lines.
- `home.php`: about 5,804 lines.
- `my_profile.php`: about 2,507 lines.

Core files:

- `login.php`: session login and role redirect.
- `registration.php`: user and garage owner registration.
- `home.php`: regular user dashboard, search, notifications, booking UI.
- `business_desh.php`: business owner dashboard.
- `admin.php`: admin dashboard and many admin actions.
- `process_booking.php`, `payment.php`, `rating_api.php`, `process_verification.php`: workflow endpoints.

## Legacy Database

The local MySQL database name is `car_parking_db_new`.

Observed tables:

- `account_information`
- `bookings`
- `dual_user`
- `garagelocation`
- `garage_information`
- `garage_operating_schedule`
- `garage_owners`
- `garage_ratings_summary`
- `garage_real_time_status`
- `garage_status_log`
- `owner_commissions`
- `payments`
- `personal_information`
- `points_transactions`
- `profit_tracking`
- `ratings`
- `user_login_history`
- `user_notification_checks`
- `vehicle_information`
- `verification_documents`
- `verification_requests`

The SQL dump also contains many MySQL triggers for points, profit tracking, ratings summary, status logging, and last-login behavior. These need to be ported carefully rather than copied mechanically.

## Migration Risks

- Passwords are currently compared as plaintext. New implementation should use Supabase Auth.
- Several SQL statements interpolate user-controlled values directly. New implementation must use Supabase client APIs or parameterized SQL/RPC calls.
- `uploads/verification` contains private user documents and must not be committed.
- Admin and business pages use `fetch()` back to the same PHP file with `action=...`. These actions need to become explicit API routes or service functions.
- The raw SQL dump includes sample data and credentials, so it is intentionally ignored by Git.

## Recommended Migration Order

1. Build Supabase schema and auth model.
2. Bootstrap Next.js with shared layout and route protection.
3. Implement API/service layer for auth, profiles, garages, vehicles, bookings, payments, ratings, verification, and admin workflows.
4. Migrate UI by workflow, not by PHP file size.
5. Verify each role end to end before retiring the corresponding PHP page.
