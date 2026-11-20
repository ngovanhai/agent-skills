# Hẹn giờ công khai một video theo tiêu đề (chỉ dùng khi người dùng đã duyệt). Nạp yt-lib.ps1 trước.
#   Schedule-Video -Tab short|upload -TitleLike '<chuỗi trong tiêu đề>' -Date '27 thg 10, 2026' -Time '15:00'
function Schedule-Video([string]$Tab, [string]$TitleLike, [string]$Date, [string]$Time) {
  YNav "https://studio.youtube.com/channel/UCmVa984PvbXOWKsLKYXbZHw/videos/$Tab"; Start-Sleep 6
  $esc = $TitleLike.Replace("'", "\'")
  $o = YEv "(() => { const r=[...document.querySelectorAll('ytcp-video-row')].find(x=>x.innerText.includes('$esc')); if(!r) return 'no row'; r.querySelector('.tablecell-visibility .icon-text-edit-triangle-wrap').click(); return 'open'; })()"
  if ($o -ne 'open') { return "LOI: $o" }
  Start-Sleep 2
  YEv "(() => { const h=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0 && e.offsetParent && /^Lên lịch$/.test((e.innerText||'').trim())); if(!h) return 'no sched'; h.click(); return 'x'; })()" | Out-Null; Start-Sleep 2
  YEv "(() => { const t=[...document.querySelectorAll('ytcp-dropdown-trigger, [role=button]')].find(e=>e.offsetParent && /thg \d+, 20/.test(e.innerText)); if(!t) return 'no trig'; t.click(); return 'x'; })()" | Out-Null; Start-Sleep 2
  YPost 'type' @{ selector = 'input:visible >> nth=3'; text = $Date; clear = $true; submit = $true } | Out-Null; Start-Sleep 2
  YPost 'type' @{ selector = 'input:visible >> nth=2'; text = $Time; clear = $true; submit = $true } | Out-Null; Start-Sleep 2
  $chk = YEv "JSON.stringify({gio:[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>i.value).filter(Boolean), ngay:[...document.querySelectorAll('ytcp-dropdown-trigger')].filter(e=>e.offsetParent).map(e=>e.innerText.trim()).filter(x=>/thg/.test(x))})"
  if ($chk -notmatch [regex]::Escape($Time) -or $chk -notmatch [regex]::Escape($Date)) {
    YEv "(() => { const c=[...document.querySelectorAll('ytcp-button, button')].filter(x=>x.offsetParent && /^Hủy$|^Huỷ$/.test(x.innerText.trim())).pop(); if(c) c.click(); return 1; })()" | Out-Null
    return "LOI ngay/gio khong khop: $chk"
  }
  YEv "(() => { const s=[...document.querySelectorAll('ytcp-button, button')].filter(x=>x.offsetParent && /^Lên lịch$/.test(x.innerText.trim())).pop(); if(!s) return 'no btn'; s.click(); return 'ok'; })()" | Out-Null; Start-Sleep 5
  $v = YEv "(() => { const r=[...document.querySelectorAll('ytcp-video-row')].find(x=>x.innerText.includes('$esc')); return r ? r.querySelector('.tablecell-visibility').innerText.replace(/\s+/g,' ').trim() : 'none'; })()"
  "$TitleLike -> $v ($Date $Time) $chk"
}
