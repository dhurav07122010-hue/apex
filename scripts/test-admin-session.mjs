import { createAdminSession, verifyAdminSession } from "../src/lib/auth/adminSession.ts";

async function run() {
  const sess = await createAdminSession("admin@example.com");
  console.log("Token generated:", sess.token.slice(0, 30));
  const valid = await verifyAdminSession(sess.token);
  console.log("Valid check:", valid.valid, "Remaining ms:", valid.remainingMs);
  const tampered = await verifyAdminSession(sess.token + "xyz");
  console.log("Tampered check (should be false):", tampered.valid);
}
run();
