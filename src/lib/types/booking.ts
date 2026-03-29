export interface BookingRequest {
  full_name: string;
  phone: string;
  email: string;
  preferred_date: string;
  guests_count: number;
  message: string;
  service_id: string;
  service_title: string;
  service_type: "experience" | "destination";
  service_slug: string;
  source_page: string;
}

export interface BookingResult {
  success: boolean;
  error?: string;
}
