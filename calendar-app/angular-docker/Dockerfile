FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output (browser folder)
COPY dist/angular-docker/browser/ /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 4200 (or 80 if you prefer)
EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
