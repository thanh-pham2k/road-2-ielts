# Road to IELTS — Speaking

Website tĩnh render nội dung từ `speaking/IELTS_Speaking_Practice_Checklist.md` và `speaking/PRACTICE_LOG.md`.

## Chạy local

Yêu cầu Node.js, không cần cài dependencies.

```sh
npm run dev
```

Mở http://127.0.0.1:4173. Sau khi sửa Markdown, khởi động lại server để cập nhật dữ liệu.

## Build

```sh
npm run build
```

Upload thư mục `dist/` lên static hosting, hoặc mở trực tiếp `dist/index.html`. Đường dẫn assets tương đối nên dùng được cả dưới subpath.

Bao gồm 10 chủ đề, 100 câu hỏi, tìm kiếm, ẩn/hiện câu trả lời, routine, checklist và nhật ký. Những câu trả lời đang trống được giữ nguyên. Checklist được lưu trong localStorage của trình duyệt, không ghi ngược vào Markdown và không tự bổ sung nhật ký.

## Tự động deploy với GitHub Pages

Workflow `.github/workflows/pages.yml` tự build và deploy thư mục `dist/` mỗi lần push lên `main`. Có thể chạy thủ công trong tab Actions bằng Run workflow.

Trong Settings → Pages của repo, chọn Source: **GitHub Actions** một lần trước khi deploy. Repo private cần gói GitHub hỗ trợ Pages; không cần đổi repo thành public nếu gói tài khoản đã hỗ trợ.

URL mặc định sau khi deploy thành công: https://thanh-pham2k.github.io/road-2-ielts/

Sửa nội dung Markdown rồi commit và push; workflow tự cập nhật web. Workflow này cập nhật GitHub Pages, không cập nhật bản hosting ChatGPT Sites.
