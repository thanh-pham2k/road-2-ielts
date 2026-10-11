import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
const md = await readFile(new URL('../speaking/IELTS_Speaking_Practice_Checklist.md', import.meta.url), 'utf8');
const log = await readFile(new URL('../speaking/PRACTICE_LOG.md', import.meta.url), 'utf8');
const topics = [];
for (const match of md.matchAll(/^# \d+\. (.+?) `\[([A-Z]+)\]`\s*\n([\s\S]*?)(?=^# |$(?![\s\S]))/gm)) {
  const questions = [...match[3].matchAll(/- \[([ xX])\] \*\*\[([A-Z]+-\d+)\] \d+\. (.*?)\*\*\s*```\s*\n([\s\S]*?)```/g)].map(q => ({id:q[2],question:q[3],answer:q[4].trim(),checked:q[1].toLowerCase()==='x'}));
  topics.push({title:match[1],id:match[2],questions});
}
const progress = [...md.split('# 13. Progress Checklist')[1].matchAll(/### (.+)\r?\n([\s\S]*?)(?=### |## Nguyên tắc)/g)].map((m,i)=>({title:m[1],items:[...m[2].matchAll(/- \[([ xX])\] (.+)/g)].map((q,j)=>({id:`stage-${i}-${j}`,text:q[2].trim(),checked:q[1].toLowerCase()==='x'}))}));
const logs = [...log.replace(/<!--[\s\S]*?-->/g,'').matchAll(/### (\d{4}-\d{2}-\d{2})\s*\n- (.+)/g)].map(m=>({date:m[1],ids:m[2].trim().split(', ')}));
if(topics.length!==10 || topics.reduce((n,t)=>n+t.questions.length,0)!==100) throw new Error('Expected 10 topics and 100 questions');
await mkdir('dist',{recursive:true});
for(const name of ['index.html','style.css','app.js']) await copyFile(`web/${name}`,`dist/${name}`);
await writeFile('dist/content.js',`window.SPEAKING_DATA = ${JSON.stringify({topics,progress,logs}).replace(/</g,'\\u003c')};\n`);
console.log(`Built ${topics.length} topics, 100 questions, ${logs.length} practice logs → dist/`);
