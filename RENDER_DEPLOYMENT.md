# Render Deployment Guide with NeonDB

## Step 1: Create NeonDB Database

1. Go to https://neon.tech
2. Sign up or log in
3. Click "Create Project"
4. Fill in:
   - Project Name: `tiger-market-jarvis`
   - Database Name: `tiger_market`
   - Region: Choose a region (e.g., us-east-2)
5. Click "Create Project"

## Step 2: Get Connection Details

1. In NeonDB, go to your project dashboard
2. Click "Connection Details"
3. Copy these values:

```
postgresql://username:password@host/database?sslmode=require
```

**Example:**
```
postgresql://neondb_owner:pX5mK9!n@ep-cool-island-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Step 3: Render Environment Variables

1. Go to your Render web service in Render Console
2. Click **Environment** tab
3. Add these variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://username:password@host/database?sslmode=require` |
| `PORT` | `3000` |

**Replace the values with YOUR actual NeonDB connection details!**

## Step 4: Push Database Schema

After Render deploys, connect to the Render logs and run:

```bash
npx prisma db push --accept-data-loss
```

This will create the database schema.

## Step 5: Seed Database (Optional)

```bash
npx prisma seed
```

This will create sample data.

## Important Notes

- `DATABASE_URL` is **required**
- `PORT` should be set to `3000`
- No `.env` file should be committed to Git (it's in .gitignore)
- All environment variables are set in Render, not in the code

## Troubleshooting

**Error: "P1001 Can't reach database server"**
- Check that DATABASE_URL is correct
- Verify NeonDB project is active
- Check firewall rules (NeonDB is usually open)

**Error: "Invalid DATABASE_URL"**
- Make sure format is correct: `postgresql://user:pass@host/db?sslmode=require`
- Check that password is properly escaped if it contains special characters

**Schema not created**
- Run: `npx prisma db push --accept-data-loss`
- Check Render logs for errors
- Verify Prisma CLI can connect to NeonDB
