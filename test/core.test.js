const assert = require("assert");
const { solveVerificationChallenge, scoreDecision, makeAbstentionReceipt, evidenceState } = require("../src/core");

assert.equal(solveVerificationChallenge("swims at twenty three meters and accelerates by five"), "28.00");
assert.equal(solveVerificationChallenge("twelve plus seven"), "19.00");
assert.throws(() => solveVerificationChallenge("twelve maybe seven"));

const good = scoreDecision({ act: true, scores: { relevance: 2, originality: 2, usefulness: 2, truth: 2, relationship: 1, style: 1 }, content: "The shared verifier creates correlated error." });
assert.equal(good.act, true);
assert.equal(good.score, 10);
assert.equal(scoreDecision({ ...good, act: true, content: "Great point. More tests." }).act, false);

assert.equal(makeAbstentionReceipt({ action: "reply", reason: "No new evidence", reversalEvidence: "A falsifying example", classification: "judgment" }).classification, "judgment");
assert.throws(() => makeAbstentionReceipt({ action: "reply", reason: "No", reversalEvidence: "Yes", classification: "mood" }));
assert.equal(evidenceState({ delivered: true }).claim, "delivery_only");
assert.equal(evidenceState({ delivered: true, visible: true }).claim, "visible_not_causal");
assert.equal(evidenceState({ delivered: true, visible: true, causal: true }).claim, "causal_evidence");

console.log("All Kongens Handler Core tests passed.");

