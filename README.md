# Road to IELTS — Speaking và Academic Writing

Repo nguồn cho nội dung IELTS Speaking. Website luyện tập nằm trong repo [n5-tungkinh](https://github.com/thanh-pham2k/n5-tungkinh), tại https://thanh-pham2k.github.io/n5-tungkinh/.

## Nội dung

- `speaking/Instant_Vocab_Practice.md` → Instant Vocab.
- `speaking/Word_Order_Practice.md` → Word Order Review.
- `speaking/IELTS_Speaking_Practice_Checklist.md` → câu hỏi, đáp án và checklist.
- `speaking/PRACTICE_LOG.md` → nhật ký luyện tập.
- `writing/Writing_Practice.md` → Word Order: luyện từng câu từ dễ đến khó.
- `writing/Topic_Vocabulary.md` → Vocab Review: từ vựng theo 10 chủ đề.

## Cập nhật website

Sửa Markdown tại đây, pull repo n5-tungkinh, rồi chạy bằng Node.js (không cần cài dependencies):

```sh
node scripts/sync-n5.mjs E:/n5-tungkinh
```

Script kiểm tra dữ liệu, copy Markdown và sinh bộ bài theo ngày cho Instant Vocab / Word Order. Sau đó kiểm tra và commit/push cả hai repo. GitHub Pages của n5-tungkinh publish từ `main` → `/docs`.

Xem [UPDATE_NOTES.md](UPDATE_NOTES.md) để biết quy trình cập nhật chi tiết. Repo này không còn chứa app web hay workflow deploy riêng.
