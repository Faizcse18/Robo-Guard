# RoboGuard

RoboGuard is a small Zero Trust licensing demo built with Cloudflare Workers and D1. Every robot command is checked against its current license, expiry, and allowlist before it can run. Repeated violations automatically revoke the license and stop the company's robots.

## Setup

1. Install Node.js and Wrangler, then authenticate:

   ```powershell
   npm install --save-dev wrangler
   npx wrangler login
   ```

2. Create a D1 database and put the returned database ID into `database_id` in `wrangler.toml`:

   ```powershell
   npx wrangler d1 create roboguard
   ```

3. Create the schema and load the sample companies and robots:

   ```powershell
   npx wrangler d1 execute roboguard --file=.\schema.sql
   npx wrangler d1 execute roboguard --file=.\seed.sql
   ```

4. Start local development. Admin routes accept requests without an Access assertion only when `DEV_MODE` is exactly `"true"`:

   ```powershell
   npx wrangler dev --var DEV_MODE:true
   ```

   Open the local URL Wrangler prints. `wrangler.toml` defaults to `DEV_MODE = "false"`; keep that value for deployed environments.

5. Deploy:

   ```powershell
   npx wrangler deploy
   ```

   Configure Cloudflare Access to protect the application. Admin requests require the `Cf-Access-Jwt-Assertion` header. This demo checks for the header's presence only; JWT signature and claims verification against the team's JWKS is intentionally left as a TODO.

## Architecture

```text
Cloudflare Access -> Worker (src/index.js) -> D1 (DB binding)
```

The Worker serves the inline dashboard at `GET /`, exposes JSON API routes, checks every command against live D1 state, and updates risk scores and license state. `schema.sql` defines the database; `seed.sql` inserts two example companies and two robots for each. The `leave_zone` restricted command simulates a geofence violation.

## Demo script

1. Open the dashboard and issue a license for a company with a future expiry and a robot ID.
2. Select that company and robot, then send an allowed command such as **Move**.
3. Send **Disable Safety** (5 points) or **Override Limits** (5 points) to create a blocked violation.
4. Repeat restricted commands until the score reaches 10; RoboGuard revokes the license and stops all of that company's robots.
5. Send another command and observe the `403 License revoked` response. Use **Reset Demo** to restore active licenses, running robots, and clear the violations and command history.
