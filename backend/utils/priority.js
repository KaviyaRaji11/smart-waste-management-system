/**
 * Priority formula (FR-06).
 * Documented explicitly so it can be explained in the review, per the doc's
 * "the exact formula must be agreed and implemented" note.
 *
 * score = (severity * 10) + ageInHours   (capped ageInHours contribution at 48)
 * severity: 1 (low) - 3 (high)
 * ageInHours: hours since the report was created — older unresolved reports rise in priority.
 *
 * Thresholds:
 *   score >= 35  -> High
 *   score >= 20  -> Medium
 *   else         -> Low
 */
function calculatePriority(severity, createdAt) {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const ageHours = Math.min(ageMs / (1000 * 60 * 60), 48);
  const score = severity * 10 + ageHours;

  let level = "Low";
  if (score >= 35) level = "High";
  else if (score >= 20) level = "Medium";

  return { score: Math.round(score * 100) / 100, level };
}

module.exports = { calculatePriority };
