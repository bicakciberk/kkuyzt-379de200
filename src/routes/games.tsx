import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Check, Copy, CornerDownLeft, Delete } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WORDS = [
  "NÖRON", "MODEL", "KODLA", "PROMPT", "VERİM", "AKILLI", "ROBOT", "SİBER",
  "PİKSEL", "SENSÖR", "BULUT", "VİZYON", "MAKİNE", "MOTOR", "KOMUT", "BAĞLAM",
  "EKRAN", "KODCU", "BETİK", "MANTIK", "SİNYAL", "VERİCİ", "DİZGE", "AĞSAL",
] as const;
const KEY_ROWS = ["ERTYUIOPĞÜ", "ASDFGHJKLŞİ", "ZXCVBNMÖÇ"] as const;
const STORAGE_KEY = "yzt-kod-kirici-v1";
const MAX_GUESSES = 6;
const LETTERS = /^[A-ZÇĞİÖŞÜ]+$/;

type TileState = "correct" | "present" | "absent";
type GameStatus = "playing" | "won" | "lost";
type DailyRecord = { guesses:string[]; status:GameStatus; answerLength:number };
type SavedGames = { records:Record<string,DailyRecord> };

export const Route = createFileRoute("/games")({
  head:()=>({meta:[
    {title:"Kod Kırıcı — YZT Mini Oyunlar"},
    {name:"description",content:"YZT'nin her gün yenilenen yapay zekâ ve teknoloji temalı kelime tahmin oyunu."},
    {property:"og:title",content:"Kod Kırıcı — YZT Mini Oyunlar"},
    {property:"og:description",content:"Altı tahminde günün teknoloji kelimesini bul."},
    {property:"og:type",content:"website"},
    {name:"twitter:card",content:"summary_large_image"},
  ]}),
  component:Games,
});

