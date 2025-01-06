/**
 * @fileOverview Main content area component that contains the calendar and stats bar
 *
 * This component handles the layout and display of the main application content,
 * including the calendar view and statistics bar. It manages overflow behavior
 * and responsive spacing.
 */

import { Calendar } from "@/components/calendar";
import { StatsBar } from "@/components/StatsBar";
import { LoadingErrorHandler } from "@/components/LoadingErrorHandler";
import { WorkOrderEvent } from "@/types/workorder";

interface MainContentProps {
  isLoading: boolean;
  error: Error | null;
  events: WorkOrderEvent[];
  onEventSelect: (event: WorkOrderEvent | null) => void;
  updateTrigger: number;
}

/**
 * MainContent component that renders the calendar and stats bar
 *
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.isLoading - Loading state for the calendar data
 * @param {Error | null} props.error - Error state if data fetching fails
 * @param {WorkOrderEvent[]} props.events - Array of work order events to display
 * @param {Function} props.onEventSelect - Callback function when an event is selected
 * @param {number} props.updateTrigger - Trigger value to force StatsBar updates
 *
 * @returns {React.ReactElement} The main content area with calendar and stats
 */
export function MainContent({
  isLoading,
  error,
  events,
  onEventSelect,
  updateTrigger,
}: MainContentProps): React.ReactElement {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 p-4 overflow-x-auto overflow-y-hidden mt-14 lg:mt-0">
          <LoadingErrorHandler isLoading={isLoading} error={error}>
            <Calendar onEventSelect={onEventSelect} events={events} />
          </LoadingErrorHandler>
        </div>
        <StatsBar trigger={updateTrigger} />
      </main>
    </div>
  );
}
