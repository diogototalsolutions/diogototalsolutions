-- Create enums
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF');
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "ClientServiceStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');
CREATE TYPE "QuoteRequestStatus" AS ENUM ('NOVO', 'EM_CONTACTO', 'ORCAMENTO_ENVIADO', 'FECHADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "nif" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" DECIMAL(10,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientService" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "notes" TEXT,
    "startDate" TIMESTAMP(3),
    "status" "ClientServiceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientService_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "status" "QuoteRequestStatus" NOT NULL DEFAULT 'NOVO',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE INDEX "ClientService_clientId_idx" ON "ClientService"("clientId");
CREATE INDEX "ClientService_serviceId_idx" ON "ClientService"("serviceId");
CREATE INDEX "QuoteRequest_status_idx" ON "QuoteRequest"("status");
CREATE INDEX "QuoteRequest_createdAt_idx" ON "QuoteRequest"("createdAt");

ALTER TABLE "ClientService" ADD CONSTRAINT "ClientService_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClientService" ADD CONSTRAINT "ClientService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
