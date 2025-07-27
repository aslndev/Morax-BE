import FormData from 'form-data';
import fetch from 'node-fetch';

class UploadService {
  constructor() {
    this.apiUrl = process.env.ANONYMFILE_API_URL || 'https://anonymfile.com/api/v1/upload';
  }

  async uploadFile(fileBuffer, originalName, mimeType) {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: originalName,
        contentType: mimeType,
      });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('Anonymfile response:', JSON.stringify(result, null, 2));
      
      if (!result.status) {
        throw new Error('Upload failed');
      }

      if (!result.data || !result.data.file || !result.data.file.url || !result.data.file.metadata) {
        throw new Error('Invalid response structure from anonymfile.com');
      }

      return {
        success: true,
        fileUrl: result.data.file.url.full,
        shortUrl: result.data.file.url.short,
        fileName: result.data.file.metadata.name,
        fileSize: result.data.file.metadata.size.bytes,
        fileId: result.data.file.metadata.id,
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
}

export default new UploadService(); 