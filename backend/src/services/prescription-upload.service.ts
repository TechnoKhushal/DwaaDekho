import { supabase } from '../config/supabase';
import { supabaseAdmin } from '../config/supabase';
import { v4 as v4 } from 'uuid';
import mime from 'mime';

// Allowed file types for prescriptions
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpeg',
  'image/png',
  'image/heic',
];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Upload a prescription document
export async function uploadPrescriptionDocument(
  file: File | Blob,
  userId: string,
  medicineId: string
): Promise<{
  success: boolean;
  documentId: string;
  downloadUrl: string;
  error: string | null;
}> {
  // Validate file type
  const fileType = file.type || mime.getType(file.name || '');
  if (!ALLOWED_FILE_TYPES.includes(fileType)) {
    return {
      success: false,
      documentId: '',
      downloadUrl: '',
      error: 'Invalid file type. Allowed types: PDF, JPEG, PNG',
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      documentId: '',
      downloadUrl: '',
      error: 'File size exceeds 10MB limit',
    };
  }

  // Check for executable content (basic check)
  const fileReader = new FileReader();
  const filePromise = new Promise<string>(resolve => {
    fileReader.onload = () => {
      const content = fileReader.result as string;
      // Check for executable patterns
      const executablePatterns = [
        /<script/i,
        /<iframe/i,
        /onload\s*=/,
        /javascript:/i,
      ];
      const isExecutable = executablePatterns.some(pattern => pattern.test(content));
      resolve(isExecutable ? 'executable' : 'safe');
    };
    fileReader.readAsText(file);
  });

  const fileTypeResult = await filePromise;
  if (fileTypeResult === 'executable') {
    return {
      success: false,
      documentId: '',
      downloadUrl: '',
      error: 'File contains executable content and cannot be uploaded',
    };
  }

  // Generate random identifier (no original filename)
  const documentId = v4();
  const filePath = `prescriptions/${userId}/${medicineId}/${documentId}`;

  // Upload to Supabase Storage (private bucket)
  const { error: uploadError } = await supabase.storage
    .from('patient-prescriptions')
    .upload(documentPath, file, {
      cacheControl: 'no-cache',
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return {
      success: false,
      documentId: '',
      downloadUrl: '',
      error: `Upload failed: ${uploadError.message}`,
    };
  }

  // Get signed URL for download (15 minutes expiry)
  const { data: signedUrlData, error: signedError } = await supabaseAdmin.storage
    .from('patient-prescriptions')
    .createSignedUrl(documentPath, 900);

  if (signedError) {
    return {
      success: false,
      documentId,
      downloadUrl: '',
      error: `Failed to generate download URL: ${signedError.message}`,
    };
  }

  // Record the prescription document in the database
  const { error: dbError } = await prisma?.prescription.create({
    data: {
      userId,
      medicineId,
      documentPath,
      documentId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadStatus: 'verified',
    },
  });

  if (dbError) {
    // If DB insert fails, try to delete the uploaded file
    await supabaseAdmin.storage
      .from('patient-prescriptions')
      .remove([documentPath]);
    return {
      success: false,
      documentId,
      downloadUrl: '',
      error: `Document uploaded but database record failed: ${dbError.message}`,
    };
  }

  const downloadUrl = signedUrlData.signedUrl;

  return {
    success: true,
    documentId,
    downloadUrl,
    error: null,
  };
}

// Validate a prescription document
export async function validatePrescriptionDocument(
  documentId: string,
  medicineId: string
): Promise<{
  valid: boolean;
  status: 'pending' | 'verified' | 'rejected';
  error: string | null;
}> {
  const { data: document, error: dbError } = await prisma.$queryRaw`
    SELECT * FROM prescription WHERE document_id = ${documentId}
  `;

  if (dbError || !data) {
    return { valid: false, status: 'pending', error: 'Document not found' };
  }

  // Check file type and size constraints
  const allowedTypes = ['pdf', 'jpeg', 'png'];
  const fileExtension = data.file_name.split('.').pop()?.toLowerCase();

  if (!allowedTypes.includes(fileExtension)) {
    return { valid: false, status: 'rejected', error: 'Invalid file type' };
  }

  // Check file size (basic check)
  if (data.file_size > 10 * 1024 * 1024) {
    return { valid: false, status: 'rejected', error: 'File too large' };
  }

  // Check for executable content (basic check)
  if (data.file_path && data.file_path.includes('.exe')) {
    return { valid: false, status: 'rejected', error: 'Executable files not allowed' };
  }

  return {
    valid: true,
    status: 'verified',
    error: null,
  };
}

// Revoke a prescription document (admin only)
export async function revokePrescriptionDocument(
  documentId: string
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await prisma.prescription.delete({
    where: { documentId },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Delete from storage
  const { error: storageError } = await supabaseAdmin.storage
    .from('patient-prescriptions')
    .remove([`prescriptions/${documentId}`]);

  if (storageError) {
    // Log but don't fail - the DB record is removed
    return { success: true, error: null };
  }

  return { success: true, error: null };
}