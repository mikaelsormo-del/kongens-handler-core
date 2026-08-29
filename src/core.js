const NUMBER_WORDS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };

function extractNumbers(text) {
  const tokens = String(text).toLowerCase().replace(/[^a-z0-9.]+/g, " ").trim().split(/\s+/);
  const values = [];
  for (let i = 0; i < tokens.length; i++) {
    if (/^\d+(?:\.\d+)?$/.test(tokens[i])) { values.push(Number(tokens[i])); continue; }
    if (!(tokens[i] in NUMBER_WORDS)) continue;
    let value = NUMBER_WORDS[tokens[i]];
    if (value >= 20 && value % 10 === 0 && NUMBER_WORDS[tokens[i + 1]] < 10) value += NUMBER_WORDS[tokens[++i]];
    values.push(value);
  }
  return values;
}

function solveVerificationChallenge(text) {
  const numbers = extractNumbers(text);
  if (numbers.length < 2) throw new Error("Challenge is not safely understood");
  const normalized = String(text).toLowerCase().replace(/[^a-z]+/g, "");
  let answer;
  if (/accelerat|increase|add|plus|sum|total|combined|together/.test(normalized)) answer = numbers[0] + numbers[1];
  else if (/decreas|subtract|difference|remain|left/.test(normalized)) answer = numbers[0] - numbers[1];
  else if (/multiply|product|times/.test(normalized)) answer = numbers[0] * numbers[1];
  else if (/divide|quotient|pergroup/.test(normalized)) answer = numbers[0] / numbers[1];
  else throw new Error("Operator is ambiguous; fail closed");
  return answer.toFixed(2);
}

function scoreDecision(decision, minimum = 10) {
  const dimensions = ["relevance", "originality", "usefulness", "truth", "relationship", "style"];
  const values = dimensions.map(key => decision?.scores?.[key]);
  if (!values.every(value => Number.isInteger(value) && value >= 0 && value <= 2)) return { act: false, score: null, reason: "invalid_scores" };
  const score = values.reduce((sum, value) => sum + value, 0);
  const generic = /^(great point|exactly\b|i agree\b|agreed\b|you(?:'re| are) (?:right|spot[ -]?on)\b)/i.test(String(decision.content || "").trim());
  return { ...decision, score, act: Boolean(decision.act) && score >= minimum && !generic, reason: generic ? "generic_opener" : decision.reason };
}

function makeAbstentionReceipt({ action, reason, reversalEvidence, classification, regret = null }) {
  const allowed = ["constraint", "policy", "judgment", "failure"];
  if (!action || !reason || !reversalEvidence || !allowed.includes(classification)) throw new Error("Incomplete abstention receipt");
  return { action, reason, reversalEvidence, classification, regret, recordedAt: new Date().toISOString() };
}

function evidenceState({ delivered = false, visible = false, causal = false } = {}) {
  return { delivered: Boolean(delivered), visible: Boolean(visible), causal: Boolean(causal), claim: causal ? "causal_evidence" : visible ? "visible_not_causal" : delivered ? "delivery_only" : "unconfirmed" };
}

function alreadyClaimed(claims = [], { postId, claim, parentId } = {}) {
  return claims.some(item =>
    (parentId && item.parentId === parentId) ||
    (postId && claim && item.postId === postId && item.claim === claim)
  );
}

function mayUpvote({ actorId, authorId, fullyRead = false, useful = false } = {}) {
  return Boolean(actorId && authorId && actorId !== authorId && fullyRead && useful);
}

function hasRequiredLinks(content, requiredLinks = []) {
  const text = String(content || "");
  return requiredLinks.every(link => typeof link === "string" && link.length > 0 && text.includes(link));
}

async function safeStep(name, operation) {
  try {
    return { name, ok: true, value: await operation() };
  } catch (error) {
    return { name, ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

module.exports = { extractNumbers, solveVerificationChallenge, scoreDecision, makeAbstentionReceipt, evidenceState, alreadyClaimed, mayUpvote, hasRequiredLinks, safeStep };

