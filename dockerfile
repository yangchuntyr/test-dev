# 使用Node.js官方的基础镜像，选择适合你项目需求的Node.js版本，这里以16为例
FROM node:18

# 设置工作目录，在容器内创建/app目录并将其作为工作目录
WORKDIR /app

# 拷贝package.json和package-lock.json（如果使用yarn则拷贝yarn.lock）到工作目录，这一步是为了提前安装依赖，利用缓存机制加快后续构建速度
COPY package*.json./

# 安装项目依赖，这里使用npm，如果你习惯用yarn可以替换为RUN yarn
RUN npm install

# 分别拷贝前端和后端代码到工作目录对应的文件夹下
COPY frontend./frontend
COPY backend./backend

# 构建前端代码（如果前端是基于类似Create React App等需要构建的框架），这里假设构建后的文件输出到frontend/build目录，不同前端框架构建命令和输出目录可能不同
RUN cd frontend && npm run build

# 暴露后端服务的端口，根据你后端代码中设置的端口号进行修改，示例中是3001端口
EXPOSE 3001

# 设置启动命令，这里先进入后端目录，然后使用ts-node启动后端服务，你可以根据实际情况调整启动的脚本等细节
CMD ["cd", "backend", "&&", "ts-node", "server.ts"]