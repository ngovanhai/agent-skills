#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_DIR = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(REPO_DIR, 'skills');
const HARNESSES_FILE = path.join(REPO_DIR, 'harnesses.json');
const PROFILES_FILE = path.join(REPO_DIR, 'profiles.json');
const MOUNTS_FILE = path.join(REPO_DIR, 'mounts.json');
const LOCAL_CONFIG_FILE = path.join(REPO_DIR, '.local.json');
const MANAGED_FILE = path.join(REPO_DIR, '.managed.json');
const BACKUP_ROOT = path.join(REPO_DIR, '.backup');
const HOME = os.homedir();
const IS_WIN = process.platform === 'win32';

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function listRepoSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .filter((d) => fs.existsSync(path.join(SKILLS_DIR, d.name, 'SKILL.md')))
    .map((d) => d.name)
    .sort();
}

function loadHarnesses() {
  const data = readJson(HARNESSES_FILE, { harnesses: {} });
  return data.harnesses || {};
}

function loadProfiles() {
  return readJson(PROFILES_FILE, { default: ['all'], profiles: { all: { skills: ['*'] } } });
}

function loadMounts() {
  const data = readJson(MOUNTS_FILE, { mounts: [] });
  return data.mounts || [];
}

function resolveDesiredMounts(localCfg, allMounts) {
  const active = new Set(localCfg.profiles || ['all']);
  return allMounts.filter((m) => {
    const srcPath = path.join(REPO_DIR, m.source);
    if (!fs.existsSync(srcPath)) return false;
    if (!m.profiles || m.profiles.length === 0) return true;
    return m.profiles.some((p) => active.has(p));
  });
}

function detectInstalledHarnesses(harnesses) {
  const detected = [];
  for (const [id, cfg] of Object.entries(harnesses)) {
    const detectPath = path.join(HOME, cfg.detectDir);
    if (fs.existsSync(detectPath)) {
      detected.push(id);
    }
  }
  return detected;
}

function loadLocalConfig(harnesses, profilesCfg) {
  const existing = readJson(LOCAL_CONFIG_FILE);
  if (existing) return existing;
  return {
    profiles: profilesCfg.default || ['all'],
    harnesses: detectInstalledHarnesses(harnesses),
    exclude: [],
  };
}

function loadManaged() {
  return readJson(MANAGED_FILE, { links: {} });
}

function resolveDesiredSkills(localCfg, profilesCfg, allRepoSkills) {
  const set = new Set();
  const activeProfiles = localCfg.profiles || ['all'];
  for (const pName of activeProfiles) {
    const p = profilesCfg.profiles?.[pName];
    if (!p) {
      console.warn(`[warn] Profile khong ton tai: ${pName}`);
      continue;
    }
    for (const s of p.skills || []) {
      if (s === '*') {
        for (const repoSkill of allRepoSkills) set.add(repoSkill);
      } else if (allRepoSkills.includes(s)) {
        set.add(s);
      }
    }
  }
  for (const ex of localCfg.exclude || []) {
    set.delete(ex);
  }
  return [...set].sort();
}

function isSymlinkOrJunction(targetPath) {
  try {
    const stat = fs.lstatSync(targetPath);
    return stat.isSymbolicLink();
  } catch {
    return false;
  }
}

function getLinkTarget(targetPath) {
  try {
    return path.resolve(path.dirname(targetPath), fs.readlinkSync(targetPath));
  } catch {
    return null;
  }
}

function createDirLink(sourceDir, targetLink) {
  const parent = path.dirname(targetLink);
  fs.mkdirSync(parent, { recursive: true });
  // Windows: 'junction' works without Admin privileges
  // macOS/Linux: 'dir' creates standard symlink
  fs.symlinkSync(sourceDir, targetLink, IS_WIN ? 'junction' : 'dir');
}

function removeDirLink(targetLink) {
  // On Windows, rmdirSync / rmSync on a junction removes only the junction, not the target
  if (IS_WIN) {
    fs.rmSync(targetLink, { recursive: false, force: true });
  } else {
    fs.unlinkSync(targetLink);
  }
}

function backupRealDir(targetPath, harnessId, skillName, stamp) {
  const dest = path.join(BACKUP_ROOT, stamp, harnessId, skillName);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    fs.renameSync(targetPath, dest);
  } catch {
    // Fallback across volumes
    fs.cpSync(targetPath, dest, { recursive: true });
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
  return dest;
}

