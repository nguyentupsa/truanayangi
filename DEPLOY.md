# Deploy lên GitHub Pages

Bản fork này build ra site tĩnh và tự deploy bằng GitHub Actions
(`.github/workflows/deploy.yml`). Không cần `gh-pages` branch, không cần
`pages-redirect/` (đó là của repo gốc).

## Lần đầu

1. **Tạo repo riêng** trên tài khoản / tổ chức của bạn (ví dụ `ten-cua-ban/truanayangi`).
   Web: github.com/new → tạo repo trống (private hoặc public tuỳ bạn).

2. **Trỏ remote sang repo mới** rồi push:
   ```sh
   cd "truanayangi"
   git remote rename origin upstream          # giữ liên kết repo gốc để pull update
   git remote add origin https://github.com/TEN-CUA-BAN/truanayangi.git
   git add -A && git commit -m "Tuỳ chỉnh cho văn phòng: khu vực, ShopeeFood, lọc món, workflow deploy"
   git push -u origin main
   ```

3. **Bật Pages**: repo → Settings → Pages → **Build and deployment** →
   Source = **GitHub Actions**.

4. Workflow chạy ngay sau khi bật (hoặc mỗi lần push `main`, hoặc bấm
   "Run workflow" ở tab Actions). Xong sẽ có URL:
   - repo thường: `https://TEN-CUA-BAN.github.io/truanayangi/`
   - Actions → job `deploy` in ra link, Settings → Pages cũng hiển thị.

## Mỗi lần cập nhật

Chỉ cần `git push` lên `main` — workflow build + deploy lại.

## Base path

`vite.config.ts` đọc `PUBLIC_BASE_PATH`. Workflow tự lấy đúng prefix từ
`actions/configure-pages` (`/truanayangi/` cho repo thường, `/` nếu sau này
bạn gắn custom domain). Không phải sửa tay.

## Kéo update từ repo gốc (tuỳ chọn)

```sh
git fetch upstream
git merge upstream/main      # xử lý conflict ở src/lib/personal-pool.ts, i18n.ts nếu có
```

## Lưu ý

- `index.html` có `noindex,nofollow` — site không lên Google. Bỏ dòng đó nếu muốn index.
- Assets SFX/artwork có bản quyền riêng (xem `ATTRIBUTION.md`); public deploy là bạn tự chịu trách nhiệm.
- Repo gốc `truanayangi-com/truanayangi` cố tình KHÔNG deploy bản app — đừng gửi PR workflow này ngược lên đó.
