// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\services\auditService.ts

import { ActivityLog } from '../types.js';

export const createAuditEntry = (
  message: string, 
  type: ActivityLog['type'], 
  priority: ActivityLog['priority'] = 'low',
  userId?: string
): ActivityLog => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    message,
    timestamp: new Date(),
    type,
    priority,
    userId
  };
};
