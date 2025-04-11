# 第一阶段：构建阶段
FROM node:18 AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build

# 第二阶段：运行阶段
FROM node:18

# 安装 serve
RUN npm install -g serve

# 设置工作目录
WORKDIR /app

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 暴露应用运行的端口
EXPOSE 3000

# 启动应用
CMD ["serve", "-s", "dist", "-l", "3000"]
