FROM eclipse-temurin:17-jdk-jammy
RUN useradd -m coder
WORKDIR /app
USER coder
CMD ["bash","-lc","echo java ready"]
