# Use official Python 3.12 slim image
FROM python:3.12-slim

# Set working directory to root
WORKDIR /

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt (must exist in your project root)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all app files into root
COPY . .

# Expose port for FastAPI
EXPOSE 8000

# Run FastAPI with Gunicorn + Uvicorn worker
CMD ["gunicorn", "-w", "1", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]
