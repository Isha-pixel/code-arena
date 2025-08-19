FROM gcc:13
RUN useradd -m coder
WORKDIR /app
USER coder
# No server here; executor will `docker run` this and pass a shell command.
CMD ["bash","-lc","echo cpp ready"]
