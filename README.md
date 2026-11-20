# Agent Skills Hub (`skillhub`)

Hệ thống quản lý và đồng bộ skills dùng chung cho nhiều máy (Windows / macOS / Linux) và nhiều harness (Antigravity, Claude Code, Codex, Cursor, OpenCode, Copilot, `~/.agents`).

## Cơ chế hoạt động
- **1 nguồn duy nhất:** toàn bộ skill nằm trong `skills/<skill-name>/SKILL.md`.
- **Liên kết trực tiếp:** trên Windows tạo **Directory Junction** (không cần Admin), trên macOS/Linux tạo **Symlink** vào thư mục skills của từng harness.
- **An toàn:** chỉ quản lý các link ghi trong `.managed.json`, không đụng tới skill built-in hay skill cộng đồng. Thư mục trùng cũ được tự động backup vào `.backup/`.
- **Loại trừ theo máy:** `.local.json` (không commit) nhận `"exclude": ["<skill>"]` để bỏ skill và `"excludeMounts": ["<mount-id>"]` để giữ thư mục thật, không symlink — dùng khi bản trên máy mới hơn bản trong repo (vd. `kit` có fx chưa push).

## Lệnh hay dùng
```bash
skillhub status                 # Xem trạng thái git, profile, harness
skillhub update                 # Kéo bản mới từ Git + đồng bộ link
skillhub sync                   # Đồng bộ lại link local (sau khi thêm/xóa skill)
skillhub push "mo ta thay doi"  # Commit & push nhanh khi sửa skill
skillhub doctor                 # Kiểm tra frontmatter SKILL.md & link gãy
skillhub profile list           # Xem các profile hiện có
skillhub profile set youtube    # Chỉ cài nhóm skill YouTube trên máy này
skillhub harness disable cursor # Tắt đồng bộ cho 1 harness cụ thể
skillhub autoupdate on 60       # Tự động update mỗi 60 phút
skillhub autoupdate off         # Tắt tự động update
```

## Cài lên máy mới
**Windows (PowerShell):**
```powershell
git clone <REPO_URL> "$HOME\.agent-skills"
& "$HOME\.agent-skills\install.ps1" -RepoUrl "<REPO_URL>"
```

**macOS / Linux:**
```bash
git clone <REPO_URL> "$HOME/.agent-skills"
bash "$HOME/.agent-skills/install.sh" "<REPO_URL>"
```

## Thêm skill mới
1. Tạo thư mục `skills/<ten-skill>/SKILL.md` (có YAML frontmatter `name` và `description`).
2. Nếu dùng profile cụ thể, thêm tên skill vào `profiles.json` (profile `all` tự nhận mọi skill mới).
3. Chạy `skillhub sync` và `skillhub push "Add <ten-skill>"`.
4. Ở các máy khác chạy `skillhub update` (hoặc đợi `autoupdate`).