function runGit(args, opts = {}) {
  return execFileSync('git', ['-C', REPO_DIR, ...args], {
    encoding: 'utf8',
    stdio: opts.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
  });
}

function cmdInit(args) {
  const harnesses = loadHarnesses();
  const profilesCfg = loadProfiles();

  let chosenProfiles = profilesCfg.default || ['all'];
  let chosenHarnesses = detectInstalledHarnesses(harnesses);

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--profiles' && args[i + 1]) {
      chosenProfiles = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    } else if (args[i] === '--harnesses' && args[i + 1]) {
      const val = args[++i];
      chosenHarnesses =
        val === 'auto'
          ? detectInstalledHarnesses(harnesses)
          : val.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  const localCfg = {
    profiles: chosenProfiles,
    harnesses: chosenHarnesses,
    exclude: [],
  };
  writeJson(LOCAL_CONFIG_FILE, localCfg);
  console.log(`Da luu cau hinh may tai ${LOCAL_CONFIG_FILE}`);
  console.log(`  Profiles : ${localCfg.profiles.join(', ')}`);
  console.log(`  Harnesses: ${localCfg.harnesses.join(', ') || '(khong tim thay)'}`);
}

function cmdSync(args) {
  const dryRun = args.includes('--dry-run');
  const harnesses = loadHarnesses();
  const profilesCfg = loadProfiles();
  if (!fs.existsSync(LOCAL_CONFIG_FILE)) {
    cmdInit([]);
  }
  const localCfg = loadLocalConfig(harnesses, profilesCfg);
  const allRepoSkills = listRepoSkills();
  const desiredSkills = resolveDesiredSkills(localCfg, profilesCfg, allRepoSkills);
  const managed = loadManaged();
  const prevLinks = managed.links || {};
  const nextLinks = {};
  const prevMounts = managed.mounts || {};
  const nextMounts = {};
  const desiredMounts = resolveDesiredMounts(localCfg, loadMounts());

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  let created = 0;
  let updated = 0;
  let unchanged = 0;
  let removed = 0;
  let backedUp = 0;

  // 1. Ensure desired links exist
  for (const hId of localCfg.harnesses || []) {
    const hCfg = harnesses[hId];
    if (!hCfg) {
      console.warn(`[warn] Harness khong ton tai trong harnesses.json: ${hId}`);
      continue;
    }
    const targetBase = path.join(HOME, hCfg.skillsDir);

    for (const skill of desiredSkills) {
      const sourceDir = path.join(SKILLS_DIR, skill);
      const targetLink = path.join(targetBase, skill);
      const key = `${hId}:${skill}`;

      const exists = fs.existsSync(targetLink) || isSymlinkOrJunction(targetLink);
      if (exists) {
        if (isSymlinkOrJunction(targetLink)) {
          const currentTarget = getLinkTarget(targetLink);
          if (currentTarget && path.resolve(currentTarget).toLowerCase() === path.resolve(sourceDir).toLowerCase()) {
            unchanged++;
            nextLinks[key] = targetLink;
            continue;
          }
          // Link points elsewhere -> replace
          if (dryRun) {
            console.log(`[dry-run] relink ${targetLink} -> ${sourceDir}`);
          } else {
            removeDirLink(targetLink);
            createDirLink(sourceDir, targetLink);
          }
          updated++;
          nextLinks[key] = targetLink;
        } else {
          // Real folder/file exists -> backup then link
          if (dryRun) {
            console.log(`[dry-run] backup & link ${targetLink} -> ${sourceDir}`);
          } else {
            const bak = backupRealDir(targetLink, hId, skill, stamp);
            console.log(`[backup] ${targetLink} -> ${bak}`);
            createDirLink(sourceDir, targetLink);
          }
          backedUp++;
          created++;
          nextLinks[key] = targetLink;
        }
      } else {
        if (dryRun) {
          console.log(`[dry-run] link ${targetLink} -> ${sourceDir}`);
        } else {
          createDirLink(sourceDir, targetLink);
        }
        created++;
        nextLinks[key] = targetLink;
      }
    }
  }

  // 2. Clean up stale managed links (removed skills, disabled harnesses, or profile changes)
  for (const [key, oldPath] of Object.entries(prevLinks)) {
    if (nextLinks[key]) continue;
    if (isSymlinkOrJunction(oldPath)) {
      const target = getLinkTarget(oldPath);
      const insideRepo = target && path.resolve(target).toLowerCase().startsWith(path.resolve(SKILLS_DIR).toLowerCase());
      if (insideRepo || !fs.existsSync(oldPath)) {
        if (dryRun) {
          console.log(`[dry-run] unlink stale ${oldPath}`);
        } else {
          removeDirLink(oldPath);
        }
        removed++;
      }
    }
  }

  // 3. Ensure desired shared mounts exist
  for (const m of desiredMounts) {
    const sourceDir = path.join(REPO_DIR, m.source);
    const targetLink = path.join(HOME, m.target);
    const exists = fs.existsSync(targetLink) || isSymlinkOrJunction(targetLink);
    if (exists) {
      if (isSymlinkOrJunction(targetLink)) {
        const currentTarget = getLinkTarget(targetLink);
        if (currentTarget && path.resolve(currentTarget).toLowerCase() === path.resolve(sourceDir).toLowerCase()) {
          unchanged++;
          nextMounts[m.id] = targetLink;
          continue;
        }
        if (dryRun) {
          console.log(`[dry-run] relink mount ${targetLink} -> ${sourceDir}`);
        } else {
          removeDirLink(targetLink);
          createDirLink(sourceDir, targetLink);
        }
        updated++;
        nextMounts[m.id] = targetLink;
      } else {
        if (dryRun) {
          console.log(`[dry-run] backup & link mount ${targetLink} -> ${sourceDir}`);
        } else {
          const bak = backupRealDir(targetLink, '_mounts', m.id, stamp);
          console.log(`[backup] ${targetLink} -> ${bak}`);
          createDirLink(sourceDir, targetLink);
        }
        backedUp++;
        created++;
        nextMounts[m.id] = targetLink;
      }
    } else {
      if (dryRun) {
        console.log(`[dry-run] link mount ${targetLink} -> ${sourceDir}`);
      } else {
        createDirLink(sourceDir, targetLink);
      }
      created++;
      nextMounts[m.id] = targetLink;
    }
  }

  // 4. Clean up stale managed mounts
  for (const [mId, oldPath] of Object.entries(prevMounts)) {
    if (nextMounts[mId]) continue;
    if (isSymlinkOrJunction(oldPath)) {
      const target = getLinkTarget(oldPath);
      const insideRepo = target && path.resolve(target).toLowerCase().startsWith(path.resolve(REPO_DIR).toLowerCase());
      if (insideRepo || !fs.existsSync(oldPath)) {
        if (dryRun) {
          console.log(`[dry-run] unlink stale mount ${oldPath}`);
        } else {
          removeDirLink(oldPath);
        }
        removed++;
      }
    }
  }

  if (!dryRun) {
    writeJson(MANAGED_FILE, {
      updatedAt: new Date().toISOString(),
      links: nextLinks,
      mounts: nextMounts,
    });
  }

  console.log(
    `[sync${dryRun ? ' dry-run' : ''}] skills=${desiredSkills.length}, harnesses=${(localCfg.harnesses || []).length}, mounts=${desiredMounts.length} | created=${created}, relinked=${updated}, unchanged=${unchanged}, removed=${removed}, backedUp=${backedUp}`
  );
}

