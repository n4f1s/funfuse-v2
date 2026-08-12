# FunFuse Game Content Sources

Research pass: **2026-08-12**

This file records the provenance for `src/content/games/details.ts`. The website
copy is editorially rewritten and summarized; it is **not** a verbatim copy of
store descriptions or third-party rules pages.

## Editorial policy

1. Prefer the current FunFuse Google Play listing for app identity and features.
2. For traditional game rules, cross-check established rules references when the
   Play description is incomplete, promotional, contradictory, or clearly
   describes a different game.
3. Avoid volatile values such as ratings, review counts and download counts in
   runtime content.
4. When regional rule variations exist, explain the stable core and avoid
   pretending one local variation is universal.

## Important corrections

### 3-2-5
The current FunFuse Play description contains rules for a different
four-player/bidding structure. The traditional rules reference confirms:
3 players, a 30-card pack, 10 cards each, and rotating trick quotas of 5, 3 and
2. The player with the 5-trick quota chooses trump.

- Google Play:
  https://play.google.com/store/apps/details?id=com.funfuse.doteenpanch
- Pagat:
  https://www.pagat.com/quotawhist/3-2-5.html

### Hazari
The current FunFuse Play description switches into bidding/trump rules that do
not match Hazari. The established Hazari rules use four players, 13 cards each,
a 3+3+3+4 arrangement, ranked three-card combinations, captured-card scoring and
a 1000-point target.

- Google Play:
  https://play.google.com/store/apps/details?id=com.funfuse.hazari
- Pagat:
  https://www.pagat.com/partition/hazari.html

### Omi
The current FunFuse Play description says 2–6 players and a 52-card playing
deck. Established Sri Lankan Omi uses four players in fixed partnerships and
32 playing cards (A through 7), with the remaining low cards traditionally used
as score tokens.

- Google Play:
  https://play.google.com/store/apps/details?id=com.funfuse.omiclub
- Pagat:
  https://www.pagat.com/whist/omi.html

## Sources by game

### Tongits Club Offline
- https://play.google.com/store/apps/details?id=com.funfuse.tongits
- https://www.pagat.com/rummy/tong-its.html

### Hazari Grand
- https://play.google.com/store/apps/details?id=com.funfuse.hazari
- https://www.pagat.com/partition/hazari.html

### CallBreak Club
- https://play.google.com/store/apps/details?id=com.funfuse.callbreakpro

### 3 2 5 Offline Fun Card Game
- https://play.google.com/store/apps/details?id=com.funfuse.doteenpanch
- https://www.pagat.com/quotawhist/3-2-5.html

### Gin Rummy Master Offline
- https://play.google.com/store/apps/details?id=com.funfuse.ginrummy
- https://www.pagat.com/rummy/ginrummy.html

### Tarneeb
- https://play.google.com/store/apps/details?id=com.funfuse.tarneeb
- https://www.pagat.com/auctionwhist/tarneeb.html

### Ludo Challenge Offline Play
- https://play.google.com/store/apps/details?id=com.funfuse.ludo.challenge

### Puzzle Club Offline
- https://play.google.com/store/apps/details?id=games.funfuse.puzzletwist

The current Play listing names 2048, Tic Tac Toe, Dice Down, Tetris,
Block Puzzle and SOS. Runtime copy uses the generic label "Falling Blocks" for
the falling-block mode while retaining the mechanics documented by the listing.

### Lucky 9 Offline Game
- https://play.google.com/store/apps/details?id=com.funfuse.luckynineclub

### Pusoy Offline
- https://play.google.com/store/apps/details?id=com.funfuse.pusoy
- https://www.pagat.com/partition/pusoy.html

### Pusoy Dos Offline
- https://play.google.com/store/apps/details?id=com.funfuse.pusoydos
- https://www.pagat.com/climbing/bigtwo.html

### Capsa Susun Offline
- https://play.google.com/store/apps/details?id=com.funfuse.capsasusunclub
- https://www.pagat.com/partition/pusoy.html

### Tiến Lên Club Offline
- https://play.google.com/store/apps/details?id=com.funfuse.tienlen
- https://www.pagat.com/climbing/thirteen.html

### Okey Club
- https://play.google.com/store/apps/details?id=com.funfuse.okey

### Belote Française
- https://play.google.com/store/apps/details?id=com.funfusegames.belote
- https://www.pagat.com/jass/belote.html

### Mau Mau Offline
- https://play.google.com/store/apps/details?id=com.funfuse.maumauoffline
- https://www.pagat.com/eights/

Special-card behavior is deliberately kept version-neutral because Mau Mau
variants differ and the current FunFuse listing does not document the app's
full action-card mapping.

### Thousand Offline
- https://play.google.com/store/apps/details?id=com.funfusegames.thousand
- https://www.pagat.com/marriage/1000.html

### Omi Club
- https://play.google.com/store/apps/details?id=com.funfuse.omiclub
- https://www.pagat.com/whist/omi.html

### Bhabhi Thulla Card Game
- https://play.google.com/store/apps/details?id=com.funfuse.bhabhicardgame
- https://www.pagat.com/inflation/getaway.html

## Implementation notes

- `details.ts` is plain structured data and should be rendered as React nodes.
- Do not use `dangerouslySetInnerHTML` for this content.
- Puzzle Club has `modes`; card/board titles mostly use `howToPlay`,
  `ruleGroups`, and optional `tips`.
- Keep `art.ts` responsible only for static image imports.
- Future screenshots can follow:
  `src/assets/games/<folder>/screenshots-1.webp`,
  `screenshots-2.webp`, etc.
