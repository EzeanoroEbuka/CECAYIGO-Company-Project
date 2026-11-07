# Accounts, roles & admin setup

## How it works now
* **One sign-in page for everyone: `/login`.** There is no separate admin portal or admin login page.
* Every account has a **role**: `customer` (default) or `admin`.
* The role is stored as a Firebase **custom claim**, which can only be set by the server — a customer cannot
  give themselves admin from the browser. Firestore and Storage rules check this claim.
* **Self-registration always creates a customer.**
* **Only an admin can create another admin** (Dashboard → *Users* tab → *Create a new admin*, or promote an
  existing customer with *Make Admin*). An admin can't change their own role (so you can't lock yourself out).
* After signing in, admins see an **Admin Dashboard** link in the account menu and are taken to the dashboard.
  Customers and guests who visit `/admin/...` just get the normal 404 page.
* Accounts created with a temporary password (the first admin, or admins created by another admin) are
  forced to choose their own password at first sign-in (`/account/security`).

## One-time setup
1. Copy your existing `.env` into this folder (see `.env.example` for the variable names). Never commit it or share it.
2. **Firebase Console → Authentication → Sign-in method:** enable **Email/Password** *and* **Anonymous**
   (the shop uses anonymous sessions for carts and checkout). If Email/Password is off, nobody can sign in.
3. `npm install`
4. Create the first admin:
   ```
   npm run seed:admin
   ```
   It prints the email and a random password **once**. (Defaults to `admin@cecayigo.com`; change with
   `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`.) Running it again is safe; to reset a forgotten
   admin password, set `SEED_ADMIN_PASSWORD` and run it again.
5. Publish the new security rules (IMPORTANT — the old ones let anyone write to your database):
   ```
   npx firebase-tools deploy --only firestore:rules,storage
   ```
   (or paste `firestore.rules` and `storage.rules` into the Firebase Console → Firestore/Storage → Rules.)
6. `npm run dev`, open `/login`, sign in with the seeded admin.

## Notes
* A promoted user gets admin access after their next sign-in (or within an hour). A demoted admin loses
  access to the admin APIs immediately and is signed out.
* Orders can be looked up by anyone who has the order ID (that's how order tracking works); only admins can
  list or edit orders.
* Old admin accounts: users in the previous version stored their role in the browser/Firestore. Those roles
  are no longer trusted. Re-promote anyone you need using `npm run seed:admin` and the Users tab.
