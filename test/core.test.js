const assert = require("assert");
const { solveVerificationChallenge, solveVerificationDetailed, scoreDecision, scoreCommentDecision, makeAbstentionReceipt, evidenceState, alreadyClaimed, selectReplyTarget, mayUpvote, hasRequiredLinks, safeStep } = require("../src/core");

assert.equal(solveVerificationChallenge("swims at twenty three meters and accelerates by five"), "28.00");
assert.equal(solveVerificationChallenge("twelve plus seven"), "19.00");
assert.equal(solveVerificationChallenge("25 plus 15 gives the total"), "40.00");
assert.equal(solveVerificationChallenge("35 decreases by 12; what is the new speed?"), "23.00");
assert.equal(solveVerificationDetailed("3 times 5").checksAgree, true);
assert.equal(solveVerificationChallenge("Force is 25 and leverage triples it. What is the total?"), "75.00");
assert.equal(solveVerificationChallenge("Force is 30 * 4. What is the total?"), "120.00");
assert.throws(() => solveVerificationChallenge("twelve maybe seven"));
assert.throws(() => solveVerificationChallenge("one lobster has twenty plus five"));

const good = scoreDecision({ act: true, scores: { relevance: 2, originality: 2, usefulness: 2, truth: 2, relationship: 1, style: 1 }, content: "The shared verifier creates correlated error." });
assert.equal(good.act, true);
assert.equal(good.score, 10);
assert.equal(scoreDecision({ ...good, act: true, content: "Great point. More tests." }).act, false);
assert.equal(scoreDecision({ ...good, act: true, content: "Doctor Memory points out that receipts are performative." }).act, false);
assert.equal(scoreCommentDecision({ ...good, act: true, stance: "challenge", content: "The conclusion fails because delivery is not visibility; test it with an independent read." }).act, true);
assert.equal(scoreCommentDecision({ ...good, act: true, stance: "challenge", content: "I disagree with this conclusion." }).act, false);
assert.equal(scoreCommentDecision({ ...good, act: true, stance: "argumentative", content: "Because reasons." }).act, false);

assert.equal(makeAbstentionReceipt({ action: "reply", reason: "No new evidence", reversalEvidence: "A falsifying example", classification: "judgment" }).classification, "judgment");
assert.throws(() => makeAbstentionReceipt({ action: "reply", reason: "No", reversalEvidence: "Yes", classification: "mood" }));
assert.equal(evidenceState({ delivered: true }).claim, "delivery_only");
assert.equal(evidenceState({ delivered: true, visible: true }).claim, "visible_not_causal");
assert.equal(evidenceState({ delivered: true, visible: true, causal: true }).claim, "causal_evidence");

const claims = [{ postId: "post-1", claim: "answer-a", parentId: "comment-1" }];
assert.equal(alreadyClaimed(claims, { postId: "post-1", claim: "answer-b", parentId: "comment-1" }), true);
assert.equal(alreadyClaimed(claims, { postId: "post-1", claim: "answer-a", parentId: "comment-2" }), true);
assert.equal(alreadyClaimed(claims, { postId: "post-2", claim: "answer-a", parentId: "comment-2" }), false);
const target = selectReplyTarget([
  { id: "old", createdAt: "2026-01-01T00:00:00Z", author: { name: "peer" } },
  { id: "new", createdAt: "2026-01-02T00:00:00Z", author: { name: "peer" } }
], [{ parentId: "old" }]);
assert.equal(target.id, "new");

assert.equal(mayUpvote({ actorId: "agent", authorId: "agent", fullyRead: true, useful: true }), false);
assert.equal(mayUpvote({ actorId: "agent", authorId: "peer", fullyRead: true, useful: true }), true);
assert.equal(mayUpvote({ actorId: "agent", authorId: "peer", fullyRead: false, useful: true }), false);

assert.equal(hasRequiredLinks("Review https://example.test/issue", ["https://example.test/issue"]), true);
assert.equal(hasRequiredLinks("Review the issue", ["https://example.test/issue"]), false);

(async () => {
  assert.equal((await safeStep("ok", async () => 42)).value, 42);
  const failed = await safeStep("broken", async () => { throw new Error("boom"); });
  assert.equal(failed.ok, false);
  assert.equal(failed.error, "boom");
  console.log("All Kongens Handler Core tests passed.");
})().catch(error => { console.error(error); process.exitCode = 1; });

