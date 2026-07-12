FROM nginx:1.27.2-alpine

COPY ./dist /var/www
COPY ./nginx /etc/nginx

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
