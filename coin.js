    (() => {
      'use strict';
      const $ = id => document.getElementById(id);
      const coin = $('coin'), coinResult = $('coinResult'), flipBtn = $('flipBtn'), resetBtn = $('resetBtn'), headsCount = $('headsCount'), tailsCount = $('tailsCount'), headsPct = $('headsPct'), tailsPct = $('tailsPct'), barHeads = $('barHeads'), barTails = $('barTails'), difference = $('difference'), closerText = $('closerText'), fairnessMessage = $('fairnessMessage'), recentPills = $('recentPills'), message = $('message'), scoreRow = $('scoreRow');
      let heads = 0, tails = 0, total = 0, turns = 0, recent = [];
      function flip() {
        if (window.crypto && crypto.getRandomValues) { const a = new Uint32Array(1); crypto.getRandomValues(a); return (a[0] & 1) ? 'Tails' : 'Heads'; }
        return Math.random() < .5 ? 'Heads' : 'Tails';
      }
      function pct(n) { return total ? (n / total) * 100 : 0 }
      function refresh(result) {
        const hp = pct(heads), tp = pct(tails), d = Math.abs(hp - 50);
        headsCount.textContent = heads.toLocaleString(); tailsCount.textContent = tails.toLocaleString(); headsPct.textContent = hp.toFixed(1) + '%'; tailsPct.textContent = tp.toFixed(1) + '%'; barHeads.style.width = (total ? hp : 50) + '%'; barTails.style.width = (total ? tp : 50) + '%';
        if (!total) { difference.textContent = '—'; closerText.textContent = 'Start tossing to find out.'; fairnessMessage.textContent = 'A fair coin gives each side the same chance on every toss: 1 out of 2, or 50%.' }
        else { difference.textContent = d.toFixed(1) + '%'; closerText.textContent = d < 1 ? 'Wow — extremely close to 50–50!' : d < 3 ? 'Very close! The 50–50 pattern is showing.' : d < 7 ? 'Pretty close. More trials can smooth things out.' : 'This sample is lopsided. That is normal for a smaller sample.'; fairnessMessage.textContent = 'Heads is at ' + hp.toFixed(1) + '% and Tails is at ' + tp.toFixed(1) + '%. The difference from an even 50% split is ' + d.toFixed(1) + ' percentage points.' }
        if (result) { coinResult.textContent = result; scoreRow.classList.remove('celebrate'); void scoreRow.offsetWidth; scoreRow.classList.add('celebrate') }
        recentPills.innerHTML = ''; (recent.length ? recent : ['No tosses yet']).forEach(r => { const p = document.createElement('span'); p.className = r === 'Tails' ? 'pill tails' : 'pill'; p.textContent = r === 'Heads' ? 'H' : r === 'Tails' ? 'T' : 'No tosses yet'; p.title = r; recentPills.appendChild(p) })
      }
      function animate(result) { turns++; const rounds = 5 + (turns % 2), face = result === 'Heads' ? 0 : 180; coin.style.transform = `rotateY(${rounds * 360 + face}deg)` }
      function one() { const r = flip(); r === 'Heads' ? heads++ : tails++; total++; recent.unshift(r); recent = recent.slice(0, 24); animate(r); refresh(r); message.textContent = total === 1 ? 'Nice! One toss is far too small to look perfectly balanced.' : total === 10 ? '10 tosses done. It does not have to be exactly 50–50!' : total === 100 ? '100 tosses! The overall pattern is easier to see now.' : total === 1000 ? '1,000 tosses! Notice how the percentages settle near 50–50.' : Math.abs(pct(heads) - 50) < 2 ? 'Your experiment is getting very close to 50–50.' : 'Keep going! Bigger samples often make the percentages settle down.' }
      async function many(n) { flipBtn.disabled = true; for (let i = 0; i < n; i++) { one(); if (i % 50 === 49) await new Promise(r => setTimeout(r, 16)) } flipBtn.disabled = false }
      flipBtn.addEventListener('click', () => many(1)); document.querySelectorAll('[data-batch]').forEach(b => b.addEventListener('click', () => many(Number(b.dataset.batch)))); resetBtn.addEventListener('click', () => { heads = tails = total = turns = 0; recent = []; coin.style.transform = 'rotateY(0deg)'; coinResult.textContent = 'Ready?'; message.textContent = "Your first toss is a tiny experiment. Let's see what happens!"; refresh() }); refresh();
    })();
