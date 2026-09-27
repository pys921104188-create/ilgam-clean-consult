# 일감 건물 청소 상담 인수인계

## 기준 저장소와 배포

- 저장소: `pys921104188-create/ilgam-clean-consult`
- 브랜치: `main`
- 운영 주소: `https://consult.ilgam.shop/`
- 배포: GitHub Pages. 루트 파일과 `CNAME`을 사용합니다.
- `consult` CNAME과 `_github-pages-challenge-pys921104188-create.consult` TXT는 삭제하지 않습니다.

## FormSubmit 경계

- 일감 플랫폼의 `간편 신청`은 `ilgam.shop` 내부 지원 API입니다.
- 건물 청소 `간편문의`와 `2차 상세정보`만 FormSubmit으로 `pys921104188@gmail.com`에 전달됩니다.
- endpoint: `https://formsubmit.co/pys921104188@gmail.com`
- 활성화 상태: Gmail에서 활성화 메일과 이후 실제 간편문의·상세정보 수신 기록을 확인했습니다.
- 스팸 방지: `_honey`와 FormSubmit 기본 reCAPTCHA를 유지합니다. `_captcha=false`를 추가하지 않습니다.
- 성공 판정: FormSubmit이 `_next`로 `thanks.html`을 연 경우에만 완료 화면입니다. CAPTCHA 전 이탈은 접수 완료가 아닙니다.

## 2026-09-28 작업

- 운영 HTML·JS가 이 저장소 최신 `main`과 일치하는지 확인했습니다.
- Gmail 수신 주소 오타를 전체 검색했고 현재 운영 경로에는 `gmai.com`이 없습니다.
- 필수 입력·동의 검증, 중복 제출 방지, CAPTCHA 미완료 후 복귀 오류 안내를 점검·보강했습니다.
- 자동 제출은 FormSubmit 200 응답과 `Almost There` reCAPTCHA 화면까지 확인했습니다.
- 남은 실제 검증: 운영 상세 폼에 `[테스트]` 데이터를 넣고 사용자가 CAPTCHA를 직접 완료한 뒤 Gmail 받은편지함·스팸함에서 새 메일을 확인합니다.

## 안전 원칙

- 실제 고객정보 대신 명백한 테스트 값만 사용합니다.
- 결제, DNS 삭제, 도메인 변경, 소셜 로그인, 일감 운영 DB는 이 저장소 작업 범위가 아닙니다.
- CAPTCHA, OTP, 이메일 인증 링크는 사용자가 직접 처리합니다.
