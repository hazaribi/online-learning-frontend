# Online Learning Platform - User Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Modern web browser
- Internet connection

### Installation & Setup
1. **Backend Setup:**
   ```bash
   cd "Online Learning Platform Backend"
   npm install
   cp .env.example .env
   # Configure your .env file with Supabase credentials
   npm run dev
   ```

2. **Frontend Setup:**
   ```bash
   cd "online-learning-frontend"
   npm install
   npm start
   ```

3. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 👤 User Roles & Features

### 🎓 Student Features
- **Account Management:**
  - Sign up with email/password
  - Login/logout functionality
  - View profile information

- **Course Discovery:**
  - Browse all published courses
  - View course details and curriculum
  - See instructor information and pricing

- **Learning Experience:**
  - Enroll in free courses instantly
  - Purchase paid courses via Stripe
  - Watch video lessons
  - Take quizzes and get scores
  - Track learning progress
  - Access course materials after enrollment

### 👨🏫 Instructor Features
- **Course Management:**
  - Create new courses with details
  - Upload course thumbnails
  - Set pricing (free or paid)
  - Manage course status (draft/published)

- **Instructor Dashboard:**
  - View course statistics
  - Edit course information
  - Delete courses
  - Publish/unpublish courses
  - Monitor course performance

- **Content Creation:**
  - Add lessons to courses
  - Create quizzes with multiple choice questions
  - Set lesson order and duration

### 🔧 Admin Features
- **Platform Management:**
  - View platform statistics
  - Monitor all users and courses
  - Access revenue analytics
  - Manage user roles

---

## 📱 User Interface Guide

### Navigation
- **Header Navigation:**
  - Logo: Returns to homepage
  - Courses: Browse all courses
  - Dashboard: Role-specific dashboard
  - Create Course: (Instructors only)
  - Admin: (Admins only)
  - Profile: User information
  - Logout: Sign out

### Course Pages
- **Course List:**
  - Grid layout with course cards
  - Shows title, description, price, instructor
  - Click "View Course" for details

- **Course Details:**
  - Complete course information
  - Lesson list with duration
  - Enrollment/payment section
  - Video player for enrolled users
  - Quiz access after enrollment

### Dashboards
- **Instructor Dashboard:**
  - Course statistics cards
  - Course management table
  - Edit/delete/publish actions
  - Create new course button

- **Admin Dashboard:**
  - Platform-wide statistics
  - User management table
  - Course analytics
  - Revenue tracking

---

## 🔐 Authentication Flow

### Sign Up Process
1. Click "Sign Up" in navigation
2. Fill in name, email, password
3. Select role (Student/Instructor)
4. Submit form
5. Automatic login with JWT token

### Login Process
1. Click "Login" in navigation
2. Enter email and password
3. Submit credentials
4. Receive JWT token
5. Redirect to dashboard

### Role-Based Access
- **Public:** Course browsing, signup, login
- **Students:** Enrollment, learning materials, progress
- **Instructors:** Course creation, management, analytics
- **Admins:** Full platform access, user management

---

## 💳 Payment & Enrollment

### Free Courses
1. Navigate to course details
2. Click "Enroll Now - Free"
3. Instant access to all materials

### Paid Courses
1. Navigate to course details
2. Click "Buy Now" in payment section
3. Redirect to Stripe checkout
4. Complete payment
5. Automatic enrollment and access

### Enrollment Benefits
- Access to all course lessons
- Video streaming capabilities
- Quiz participation
- Progress tracking
- Certificate eligibility (future feature)

---

## 🎯 Learning Experience

### Video Lessons
- **Features:**
  - HTML5 video player
  - Progress tracking
  - Play/pause controls
  - Duration display
  - Automatic progress saving

### Quizzes
- **Format:**
  - Multiple choice questions
  - Immediate scoring
  - Pass/fail results
  - Retake capability

### Progress Tracking
- **Metrics:**
  - Overall course completion percentage
  - Individual lesson progress
  - Time spent watching
  - Quiz scores and attempts

---

## 🛠 Technical Features

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API endpoints
- CORS configuration

### Performance
- Responsive design for all devices
- Optimized API calls
- Lazy loading components
- Efficient state management

### Integration
- Supabase database
- Stripe payment processing
- Material-UI components
- React Router navigation

---

## 🐛 Troubleshooting

### Common Issues
1. **Login Problems:**
   - Check email/password accuracy
   - Ensure account exists
   - Clear browser cache

2. **Course Access:**
   - Verify enrollment status
   - Check payment completion
   - Refresh page

3. **Video Playback:**
   - Check internet connection
   - Try different browser
   - Ensure video URL is valid

### Support
- Check browser console for errors
- Verify backend server is running
- Ensure database connection is active
- Contact system administrator

---

## 🚀 Future Enhancements
- Certificate generation
- Discussion forums
- Live streaming
- Mobile app
- Advanced analytics
- Multi-language support