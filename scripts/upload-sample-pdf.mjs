import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length > 0) env[k.trim()] = v.join("=").trim();
});

const adminDb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Valid minimal PDF 1.4 binary content with readable text
function createSamplePdfBuffer() {
  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 215 >>
stream
BT
/F1 24 Tf
100 700 Td
(ApexBooks - Secure Digital Delivery) Tj
/F1 14 Tf
0 -40 Td
(Thank you for purchasing your official eBook.) Tj
0 -25 Td
(Licensed to verified customer. All rights reserved.) Tj
0 -25 Td
(Protected by cryptographic download token and tamper-evident logging.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000510 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
583
%%EOF`;

  return Buffer.from(pdfString, "utf-8");
}

async function uploadPdf() {
  const pdfBuffer = createSamplePdfBuffer();
  const filePath = "sample-apexbook.pdf";

  console.log("Uploading sample PDF to private 'ebooks' bucket...");
  const { data, error } = await adminDb.storage
    .from("ebooks")
    .upload(filePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    console.error("Failed to upload PDF:", error);
    process.exit(1);
  }

  console.log("Uploaded successfully:", data);

  // Update existing products with this storage_path if they have null
  const { error: updErr } = await adminDb
    .from("products")
    .update({ storage_path: filePath })
    .is("storage_path", null);

  if (updErr) {
    console.error("Failed to update products storage_path:", updErr);
  } else {
    console.log("Products storage_path updated to", filePath);
  }
}

uploadPdf();
