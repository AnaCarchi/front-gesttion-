export interface DocumentFile {
  id: number;

  trainingAssignmentId: number;

  name: string;

  /**
   * Identificador de plantilla:
   * - VINC_01
   * - DUAL_02
   * etc.
   */
  templateKey: string;

  /**
   * Ruta local / base64 / nombre en storage
   */
  filePath: string;

  uploadedAt: Date;
}
