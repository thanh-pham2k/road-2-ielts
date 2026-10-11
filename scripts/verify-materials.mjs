import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
const target=path.resolve(process.argv[2]||'../n5-tungkinh');
const context={window:{}};
vm.runInNewContext(await readFile(path.join(target,'docs/ielts/practice-data.js'),'utf8'),context);
const data=context.window.IELTS_PRACTICE;
const topics=new Set(data.writing.map(group=>group.topic));
if(topics.size!==16 || data.structures.length!==16) throw Error('Expected 16 topics');
let sentences=0,vocabulary=0,structures=0;
for(const group of data.writing){
 const rows=group.csv.split('\n').slice(1).map(row=>row.split(','));
 if(rows.length<5||rows.length>6 || !data['topic-vocab'].find(g=>g.topic===group.topic&&g.date===group.date)) throw Error(`Daily sentence coverage: ${group.topic}`);
 for(let index=0;index<rows.length;index++){
  const row=rows[index];
  if(row.length!==6 || !row[0]||!row[2]||!row[3]||!row[4]) throw Error('Incomplete sentence');
  const chunks=row[5].split('|');
  if(chunks.length<2||chunks.some(chunk=>!chunk)||chunks.join(' ')!==row[3]) throw Error(`Chunk mismatch: ${row[0]}`);
  if(![1,2,3].includes(group.levels[index]) || (index&&group.levels[index]<group.levels[index-1]))throw Error('Difficulty order');
 }sentences+=rows.length;
}
for(const group of data['topic-vocab']){
 const rows=group.csv.split('\n').slice(1).map(row=>row.split(','));
 if(rows.length<4||rows.length>6)throw Error(`Daily vocabulary coverage: ${group.topic}`);
 for(const row of rows){if(row.length!==5||!row[0]||!row[2]||!row[3]||!row[4])throw Error(`Incomplete bilingual vocabulary: ${row}`)}vocabulary+=rows.length;
}
for(const group of data.structures){
 if(!topics.has(group.topic)||group.items.length!==(group.topic.startsWith('Work English')?16:12))throw Error(`Structure coverage: ${group.topic}`);
 for(const item of group.items){if(!item.purpose||!item.pattern||!item.example||!item.meaning)throw Error('Incomplete structure')}
 structures+=group.items.length;
}
if(sentences!==246||vocabulary!==242||structures!==216)throw Error('Totals do not match');
if(data.writing.length!==48||new Set(data.writing.map(g=>g.date)).size!==48)throw Error('Expected 48 distinct daily sessions');
for(const topic of topics){const groups=data.writing.filter(g=>g.topic===topic);const words=data['topic-vocab'].filter(g=>g.topic===topic);if(groups.length!==3||words.length!==3||groups.reduce((n,g)=>n+g.count,0)!==(topic.startsWith('Work English')?16:15)||words.reduce((n,g)=>n+g.count,0)!==(topic.startsWith('Work English')?12:17))throw Error(`Topic totals changed: ${topic}`);}
const html=await readFile(path.join(target,'docs/index.html'),'utf8');
for(const script of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
for(const file of ['Writing_Practice.md','Topic_Vocabulary.md','Sentence_Structures.md','README.md']){
 const source=await readFile(`writing/${file}`,'utf8');const deployed=await readFile(path.join(target,'docs/ielts/writing',file),'utf8');
 if(source!==deployed)throw Error(`Source copy differs: ${file}`);
}
console.log(`Verified ${topics.size} topics; ${sentences} complete chunk exercises; ${vocabulary} bilingual cards; ${structures} structure examples; ascending difficulty; exact source copies; JS syntax.`);
