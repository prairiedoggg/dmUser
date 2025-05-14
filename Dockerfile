FROM node:18-slim
WORKDIR /app

# ca-certificates 패키지 추가
RUN apt-get update && DEBIAN_FRONTEND=noninteractive \
    apt-get install -y --no-install-recommends \
    bash git python3 make g++ build-essential ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# 이제 package-lock.json도 복사됩니다 (올바른 수정)
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 스킵하고 개발 모드로 실행
EXPOSE 3000
CMD ["npm", "run", "start:dev"]