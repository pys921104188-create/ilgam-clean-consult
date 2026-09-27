# 일감 건물 청소 상담

`consult.ilgam.shop`에 게시하는 정적 상담 신청 페이지입니다. 이 저장소는 `pys921104188-create` GitHub 계정에서 관리합니다. `main` 브랜치 루트의 파일이 GitHub Pages로 자동 배포됩니다. `CNAME` 파일과 Cafe24의 `consult` CNAME 레코드는 이 주소 연결에 필요합니다. Cafe24의 `_github-pages-challenge-pys921104188-create.consult` TXT 레코드는 이 계정의 도메인 소유 확인을 유지하므로 삭제하지 마세요. 기존 `ilgam.shop` 및 `www.ilgam.shop` 설정은 이 저장소와 별개입니다.

1차 간편문의는 연락처와 개인정보 수집·이용 동의가 필수이며 성함과 지역은 선택입니다. 2차 상세정보는 이름, 주소, 연락처, 건물 규모와 동의가 필수입니다. 제출은 FormSubmit을 통해 `pys921104188@gmail.com`으로 전달하도록 구성되어 있습니다.

FormSubmit 수신함 활성화 및 실제 이메일 도착 검증이 끝나기 전에는 신청 완료를 보증할 수 없습니다. 운영자 정보와 보유기간은 게시 전에 실제 운영 방침과 일치해야 합니다.

## 운영 시작 전 확인

1. `consult.ilgam.shop`에 HTTPS가 적용되고 GitHub 저장소의 **Settings → Pages → Enforce HTTPS**를 켤 수 있는지 확인합니다. DNS·인증서 반영에는 시간이 걸릴 수 있습니다.
2. 본인 테스트 문의를 한 건 제출하고 `pys921104188@gmail.com`으로 온 FormSubmit 활성화 메일의 링크를 직접 확인합니다. 활성화 후 다른 테스트 문의를 제출해 이메일 수신과 완료 화면을 검증합니다. 실제 고객 정보로 테스트하지 마세요. 제출 뒤 FormSubmit의 `Almost There` 화면에서 reCAPTCHA를 끝내야 접수가 완료되며, 확인 전에 창을 닫거나 뒤로 가면 메일이 발송되지 않습니다.
3. `index.html`의 개인정보 수집·이용 안내에 적힌 운영자 표시와 보유기간을 실제 운영 방침에 맞춥니다.

페이지를 수정할 때는 이 저장소에서 파일을 바꾸고 `main`에 반영하면 됩니다. FormSubmit 전송 주소는 `index.html`의 두 폼과 `app.js`에 있으므로 이메일 주소를 바꿀 경우 세 곳을 함께 수정하고 새 주소로 다시 활성화해야 합니다. `_url` 필드는 FormSubmit이 신청 페이지의 출처를 확인하는 데 필요합니다. 사이트 주소를 바꾸면 `index.html`의 두 `_url` 값도 바꿔 주세요.

로컬 검증은 저장소 루트에서 `python -m http.server 8080 --bind 127.0.0.1`을 실행한 뒤 다른 터미널에서 `node check.cjs`로 수행합니다. Windows에서는 설치된 Edge를 사용합니다.

## 2026-09-28 전송 점검

- 운영 폼 action과 스크립트 endpoint는 모두 `https://formsubmit.co/pys921104188@gmail.com`이며 `gmai.com` 오타는 없습니다.
- FormSubmit은 활성화되어 있고 Gmail에서 1차 간편문의와 2차 상세정보의 과거 실제 수신 기록을 확인했습니다.
- 자동 POST 점검은 HTTP 200과 reCAPTCHA `Almost There` 화면까지 도달했습니다. CAPTCHA는 운영자가 직접 완료해야 하므로 새 2차 테스트 메일의 최종 수신은 별도 확인 항목입니다.
- 중복 제출 잠금, 전송 중 `aria-busy`, CAPTCHA 미완료 상태로 돌아왔을 때의 한국어 오류·재시도 안내를 보강했습니다. 개인정보 필드, 동의, honeypot, CAPTCHA, 완료 페이지 조건은 유지했습니다.
