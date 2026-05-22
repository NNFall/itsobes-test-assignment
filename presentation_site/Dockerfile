FROM nginx:1.27-alpine

COPY presentation_site/nginx.conf /etc/nginx/conf.d/default.conf
COPY presentation_site/public/ /usr/share/nginx/html/
COPY task1_web_utility/ /usr/share/nginx/html/task1/
COPY task2_python_api_docker/examples/ /usr/share/nginx/html/task2/examples/
COPY task3_apps_script/examples/ /usr/share/nginx/html/task3/examples/
COPY task3_apps_script/Code.gs /usr/share/nginx/html/task3/Code.gs
COPY docs/ /usr/share/nginx/html/docs/
COPY deliverables/ /usr/share/nginx/html/downloads/
