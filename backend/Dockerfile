# ---- Build Stage ----
FROM golang:1.22.5 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o main main.go

# ---- Run Stage ----
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main ./main

EXPOSE 3001

CMD ["./main"]