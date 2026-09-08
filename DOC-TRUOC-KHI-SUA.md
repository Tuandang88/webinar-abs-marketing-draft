# Trang web webinar — đọc trước khi sửa

> Cập nhật: 15/08/2026 · Chốt theo chỉ đạo ông chủ: **nguồn để trong team-kit, trang vẫn chạy từ GitHub riêng của Tuấn để share được với team.**

## Hai nơi, hai vai trò

| | Ở đâu | Vai trò |
|---|---|---|
| **Bản thảo** | Thư mục này (`web/` trong team-kit) | **Nơi duy nhất được sửa.** Cả team thấy, có lịch sử thay đổi chung với nội dung bài viết |
| **Bản in** | `github.com/Tuandang88/webinar-abs-marketing-draft` | Chỉ để hiển thị ra web. **Không sửa tay ở đây** |

Ví von: thư mục này là bản thảo, kho GitHub kia là bản đem đi in. Sửa bản thảo rồi bấm "in" một cái.

## Cách đăng — một câu lệnh

```bash
cd F-cho-cs-tuan/webinar-ai-agent-marketing/web
./dang-trang.sh "sửa tiêu đề bài 3"
```

Lệnh sẽ tự: lấy bản mới nhất từ GitHub về → chép nội dung từ đây sang → đăng lên → in ra địa chỉ để bấm xem. GitHub cần khoảng 1 phút để trang cập nhật.

## Các trang đang chạy

| Trang | Địa chỉ | Dùng để |
|---|---|---|
| Trang duyệt social | https://tuandang88.github.io/webinar-abs-marketing-draft/duyet-social/ | Sếp Đạt duyệt nội dung + hình từng buổi. Có nút Duyệt / Yêu cầu chỉnh sửa / Tải ảnh |
| Landing chuỗi webinar | https://tuandang88.github.io/webinar-abs-marketing-draft/ | Landing chuỗi "AI CAN, YOU KNOW?" |
| Landing B2B cho CEO | https://tuandang88.github.io/webinar-abs-marketing-draft/b2b-ceo/ | Webinar bán gói Enterprise Launch |

Bản duyệt các buổi cũ: `/duyet-social/buoi-1/` · `/duyet-social/buoi-2/`

## ⚠️ Hai điều phải nhớ

**1. Đừng sửa tay bên kho GitHub.** Lệnh đăng đồng bộ hai bên cho khớp nhau, nên file nào chỉ có bên đó mà không có trong thư mục này **sẽ bị xoá** ở lần đăng sau.

**2. Trang duyệt phải lấy nội dung từ file gốc, không chép lại.** Ngày 15/08 đã xảy ra: dựng trang duyệt buổi 3 bằng cách chép lại bản nháp thay vì đọc từ `content-gioi-thieu-buoi-3.md` mà ông chủ đã chỉnh tay → tiêu đề bài 3 trên trang lệch với file, phải sửa lại hai nơi.

## Vì sao không gộp hẳn vào GitHub của team

Đã kiểm tra ngày 15/08: tài khoản Tuandang88 **không có quyền quản trị** trên `maixuandat-bot/agentboss-team-kit` (đẩy file lên được nhờ khoá SSH, nhưng hỏi cài đặt kho thì GitHub trả về "không tìm thấy"). Muốn bật hiển thị web ở đó phải nhờ sếp Đạt.

Và kể cả bật được cũng không nên: **GitHub chỉ cho bật cả kho, không bật lẻ một thư mục** — nghĩa là công khai luôn nhật ký công việc, kế hoạch doanh thu và tài liệu nội bộ của cả team.
