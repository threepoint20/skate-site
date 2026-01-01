# Blog Cover Image Feature

## Overview
The blog system now supports cover image uploads for articles. Users with administrator permissions can upload cover images when creating or editing blog posts.

## Features
- **Drag & Drop Upload**: Users can drag image files directly onto the upload area
- **Click to Upload**: Traditional file picker interface
- **Image Preview**: Real-time preview of uploaded images
- **Security**: Only administrators can upload images
- **File Validation**: Supports JPG, PNG, WebP, GIF formats up to 5MB
- **Safe File Names**: Automatically generates secure file names with timestamps

## File Storage
- Images are stored in `public/images/blog/` directory
- File naming format: `blog-cover-{timestamp}-{random}.{extension}`
- Images are accessible via `/images/blog/{filename}` URLs

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
- Unused images remain in the file system (manual cleanup may be needed)

## Technical Implementation
- **Upload API**: `/api/upload/image` handles file uploads with security validation
- **Component**: `ImageUpload.tsx` provides the upload interface
- **Database**: `coverImage` field stores the image URL path
- **Security**: Rate limiting, file type validation, and admin-only access

## Security Features
- Admin authentication required for uploads
- File type whitelist (images only)
- File size limits (5MB maximum)
- Rate limiting to prevent abuse
- Secure file naming to prevent conflicts
- Input validation and sanitization