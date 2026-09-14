FROM mysql:8.0

COPY init.sql /docker-entrypoint-initdb.d/

RUN groupadd -g 1001 appgroup && \
    useradd --no-log-init -u 1001 -g appgroup -m -s /usr/sbin/nologin appuser

RUN chown -R appuser:appgroup /var/lib/mysql

USER appuser

HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD}