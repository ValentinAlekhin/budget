FROM golang:alpine AS builder

WORKDIR /app

ADD go.mod .

COPY . .

RUN go build -o main main.go

FROM alpine

WORKDIR /

COPY --from=builder /app/main /main

CMD ["/main"]
