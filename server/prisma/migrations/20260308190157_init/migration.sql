-- CreateEnum
CREATE TYPE "Role" AS ENUM ('candidate', 'employer', 'recruiter', 'senior_manager', 'visa_officer', 'admin', 'agency');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "CandidateState" AS ENUM ('registration', 'assessment', 'showcase', 'hard_lock', 'contracting', 'work_permit', 'visa', 'deployment', 'completed');

-- CreateEnum
CREATE TYPE "LanguageLevel" AS ENUM ('basic', 'intermediate', 'advanced', 'fluent');

-- CreateEnum
CREATE TYPE "JobOrderStatus" AS ENUM ('draft', 'active', 'filled', 'closed');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('passport', 'education', 'medical', 'photo', 'resume', 'contract');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('not_uploaded', 'uploaded', 'under_review', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('skill', 'language', 'medical', 'interview');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('local', 'google');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'candidate',
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "googleId" TEXT,
    "avatar" TEXT,
    "provider" "Provider" NOT NULL DEFAULT 'local',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "displayId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dob" TEXT,
    "gender" "Gender",
    "region" TEXT,
    "district" TEXT,
    "address" TEXT,
    "industry" TEXT,
    "specialization" TEXT,
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "languages" JSONB NOT NULL DEFAULT '[]',
    "education" JSONB NOT NULL DEFAULT '[]',
    "workExperience" JSONB NOT NULL DEFAULT '[]',
    "currentState" "CandidateState" NOT NULL DEFAULT 'registration',
    "stateHistory" JSONB NOT NULL DEFAULT '[]',
    "conditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "profileComplete" INTEGER NOT NULL DEFAULT 0,
    "recruiterId" TEXT,
    "matchScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobOrder" (
    "id" TEXT NOT NULL,
    "title" JSONB NOT NULL DEFAULT '{}',
    "employer" JSONB NOT NULL DEFAULT '{}',
    "industry" TEXT,
    "specialization" JSONB NOT NULL DEFAULT '{}',
    "country" TEXT,
    "city" JSONB NOT NULL DEFAULT '{}',
    "description" JSONB NOT NULL DEFAULT '{}',
    "requirements" JSONB NOT NULL DEFAULT '{}',
    "salary" JSONB NOT NULL DEFAULT '{}',
    "benefits" JSONB NOT NULL DEFAULT '{}',
    "workersNeeded" INTEGER NOT NULL DEFAULT 1,
    "workersHired" INTEGER NOT NULL DEFAULT 0,
    "deadline" TEXT,
    "status" "JobOrderStatus" NOT NULL DEFAULT 'draft',
    "recruiterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileName" TEXT,
    "filePath" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'not_uploaded',
    "uploadedAt" TEXT,
    "reviewedAt" TEXT,
    "reviewedBy" TEXT,
    "reviewNote" TEXT,
    "slaDeadline" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "type" "AssessmentType" NOT NULL,
    "category" TEXT,
    "score" INTEGER,
    "maxScore" INTEGER,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "assessedBy" TEXT,
    "assessedAt" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_displayId_key" ON "Candidate"("displayId");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