function cmdUpdate(args) {
  let hasRemote = false;
  try {
    const remotes = runGit(['remote']).trim();
    hasRemote = remotes.length > 0;
  } catch {
    hasRemote = false;
  }

  if (hasRemote) {
    console.log('[update] Dang keo ban moi tu git remote...');
    try {
      runGit(['pull', '--ff-only'], { inherit: true });
    } catch (err) {
      console.error('[error] git pull --ff-only that bai. Hay kiem tra thay doi chua commit trong repo.');
      process.exitCode = 1;
      return;
    }
  } else {
    console.log('[update] Repo chua gan git remote (bo qua git pull, chi chay sync local).');
  }

  cmdSync(args);
}

function cmdPush(args) {
  const msg = args.join(' ').trim() || `Update skills (${new Date().toISOString().slice(0, 16).replace('T', ' ')})`;
  const status = runGit(['status', '--porcelain']).trim();
  if (!status) {
    console.log('[push] Khong co thay doi nao can commit.');
    return;
  }
  runGit(['add', '-A'], { inherit: true });
  runGit(['commit', '-m', msg], { inherit: true });
  const remotes = runGit(['remote']).trim();
  if (remotes) {
    runGit(['push'], { inherit: true });
  } else {
    console.log('[push] Da commit local. Chua co remote nen chua push (dung: git -C ~/.agent-skills remote add origin <url>).');
  }
}

