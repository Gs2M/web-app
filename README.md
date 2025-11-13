# HTML Bootstrap jQuery App

## Giới thiệu
Đây là một ứng dụng web mẫu được xây dựng bằng HTML, CSS, Bootstrap và jQuery. Mục tiêu của dự án là làm khuôn mẫu để phát triển các trang web đáp ứng và có tính tương tác cao.

## Nội dung dự án (web-app)

Tài liệu này đã được cập nhật để phản ánh các file hiện có trong repository và hướng dẫn cách thiết lập, chạy bằng Docker / Docker Compose hoặc chạy nhanh cục bộ.

## Tổng quan
Web-app là một ứng dụng tĩnh (HTML/CSS/JS) được phục vụ bởi một ứng dụng Node/Express nhẹ (`server.js`). Dự án sử dụng Bootstrap + SCSS, có các component header/footer, và nhiều hình ảnh trong `public/images`.

## Cấu trúc chính
```
web-app/
├─ src/                 # Tài nguyên HTML/CSS/JS được phục vụ
│  ├─ index.html
│  ├─ pages/
│  ├─ components/
│  ├─ css/
│  ├─ scss/
│  └─ js/
├─ public/              # Nội dung tĩnh (images, media)
├─ server.js            # Express static server
├─ package.json
├─ Dockerfile
├─ docker-compose.yml
├─ build.ps1            # launcher PowerShell cho Cake (nếu dùng)
├─ buildcake.ps1        # helper PowerShell (build / run docker)
├─ build.cake           # Cake build script (nếu bạn dùng Cake)
└─ README.md
```

## Yêu cầu (Prerequisites)
- Node.js (v16+ hoặc v18+) và npm
- Docker & Docker Compose (nếu muốn chạy bằng container)
- (Tùy chọn) .NET SDK & Cake.Tool — chỉ cần khi bạn dùng `build.cake` hoặc `build.ps1` để chạy task Cake

Trên Windows (PowerShell):
```powershell
# Kiểm tra node
node -v
# Kiểm tra npm
npm -v
# Kiểm tra Docker
docker --version
# Kiểm tra docker compose
docker compose version
```

## Chạy nhanh cục bộ (không Docker)
1. Cài dependencies (nếu bạn muốn dùng npm packages):
```powershell
npm install
```
2. Chạy server Node (Express) để phục vụ thư mục `src`:
```powershell
node server.js
# mở http://localhost:3000
```

> Lưu ý: server.js cấu hình để phục vụ `src` và `public` (route `/pub`). Cổng mặc định là `3000`.

## SCSS -> CSS (khắc phục lỗi MIME khi trình duyệt cố tải .scss)
Trước khi deploy bằng Docker hoặc chạy local, bạn nên biên dịch SCSS sang CSS để tránh lỗi kiểu MIME (browser không load `.scss`).

1) Cài sass CLI (một lần):
```powershell
npm install -D sass
```
2) Build 1 lần:
```powershell
npx sass src/scss/main.scss src/css/main.css --no-source-map
```
3) Hoặc watch trong khi phát triển:
```powershell
npx sass --watch src/scss/main.scss:src/css/main.css
```

Sau khi biên dịch, đảm bảo `index.html` (hoặc `src/css/styles.css`) tham chiếu tới file CSS đã biên dịch (`src/css/main.css`) thay vì file `.scss`.

## Chạy với Docker (production)
1) Build image (từ thư mục project):
```powershell
docker build -t gs2m/web-app:latest .
```
2) Chạy container:
```powershell
docker run -d --name web-app -p 3000:3000 gs2m/web-app:latest
# Mở http://localhost:3000
```

## Chạy với Docker Compose
Repository đã có `docker-compose.yml` với 2 service: `web` (production build) và `web-dev` (để phát triển với bind-mount).

1) Build & chạy service production `web`:
```powershell
docker compose -f docker-compose.yml up --build -d web
```
2) Chạy service phát triển (thích hợp khi bạn muốn thay đổi file trên host và thấy kết quả ngay):
```powershell
docker compose -f docker-compose.yml up --build web-dev
```
3) Dừng & gỡ:
```powershell
docker compose -f docker-compose.yml down
```

## Scripts hỗ trợ (PowerShell helpers)
- `build.ps1`: launcher để chạy `build.cake` (Cake script). Nếu bạn chưa cài Cake Tool, script sẽ cố cài (yêu cầu .NET SDK).
- `buildcake.ps1`: một script PowerShell tùy chỉnh để build/push/run Docker; có chế độ tương tác (interactive) để chạy từng bước.

Ví dụ dùng `buildcake.ps1`:
```powershell
# build + run non-interactive
.\buildcake.ps1 -ImageName "web-app:latest" -Port 3000

# interactive: bạn sẽ được hỏi trước mỗi bước (build/push/run)
.\buildcake.ps1 -Interactive
```

## Biến môi trường và cấu hình
- `PORT` — server mặc định lắng nghe trên 3000 (cấu hình trong `server.js`). Bạn có thể override bằng biến môi trường khi chạy container; ví dụ `-e PORT=8080` trên `docker run` hoặc cập nhật `docker-compose.yml`.
- Không có file `.env` mặc định trong repo hiện tại. Nếu bạn cần cấu hình thêm, tạo file `.env` và đọc nó trong `server.js` hoặc Docker Compose theo nhu cầu.

## Lỗi và cách khắc phục phổ biến
- Lỗi MIME type khi trình duyệt cố load `.scss`: biên dịch SCSS sang CSS (xem phần SCSS -> CSS phía trên).
- Lỗi `command not found` khi chạy `build.ps1` hoặc `buildcake.ps1`: kiểm tra các command có sẵn (`dotnet`, `docker`, `node`) và đảm bảo đã cài đặt và PATH đã được cập nhật. Trên Windows PowerShell, có thể cần mở lại shell sau khi cài tool global.

## Gợi ý deploy nâng cao
- Multi-stage Dockerfile: nếu bạn muốn build assets (SCSS, bundler) trong image, tôi có thể chuyển `Dockerfile` sang multi-stage để biên dịch trong một stage và chỉ copy file tĩnh vào runtime image — giúp image nhỏ hơn và không cần cài Sass trong runtime.
- CI/CD: thêm bước `docker build` và `docker push` trong pipeline và tag bằng commit SHA hoặc semantic version.

## Liên hệ & Góp ý
Nếu bạn muốn mình sửa README theo tiếng Việt chi tiết hơn, hoặc tự động thêm script `build:sass` vào `package.json` và cập nhật Dockerfile để build assets trong quá trình build image, cho mình biết — mình sẽ thực hiện.

---
*Tài liệu này được sinh tự động dựa trên cấu trúc hiện có của repository (server.js, docker-compose.yml, script build).*
