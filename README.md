# DNA Sequence Analyzer

DNA Sequence Analyzer 是一个前后端分离的 DNA 序列分析项目。当前版本完成了 Assignment 0 的基础项目初始化：后端使用 Python、FastAPI 和 pytest，前端使用 React、TypeScript 和 Vite。

## 项目结构

```text
DNA-Sequence-Analyzer/
├── backend/
│   ├── .venv/              # 本地 Python 虚拟环境，不提交到 Git
│   └── requirements.txt   # 后端 Python 依赖
├── frontend/              # React + TypeScript 前端
├── .gitignore             # Git 忽略规则
└── README.md              # 项目说明
```

## 环境要求

- Python 3
- Node.js 和 npm

## 后端设置

在仓库根目录执行：

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

激活成功后，终端提示符通常会显示 `(.venv)`。退出虚拟环境可运行：

```bash
deactivate
```

## 前端设置

在仓库根目录执行：

```bash
cd frontend
npm install
npm run dev
```

终端会显示本地开发地址，通常为 `http://localhost:5173`。

## 验收检查

```bash
# 后端：确认使用项目虚拟环境中的 Python
cd backend
source .venv/bin/activate
which python

# 前端：执行生产构建
cd ../frontend
npm run build

# Git：确认依赖目录未被跟踪
cd ..
git status --short --ignored
```

`backend/.venv/`、`frontend/node_modules/` 和 `frontend/dist/` 均应被 Git 忽略。
