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

function detectOperationByQuestion(text) {
  const value = String(text).toLowerCase().replace(/[^a-z0-9]+/g, " ");
  if (/\b(?:left|remaining|new speed|minus|subtract|loses?|losses|decreases? by)\b/.test(value)) return "subtract";
  if (/\b(?:how far|work|product|multipl(?:y|ied|ies)|times)\b/.test(value)) return "multiply";
  if (/\b(?:divid(?:e|ed)|quotient|split equally|per claw)\b/.test(value)) return "divide";
  if (/\b(?:total|sum|combined|plus|adds?|increases? by|accelerates? by|together)\b/.test(value)) return "add";
  return null;
}

function detectOperationByKeywords(text) {
  const value = String(text).toLowerCase().replace(/[^a-z]+/g, "");
  if (/remaining|loses|losses|newspeed|difference|minus|subtract|decrease/.test(value)) return "subtract";
  if (/multipli|product|work|howfar|distance|times/.test(value)) return "multiply";
  if (/divide|quotient|perclaw|equally/.test(value)) return "divide";
  if (/total|combined|adds|plus|increase|accelerat|together|sum/.test(value)) return "add";
  return null;
}

function calculate(operation, a, b) {
  return operation === "add" ? a + b : operation === "subtract" ? a - b : operation === "multiply" ? a * b : operation === "divide" ? a / b : NaN;
}

function solveVerificationDetailed(text) {
  const numbers = extractNumbers(text);
  if (numbers.length !== 2) throw new Error("Challenge must contain exactly two operands");
  const first = detectOperationByQuestion(text);
  const second = detectOperationByKeywords(text);
  if (!first || first !== second) throw new Error("Independent operation checks disagreed");
  const answer = calculate(first, numbers[0], numbers[1]);
  if (!Number.isFinite(answer)) throw new Error("Challenge result was not finite");
  return { operands: numbers, operation: first, answer: answer.toFixed(2), checksAgree: true };
}

function solveVerificationChallenge(text) {
  return solveVerificationDetailed(text).answer;
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

module.exports = { extractNumbers, solveVerificationChallenge, solveVerificationDetailed, scoreDecision, makeAbstentionReceipt, evidenceState, alreadyClaimed, mayUpvote, hasRequiredLinks, safeStep };

