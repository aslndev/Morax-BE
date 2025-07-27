# Morax Backend API

Backend API untuk platform pembelajaran Morax yang dibangun dengan Node.js, Express, dan SQLite.

## 🏗️ Struktur Proyek

```
morax-be/
├── src/
│   ├── config/           # Konfigurasi aplikasi
│   │   ├── database.js   # Konfigurasi database
│   │   └── upload.js     # Konfigurasi file upload
│   ├── controllers/      # Controller untuk handling request
│   │   ├── AuthController.js
│   │   ├── CourseController.js
│   │   ├── ProfileController.js
│   │   ├── UploadController.js
│   │   ├── CourseMaterialController.js
│   │   ├── CommentController.js
│   │   ├── NotificationController.js
│   │   └── AdminController.js
│   ├── database/         # Database initialization
│   │   └── init.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # Authentication middleware
│   │   └── profile.js    # Profile loading middleware
│   ├── models/           # Data models
│   │   ├── Course.js
│   │   ├── Profile.js
│   │   ├── User.js
│   │   ├── CourseMaterial.js
│   │   ├── Comment.js
│   │   └── Notification.js
│   ├── routes/           # Route definitions
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── profile.js
│   │   ├── upload.js
│   │   ├── materials.js
│   │   ├── comments.js
│   │   ├── notifications.js
│   │   └── admin.js
│   ├── services/         # Business logic services
│   │   ├── AuthService.js
│   │   └── UploadService.js
│   └── app.js           # Main application file
├── .env                 # Environment variables (create from env.example)
├── env.example          # Environment variables template
├── package.json
├── README.md
└── morax.db            # SQLite database file
```

## 🚀 Fitur

- **Authentication & Authorization**: JWT-based authentication dengan role-based access control
- **User Management**: Registrasi, login, dan manajemen profil user
- **Course Management**: CRUD operations untuk kursus dengan approval system
- **Course Materials**: Manajemen materi kursus (PDF, PPT, YouTube, dll)
- **Comments System**: Sistem komentar untuk kursus
- **Notifications**: Sistem notifikasi untuk user
- **Admin Dashboard**: Dashboard admin dengan statistik dan manajemen user
- **File Upload**: Upload file menggunakan AnonymFile service
- **Database**: SQLite dengan foreign key constraints
- **Clean Architecture**: Separation of concerns dengan MVC pattern

## 🛠️ Teknologi

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite dengan better-sqlite3
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: multer + AnonymFile API
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm atau yarn

## 🔧 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd morax-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit file `.env` sesuai kebutuhan:
   ```env
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-secret-key-change-this-in-production
   DB_PATH=morax.db
   MAX_FILE_SIZE=52428800
   MAX_THUMBNAIL_SIZE=5242880
   ANONYMFILE_API_URL=https://anonymfile.com/api/v1/upload
   ```

4. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `PUT /api/auth/password` - Change password (protected)

### Profile
- `GET /api/profile` - Get user profile (protected)
- `PUT /api/profile` - Update user profile (protected)

### Courses
- `GET /api/courses` - Get all courses (public)
- `GET /api/courses/:id` - Get course by ID (public)
- `POST /api/courses` - Create new course (protected)
- `PUT /api/courses/:id` - Update course (protected)
- `DELETE /api/courses/:id` - Delete course (protected)
- `PUT /api/courses/:id/status` - Update course status (admin only)

### Course Materials
- `GET /api/courses/:courseId/materials` - Get materials by course ID (public)
- `POST /api/courses/:courseId/materials` - Add material to course (protected)
- `PUT /api/courses/:courseId/materials/:materialId` - Update material (protected)
- `DELETE /api/courses/:courseId/materials/:materialId` - Delete material (protected)

### Comments
- `GET /api/courses/:courseId/comments` - Get comments by course ID (public)
- `POST /api/courses/:courseId/comments` - Add comment to course (protected)
- `PUT /api/courses/:courseId/comments/:commentId` - Update comment (protected)
- `DELETE /api/courses/:courseId/comments/:commentId` - Delete comment (protected)

