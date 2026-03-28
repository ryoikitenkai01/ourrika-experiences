/**
 * BookingModal — thin re-export shim.
 *
 * The implementation now lives in BookingPanel.tsx.
 * All existing callers (ExperienceBookingClient, DestinationBookingClient,
 * OfferBookingClient) import `BookingModal` by name — this keeps them working
 * without touching any of those files.
 */
export { BookingPanel as BookingModal } from "@/components/ui/BookingPanel";
export type { BookingPanelProps as BookingModalProps } from "@/components/ui/BookingPanel";
