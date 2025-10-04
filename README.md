# Taskmanian

Taskmanian is a **support + task management system** with an optional **AI assistant**. 
It combines a ReactJS client, Node.js REST API, MongoDB backend, and Nginx proxy. 
The AI assistant can use **OpenAI** or **DeepSeek**, configurable via environment variables.

---

## Features
- Task management: create, update, delete, search
- Support workflow with status tracking
- AI assistant for task triage, summaries, and replies
- JWT authentication (in-memory demo users, extendable to DB)
- REST API with Express + Mongoose
- React (Vite) web client
- Dockerized with Nginx reverse proxy
- GitLab CI/CD with Docker image publishing

---

## Quick Start
```bash
# Clone repo
git clone https://gitlab.com/quidiligr/taskmanian.git
cd taskmanian

# Copy envs
cp .env.example .env

# Build & run locally
docker compose up -d --build

# Open app
http://localhost:8080
```

Default demo login:
```
Email: admin@taskmanian.local
Password: admin
```

---

## Environment Variables
```env
MONGO_URI=mongodb://mongo:27017/taskmanian
JWT_SECRET=change-me
LLM_PROVIDER=deepseek   # or openai
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-chat
```

---

## Deployment
1. Push code to GitLab project `taskmanian`.
2. Configure CI/CD variables:
   - `CI_REGISTRY`, `CI_REGISTRY_USER`, `CI_REGISTRY_PASSWORD`
   - plus app envs above
3. CI/CD builds and pushes images: `api`, `client`, `nginx`
4. On server:
```bash
export CI_REGISTRY_IMAGE=registry.gitlab.com/yourgroup/taskmanian
export JWT_SECRET=prod-secret
export LLM_PROVIDER=deepseek
export DEEPSEEK_API_KEY=sk-...

docker compose pull
docker compose up -d
```

---

## Health Checks
- API: `GET /api/health` → `{ ok: true }`
- Web: open `http://localhost:8080`, login, add tasks, test AI

---

## Roadmap
- Replace demo users with real `User` model in MongoDB
- Add roles: Admin, Agent, Requester
- Add comments and attachments (S3/MinIO)
- Add integrations: Slack, Teams, Email ingest
- Add mobile client (React Native or Flutter)

---

## License
MIT License — see [LICENSE](LICENSE) file.

---

## Contributing
1. Fork this repo
2. Create a feature branch (`git checkout -b feature/foo`)
3. Commit changes (`git commit -m 'feat: add foo'`)
4. Push branch (`git push origin feature/foo`)
5. Create a Merge Request in GitLab

---

## Maintainer
**Romulo Quidilig**  
rquidilig@gmail.com
