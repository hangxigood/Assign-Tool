export {}  // Mark this file as a module

/**
 * @fileoverview Type definitions for dashboard statistics
 */

/**
 * Represents the dashboard statistics data structure
 */
export interface Stats {
  /** Truck allocation statistics */
  trucks: {
    /** Total number of trucks in fleet */
    total: number;
    /** Number of trucks currently assigned to work orders */
    assigned: number;
    /** Number of trucks available for assignment */
    available: number;
  };
  /** Technician allocation statistics */
  technicians: {
    /** Total number of technicians */
    total: number;
    /** Number of technicians currently assigned to work orders */
    assigned: number;
    /** Number of technicians available for assignment */
    available: number;
  };
  /** Total hours worked today across all technicians */
  hoursWorked: number;
}
