
# Watcher Service - Quick Start

## 🚀 5-Minute Setup

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone & Setup
```bash
git clone <repository>
cd watcher

# One-command setup (build + migrate + seed)
make setup
```

### 2. Start Services
```bash
# Start all services
make up
```

### 3. Test Immediately
```bash
# Copy the test URL from setup output and run:
curl "http://localhost:3000/public/w/2yGE6fwHj6ZRz7jXcL8w9e/dashboard"

# Or test health endpoint
curl http://localhost:3000/healthz
```

## 📋 What You Get

✅ **Production-ready API** at `http://localhost:3000`  
✅ **PostgreSQL database** with test data  
✅ **Secure tokens** with Base58Check validation  
✅ **ETag caching** and rate limiting  
✅ **4 test workers** with realistic metrics

## 🛠️ Development Commands

```bash
make up          # Start services
make down        # Stop services  
make migrate     # Run migrations
make setup       # Full rebuild & setup
```

## 🔌 API Usage

**Public Dashboard** (replace `{token}`):
```
GET /public/w/{token}/dashboard
```

**Health Check**:
```
GET /healthz
```

## 🎯 Next Steps

1. **Test the endpoint** with your generated token
2. **Check database**: `docker exec -it watcher-postgres-1 psql -U postgres -d watcher`
3. **Review logs**: `docker-compose logs -f app`

Your secure watcher service is now running! 🎉
```
