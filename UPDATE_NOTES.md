# IELTS → n5-tungkinh: ghi chú cập nhật

Theo yêu cầu ngày 2026-10-11, đưa bài IELTS vào website hiện có của repo `thanh-pham2k/n5-tungkinh`.

## File nguồn và chế độ tương ứng

- `speaking/Instant_Vocab_Practice.md` → **Instant Vocab** (`instant-vocab`).
- `speaking/Word_Order_Practice.md` → **Word Order Review** (`word-order`).
- `speaking/IELTS_Speaking_Practice_Checklist.md`: câu hỏi và câu trả lời Speaking.
- `speaking/PRACTICE_LOG.md`: nhật ký học.

Repo `road-2-ielts` là nguồn nội dung. Giữ heading ngày `### YYYY-MM-DD` và CSV trong code fence. Instant Vocab có 5 cột; Word Order có thêm cột `word_order`, ngăn các cụm bằng `|`. Các tên cột `hiragana`, `example_ja` được giữ để tương thích app, nhưng chứa tiếng Anh; `hiragana` có thể trống. Không thêm dấu phẩy vào nội dung ô CSV khi dùng script hiện tại.

Sau khi chuyển sang n5-tungkinh, đã gỡ app web riêng, build/server scripts, package.json, manifest Sites và workflow Pages khỏi repo nguồn. Lần sau chỉ cập nhật nội dung + đồng bộ; không tạo lại web/deploy riêng ở đây. Bản ChatGPT Sites đã publish trước đó không còn là đích cập nhật.

## Quy trình lần sau

1. Cập nhật Markdown trong `road-2-ielts/speaking/`; đồng bộ nội dung hai file luyện tập theo cùng ngày.
2. Pull repo đích trước khi đồng bộ để giữ các thay đổi mới.
3. Chạy `node scripts/sync-n5.mjs E:/n5-tungkinh` từ repo này. Script kiểm tra số cột và thứ tự cụm, copy 4 Markdown vào `docs/ielts/speaking/` và sinh `docs/ielts/practice-data.js`.
4. Kiểm tra dialog **Chọn câu IELTS…** trong Instant Vocab và Word Order Review: lọc ngày, tick từng câu rồi **Nạp các câu đã chọn**. Không chọn mặc định; giữ lựa chọn qua các bộ lọc trong lần mở dialog. Ngôn ngữ tự chuyển sang English khi nạp IELTS.
5. Add, commit, push thay đổi ở **cả hai repo**. Chỉ sửa nguồn Markdown, không sửa tay `practice-data.js`.

Website đích: https://thanh-pham2k.github.io/n5-tungkinh/ . GitHub Pages dùng `main` → `/docs`, giữ cơ chế deploy hiện có. Push thành công không đồng nghĩa Pages đã publish; kiểm tra deployment riêng. Không cần deploy lại ChatGPT Sites để cập nhật bộ bài trong n5-tungkinh.
