function applyInline(text, key) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span key={key}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </span>
  );
}

function MarkdownText({ text, className = "" }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let bulletBuffer = [];
  let counter = 0;

  const uid = () => counter++;

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    const id = uid();
    elements.push(
      <ul key={`ul-${id}`} className="list-disc list-inside space-y-1 mb-3 text-gray-700">
        {bulletBuffer.map((item, j) => (
          <li key={j}>{applyInline(item)}</li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushBullets();
      continue;
    }

    if (trimmed === "---") {
      flushBullets();
      elements.push(<hr key={`hr-${uid()}`} className="my-4 border-gray-200" />);
      continue;
    }

    // Bullet: "* text" or "- text"
    const bulletMatch = trimmed.match(/^[*\-]\s+(.+)/);
    if (bulletMatch) {
      bulletBuffer.push(bulletMatch[1]);
      continue;
    }

    flushBullets();

    // Numbered item: "1.  Question text"
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      elements.push(
        <p key={`n-${uid()}`} className="font-semibold text-gray-800 mt-4 mb-1 text-sm">
          {numberedMatch[1]}.&nbsp;{applyInline(numberedMatch[2])}
        </p>
      );
      continue;
    }

    // Option: "a) text" or "    a) text" (possibly indented)
    const optionMatch = trimmed.match(/^([a-dA-D])\)\s+(.+)/);
    if (optionMatch) {
      elements.push(
        <p key={`opt-${uid()}`} className="ml-5 text-gray-600 text-sm leading-relaxed">
          <span className="font-medium text-gray-400">{optionMatch[1].toLowerCase()})</span>{" "}
          {applyInline(optionMatch[2])}
        </p>
      );
      continue;
    }

    // Regular paragraph line
    elements.push(
      <p key={`p-${uid()}`} className="text-gray-700 text-sm mb-2 leading-relaxed">
        {applyInline(trimmed)}
      </p>
    );
  }

  flushBullets();

  return <div className={className}>{elements}</div>;
}

export default MarkdownText;
