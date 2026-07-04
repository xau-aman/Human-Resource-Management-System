import type { AttendanceRecord } from '../types';

export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', employeeId: '1', employee: { id: '1', firstName: 'Arjun', lastName: 'Sharma', employeeId: 'WZ1001', department: { id: 'd1', name: 'Engineering' } }, date: '2024-12-20', checkIn: '09:02', checkOut: '18:15', workingHours: 9.2, status: 'PRESENT' },
  { id: 'a2', employeeId: '2', employee: { id: '2', firstName: 'Priya', lastName: 'Patel', employeeId: 'WZ1002', department: { id: 'd1', name: 'Engineering' } }, date: '2024-12-20', checkIn: '09:30', checkOut: '18:30', workingHours: 9.0, status: 'LATE' },
  { id: 'a3', employeeId: '3', employee: { id: '3', firstName: 'Rahul', lastName: 'Verma', employeeId: 'WZ1003', department: { id: 'd1', name: 'Engineering' } }, date: '2024-12-20', checkIn: '08:55', checkOut: '18:00', workingHours: 9.1, status: 'PRESENT' },
  { id: 'a4', employeeId: '4', employee: { id: '4', firstName: 'Sneha', lastName: 'Iyer', employeeId: 'WZ1004', department: { id: 'd1', name: 'Engineering' } }, date: '2024-12-20', checkIn: undefined, checkOut: undefined, workingHours: 0, status: 'ABSENT' },
  { id: 'a5', employeeId: '6', employee: { id: '6', firstName: 'Ananya', lastName: 'Reddy', employeeId: 'WZ1006', department: { id: 'd2', name: 'Design' } }, date: '2024-12-20', checkIn: '09:10', checkOut: '18:10', workingHours: 9.0, status: 'PRESENT' },
  { id: 'a6', employeeId: '7', employee: { id: '7', firstName: 'Karan', lastName: 'Mehta', employeeId: 'WZ1007', department: { id: 'd2', name: 'Design' } }, date: '2024-12-20', checkIn: '09:00', checkOut: '18:00', workingHours: 9.0, status: 'PRESENT' },
  { id: 'a7', employeeId: '8', employee: { id: '8', firstName: 'Divya', lastName: 'Singh', employeeId: 'WZ1008', department: { id: 'd3', name: 'Marketing' } }, date: '2024-12-20', checkIn: '09:45', checkOut: '18:45', workingHours: 9.0, status: 'LATE' },
  { id: 'a8', employeeId: '11', employee: { id: '11', firstName: 'Aditya', lastName: 'Joshi', employeeId: 'WZ1011', department: { id: 'd4', name: 'Human Resources' } }, date: '2024-12-20', checkIn: '09:00', checkOut: '18:00', workingHours: 9.0, status: 'PRESENT' },
];
