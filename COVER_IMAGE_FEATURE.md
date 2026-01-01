# Blog Cover Image Feature

## Overview
The blog system now supports cover image uploads for articles. Users with administrator permissions can upload cover images when creating or editing blog posts. The system automatically uses cloud storage (Vercel Blob) in production and local file system in development.

## Features
- **Drag & Drop Upload**: Users can drag image files directly onto the upload area
- **Click to Upload**: Traditional file picker interface
- **Image Preview**: Real-time preview of uploaded images
- **Security**: Only administrators can upload images
- **File Validation**: Supports JPG, PNG, WebP, GIF formats up to 5MB
- **Safe File Names**: Automatically generates secure file names with timestamps
- **Cloud Storage**: Uses Vercel Blob in production, local files in development
- **Automatic Environment Detection**: Seamlessly switches between storage methods

## File Storage

### Development Environment
- Images are stored in `public/images/blog/` directory
- File naming format: `blog-cover-{timestamp}-{random}.{extension}`
- Images are accessible via `/images/blog/{filename}` URLs

### Production Environment (Vercel)
- Images are stored in Vercel Blob cloud storage
- Automatic CDN distribution for fast loading
- Secure public URLs generated automatically
- No file system limitations

## Environment Setup

### Development
No additional setup required - uses local file system automatically.

### Production (Vercel)
1. Vercel Blob is automatically configured in production
2. No manual token setup needed for basic usage
3. Images are automatically served via Vercel's CDN

### Manual Blob Configuration (Optional)
If you need custom Blob configuration, add to your environment variables:
```
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

## Usage

### Creating New Posts
1. Navigate to `/blog/new`
2. Fill in the article details
3. Use the "封面圖片" (Cover Image) section to upload an image
4. Drag & drop or click to select an image file
5. Preview the image and remove if needed
6. Publish the article

### Displaying Cover Images
- **Blog Listing**: Cover images appear as thumbnails in the blog grid
- **Individual Posts**: Cover images display prominently below the post header
- **Fallback**: Posts without cover images show a skateboard emoji placeholder

### Image Management
- Cover images can be removed during editing
- New images replace existing ones
- Cloud storage handles cleanup automatically in production

## Technical Implementation
- **Upload API**: `/api/upload/image` handles file uploads with security validation
- **Component**: `ImageUpload.tsx` provides the upload interface
- **Database**: `coverImage` field stores the image URL path
- **Security**: Rate limiting, file type validation, and admin-only access
- **Storage Adapter**: Automatically detects environment and uses appropriate storage

## Security Features
- Admin authentication required for uploads
- File type whitelist (images only)
- File size limits (5MB maximum)
- Rate limiting to prevent abuse
- Secure file naming to prevent conflicts
- Input validation and sanitization

## Error Handling
- Graceful fallback between storage methods
- Clear error messages for users
- Automatic retry logic for cloud uploads
- Comprehensive logging for debugging