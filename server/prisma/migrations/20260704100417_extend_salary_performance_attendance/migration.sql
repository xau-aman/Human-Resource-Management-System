-- CreateEnum
CREATE TYPE "WageType" AS ENUM ('FIXED');

-- CreateEnum
CREATE TYPE "SalaryCalculationType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'REMAINDER');

-- CreateEnum
CREATE TYPE "SalaryCalculationBase" AS ENUM ('MONTHLY_WAGE', 'BASIC_SALARY');

-- CreateEnum
CREATE TYPE "PerformanceRating" AS ENUM ('EXCEPTIONAL', 'STRONG', 'GOOD', 'NEEDS_IMPROVEMENT', 'CRITICAL');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "extraMinutes" INTEGER,
ADD COLUMN     "workingMinutes" INTEGER;

-- AlterTable
ALTER TABLE "LeaveRequest" ADD COLUMN     "attachmentName" TEXT,
ADD COLUMN     "duration" INTEGER;

-- AlterTable
ALTER TABLE "PerformanceReview" ADD COLUMN     "assignedGoals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "assignedTasks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "attendanceConsistencyScore" DOUBLE PRECISION,
ADD COLUMN     "goalAchievementScore" DOUBLE PRECISION,
ADD COLUMN     "managerRatingScore" DOUBLE PRECISION,
ADD COLUMN     "rating" "PerformanceRating",
ADD COLUMN     "reviewPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "reviewPeriodStart" TIMESTAMP(3),
ADD COLUMN     "skillGrowthScore" DOUBLE PRECISION,
ADD COLUMN     "taskCompletionScore" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "SalaryStructure" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "monthlyWage" DOUBLE PRECISION NOT NULL,
    "yearlyWage" DOUBLE PRECISION NOT NULL,
    "wageType" "WageType" NOT NULL DEFAULT 'FIXED',
    "workingDaysPerWeek" INTEGER NOT NULL DEFAULT 5,
    "workingHoursPerDay" DOUBLE PRECISION NOT NULL DEFAULT 8,
    "breakTimeMinutes" INTEGER NOT NULL DEFAULT 60,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryComponent" (
    "id" TEXT NOT NULL,
    "salaryStructureId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "calculationType" "SalaryCalculationType" NOT NULL,
    "percentage" DOUBLE PRECISION,
    "fixedAmount" DOUBLE PRECISION,
    "calculationBase" "SalaryCalculationBase" NOT NULL DEFAULT 'MONTHLY_WAGE',
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryComponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalaryStructure_employeeId_key" ON "SalaryStructure"("employeeId");

-- AddForeignKey
ALTER TABLE "SalaryStructure" ADD CONSTRAINT "SalaryStructure_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryComponent" ADD CONSTRAINT "SalaryComponent_salaryStructureId_fkey" FOREIGN KEY ("salaryStructureId") REFERENCES "SalaryStructure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
