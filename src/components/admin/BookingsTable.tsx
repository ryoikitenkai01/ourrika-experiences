"use client";

import React, { useState } from "react";
import { updateBookingStatus, BookingLead } from "@/app/actions/admin-bookings";
import { Check, X, Building, Map, ShoppingBag, Eye, User, Phone, Mail, Calendar, Users, MessageSquare } from "lucide-react";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

interface BookingsTableProps {
  bookings: BookingLead[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const [localBookings, setLocalBookings] = useState(bookings);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statuses = ["new", "contacted", "confirmed", "closed"] as const;

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const result = await updateBookingStatus(id, newStatus);
    if (result.success) {
      setLocalBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } else {
      alert("Failed to update status");
    }
    setUpdatingId(null);
  };

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-500",
    contacted: "bg-yellow-500/10 text-yellow-500",
    confirmed: "bg-green-500/10 text-green-500",
    closed: "bg-gray-500/10 text-gray-500",
  };

  const getServiceTypeIcon = (type: string | null) => {
    switch (type) {
      case "experience":
        return <Building size={14} className="text-[var(--color-admin-accent)] shrink-0" />;
      case "destination":
        return <Map size={14} className="text-[#a8a29e] shrink-0" />;
      case "offer":
        return <ShoppingBag size={14} className="text-[#fbbf24] shrink-0" />;
      default:
        return <Building size={14} className="text-gray-500 shrink-0" />;
    }
  };

  return (
    <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm text-[var(--color-admin-text)]">
          <thead className="bg-[#1a1a1a] text-[10px] tracking-widest uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4 font-normal">Contact</th>
              <th className="px-6 py-4 font-normal hidden md:table-cell">Service</th>
              <th className="px-6 py-4 font-normal hidden lg:table-cell">Request Details</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal hidden xl:table-cell">Date</th>
              <th className="px-6 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-admin-border)]">
            {localBookings.map((booking) => (
              <React.Fragment key={booking.id}>
                <tr className="hover:bg-[#1a1a1a] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white mb-1">{booking.full_name}</div>
                    {(booking.email || booking.phone) && (
                      <div className="text-xs text-gray-400">
                        {booking.email && <div>{booking.email}</div>}
                        {booking.phone && <div>{booking.phone}</div>}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      {getServiceTypeIcon(booking.service_type)}
                      <span className="truncate max-w-[200px]" title={booking.service_title || ""}>
                        {booking.service_title || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="text-xs text-gray-400">
                      {booking.preferred_date ? (
                        <div>On {formatDate(booking.preferred_date)}</div>
                      ) : (
                        <div>No date given</div>
                      )}
                      <div>{booking.guests_count} guest{booking.guests_count !== 1 ? 's' : ''}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      disabled={updatingId === booking.id}
                      className={`text-xs px-2.5 py-1 uppercase tracking-wider rounded-sm outline-none cursor-pointer transition-opacity ${
                        updatingId === booking.id ? "opacity-50" : ""
                      } ${statusColors[booking.status] || statusColors.new}`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s} className="bg-black text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell text-gray-500 text-xs">
                    {formatDate(booking.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
                {/* Expandable Details Row */}
                {expandedId === booking.id && (
                  <tr className="bg-[#141414]">
                    <td colSpan={6} className="px-6 py-6 border-t border-[var(--color-admin-border)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Contact info block */}
                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-800 pb-2">
                            Contact
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                              <User size={16} className="text-gray-400 mt-0.5" />
                              <div className="text-white">{booking.full_name}</div>
                            </div>
                            {booking.phone && (
                              <div className="flex items-start gap-3 text-sm">
                                <Phone size={16} className="text-gray-400 mt-0.5" />
                                <a href={`tel:${booking.phone}`} className="text-blue-400 hover:text-blue-300">
                                  {booking.phone}
                                </a>
                              </div>
                            )}
                            {booking.email && (
                              <div className="flex items-start gap-3 text-sm">
                                <Mail size={16} className="text-gray-400 mt-0.5" />
                                <a href={`mailto:${booking.email}`} className="text-blue-400 hover:text-blue-300">
                                  {booking.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Request block */}
                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-800 pb-2">
                            Request
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm text-gray-300">
                              <Calendar size={16} className="text-gray-400 mt-0.5" />
                              <div>
                                {booking.preferred_date
                                  ? formatDate(booking.preferred_date)
                                  : "Flexible / Not specified"}
                              </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-gray-300">
                              <Users size={16} className="text-gray-400 mt-0.5" />
                              <div>
                                {booking.guests_count} guest{booking.guests_count !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-gray-300">
                              {getServiceTypeIcon(booking.service_type)}
                              <div>
                                <span className="capitalize">{booking.service_type}: </span>
                                {booking.service_title || "Unknown"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Message block */}
                        <div className="lg:col-span-1 border-l border-gray-800 pl-8">
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-800 pb-2 flex gap-2 items-center">
                            <MessageSquare size={12} />
                            Message
                          </h4>
                          <div className="text-sm text-gray-300 whitespace-pre-wrap">
                            {booking.message || <span className="text-gray-600 italic">No message provided.</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {localBookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