### Notifications
- `GET /api/notifications` - Get user notifications (protected)
- `PUT /api/notifications/:id/read` - Mark notification as read (protected)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

### File Upload
- `POST /api/upload` - Upload file (protected)

### Health Check
- `GET /health` - Health check endpoint

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk authentication. Token harus disertakan dalam header `Authorization` dengan format:

```
Authorization: Bearer <token>
```

## 👥 User Roles

- **admin**: Akses penuh ke semua fitur
- **teacher**: Dapat membuat dan mengelola kursus
- **student**: Dapat mengakses kursus yang disetujui
- **guest**: Akses terbatas

## 🗄️ Database Schema

### Users Table
- `id` (TEXT, PRIMARY KEY)
- `email` (TEXT, UNIQUE)
- `password_hash` (TEXT)
- `created_at` (TEXT)
- `updated_at` (TEXT)

### Profiles Table
- `id` (TEXT, PRIMARY KEY, FOREIGN KEY to users.id)
- `email` (TEXT, UNIQUE)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `role` (TEXT, CHECK: admin/teacher/student/guest)
- `created_at` (TEXT)
- `updated_at` (TEXT)

### Courses Table
- `id` (TEXT, PRIMARY KEY)
- `title` (TEXT)
- `description` (TEXT)
- `content` (TEXT)
- `thumbnail_url` (TEXT)
- `status` (TEXT, CHECK: draft/pending/approved/rejected)
- `category` (TEXT)
- `author_id` (TEXT, FOREIGN KEY to profiles.id)
- `created_at` (TEXT)
- `updated_at` (TEXT)
- `approved_at` (TEXT)
- `approved_by` (TEXT, FOREIGN KEY to profiles.id)

### Course Materials Table
- `id` (TEXT, PRIMARY KEY)
- `course_id` (TEXT, FOREIGN KEY to courses.id)
- `title` (TEXT)
- `type` (TEXT, CHECK: pdf/ppt/docx/youtube/image/audio)
- `file_url` (TEXT)
- `youtube_url` (TEXT)
- `youtube_embed_id` (TEXT)
- `audio_url` (TEXT)
- `file_size` (INTEGER)
- `created_at` (TEXT)
- `updated_at` (TEXT)

### Comments Table
- `id` (TEXT, PRIMARY KEY)
- `course_id` (TEXT, FOREIGN KEY to courses.id)
- `user_id` (TEXT, FOREIGN KEY to profiles.id)
- `parent_id` (TEXT, FOREIGN KEY to comments.id)
- `content` (TEXT)
- `likes` (INTEGER, DEFAULT 0)
- `dislikes` (INTEGER, DEFAULT 0)
- `created_at` (TEXT)
- `updated_at` (TEXT)

### Comment Reactions Table
- `id` (TEXT, PRIMARY KEY)
- `comment_id` (TEXT, FOREIGN KEY to comments.id)
- `user_id` (TEXT, FOREIGN KEY to profiles.id)
- `reaction_type` (TEXT, CHECK: like/dislike)
- `created_at` (TEXT)

### Notifications Table
- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY to profiles.id)
- `type` (TEXT)
- `title` (TEXT)
- `message` (TEXT)
- `read` (BOOLEAN, DEFAULT FALSE)
- `created_at` (TEXT)

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

- `npm start` - Run in production mode
- `npm run dev` - Run in development mode with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🔧 Development

### Code Structure
Proyek ini mengikuti clean architecture principles:

1. **Controllers**: Handle HTTP requests dan responses
2. **Services**: Business logic
3. **Models**: Data access layer
4. **Routes**: Route definitions
5. **Middleware**: Custom middleware functions
6. **Config**: Configuration files

### Adding New Features
1. Create model di `src/models/`
2. Create service di `src/services/`
3. Create controller di `src/controllers/`
4. Create routes di `src/routes/`
5. Register routes di `src/app.js`

## 🚨 Error Handling

API menggunakan centralized error handling dengan format response:

```json
{
  "error": "Error message",
  "details": "Additional details (in development)"
}
```

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request 