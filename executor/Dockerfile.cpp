FROM gcc:13

# create unprivileged user
RUN useradd -m coder
WORKDIR /app
USER coder

# default (we pass the command from the host)
CMD ["bash","-lc","echo cpp ready"]
