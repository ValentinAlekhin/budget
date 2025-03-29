package ws

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
)

type ClientManager struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

type Client struct {
	id     int32
	socket *websocket.Conn
	send   chan []byte
}

type Message struct {
	Sender    int32  `json:"sender,omitempty"`
	Recipient string `json:"recipient,omitempty"`
	Content   any    `json:"content,omitempty"`
	Type      string `json:"type"`
}

func (m *ClientManager) Start() {
	for {
		select {
		case conn := <-m.register:
			m.clients[conn] = true
			jsonMessage, _ := json.Marshal(&Message{Content: "Connected"})
			conn.send <- jsonMessage
		case conn := <-m.unregister:
			if _, ok := m.clients[conn]; ok {
				close(conn.send)
				delete(m.clients, conn)
			}
		case message := <-m.broadcast:
			for conn := range m.clients {
				select {
				case conn.send <- message:
				default:
					close(conn.send)
					delete(m.clients, conn)
				}
			}
		}
	}
}

func (m *ClientManager) send(message []byte, ignore *Client) {
	for conn := range m.clients {
		if conn != ignore {
			conn.send <- message
		}
	}
}

func (m *ClientManager) SendToUser(userId int32, message []byte) {
	for conn := range Manager.clients {
		if conn.id != userId {
			continue
		}

		conn.send <- message
	}
}

func (c *Client) read() {
	defer func() {
		Manager.unregister <- c
		_ = c.socket.Close()
	}()

	for {
		_, message, err := c.socket.ReadMessage()
		if err != nil {
			Manager.unregister <- c
			_ = c.socket.Close()
			break
		}
		jsonMessage, _ := json.Marshal(&Message{Sender: c.id, Content: string(message)})
		Manager.broadcast <- jsonMessage
	}
}

func (c *Client) write() {
	defer func() {
		_ = c.socket.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				_ = c.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			_ = c.socket.WriteMessage(websocket.TextMessage, message)
		}
	}
}

var Manager = ClientManager{
	broadcast:  make(chan []byte),
	register:   make(chan *Client),
	unregister: make(chan *Client),
	clients:    make(map[*Client]bool),
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:    1024,
	WriteBufferSize:   1024,
	EnableCompression: true,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Handler(ctx *gin.Context) {
	userId := ctx.MustGet("userId").(int32)
	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		return
	}

	client := &Client{id: userId, socket: conn, send: make(chan []byte)}
	Manager.register <- client

	go client.read()
	go client.write()
}
