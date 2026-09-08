// File Upload Service
// Handles file uploads and storage

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

class FileService {
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
  private readonly ALLOWED_PDF_TYPES = ['application/pdf'];
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  // Validate file before upload
  validateFile(file: File, type: 'video' | 'pdf' | 'image'): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `حجم الملف كبير جداً. الحد الأقصى هو ${this.MAX_FILE_SIZE / 1024 / 1024} ميجابايت`,
      };
    }

    // Check file type
    const allowedTypes =
      type === 'video'
        ? this.ALLOWED_VIDEO_TYPES
        : type === 'pdf'
        ? this.ALLOWED_PDF_TYPES
        : this.ALLOWED_IMAGE_TYPES;

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `نوع الملف غير مدعوم. الأنواع المسموحة: ${allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  // Upload file and return URL
  async uploadFile(file: File): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const uploadedFile: UploadedFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: reader.result as string,
          uploadedAt: new Date().toISOString(),
        };

        // Store in localStorage
        const files = JSON.parse(localStorage.getItem('edu_platform_files') || '[]');
        files.push(uploadedFile);
        localStorage.setItem('edu_platform_files', JSON.stringify(files));

        resolve(uploadedFile);
      };

      reader.onerror = () => {
        reject(new Error('فشل في قراءة الملف'));
      };

      reader.readAsDataURL(file);
    });
  }

  // Get file by ID
  getFile(fileId: string): UploadedFile | null {
    const files = JSON.parse(localStorage.getItem('edu_platform_files') || '[]');
    return files.find((f: UploadedFile) => f.id === fileId) || null;
  }

  // Delete file
  deleteFile(fileId: string): void {
    const files = JSON.parse(localStorage.getItem('edu_platform_files') || '[]');
    const filtered = files.filter((f: UploadedFile) => f.id !== fileId);
    localStorage.setItem('edu_platform_files', JSON.stringify(filtered));
  }

  // Get all files
  getAllFiles(): UploadedFile[] {
    return JSON.parse(localStorage.getItem('edu_platform_files') || '[]');
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Get file extension
  getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  // Check if file is video
  isVideo(file: File): boolean {
    return this.ALLOWED_VIDEO_TYPES.includes(file.type);
  }

  // Check if file is PDF
  isPDF(file: File): boolean {
    return this.ALLOWED_PDF_TYPES.includes(file.type);
  }

  // Check if file is image
  isImage(file: File): boolean {
    return this.ALLOWED_IMAGE_TYPES.includes(file.type);
  }
}

export const fileService = new FileService();