function cmdStatus() {
  const harnesses = loadHarnesses();
  const profilesCfg = loadProfiles();
  const localCfg = loadLocalConfig(harnesses, profilesCfg);
  const allRepoSkills = listRepoSkills();
  const desiredSkills = resolveDesiredSkills(localCfg, profilesCfg, allRepoSkills);

  console.log(`Repo      : ${REPO_DIR}`);
  try {
    const branch = runGit(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
    const remote = runGit(['remote', '-v']).trim().split('\n')[0] || '(chua gan remote)';
    const dirty = runGit(['status', '--porcelain']).trim().split('\n').filter(Boolean).length;
    console.log(`Git       : branch=${branch}, dirty=${dirty}, remote=${remote}`);
  } catch {
    console.log(`Git       : (chua khoi tao git)`);
  }
  console.log(`Profiles  : ${(localCfg.profiles || []).join(', ')}`);
  console.log(`Skills    : ${desiredSkills.length}/${allRepoSkills.length} (${desiredSkills.join(', ')})`);
  console.log('\nHarnesses:');

  for (const [id, cfg] of Object.entries(harnesses)) {
    const enabled = (localCfg.harnesses || []).includes(id);
    const detected = fs.existsSync(path.join(HOME, cfg.detectDir));
    const targetBase = path.join(HOME, cfg.skillsDir);
    let ok = 0;
    let missing = 0;
    let conflict = 0;
    if (enabled) {
      for (const s of desiredSkills) {
        const p = path.join(targetBase, s);
        const src = path.join(SKILLS_DIR, s);
        if (isSymlinkOrJunction(p)) {
          const tgt = getLinkTarget(p);
          if (tgt && path.resolve(tgt).toLowerCase() === path.resolve(src).toLowerCase()) ok++;
          else conflict++;
        } else if (fs.existsSync(p)) {
          conflict++;
        } else {
          missing++;
        }
      }
    }
    const state = enabled ? `ON  (ok=${ok}, missing=${missing}, conflict=${conflict})` : `OFF (detected=${detected})`;
    console.log(`  - ${id.padEnd(12)} ${state}  -> ~/${cfg.skillsDir}`);
  }

  const desiredMounts = resolveDesiredMounts(localCfg, loadMounts());
  if (desiredMounts.length > 0) {
    console.log('\nShared Mounts:');
    for (const m of desiredMounts) {
      const p = path.join(HOME, m.target);
      const src = path.join(REPO_DIR, m.source);
      let st = 'MISSING';
      if (isSymlinkOrJunction(p)) {
        const tgt = getLinkTarget(p);
        st = tgt && path.resolve(tgt).toLowerCase() === path.resolve(src).toLowerCase() ? 'OK' : 'WRONG';
      } else if (fs.existsSync(p)) {
        st = 'REAL_DIR';
      }
      console.log(`  - ${m.id.padEnd(26)} ${st.padEnd(8)} ~/${m.target} -> ${m.source}`);
    }
  }
}

function cmdDoctor() {
  const harnesses = loadHarnesses();
  const profilesCfg = loadProfiles();
  const localCfg = loadLocalConfig(harnesses, profilesCfg);
  const allRepoSkills = listRepoSkills();
  let issues = 0;

  console.log('=== 1. Kiem tra SKILL.md trong repo ===');
  for (const s of allRepoSkills) {
    const mdPath = path.join(SKILLS_DIR, s, 'SKILL.md');
    const content = fs.readFileSync(mdPath, 'utf8');
    const hasFrontmatter = content.startsWith('---');
    const hasName = /^name:\s*.+/m.test(content);
    const hasDesc = /^description:\s*.+/m.test(content);
    if (!hasFrontmatter || !hasName || !hasDesc) {
      console.log(`  [FAIL] ${s}/SKILL.md thieu frontmatter chuan (name/description)`);
      issues++;
    } else {
      console.log(`  [OK]   ${s}`);
    }
  }

  console.log('\n=== 2. Kiem tra link trong cac harness ===');
  const desired = resolveDesiredSkills(localCfg, profilesCfg, allRepoSkills);
  for (const hId of localCfg.harnesses || []) {
    const hCfg = harnesses[hId];
    if (!hCfg) continue;
    const base = path.join(HOME, hCfg.skillsDir);
    for (const s of desired) {
      const p = path.join(base, s);
      const src = path.join(SKILLS_DIR, s);
      if (isSymlinkOrJunction(p)) {
        const tgt = getLinkTarget(p);
        if (!fs.existsSync(p)) {
          console.log(`  [BROKEN] ${p} -> ${tgt}`);
          issues++;
        } else if (path.resolve(tgt).toLowerCase() !== path.resolve(src).toLowerCase()) {
          console.log(`  [WRONG]  ${p} -> ${tgt} (expected ${src})`);
          issues++;
        }
      } else if (fs.existsSync(p)) {
        console.log(`  [REAL]   ${p} dang la thu muc that, chua link (chay: skillhub sync)`);
        issues++;
      } else {
        console.log(`  [MISS]   ${p} chua duoc link (chay: skillhub sync)`);
        issues++;
      }
    }
  }

  console.log('\n=== 3. Kiem tra shared mounts ===');
  for (const m of resolveDesiredMounts(localCfg, loadMounts())) {
    const p = path.join(HOME, m.target);
    const src = path.join(REPO_DIR, m.source);
    if (isSymlinkOrJunction(p)) {
      const tgt = getLinkTarget(p);
      if (!fs.existsSync(p)) {
        console.log(`  [BROKEN] ${p} -> ${tgt}`);
        issues++;
      } else if (path.resolve(tgt).toLowerCase() !== path.resolve(src).toLowerCase()) {
        console.log(`  [WRONG]  ${p} -> ${tgt} (expected ${src})`);
        issues++;
      }
    } else if (fs.existsSync(p)) {
      console.log(`  [REAL]   ${p} dang la thu muc that, chua link (chay: skillhub sync)`);
      issues++;
    } else {
      console.log(`  [MISS]   ${p} chua duoc link (chay: skillhub sync)`);
      issues++;
    }
  }

  console.log(`\nKet qua doctor: ${issues === 0 ? 'SACH SE (0 loi)' : `${issues} van de can xu ly`}`);
  if (issues > 0) process.exitCode = 1;
}

function cmdProfile(args) {
  const harnesses = loadHarnesses();
  const profilesCfg = loadProfiles();
  const localCfg = loadLocalConfig(harnesses, profilesCfg);
  const sub = args[0] || 'list';

  if (sub === 'list') {
    for (const [name, p] of Object.entries(profilesCfg.profiles || {})) {
      const active = (localCfg.profiles || []).includes(name) ? '*' : ' ';
      console.log(` ${active} ${name.padEnd(12)} - ${p.description || ''} [${(p.skills || []).join(', ')}]`);
    }
    return;
  }
  if (sub === 'set' && args[1]) {
    localCfg.profiles = args[1].split(',').map((s) => s.trim()).filter(Boolean);
    writeJson(LOCAL_CONFIG_FILE, localCfg);
    console.log(`Da doi profile thanh: ${localCfg.profiles.join(', ')}`);
    cmdSync([]);
    return;
  }
  console.log('Dung: skillhub profile list | skillhub profile set <p1,p2>');
}

function cmdHarness(args) {
  const harnesses = loadHarnesses();
  const profilesCfg = loadProfiles();
  const localCfg = loadLocalConfig(harnesses, profilesCfg);
  const sub = args[0] || 'list';
  const id = args[1];

  if (sub === 'list') {
    for (const [hId, cfg] of Object.entries(harnesses)) {
      const on = (localCfg.harnesses || []).includes(hId) ? 'ON ' : 'OFF';
      console.log(` [${on}] ${hId.padEnd(12)} (${cfg.label}) -> ~/${cfg.skillsDir}`);
    }
    return;
  }
  if ((sub === 'enable' || sub === 'disable') && id) {
    if (!harnesses[id]) {
      console.error(`Khong tim thay harness: ${id}`);
      process.exitCode = 1;
      return;
    }
    const set = new Set(localCfg.harnesses || []);
    if (sub === 'enable') set.add(id);
    else set.delete(id);
    localCfg.harnesses = [...set];
    writeJson(LOCAL_CONFIG_FILE, localCfg);
    console.log(`Da ${sub} harness: ${id}`);
    cmdSync([]);
    return;
  }
  console.log('Dung: skillhub harness list | enable <id> | disable <id>');
}

function cmdAutoUpdate(args) {
  const action = args[0] || 'status';
  const minutes = Math.max(5, parseInt(args[1] || '60', 10) || 60);
  const taskName = 'SkillHubAutoUpdate';

  if (IS_WIN) {
    if (action === 'on') {
      const nodeExe = process.execPath;
      const script = __filename;
      const tr = `"${nodeExe}" "${script}" update`;
      execFileSync(
        'schtasks',
        ['/Create', '/TN', taskName, '/TR', tr, '/SC', 'MINUTE', '/MO', String(minutes), '/F'],
        { stdio: 'inherit' }
      );
      console.log(`Da bat auto-update moi ${minutes} phut (Windows Task Scheduler: ${taskName}).`);
    } else if (action === 'off') {
      try {
        execFileSync('schtasks', ['/Delete', '/TN', taskName, '/F'], { stdio: 'inherit' });
        console.log(`Da tat auto-update (${taskName}).`);
      } catch {
        console.log('Chua co task auto-update nao dang bat.');
      }
    } else {
      try {
        execFileSync('schtasks', ['/Query', '/TN', taskName, '/FO', 'LIST'], { stdio: 'inherit' });
      } catch {
        console.log('Auto-update dang TAT.');
      }
    }
    return;
  }

  // macOS / Linux via crontab
  const marker = '# skillhub-autoupdate';
  const cronLine = `*/${Math.min(59, minutes)} * * * * "${process.execPath}" "${__filename}" update >> "${path.join(REPO_DIR, '.autoupdate.log')}" 2>&1 ${marker}`;
  let current = '';
  try {
    current = execFileSync('crontab', ['-l'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    current = '';
  }
  const filtered = current
    .split('\n')
    .filter((l) => l.trim() && !l.includes(marker));

  if (action === 'on') {
    filtered.push(cronLine);
    execFileSync('crontab', ['-'], { input: filtered.join('\n') + '\n', encoding: 'utf8' });
    console.log(`Da bat auto-update qua crontab moi ${Math.min(59, minutes)} phut.`);
  } else if (action === 'off') {
    execFileSync('crontab', ['-'], { input: filtered.join('\n') + (filtered.length ? '\n' : ''), encoding: 'utf8' });
    console.log('Da tat auto-update khoi crontab.');
  } else {
    const active = current.split('\n').find((l) => l.includes(marker));
    console.log(active ? `Auto-update dang BAT: ${active}` : 'Auto-update dang TAT.');
  }
}

function printHelp() {
  console.log(`skillhub - Quan ly & dong bo agent skills da may / da harness

Lenh:
  skillhub init [--profiles all|youtube] [--harnesses auto|antigravity,claude]
  skillhub sync [--dry-run]            Dong bo junction/symlink vao cac harness
  skillhub update                      git pull --ff-only + sync
  skillhub push [message]              git add + commit + push nhanh
  skillhub status                      Xem trang thai repo, profile & harness
  skillhub doctor                      Kiem tra SKILL.md va link gãy/trùng
  skillhub profile list|set <p1,p2>    Xem hoac doi profile cho may nay
  skillhub harness list|enable|disable Bat/tat harness cho may nay
  skillhub autoupdate on [phut]|off|status
`);
}

const [, , cmd, ...rest] = process.argv;
switch (cmd) {
  case 'init':
    cmdInit(rest);
    break;
  case 'sync':
    cmdSync(rest);
    break;
  case 'update':
    cmdUpdate(rest);
    break;
  case 'push':
    cmdPush(rest);
    break;
  case 'status':
    cmdStatus();
    break;
  case 'doctor':
    cmdDoctor();
    break;
  case 'profile':
    cmdProfile(rest);
    break;
  case 'harness':
    cmdHarness(rest);
    break;
  case 'autoupdate':
    cmdAutoUpdate(rest);
    break;
  default:
    printHelp();
    break;
}
