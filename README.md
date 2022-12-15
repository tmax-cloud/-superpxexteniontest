### 개요
- ws 에서 받은 데이터를 memfs(메모리 파일시스템) workspace 에 파일로 넣어주는 vscode extension
https://marketplace.visualstudio.com/items?itemName=ParkHyowook.superpxextensiontest2


### 0.0.2
- DBFS 명령어 추가
  - DBFS: init DB fs
  - DBFS: Get file from DB serverUrl

## 요구사항
 - 1.50.0 이상 vscode 요구됨

## 사용 방법
1. extension 설치 환경 구축
    1. 코드를 vscode 에서 디버그 모드로(F5) 실행       
    2. vs code 에서 extention 설치extension superpxextensiontest2 검색
2. vscode 에서 ctrl+shift+p 로 명령창 열기
3. DBFS: init DB fs 실행 Worksapce 생성됨(DB - Sample)
4. DBFS: Get file from DB serverUrl 입력 창 뜸파일 생성됨
    1. ws server 필요
    2. github 의 app.js 로 ws 서버 구동가능


## 명령어 설명
- DBFS: init DB fs - Worksapce 생성
- DBFS: Get file from DB serverUrl - websocket 서버와 연결해서 특정 응답을 받고 그걸 파일로 memfs 에 저장

## test 용 websocket 서버
- node app.js 로 구동
- ws://localhost:8001 url 입력하면 됨
