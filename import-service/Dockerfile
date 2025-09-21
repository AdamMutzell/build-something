# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy the import.py file
COPY import.py ./

# (Optional) Copy requirements.txt and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Run the service
CMD ["python", "import.py"]