function istanbulDateKey(){
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Istanbul",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
  const get=(type:string)=>parts.find((part)=>part.type===type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function wordForDate(dateKey:string){
  const day=Math.floor((Date.parse(`${dateKey}T00:00:00Z`)-Date.parse("2026-01-01T00:00:00Z"))/86400000);
  return WORDS[((day%WORDS.length)+WORDS.length)%WORDS.length] ?? WORDS[0];
}

function normalizeLetter(value:string){return value.toLocaleUpperCase("tr-TR").replace(/[^A-ZÇĞİÖŞÜ]/g,"")}

function scoreGuess(guess:string,answer:string):TileState[]{
  const result:Array<TileState|undefined>=Array.from({length:answer.length});
  const remaining=new Map<string,number>();
  for(let i=0;i<answer.length;i+=1){
    if(guess[i]===answer[i]) result[i]="correct";
    else {const letter=answer[i] ?? "";remaining.set(letter,(remaining.get(letter) ?? 0)+1)}
  }
  for(let i=0;i<guess.length;i+=1){
    if(result[i]) continue;
    const letter=guess[i] ?? "";const count=remaining.get(letter) ?? 0;
    result[i]=count>0?"present":"absent";
    if(count>0) remaining.set(letter,count-1);
  }
  return result.map((state)=>state ?? "absent");
}

function readGames():SavedGames{
  try{
    const parsed=JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "") as Partial<SavedGames>;
    return parsed.records && typeof parsed.records==="object"?{records:parsed.records}: {records:{}};
  }catch{return {records:{}}}
}

function writeGames(games:SavedGames){window.localStorage.setItem(STORAGE_KEY,JSON.stringify(games))}

function dateDistance(from:string,to:string){return Math.round((Date.parse(`${to}T00:00:00Z`)-Date.parse(`${from}T00:00:00Z`))/86400000)}

function getStats(records:Record<string,DailyRecord>){
  const completed=Object.entries(records).filter(([,record])=>record.status!=="playing").sort(([a],[b])=>a.localeCompare(b));
  const wins=completed.filter(([,record])=>record.status==="won").length;
  let longest=0;let run=0;let previous="";
  for(const [date,record] of completed){
    if(record.status!=="won"){run=0;previous="";continue}
    run=previous && dateDistance(previous,date)===1?run+1:1;
    longest=Math.max(longest,run);previous=date;
  }
  return {played:completed.length,winRate:completed.length?Math.round(wins/completed.length*100):0,longest};
}

function Games(){
  const [dateKey,setDateKey]=useState("");
  const [saved,setSaved]=useState<SavedGames>({records:{}});
  const [guesses,setGuesses]=useState<string[]>([]);
  const [current,setCurrent]=useState("");
  const [status,setStatus]=useState<GameStatus>("playing");
  const [message,setMessage]=useState("");
  const [copied,setCopied]=useState(false);
  const answer=useMemo(()=>dateKey?wordForDate(dateKey):WORDS[0],[dateKey]);

  useEffect(()=>{
    const today=istanbulDateKey();const games=readGames();const record=games.records[today];
    setDateKey(today);setSaved(games);setGuesses(record?.guesses ?? []);setStatus(record?.status ?? "playing");
  },[]);

  const finish=useCallback((nextGuesses:string[],nextStatus:GameStatus)=>{
    if(!dateKey) return;
    const next={records:{...saved.records,[dateKey]:{guesses:nextGuesses,status:nextStatus,answerLength:answer.length}}};
    writeGames(next);setSaved(next);setStatus(nextStatus);
  },[answer.length,dateKey,saved.records]);

  const submit=useCallback(()=>{
    if(status!=="playing") return;
    if(current.length!==answer.length){setMessage(`${answer.length} harfli bir kelime yazmalısın.`);return}
    if(!LETTERS.test(current)){setMessage("Yalnızca Türkçe harfleri kullanabilirsin.");return}
    const next=[...guesses,current];setGuesses(next);setCurrent("");setMessage("");
    if(current===answer) finish(next,"won");
    else if(next.length===MAX_GUESSES) finish(next,"lost");
    else if(dateKey){const nextSaved={records:{...saved.records,[dateKey]:{guesses:next,status:"playing" as const,answerLength:answer.length}}};writeGames(nextSaved);setSaved(nextSaved)}
  },[answer,current,dateKey,finish,guesses,saved.records,status]);

  const press=useCallback((key:string)=>{
    if(status!=="playing") return;
    if(key==="ENTER"){submit();return}
    if(key==="BACKSPACE"){setCurrent((value)=>value.slice(0,-1));setMessage("");return}
    const letter=normalizeLetter(key);
    if(letter.length===1) setCurrent((value)=>value.length<answer.length?value+letter:value);
    setMessage("");
  },[answer.length,status,submit]);

  useEffect(()=>{
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.ctrlKey||event.metaKey||event.altKey) return;
      if(event.key==="Enter"){event.preventDefault();press("ENTER")}
      else if(event.key==="Backspace"){event.preventDefault();press("BACKSPACE")}
      else if(normalizeLetter(event.key).length===1) press(event.key);
    };
    window.addEventListener("keydown",onKeyDown);return()=>window.removeEventListener("keydown",onKeyDown);
  },[press]);

  const keyStates=useMemo(()=>{
    const states:Record<string,TileState>={};const rank:Record<TileState,number>={absent:1,present:2,correct:3};
    for(const guess of guesses) scoreGuess(guess,answer).forEach((state,index)=>{const letter=guess[index] ?? "";const old=states[letter];if(!old||rank[state]>rank[old]) states[letter]=state});
    return states;
  },[answer,guesses]);

  const stats=useMemo(()=>getStats(saved.records),[saved.records]);
  const rows=Array.from({length:MAX_GUESSES},(_,row)=>guesses[row] ?? (row===guesses.length&&status==="playing"?current:""));

  const share=async()=>{
    const squares=guesses.map((guess)=>scoreGuess(guess,answer).map((state)=>state==="correct"?"🟦":state==="present"?"🔹":"⬜").join("")).join("\n");
    const result=status==="won"?`${guesses.length}/${MAX_GUESSES}`:`X/${MAX_GUESSES}`;
    const text=`YZT Kod Kırıcı · ${dateKey} · ${result}\n\n${squares}\n\nkkuyzt.com/games`;
    try{await navigator.clipboard.writeText(text);setCopied(true);window.setTimeout(()=>setCopied(false),2200)}catch{setMessage("Sonuç kopyalanamadı.")}
  };

  return <>
    <section className="border-b border-border bg-background pt-32 pb-10 md:pt-40 md:pb-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
        <div><p className="eyebrow">Mini Oyunlar · 01</p><h1 className="mt-5 font-display text-5xl leading-none font-semibold sm:text-7xl">Kod Kırıcı</h1><p className="mt-5 max-w-xl leading-7 text-muted-foreground">Günün teknoloji kelimesini altı tahminde çöz. Her gün tek kelime, tek hak.</p></div>
        <div className="flex items-center gap-3 border-l-2 border-brand-mid pl-4 text-sm font-bold"><CalendarDays className="size-5 text-brand-mid"/><span>{dateKey?dateKey.split("-").reverse().join("."):"Gün yükleniyor"}</span></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="min-w-0">
          <div className="game-board mx-auto" style={{"--word-length":answer.length} as CSSProperties} aria-label={`${answer.length} harfli kelime için altı tahmin`}>
            {rows.flatMap((guess,row)=>Array.from({length:answer.length},(_,column)=>{const letter=guess[column]??"";const tileState=row<guesses.length?scoreGuess(guess,answer)[column]:undefined;return <div key={`${row}-${column}`} className={cn("game-tile",letter&&"game-tile-filled",tileState&&`game-tile-${tileState}`)} aria-label={tileState?`${letter}, ${tileState==="correct"?"doğru yerde":tileState==="present"?"kelimede var, yeri yanlış":"kelimede yok"}`:letter||"boş kutu"}>{letter}</div>}))}
          </div>
          <div className="game-message" role="status" aria-live="polite">{message || (status==="won"?`Kodu kırdın! ${guesses.length}. tahminde buldun.`:status==="lost"?`Bugünün kelimesi: ${answer}`:`${MAX_GUESSES-guesses.length} tahmin hakkın var.`)}</div>
          <div className="game-keyboard" aria-label="Türkçe sanal klavye">
            {KEY_ROWS.map((row,rowIndex)=><div key={row} className="game-keyboard-row">{rowIndex===2&&<Button type="button" variant="outline" className="game-key game-key-wide" disabled={status!=="playing"} onClick={()=>press("ENTER")} aria-label="Tahmini gönder"><CornerDownLeft/></Button>}{Array.from(row).map((letter)=><Button type="button" variant="outline" key={letter} className={cn("game-key",keyStates[letter]&&`game-key-${keyStates[letter]}`)} disabled={status!=="playing"} onClick={()=>press(letter)} aria-label={`${letter} harfi`}>{letter}</Button>)}{rowIndex===2&&<Button type="button" variant="outline" className="game-key game-key-wide" disabled={status!=="playing"} onClick={()=>press("BACKSPACE")} aria-label="Son harfi sil"><Delete/></Button>}</div>)}
          </div>
          {status!=="playing"&&<div className="mt-8 flex justify-center"><Button type="button" size="lg" onClick={share}>{copied?<><Check/>Kopyalandı</>:<><Copy/>Sonucu paylaş</>}</Button></div>}
        </div>
        <aside className="border-t-2 border-brand-mid pt-5 lg:border-t-0 lg:border-l-2 lg:pt-0 lg:pl-7">
          <p className="eyebrow">İstatistik · Bu cihaz</p><div className="mt-6 grid grid-cols-3 gap-3 lg:grid-cols-1">
            {[['Oynanan',stats.played],['Kazanma',`${stats.winRate}%`],['En uzun seri',stats.longest]].map(([label,value],index)=><div key={label} className={cn("game-stat",index===1&&"game-stat-mid",index===2&&"game-stat-pale")}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
          <div className="mt-8 border border-foreground p-5 text-sm leading-6"><p className="font-bold">Renklerin ipucu</p><div className="mt-4 space-y-3"><p className="flex items-center gap-3"><span className="size-4 bg-brand-dark"/>Doğru harf, doğru yer</p><p className="flex items-center gap-3"><span className="size-4 bg-brand-pale ring-1 ring-brand-mid"/>Doğru harf, farklı yer</p><p className="flex items-center gap-3"><span className="size-4 bg-muted-foreground"/>Bu harf kelimede yok</p></div></div>
        </aside>
      </div>
    </section>
  </>;
}