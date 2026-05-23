import { getSupabaseAdmin } from "./supabase.js";

async function insertRow(table, row) {
  const { error } = await getSupabaseAdmin().from(table).insert(row);

  if (error) {
    throw new Error(`Supabase insert into ${table} failed: ${error.message}`);
  }
}

export async function insertChurchMember(member) {
  await insertRow("church_members", {
    full_name: member.fullName,
    email: member.email,
    country: member.country,
    loyalty_message: member.loyaltyMessage
  });
}

export async function insertCitizenComplaint(complaint) {
  await insertRow("citizen_complaints", {
    full_name: complaint.fullName,
    email: complaint.email,
    location: complaint.location,
    complaint_description: complaint.complaintDescription
  });
}

