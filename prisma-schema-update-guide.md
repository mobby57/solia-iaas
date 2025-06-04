# Prisma Schema Update Guide for Solia IaaS

To update the Prisma schema to align with the provided registration forms and models, please follow these steps:

## 1. Update User Model

Replace the single `name` field with separate `firstName` and `lastName` fields.

Original User model snippet:
```prisma
model User {
  id             String         @id @default(auto()) @map("_id") @db.ObjectId
  email          String         @unique
  password       String
  name           String
  roleId         String?        @db.ObjectId
  role           Role?          @relation(fields: [roleId], references: [id])
  organizationId String?        @db.ObjectId
  organization   Organization?  @relation(fields: [organizationId], references: [id])
  kycData        Json?
  // other fields...
}
```

Updated User model snippet:
```prisma
model User {
  id             String         @id @default(auto()) @map("_id") @db.ObjectId
  email          String         @unique
  password       String
  firstName      String
  lastName       String
  roleId         String?        @db.ObjectId
  role           Role?          @relation(fields: [roleId], references: [id])
  organizationId String?        @db.ObjectId
  organization   Organization?  @relation(fields: [organizationId], references: [id])
  kycData        Json?
  // other fields...
}
```

## 2. Update Organization Model

Add fields to match the provided simplified model:

Original Organization model snippet:
```prisma
model Organization {
  id        String     @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  users     User[]
  donations Donation[]
  missions  Mission[]
  documents Document[]
  tenantId  String
  // other fields...
}
```

Updated Organization model snippet:
```prisma
model Organization {
  id                 String     @id @default(auto()) @map("_id") @db.ObjectId
  organizationName   String
  siret              String     @unique
  apeCode            String?
  email              String
  phoneNumber        String
  address            Json
  legalRepresentative Json
  proofOfRegistration String?
  users              User[]
  donations          Donation[]
  missions           Mission[]
  documents          Document[]
  tenantId           String
  // other fields...
}
```

## 3. Apply Changes

After updating the schema file (`prisma/schema.prisma`), run the following commands to apply the changes:

```bash
npx prisma generate
npx prisma migrate dev --name update_user_and_organization_models
```

This will generate the Prisma client and create a migration for the schema changes.

---

If you want, I can assist you with generating migration commands or further code updates after you apply these schema changes.
