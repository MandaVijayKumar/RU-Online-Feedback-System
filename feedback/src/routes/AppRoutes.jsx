import { Routes, Route } from 'react-router-dom'

// Common
import Home from '../components/common/Home'
import AdminDashboard from '../components/admin/AdminDashboard'


// Student
import StudentLogin from '../components/student/StudentLogin'
import OtpVerify from '../components/student/OtpVerify'
import FeedbackForm from '../components/student/FeedbackForm'
import ExcelUpload from '../components/admin/ExcelUpload'
import ManageStudents from '../components/admin/ManageStudents'
import ManageFaculty from '../components/admin/ManageFaculty'
import FacultyAnalytics from '../components/admin/FacultyAnalytics'
import Reports from '../components/admin/Reports'
import FacultyPerformance from '../components/admin/FacultyPerformance'
import DepartmentAnalytics from '../components/admin/DepartmentAnalytics'
import DepartmentFacultyAnalytics from '../components/admin/DepartmentFacultyAnalytics'

import FacultyDetailedAnalytics from '../components/admin/FacultyDetailedAnalytics'


// Admin
import AdminLogin from '../components/admin/AdminLogin'

export default function AppRoutes() {
    return (
        <Routes>
            {/* Common */}
            <Route path="/" element={<Home />} />

            {/* Student Flow */}
            <Route path="/student" element={<StudentLogin />} />
            <Route path="/otp" element={<OtpVerify />} />
            <Route path="/feedback" element={<FeedbackForm />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/upload" element={<ExcelUpload />} />


            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/faculty" element={<ManageFaculty />} />
            {/* <Route path="/admin/analytics" element={<FacultyAnalytics />} /> */}
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/faculty/:facultyId" element={<FacultyPerformance />} />
            <Route path="/admin/analytics" element={<DepartmentAnalytics />} />

            <Route
                path="/admin/analytics/department/:department"
                element={<DepartmentFacultyAnalytics />}
            />
            <Route
                path="/admin/analytics/faculty/:facultyId"
                element={<FacultyDetailedAnalytics />}
            />

        </Routes>
    )
}
