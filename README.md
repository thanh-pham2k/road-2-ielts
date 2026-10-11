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
