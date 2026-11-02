/* ===== EXPORT FOR WEBSITE (prototype for wake.mobi, 23 Oct): the song as the tracker shows it, one lane per track
   that plays, timed exactly as RENDER SONG renders it (the same sequencer, the same once-through from RENDER FROM).
   The website's little tracker scrolls these lanes in time with the rendered mix.
   Goes inside the app's main scope, next to RENDER SONG. To take it out: delete this block and its File menu item.

   The file it describes (app 'thunder-web', v 1):
     name, bpm, lpb       the song's name and tempo (the timeline is exact even when commands change the tempo)
     end                  ms, when the last step finishes
     dict                 every distinct cell text once; lanes point into it ('' = an empty row)
     lanes[]              one per track that has notes and isn't muted:
       n, name, poly        track number (1-based), its name (track name, else the pad it plays most), mono or poly
       t[], c[], s[], r[]   per step: time in ms, cell (index into dict), phrase row, song row
       m[]                  (only when the track has muted song blocks) the steps that don't sound, as
                            [first, end) index ranges: the block is muted, so its notes are shown but not played
   Cell text: "NOTE INST VOL FX1 FX2 FX3", e.g. "C-4 01 40 DEL03"; a poly track adds its chord after the note ("C-4+eg").
   Each FX is a command and its value ("RET22"); empty FX at the end are left off, and an empty one before a used
   one is "-----". */
function webTimeline(){
  const seq = makeSeq(S, 'song', {row:S.renderFrom, once:true});
  if (!seq.alive()) return null;
  const steps = [], notes = []; let guard = 0, last = 0;
  while (seq.alive() && seq.time < 1200 && guard++ < 100000){
    const r = seq.step(); steps.push(r); last = r.t + (r.line || 0);
    for (const e of r.evs) if (e.type === 'note' && kit.voices[e.pad]) notes.push(e);
  }
  const keep = []; for (let t = 0; t < NT; t++) if (audible(t) && notes.some(e => e.track === t)) keep.push(t);
  const dict = [''], di = new Map([['', 0]]);
  const id = s => { let k = di.get(s); if (k == null){ k = dict.length; dict.push(s); di.set(s, k); } return k; };
  const cellOf = (row, poly) => {
    if (!row || row.every(v => v < 0)) return '';
    let n = noteS(row[0]);
    if (poly){ const more = row.slice(1, NCOL).filter(v => v >= 0); if (more.length) n += '+' + more.map(v => v === OFF ? '×' : NBL[v % 12]).join(''); }
    const fxs = []; for (let k = FX0; k < RW; k += 2) fxs.push(row[k] >= 0 ? (FXC[row[k]] || '???') + h2(row[k + 1]) : '-----');
    while (fxs.length && fxs[fxs.length - 1] === '-----') fxs.pop();
    return n + ' ' + h2(row[IC]) + ' ' + h2(row[VC]) + (fxs.length ? ' ' + fxs.join(' ') : '');
  };
  const lanes = keep.map(t => ({n:t + 1, name:tName(t) || stemName(t, notes), poly:isPolyT(t), t:[], c:[], s:[], r:[], m:[]}));
  const at = new Map(keep.map((t, i) => [t, lanes[i]]));
  for (const st of steps) for (const [t, L] of at){
    const p = st.pos[t]; if (!p) continue;
    const ph = p.phrase >= 0 ? S.phrases[p.phrase] : null;
    L.t.push(Math.round(st.t * 1000)); L.c.push(id(cellOf(ph ? ph[p.step] : null, L.poly))); L.s.push(p.step); L.r.push(p.row);
    // a muted song block still runs its rows but its notes are dropped (as makeSeq does): mark those steps
    if (blockMuted(S, p.row, t)){ const k = L.t.length - 1, last = L.m[L.m.length - 1]; if (last && last[1] === k) last[1] = k + 1; else L.m.push([k, k + 1]); }
  }
  for (const L of lanes) if (!L.m.length) delete L.m;
  return {app:'thunder-web', v:1, name:S.name || 'Song', bpm:S.bpm, lpb:S.lpb || 4, end:Math.round(last * 1000), dict, lanes};
}
