import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);
const auth = getAuth(app);

async function createFirebaseUser(email: string, password: string, displayName: string) {
  try {
    const user = await auth.createUser({ email, password, displayName });
    return user.uid;
  } catch (e: any) {
    if (e.code === 'auth/email-already-exists') {
      const user = await auth.getUserByEmail(email);
      return user.uid;
    }
    throw e;
  }
}

async function main() {
  console.log('🌱 Seeding Firestore...');

  // Departments
  const deptData = [
    { name: 'Engineering', description: 'Software development and infrastructure' },
    { name: 'Design', description: 'UI/UX and product design' },
    { name: 'Marketing', description: 'Growth, brand, and communications' },
    { name: 'Human Resources', description: 'People operations and culture' },
  ];
  const deptIds: Record<string, string> = {};
  for (const dept of deptData) {
    const snap = await db.collection('departments').where('name', '==', dept.name).limit(1).get();
    if (snap.empty) {
      const ref = db.collection('departments').doc();
      await ref.set({ ...dept, createdAt: new Date().toISOString() });
      deptIds[dept.name] = ref.id;
    } else {
      deptIds[dept.name] = snap.docs[0].id;
    }
  }
  console.log('✅ Departments seeded');

  // Skills
  const skillData = [
    { name: 'React', category: 'Frontend' }, { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' }, { name: 'TypeScript', category: 'Frontend' },
    { name: 'PostgreSQL', category: 'Database' }, { name: 'Leadership', category: 'Soft Skills' },
    { name: 'Communication', category: 'Soft Skills' }, { name: 'Project Management', category: 'Management' },
    { name: 'Figma', category: 'Design' }, { name: 'AWS', category: 'Cloud' },
  ];
  const skillIds: string[] = [];
  for (const skill of skillData) {
    const snap = await db.collection('skills').where('name', '==', skill.name).limit(1).get();
    if (snap.empty) {
      const ref = db.collection('skills').doc();
      await ref.set({ ...skill, createdAt: new Date().toISOString() });
      skillIds.push(ref.id);
    } else {
      skillIds.push(snap.docs[0].id);
    }
  }
  console.log('✅ Skills seeded');

  // Employees + Users
  const employeeData = [
    { firstName: 'Arjun', lastName: 'Sharma', email: 'admin@workzen.com', password: 'admin123', designation: 'Engineering Manager', dept: 'Engineering', role: 'ADMIN', status: 'ACTIVE', joining: '2021-03-15' },
    { firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@workzen.com', password: 'emp123', designation: 'Senior Frontend Developer', dept: 'Engineering', role: 'EMPLOYEE', status: 'ACTIVE', joining: '2021-07-01' },
    { firstName: 'Rahul', lastName: 'Verma', email: 'rahul.verma@workzen.com', password: 'emp123', designation: 'Backend Developer', dept: 'Engineering', role: 'EMPLOYEE', status: 'ACTIVE', joining: '2022-01-10' },
    { firstName: 'Sneha', lastName: 'Iyer', email: 'sneha.iyer@workzen.com', password: 'emp123', designation: 'Full Stack Developer', dept: 'Engineering', role: 'EMPLOYEE', status: 'ACTIVE', joining: '2022-06-20' },
    { firstName: 'Vikram', lastName: 'Nair', email: 'vikram.nair@workzen.com', password: 'emp123', designation: 'DevOps Engineer', dept: 'Engineering', role: 'EMPLOYEE', status: 'ON_LEAVE', joining: '2021-11-05' },
    { firstName: 'Ananya', lastName: 'Reddy', email: 'ananya.reddy@workzen.com', password: 'emp123', designation: 'Lead Designer', dept: 'Design', role: 'MANAGER', status: 'ACTIVE', joining: '2021-04-12' },
    { firstName: 'Karan', lastName: 'Mehta', email: 'karan.mehta@workzen.com', password: 'emp123', designation: 'UI/UX Designer', dept: 'Design', role: 'EMPLOYEE', status: 'ACTIVE', joining: '2022-03-08' },
    { firstName: 'Divya', lastName: 'Singh', email: 'divya.singh@workzen.com', password: 'emp123', designation: 'Marketing Manager', dept: 'Marketing', role: 'MANAGER', status: 'ACTIVE', joining: '2021-09-01' },
    { firstName: 'Rohan', lastName: 'Gupta', email: 'rohan.gupta@workzen.com', password: 'emp123', designation: 'Content Strategist', dept: 'Marketing', role: 'EMPLOYEE', status: 'ACTIVE', joining: '2022-08-15' },
    { firstName: 'Meera', lastName: 'Krishnan', email: 'meera.krishnan@workzen.com', password: 'emp123', designation: 'Growth Analyst', dept: 'Marketing', role: 'EMPLOYEE', status: 'ACTIVE', joining: '2023-01-20' },
    { firstName: 'Aditya', lastName: 'Joshi', email: 'hr@workzen.com', password: 'admin123', designation: 'HR Manager', dept: 'Human Resources', role: 'HR', status: 'ACTIVE', joining: '2021-02-01' },
    { firstName: 'Pooja', lastName: 'Desai', email: 'pooja.desai@workzen.com', password: 'emp123', designation: 'HR Executive', dept: 'Human Resources', role: 'HR', status: 'ACTIVE', joining: '2022-05-10' },
  ];

  const empIds: string[] = [];
  for (let i = 0; i < employeeData.length; i++) {
    const emp = employeeData[i];
    const employeeId = `WZ${String(1001 + i).padStart(4, '0')}`;
    const deptId = deptIds[emp.dept];

    // Create Firebase Auth user
    const uid = await createFirebaseUser(emp.email, emp.password, `${emp.firstName} ${emp.lastName}`);

    // Create user doc in Firestore with bcrypt hash
    const passwordHash = await bcrypt.hash(emp.password, 10);
    const userSnap = await db.collection('users').where('email', '==', emp.email).limit(1).get();
    let userId: string;
    if (userSnap.empty) {
      await db.collection('users').doc(uid).set({
        email: emp.email, role: emp.role, firebaseUid: uid,
        passwordHash, createdAt: new Date().toISOString(),
      });
      userId = uid;
    } else {
      // Update passwordHash if missing
      const existing = userSnap.docs[0].data();
      if (!existing.passwordHash) {
        await userSnap.docs[0].ref.update({ passwordHash, firebaseUid: uid });
      }
      userId = userSnap.docs[0].id;
    }

    // Create employee doc
    const empSnap = await db.collection('employees').where('email', '==', emp.email).limit(1).get();
    let empId: string;
    if (empSnap.empty) {
      const ref = db.collection('employees').doc();
      await ref.set({
        employeeId, firstName: emp.firstName, lastName: emp.lastName, email: emp.email,
        phone: `+91 98${String(10000000 + i * 1234567).slice(0, 8)}`,
        designation: emp.designation, joiningDate: emp.joining,
        employmentStatus: emp.status, departmentId: deptId, departmentName: emp.dept,
        userId, createdAt: new Date().toISOString(),
      });
      empId = ref.id;
    } else {
      empId = empSnap.docs[0].id;
    }
    empIds.push(empId);
  }
  console.log('✅ Employees + Firebase Auth users seeded');

  // Attendance - last 7 working days
  const today = new Date();
  const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'ABSENT'];
  for (const empId of empIds) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      const dateStr = date.toISOString().split('T')[0];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const snap = await db.collection('attendance').where('employeeId', '==', empId).where('date', '==', dateStr).limit(1).get();
      if (snap.empty) {
        await db.collection('attendance').doc().set({
          employeeId: empId, date: dateStr, status,
          checkIn: status !== 'ABSENT' ? `${dateStr}T09:00:00.000Z` : null,
          checkOut: status !== 'ABSENT' ? `${dateStr}T18:00:00.000Z` : null,
          workingHours: status !== 'ABSENT' ? 9 : 0,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }
  console.log('✅ Attendance seeded');

  // Leave requests
  const leaveData = [
    { empIdx: 1, type: 'SICK', start: '2024-12-20', end: '2024-12-22', reason: 'Fever and cold', status: 'APPROVED' },
    { empIdx: 4, type: 'CASUAL', start: '2024-12-23', end: '2024-12-24', reason: 'Family function', status: 'PENDING' },
    { empIdx: 2, type: 'PAID', start: '2025-01-02', end: '2025-01-05', reason: 'Vacation', status: 'PENDING' },
    { empIdx: 6, type: 'CASUAL', start: '2024-12-26', end: '2024-12-26', reason: 'Personal work', status: 'APPROVED' },
  ];
  for (const l of leaveData) {
    await db.collection('leaveRequests').doc().set({
      employeeId: empIds[l.empIdx], leaveType: l.type,
      startDate: l.start, endDate: l.end, reason: l.reason, status: l.status,
      createdAt: new Date().toISOString(),
    });
  }
  console.log('✅ Leave requests seeded');

  // Performance reviews
  const perfData = [32, 28, 22, 25, 18, 30, 20, 24, 19, 21, 22, 18];
  const goalData = [[5,6],[4,5],[3,5],[5,6],[3,5],[5,6],[4,5],[4,6],[3,5],[3,5],[4,5],[4,5]];
  const ratings = [4.5, 4.2, 3.8, 4.7, 3.5, 4.7, 4.0, 4.0, 3.7, 3.9, 4.3, 4.1];
  for (let i = 0; i < empIds.length; i++) {
    const goalRate = goalData[i][0] / goalData[i][1];
    const score = parseFloat((goalRate * 40 + (ratings[i] / 5) * 40 + Math.min(perfData[i] / 30, 1) * 20).toFixed(1));
    await db.collection('performanceReviews').doc().set({
      employeeId: empIds[i], reviewPeriod: 'Q4 2024',
      tasksCompleted: perfData[i], goalsAchieved: goalData[i][0], totalGoals: goalData[i][1],
      managerRating: ratings[i], overallScore: score, comments: 'Good performance this quarter.',
      createdAt: new Date().toISOString(),
    });
  }
  console.log('✅ Performance reviews seeded');

  // Employee skills
  const skillAssignments = [[0,3,5,9],[0,3,1],[1,2,4],[0,1,3,4],[9,1,4],[8,6,7],[8,6],[6,7,5],[6,7],[6,7,2],[5,6,7],[5,6]];
  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
  for (let i = 0; i < empIds.length; i++) {
    for (const skillIdx of skillAssignments[i] || []) {
      if (skillIdx < skillIds.length) {
        const snap = await db.collection('employeeSkills').where('employeeId', '==', empIds[i]).where('skillId', '==', skillIds[skillIdx]).limit(1).get();
        if (snap.empty) {
          await db.collection('employeeSkills').doc().set({
            employeeId: empIds[i], skillId: skillIds[skillIdx],
            level: levels[Math.floor(Math.random() * levels.length)],
            createdAt: new Date().toISOString(),
          });
        }
      }
    }
  }
  console.log('✅ Employee skills seeded');

  // Workforce insights
  const insightSnap = await db.collection('workforceInsights').limit(1).get();
  if (insightSnap.empty) {
    await Promise.all([
      db.collection('workforceInsights').doc().set({ type: 'WORKLOAD_RISK', severity: 'HIGH', title: 'Engineering team overloaded', description: 'Engineering team has 40% more tasks than capacity this sprint.', employeeIds: [empIds[0], empIds[1]], isResolved: false, createdAt: new Date().toISOString() }),
      db.collection('workforceInsights').doc().set({ type: 'SKILL_GAP', severity: 'MEDIUM', title: 'Cloud skills gap in Engineering', description: 'Only 1 of 5 engineers has AWS expertise.', employeeIds: [], isResolved: false, createdAt: new Date().toISOString() }),
      db.collection('workforceInsights').doc().set({ type: 'ATTENDANCE_RISK', severity: 'MEDIUM', title: 'Attendance dip in Marketing', description: 'Marketing attendance dropped 15% this month.', employeeIds: [empIds[8]], isResolved: false, createdAt: new Date().toISOString() }),
      db.collection('workforceInsights').doc().set({ type: 'PERFORMANCE_OPPORTUNITY', severity: 'LOW', title: 'High performer ready for promotion', description: 'Ananya Reddy has scored above 90% for 3 consecutive quarters.', employeeIds: [empIds[5]], isResolved: false, createdAt: new Date().toISOString() }),
    ]);
  }
  console.log('✅ Workforce insights seeded');

  console.log('\n🎉 Firestore seed complete!');
  console.log('📧 admin@workzen.com / admin123');
  console.log('📧 hr@workzen.com / admin123');
  console.log('📧 priya.patel@workzen.com / emp123');
  process.exit(0);
}

main().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
