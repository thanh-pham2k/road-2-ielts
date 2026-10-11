# IELTS → n5-tungkinh: ghi chú cập nhật

Theo yêu cầu ngày 2026-10-11, đưa bài IELTS vào website hiện có của repo `thanh-pham2k/n5-tungkinh`.

## File nguồn và chế độ tương ứng

- `speaking/Instant_Vocab_Practice.md` → **Instant Vocab** (`instant-vocab`).
- `speaking/Word_Order_Practice.md` → **Word Order Review** (`word-order`).
- `speaking/IELTS_Speaking_Practice_Checklist.md`: câu hỏi và câu trả lời Speaking.
- `speaking/PRACTICE_LOG.md`: nhật ký học.
- `writing/Writing_Practice.md` → **Word Order Review** (`writing`), CSV 6 cột; 246 câu theo 16 chủ đề. Chỉ luyện câu, chưa làm bài dài.
- `writing/Topic_Vocabulary.md` → **Vocab Review** (`topic-vocab`), CSV 5 cột; 242 thẻ theo cùng 16 chủ đề. Xem `writing/README.md` cho quy trình học và cập nhật.
- `writing/Sentence_Structures.md` → **Sentence Structures**: 216 mẫu/ví dụ theo 16 chủ đề.

Repo `road-2-ielts` là nguồn nội dung. Giữ heading ngày `### YYYY-MM-DD` và CSV trong code fence. Instant Vocab có 5 cột; Word Order có thêm cột `word_order`, ngăn các cụm bằng `|`. Các tên cột `hiragana`, `example_ja` được giữ để tương thích app, nhưng chứa tiếng Anh; `hiragana` có thể trống. Không thêm dấu phẩy vào nội dung ô CSV khi dùng script hiện tại.

Sau khi chuyển sang n5-tungkinh, đã gỡ app web riêng, build/server scripts, package.json, manifest Sites và workflow Pages khỏi repo nguồn. Lần sau chỉ cập nhật nội dung + đồng bộ; không tạo lại web/deploy riêng ở đây. Bản ChatGPT Sites đã publish trước đó không còn là đích cập nhật.

## Quy trình lần sau

Đã chia Writing/Vocab thành 48 ngày học gợi ý (11/10–27/11/2026), mỗi ngày 5–6 câu và 4–6 thẻ cùng chủ đề. `writing/DAILY_PLAN.md` ghi lịch đầy đủ. Giữ cách chia theo ngày khi cập nhật, không gom toàn bộ về một ngày. Tổng tài liệu không đổi. Script verify kiểm tra số buổi và tổng câu/thẻ từng chủ đề.

Yêu cầu mới: chỉ luyện câu phục vụ Work English và IELTS; mở rộng collocation từng chủ đề và thêm Sentence Structures tái sử dụng. Bộ hiện tại: 16 chủ đề, 246 câu, 242 thẻ (12 mỗi nhóm Work; 17 mỗi nhóm IELTS), 216 mẫu/ví dụ. File `writing/Sentence_Structures.md` là nguồn cho mục Sentence Structures trên web. Xem `writing/README.md` để biết schema và cập nhật trực tiếp Markdown; không tạo lại bộ 30 câu/50 thẻ cũ.

1. Cập nhật Markdown trong `road-2-ielts/speaking/`; đồng bộ nội dung hai file luyện tập theo cùng ngày.
2. Pull repo đích trước khi đồng bộ để giữ các thay đổi mới.
3. Chạy `node scripts/sync-n5.mjs E:/n5-tungkinh` từ repo này. Script kiểm tra số cột và thứ tự cụm, copy Markdown vào `docs/ielts/speaking/` và `docs/ielts/writing/`, sinh `docs/ielts/practice-data.js` cho 4 bộ nội dung.
4. Kiểm tra dialog **Chọn câu IELTS…** trong Instant Vocab và Word Order Review: lọc ngày, tick từng câu rồi **Nạp các câu đã chọn**. Không chọn mặc định; giữ lựa chọn qua các bộ lọc trong lần mở dialog. Ngôn ngữ tự chuyển sang English khi nạp IELTS.
5. Add, commit, push thay đổi ở **cả hai repo**. Chỉ sửa nguồn Markdown, không sửa tay `practice-data.js`.

Website đích: https://thanh-pham2k.github.io/n5-tungkinh/ . GitHub Pages dùng `main` → `/docs`, giữ cơ chế deploy hiện có. Push thành công không đồng nghĩa Pages đã publish; kiểm tra deployment riêng. Không cần deploy lại ChatGPT Sites để cập nhật bộ bài trong n5-tungkinh.
