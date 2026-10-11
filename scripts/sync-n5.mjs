import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(process.argv[2] || '../n5-tungkinh');
const destination = path.join(target, 'docs/ielts/speaking');
await mkdir(destination, { recursive: true });
const mapping = { 'instant-vocab': 'Instant_Vocab_Practice.md', 'word-order': 'Word_Order_Practice.md', writing: 'Writing_Practice.md', 'topic-vocab': 'Topic_Vocabulary.md' };
const data = {};
const speakingTopics = JSON.parse(await readFile(path.join(source,'speaking/Question_Topics.json'),'utf8'));
data.speaking = speakingTopics.map((topic,index)=>({topic:topic.topic,date:new Date(Date.UTC(2026,9,11+index)).toISOString().slice(0,10),questions:[...topic.p1.map((text,i)=>({id:`SP-${index+1}-P1-${i+1}`,part:1,text})),{id:`SP-${index+1}-P2-1`,part:2,text:topic.cue,points:topic.points},...topic.p3.map((text,i)=>({id:`SP-${index+1}-P3-${i+1}`,part:3,text}))]}));
if(data.speaking.length!==26 || data.speaking.some(topic=>topic.questions.length!==8))throw new Error('Incomplete Speaking question bank');
const speakingMarkdown = '# Speaking — bộ câu hỏi mở rộng\n\n26 chủ đề; mỗi chủ đề có 4 câu Part 1, 1 cue card Part 2 và 3 câu Part 3 (208 mục mới). Lịch gợi ý: một chủ đề mỗi ngày. Giữ nguyên 100 câu trong IELTS_Speaking_Practice_Checklist.md. Đây là câu hỏi luyện tập tự biên soạn, không phải đề thi thật hoặc dự đoán đề.\n\nCách luyện: Part 1 trả lời trực tiếp rồi thêm lý do/ví dụ. Part 2 lập ý trong một phút và nói 1–2 phút. Part 3 nêu quan điểm, giải thích và đưa ví dụ ở mức xã hội.\n\nCấu trúc bài thi tham khảo: https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking\n'+data.speaking.map(topic=>`\n## ${topic.date} · ${topic.topic}\n`+topic.questions.map(q=>`\n### ${q.id} · Part ${q.part}\n\n${q.text}\n${q.points?q.points.map(point=>'- '+point).join('\n')+'\n':''}`).join('')).join('');
await writeFile(path.join(source,'speaking/Speaking_Questions.md'),speakingMarkdown);
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
  // A topic may have several source sections on the same day; show it once.
  const groups = new Map();
  for (const group of data[mode]) {
    const key = `${group.date}:${group.topic}`;
    if (!groups.has(key)) groups.set(key, group);
    else { const existing = groups.get(key); existing.csv += '\n' + group.csv.split('\n').slice(1).join('\n'); existing.count += group.count; }
  }
  data[mode] = [...groups.values()];
  if (mode === 'writing') {
    const levelOf = sentence => /\b(because|when|although|while|once|than|before|that|by|if|but)\b/i.test(sentence) ? 3 : sentence.split(/\s+/).length > 10 ? 2 : 1;
    for (const group of data[mode]) {
      const lines = group.csv.split('\n');
      const rows = lines.slice(1).map(row=>({row,level:levelOf(row.split(',')[3])})).sort((a,b)=>a.level-b.level);
      group.csv = [lines[0],...rows.map(item=>item.row)].join('\n');
      group.levels = rows.map(item=>item.level);
    }
  }
}
const structures = await readFile(path.join(source,'writing/Sentence_Structures.md'),'utf8');
data.structures = [...structures.matchAll(/^## (.+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(section => ({topic:section[1].trim(),items:[...section[2].matchAll(/^\| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|\s*$/gm)].filter(row=>row[2].trim()!=='Mẫu').map(row=>({purpose:row[1].trim(),pattern:row[2].trim(),example:row[3].trim(),meaning:row[4].trim()}))})).filter(section=>section.items.length);
const structureGroups = new Map();
for (const group of data.structures) { if (!structureGroups.has(group.topic)) structureGroups.set(group.topic,group); else structureGroups.get(group.topic).items.push(...group.items); }
data.structures = [...structureGroups.values()];
if(data.structures.length!==16 || data.structures.some(section=>section.items.length<12)) throw new Error('Expected 16 structure topics with at least 12 examples each');
const structurePractice = JSON.parse(await readFile(path.join(source,'writing/Structure_Practice.json'),'utf8'));
for(const topic of data.structures)for(const item of topic.items){
 const set=structurePractice.find(set=>set.topic===topic.topic&&set.pattern===item.pattern&&set.example===item.example);
 if(!set||set.exercises.length!==5)throw new Error(`Missing five-exercise set: ${topic.topic} / ${item.pattern}`);
 item.exercises=set.exercises;
}
for (const filename of ['Instant_Vocab_Practice.md', 'Word_Order_Practice.md', 'IELTS_Speaking_Practice_Checklist.md', 'PRACTICE_LOG.md', 'Question_Topics.json', 'Speaking_Questions.md']) {
  await copyFile(path.join(source,'speaking',filename), path.join(destination,filename));
}
await mkdir(path.join(target,'docs/ielts/writing'), {recursive:true});
for (const filename of ['Writing_Practice.md','Topic_Vocabulary.md','Sentence_Structures.md','Structure_Practice.json','DAILY_PLAN.md','README.md']) await copyFile(path.join(source,'writing',filename),path.join(target,'docs/ielts/writing',filename));
await writeFile(path.join(target,'docs/ielts/practice-data.js'), `window.IELTS_PRACTICE = ${JSON.stringify(data,null,2).replace(/</g,'\\u003c')};\n`);
console.log(`Synced IELTS to ${target}: ${Object.entries(data).filter(([mode])=>!['structures','speaking'].includes(mode)).map(([mode,days])=>`${mode}: ${days.length} groups / ${days.reduce((n,d)=>n+d.count,0)} rows`).join('; ')}; structures: ${data.structures.length} topics; speaking: 26 topics / 208 questions`);
