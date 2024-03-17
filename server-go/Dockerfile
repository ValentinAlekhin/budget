FROM golang:alpine AS builder

WORKDIR /app

ADD go.mod .

COPY . .

RUN go build -o main main.go

FROM alpine

RUN apk add --no-cache postgresql16-client

WORKDIR /app

COPY --from=builder /app/main /app/main

CMD ["/app/main"]
