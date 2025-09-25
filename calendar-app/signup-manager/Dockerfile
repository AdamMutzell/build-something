FROM python:3.11-slim
WORKDIR /signup-manager
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 31566
CMD ["python", "app/signup.py"]