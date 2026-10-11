import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(process.argv[2] || '../n5-tungkinh');
const destination = path.join(target, 'docs/ielts/speaking');
await mkdir(destination, { recursive: true });
const mapping = { 'instant-vocab': 'Instant_Vocab_Practice.md', 'word-order': 'Word_Order_Practice.md', writing: 'Writing_Practice.md', 'topic-vocab': 'Topic_Vocabulary.md' };
const data = {};
for (const [mode, filename] of Object.entries(mapping)) {
  const markdown = await readFile(path.join(source, ['writing','topic-vocab'].includes(mode) ? 'writing' : 'speaking', filename), 'utf8');
  const sections = [...markdown.matchAll(/^### (\d{4}-\d{2}-\d{2})([^\r\n]*)\r?\n([\s\S]*?)(?=^### |$(?![\s\S]))/gm)];
  data[mode] = sections.map(section => {
    const blocks = [...section[3].matchAll(/```(?:csv)?\s*\n([\s\S]*?)```/g)].map(m => m[1].trim().split(/\r?\n/));
    if (!blocks.length) throw new Error(`No CSV in ${filename} / ${section[1]}`);
    const header = blocks[0][0];
    if (blocks.some(b => b[0] !== header)) throw new Error('Inconsistent CSV headers');
    const rows = blocks.flatMap(b => b.slice(1)).filter(Boolean);
    const columns = ['instant-vocab','topic-vocab'].includes(mode) ? 5 : 6;
    for (const row of rows) {
      if (row.split(',').length !== columns) throw new Error(`Invalid columns: ${row}`);
      if (['word-order','writing'].includes(mode)) {
        const fields = row.split(',');
        if (fields[5].split('|').join(' ').replace(/\s+/g,' ').trim() !== fields[3].replace(/\s+/g,' ').trim()) throw new Error(`Word order differs from sentence: ${row}`);
      }
    }
    return { date: section[1], topic: section[2].replace(/^\s*·\s*/, '').trim(), count: rows.length, csv: [header,...rows].join('\n') };
  });
  if (!data[mode].length) throw new Error(`No dated content in ${filename}`);
}
for (const filename of ['Instant_Vocab_Practice.md', 'Word_Order_Practice.md', 'IELTS_Speaking_Practice_Checklist.md', 'PRACTICE_LOG.md']) {
  await copyFile(path.join(source,'speaking',filename), path.join(destination,filename));
}
await mkdir(path.join(target,'docs/ielts/writing'), {recursive:true});
for (const filename of ['Writing_Practice.md','Topic_Vocabulary.md','README.md']) await copyFile(path.join(source,'writing',filename),path.join(target,'docs/ielts/writing',filename));
await writeFile(path.join(target,'docs/ielts/practice-data.js'), `window.IELTS_PRACTICE = ${JSON.stringify(data,null,2).replace(/</g,'\\u003c')};\n`);
console.log(`Synced IELTS to ${target}: ${Object.entries(data).map(([mode,days])=>`${mode}: ${days.length} groups / ${days.reduce((n,d)=>n+d.count,0)} rows`).join('; ')}`);
