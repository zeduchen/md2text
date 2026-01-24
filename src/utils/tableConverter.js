import stringWidth from 'string-width';

/**
 * Renders a single table block
 */
function renderTableBlock(tableRows, styleName) {
  if (tableRows.length < 2) return '';

  let header = tableRows[0];
  let body = tableRows.slice(2);
  let alignments = tableRows[1] || [];

  const isSeparator = alignments.every(col => /^[\s\-:]+$/.test(col));
  if (!isSeparator) {
    body = tableRows.slice(1);
    alignments = header.map(() => 'left');
  }

  const columnCount = Math.max(header.length, ...body.map(r => r.length));
  const colWidths = new Array(columnCount).fill(0);

  function updateWidths(row) {
    row.forEach((col, i) => {
      if (i < columnCount) {
        // Use string-width for accurate calculation
        colWidths[i] = Math.max(colWidths[i], stringWidth(col));
      }
    });
  }

  updateWidths(header);
  body.forEach(updateWidths);

  function pad(text, width) {
    const w = stringWidth(text);
    return text + ' '.repeat(Math.max(0, width - w));
  }

  function renderRow(row, left, mid, right) {
    // We need to ensure that the row has enough columns
    // And each column is padded correctly
    const paddedCols = [];
    for (let i = 0; i < columnCount; i++) {
      const col = row[i] || ''; // handle empty or missing cells
      paddedCols.push(pad(col, colWidths[i]));
    }
    return left + paddedCols.join(mid) + right;
  }

  function renderSeparator(left, mid, right, fill) {
    return left + colWidths.map(w => fill.repeat(w)).join(mid) + right;
  }

  const styles = {
    simple: {
      top: null,
      headerRow: { left: '| ', mid: ' | ', right: ' |' },
      headerSep: { left: '|-', mid: '-|-', right: '-|', fill: '-' },
      bodyRow: { left: '| ', mid: ' | ', right: ' |' },
      bottom: null
    },
    grid: {
      top: { left: '+-', mid: '-+-', right: '-+', fill: '-' },
      headerRow: { left: '| ', mid: ' | ', right: ' |' },
      headerSep: { left: '+-', mid: '-+-', right: '-+', fill: '-' },
      bodyRow: { left: '| ', mid: ' | ', right: ' |' },
      bodySep: { left: '+-', mid: '-+-', right: '-+', fill: '-' }, // Full grid separator
      bottom: { left: '+-', mid: '-+-', right: '-+', fill: '-' }
    },
    unicode: {
      top: { left: '┌─', mid: '─┬─', right: '─┐', fill: '─' },
      headerRow: { left: '│ ', mid: ' │ ', right: ' │' },
      headerSep: { left: '├─', mid: '─┼─', right: '─┤', fill: '─' },
      bodyRow: { left: '│ ', mid: ' │ ', right: ' │' },
      bodySep: { left: '├─', mid: '─┼─', right: '─┤', fill: '─' }, // Full grid separator
      bottom: { left: '└─', mid: '─┴─', right: '─┘', fill: '─' }
    }
  };

  const style = styles[styleName] || styles.simple;
  const outputLines = [];

  if (style.top) outputLines.push(renderSeparator(style.top.left, style.top.mid, style.top.right, style.top.fill));
  outputLines.push(renderRow(header, style.headerRow.left, style.headerRow.mid, style.headerRow.right));
  if (style.headerSep) outputLines.push(renderSeparator(style.headerSep.left, style.headerSep.mid, style.headerSep.right, style.headerSep.fill));

  body.forEach((row, index) => {
    outputLines.push(renderRow(row, style.bodyRow.left, style.bodyRow.mid, style.bodyRow.right));
    // Add separator between rows if style has bodySep
    if (style.bodySep && index < body.length - 1) {
      outputLines.push(renderSeparator(style.bodySep.left, style.bodySep.mid, style.bodySep.right, style.bodySep.fill));
    }
  });

  if (style.bottom) outputLines.push(renderSeparator(style.bottom.left, style.bottom.mid, style.bottom.right, style.bottom.fill));

  return outputLines.join('\n');
}

/**
 * Converts a Markdown string (possibly containing text + tables) into formatted text.
 */
export function markdownToTextTable(markdown, options = { style: 'grid' }) {
  if (!markdown) return '';

  const lines = markdown.trim().split('\n');
  const resultBlocks = [];

  let currentBlockType = 'text'; // 'text' | 'table'
  let currentBlockLines = [];

  function flushBlock() {
    if (currentBlockLines.length === 0) return;

    if (currentBlockType === 'table') {
      // Parse table lines
      const tableRows = [];
      for (const line of currentBlockLines) {
        const content = line.trim().replace(/^\||\|$/g, '');
        const columns = content.split('|').map(col => col.trim());
        tableRows.push(columns);
      }
      resultBlocks.push(renderTableBlock(tableRows, options.style));
    } else {
      // Just join text lines
      resultBlocks.push(currentBlockLines.join('\n'));
    }
    currentBlockLines = [];
  }

  for (const line of lines) {
    const isTableLine = line.trim().startsWith('|') || (line.trim().includes('|') && line.trim().length > 2); // Simple heuristic

    if (isTableLine) {
      if (currentBlockType === 'text') {
        flushBlock();
        currentBlockType = 'table';
      }
      currentBlockLines.push(line);
    } else {
      if (currentBlockType === 'table') {
        flushBlock();
        currentBlockType = 'text';
      }
      currentBlockLines.push(line);
    }
  }
  flushBlock();

  return resultBlocks.join('\n\n'); // Separate blocks by blank line
}
